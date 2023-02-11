import type {
  ReadTransaction,
  Reflect,
  WriteTransaction,
} from '@rocicorp/reflect';
import {nanoid} from 'nanoid';
import type {
  Actor,
  BotmasterState,
  Cursor,
  Letter,
  Position,
} from '../shared/types';
import {LETTERS} from '../shared/letters';
import {approxInt, randElm, randFloat, randInt} from '../shared/util';
import type {M} from '../shared/mutators';
import {resolver, Resolver} from '@rocicorp/resolver';

type Rect = {
  tl: Position;
  br: Position;
};

export type Delegate = {
  getBotArea: () => Rect;
  getRandomPositionOnLetter: (letter: Letter) => Position;
};

export class Botmaster {
  private _reflect: Reflect<M>;
  private _delegate: Delegate;
  private _bots: Bot[];
  private _disabled: boolean;

  get isMe() {
    if (this._disabled) {
      return false;
    }
    return this._bots.length > 0;
  }

  constructor(
    reflect: Reflect<M>,
    delegate: Delegate,
    disabled: boolean = false,
  ) {
    this._reflect = reflect;
    this._delegate = delegate;
    this._bots = [];
    this._disabled = disabled;
    if (disabled) {
      return;
    }

    this._reflect.subscribe(
      async tx => {
        return (
          (await getBotmasterState(tx))?.clientID ===
          (await this._reflect.clientID)
        );
      },
      {
        onData: isMe => {
          if (isMe) {
            console.log('I AM THE BOTMASTER');
            void this._start();
          } else {
            console.log('i am not the botmaster :(');
          }
        },
      },
    );

    void this._reflect.mutate.guaranteeBotmaster();
  }

  async _start() {
    console.log(await this._reflect.query(tx => tx.scan().entries().toArray()));
    await this._clearOldBots();

    while (true) {
      if (Math.random() < 0.5) {
        if (this._bots.length > 0) {
          const bot = randElm(this._bots);
          await bot.stop();
          this._bots.splice(
            this._bots.findIndex(b => b === bot),
            1,
          );
          this._reflect.mutate.removeActor(bot.actorID);
        }
      } else {
        if (this._bots.length < 3) {
          this._bots.push(new Bot(this._reflect, this._delegate));
        }
      }
      await sleep(approxInt(2000, 1000));
    }
  }

  async _clearOldBots() {
    const actors = (await this._reflect.query(tx =>
      tx.scan({prefix: 'actor/'}).values().toArray(),
    )) as Readonly<Actor>[];
    for (const actor of actors) {
      if (actor.isBot) {
        this._reflect.mutate.removeActor(actor.id);
      }
    }
  }
}

class Bot {
  private _reflect: Reflect<M>;
  private _delegate: Delegate;
  private _actorId: string;
  private _stopper: Resolver<void> | null;

  constructor(reflect: Reflect<M>, delegate: Delegate) {
    this._reflect = reflect;
    this._delegate = delegate;
    this._actorId = nanoid();
    this._stopper = null;

    void this._init();
  }

  get actorID() {
    return this._actorId;
  }

  async stop() {
    this._stopper = resolver();
    await this._stopper.promise;
  }

  private async _init() {
    await this._reflect.mutate.guaranteeActor({
      actorId: this._actorId,
      isBot: true,
    });
    await this._reflect.mutate.updateActorLocation({
      actorId: this._actorId,
      location: randomLocation(),
    });
    await this._reflect.mutate.updateCursor({
      actorId: this._actorId,
      isDown: false,
      onPage: true,
      ts: Date.now(),
      ...randInside(this._delegate.getBotArea()),
    });

    while (this._stopper === null) {
      const choices = [
        () => scribblePlan(this._reflect, this._delegate, this._actorId),
        () => moveOffscreenPlan(this._reflect, this._delegate, this._actorId),
        () => sleep(approxInt(2000, 2000)),
      ];
      const plan = randElm(choices);
      console.log('next plan', plan);
      await plan();
    }

    this._stopper.resolve();
  }
}

async function scribblePlan(
  reflect: Reflect<M>,
  delegate: Delegate,
  actorId: string,
) {
  const letter = randElm(LETTERS);
  let pos = delegate.getRandomPositionOnLetter(letter);
  await moveToPositionPlan(reflect, actorId, pos, approxInt(1500, 200));
  const numStrokes = randInt(0, 3);
  for (let i = 0; i < numStrokes; i++) {
    await sleep(approxInt(50, 50));
    pos = delegate.getRandomPositionOnLetter(letter);
    await moveToPositionPlan(reflect, actorId, pos, approxInt(400, 100));
  }

  await sleep(approxInt(50, 50));
}

async function moveOffscreenPlan(
  reflect: Reflect<M>,
  delegate: Delegate,
  actorId: string,
) {
  const pos = randInside(delegate.getBotArea());
  await moveToPositionPlan(reflect, actorId, pos, approxInt(1200, 300));
}

async function moveToPositionPlan(
  reflect: Reflect<M>,
  actorId: string,
  endPosition: Position,
  duration: number,
) {
  const startPosition = (await reflect.query(tx =>
    tx.get(`cursor/${actorId}`),
  )) as Readonly<Cursor>;
  const startTime = performance.now();

  while (true) {
    const t = await raf();
    const elapsed = Math.min(duration, t - startTime);
    const f = elapsed / duration;
    const p = {
      x: startPosition.x + (endPosition.x - startPosition.x) * f,
      y: startPosition.y + (endPosition.y - startPosition.y) * f,
    };
    await reflect.mutate.updateCursor({
      ...p,
      actorId,
      isDown: false,
      onPage: true,
      ts: Date.now(),
    });
    if (f == 1) {
      break;
    }
  }
}

export async function guaranteeBotmaster(tx: WriteTransaction) {
  if (!(await tx.has('botmaster'))) {
    const val: BotmasterState = {
      clientID: tx.clientID,
      mode: 'intro',
    };
    await tx.put('botmaster', val);
  }
}

export async function getBotmasterState(tx: ReadTransaction) {
  const val = await tx.get('botmaster');
  return val as Readonly<BotmasterState> | undefined;
}

export async function clearBotmaster(tx: WriteTransaction) {
  await tx.del('botmaster');
}

function randInside(rect: Rect) {
  return {
    x: randFloat(rect.tl.x, rect.br.x),
    y: randFloat(rect.tl.y, rect.br.y),
  };
}

function randomLocation() {
  const places = [
    'Los Angeles, CA',
    'Paris, France',
    'New York City, NY',
    'Bangkok, Thailand',
    'Hong Kong, China',
    'Rome, Italy',
    'Barcelona, Spain',
    'London, United Kingdom',
    'Munich, Germany',
    'Melbourne, Australia',
  ];
  return randElm(places);
}

function raf() {
  return new Promise<number>(res => {
    requestAnimationFrame(res);
  });
}

function sleep(ms: number) {
  return new Promise(res => window.setTimeout(res, ms));
}
