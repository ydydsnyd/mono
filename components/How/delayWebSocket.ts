const fetchPing = async (url: string): Promise<number> => {
  await fetch(url);
  const start = Date.now();
  await fetch(url);
  const end = Date.now();
  return end - start;
};

let delayWebSocketCalled = false;
export const delayWebSocket = (host: string) => {
  if (delayWebSocketCalled) {
    return;
  }
  delayWebSocketCalled = true;

  let halfTripPing = 0;
  fetchPing(`${host}/ping`)
    .then(ping => {
      halfTripPing = ping / 2;
      console.log(`Half-trip ping: ${halfTripPing}ms`);
    })
    .catch(() => {
      console.debug('Failed to fetch ping, using default value of 0ms');
    });
  const OriginalWebSocket = WebSocket;
  globalThis.WebSocket = class extends OriginalWebSocket {
    private readonly userID: string;
    private readonly sendQueue: DelayQueue<
      string | ArrayBufferLike | Blob | ArrayBufferView
    >;
    private readonly deliveryQueue: DelayQueue<MessageEvent>;

    private onMessageCallback:
      | ((this: WebSocket, ev: MessageEvent) => any)
      | null = null;

    constructor(url: string | URL, protocols?: string | string[] | undefined) {
      super(url, protocols);
      const urlObj = new URL(url);
      this.userID = urlObj.searchParams.get('clientID') ?? '';
      this.sendQueue = new DelayQueue(data => super.send(data));
      this.deliveryQueue = new DelayQueue(ev =>
        this.onMessageCallback?.call(this, ev),
      );
    }

    override send(
      data: string | ArrayBufferLike | Blob | ArrayBufferView,
    ): void {
      const latency = latencies.get(this.userID);
      this.sendQueue.enqueue(data, latency, halfTripPing);
    }

    override set onmessage(
      callback: ((this: WebSocket, ev: MessageEvent) => any) | null,
    ) {
      this.onMessageCallback = callback;
      if (callback === null) {
        super.onmessage = null;
      }

      super.onmessage = (ev: MessageEvent) => {
        const latency = latencies.get(this.userID);
        this.deliveryQueue.enqueue(ev, latency, halfTripPing);
      };
    }

    override get onmessage() {
      return super.onmessage;
    }
  };
};

class DelayQueue<T> {
  private readonly _queue: {
    targetTime: number;
    t: T;
  }[] = [];
  private _processScheduled = false;
  private readonly _process: (t: T) => void;
  constructor(process: (t: T) => void) {
    this._process = process;
  }

  enqueue(t: T, latency: number | undefined, halfTripPing: number): void {
    if ((latency && latency > halfTripPing) || this._queue.length > 0) {
      const targetTime = Date.now() + Math.max(latency ?? 0 - halfTripPing, 0);
      this._queue.push({
        targetTime,
        t,
      });
      this._maybeScheduleProcess();
    } else {
      this._process(t);
    }
  }

  private _maybeScheduleProcess = () => {
    if (this._processScheduled || this._queue.length === 0) {
      return;
    }
    this._processScheduled = true;
    setTimeout(() => {
      this._processScheduled = false;
      const now = Date.now();
      const toProcess = this._queue.filter(({targetTime}) => targetTime <= now);
      this._queue.splice(0, toProcess.length);
      toProcess.forEach(({t}) => this._process(t));
      this._maybeScheduleProcess();
    }, this._queue[0].targetTime - Date.now());
  };
}

const latencies: Map<string, number> = new Map();
export const setLatency = (userID: string, latency: number) => {
  console.log('setting lacency for', userID, latency);
  latencies.set(userID, latency);
};
