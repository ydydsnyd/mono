import {init} from '@/demo/howto-frontend';
import {M, deregisterClientConsole} from '@/demo/shared/mutators';
import type {Latency} from '@/demo/shared/types';
import {closeReflect} from '@/util/reflect';
import {getWorkerHost} from '@/util/worker-host';
import type {Reflect} from '@rocicorp/reflect';
import {nanoid} from 'nanoid';
import {event} from 'nextjs-google-analytics';
import React, {useEffect, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import {ClientIDContext} from './ClientIDContext';
import {Demo1} from './Demo1';
import {delayWebSocket, setLatency} from './delayWebSocket';

export type DemoReflectState = {
  roomID: string;
  reflect1: Reflect<M>;
  reflect2: Reflect<M>;
  reflectServer: Reflect<M>;
  clientID1: string | undefined;
  clientID2: string | undefined;
  latency1: Latency;
  latency2: Latency;
};

type DemoComponentProps = {
  reflect1: Reflect<M> | undefined;
  reflect2: Reflect<M> | undefined;
  reflectServer: Reflect<M> | undefined;
  reset: () => void;
  key?: string | undefined;
  latency1?: Latency | undefined;
  latency2?: Latency | undefined;
  setLatency1: (latency: Latency) => void;
  setLatency2: (latency: Latency) => void;
};

type DemoComponent = React.ComponentType<DemoComponentProps>;

function initDemo(
  prevState: DemoReflectState | undefined,
  setState: React.Dispatch<React.SetStateAction<DemoReflectState | undefined>>,
  prepend: string,
): void {
  let latency1 = 0 as Latency;
  let latency2 = 0 as Latency;
  if (prevState) {
    closeReflect(prevState.reflect1);
    closeReflect(prevState.reflect2);
    closeReflect(prevState.reflectServer);
    latency1 = prevState.latency1;
    latency2 = prevState.latency2;
  }

  const [roomID, client1UserID, client2UserID, client3UserID] = Array.from(
    {length: 4},
    () => nanoid(),
  );

  const r1 = init(prepend + roomID, prepend + 'client1' + client1UserID);
  const r2 = init(prepend + roomID, prepend + 'client2' + client2UserID);
  const r3 = init(prepend + roomID, prepend + 'client3' + client3UserID);

  setState({
    roomID,
    reflect1: r1,
    reflect2: r2,
    reflectServer: r3,
    clientID1: undefined,
    clientID2: undefined,
    latency1,
    latency2,
  });

  void Promise.all([r1.clientID, r2.clientID]).then(
    ([clientID1, clientID2]) => {
      const latencyMapping = [0, 300, 950];
      setLatency(clientID1, latencyMapping[latency1]);
      setLatency(clientID2, latencyMapping[latency2]);
      setState((prev: DemoReflectState | undefined) => {
        if (prev && prev.reflect1 === r1 && prev.reflect2 === r2) {
          return {
            ...prev,
            clientID1,
            clientID2,
          };
        }
        return prev;
      });
    },
  );
}

function DemoWrapperInternal(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Demo: DemoComponent,
  state: DemoReflectState | undefined,
  setState: React.Dispatch<React.SetStateAction<DemoReflectState | undefined>>,
  prepend: string,
  intialized: boolean,
) {
  useEffect(() => {
    if (intialized) {
      initDemo(state, setState, prepend);
    }
  }, [state?.latency1 ?? 0, state?.latency2 ?? 0, intialized]);

  return (
    <ClientIDContext.Provider
      value={{
        client1ID: state?.clientID1 ?? '',
        client2ID: state?.clientID2 ?? '',
      }}
    >
      <Demo
        reflect1={state?.reflect1}
        reflect2={state?.reflect2}
        reflectServer={state?.reflectServer}
        reset={() => {
          initDemo(state, setState, prepend);
          event('demo_reset', {
            category: 'How it Works',
            action: 'Press reset demo button',
            label: 'demos',
          });
        }}
        key={state?.roomID}
        latency1={state?.latency1}
        latency2={state?.latency2}
        setLatency1={(latency: Latency) => {
          setState((prev: DemoReflectState | undefined) => {
            if (prev) {
              return {
                ...prev,
                latency1: latency,
              };
            }
            return prev;
          });
        }}
        setLatency2={(latency: Latency) =>
          setState((prev: DemoReflectState | undefined) => {
            if (prev) {
              return {
                ...prev,
                latency2: latency,
              };
            }
            return prev;
          })
        }
      />
    </ClientIDContext.Provider>
  );
}

export function How() {
  const [initialized, setInitialized] = useState(false);

  const {ref} = useInView({
    triggerOnce: true,
    onChange: inView => {
      if (inView) {
        setInitialized(true);
        delayWebSocket(getWorkerHost());
      }
    },
  });
  const [iReflectState, setIReflectState] = useState<DemoReflectState>();

  useEffect(() => {
    const cleanup = async () => {
      const reflects = [
        iReflectState?.reflect1,
        iReflectState?.reflect2,
        iReflectState?.reflectServer,
      ];

      for (const reflect of reflects) {
        if (reflect) {
          await reflect.clientID.then(deregisterClientConsole);
          closeReflect(reflect);
        }
      }
    };

    return () => {
      void cleanup();
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const DemoWrapper = useMemo(() => DemoWrapperInternal, []);

  return (
    <div ref={ref}>
      {DemoWrapper(
        Demo1,
        iReflectState,
        setIReflectState,
        'increment_',
        initialized,
      )}
    </div>
  );
}
