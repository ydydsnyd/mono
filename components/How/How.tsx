import React, {useState, useEffect, useMemo} from 'react';
import {init} from '@/demo/howto-frontend';
import {nanoid} from 'nanoid';
import {delayWebSocket} from './delayWebSocket';
import {M, deregisterClientConsole} from '@/demo/shared/mutators';
import Demo1 from './Demo1';
import Demo2 from './Demo2';
import {ClientIDContext} from './ClientIDContext';
import Demo0 from './Demo0';
import {useInView} from 'react-intersection-observer';
import styles from './How.module.css';
import type {Reflect} from '@rocicorp/reflect';

type DemoReflectState = {
  roomID: string;
  reflect1: Reflect<M>;
  reflect2: Reflect<M>;
  reflectServer: Reflect<M>;
  clientID1: string | undefined;
  clientID2: string | undefined;
  clientID3: string | undefined;
};

type DemoComponentProps = {
  reflect1: Reflect<M>;
  reflect2: Reflect<M>;
  reflectServer: Reflect<M>;
  reset: () => Promise<void>;
  key: string;
};

type DemoComponent = React.ComponentType<DemoComponentProps>;

async function initDemo() {
  const [roomID, client1UserID, client2UserID, client3UserID] = Array.from(
    {length: 4},
    () => nanoid(),
  );

  const r1 = init(roomID, client1UserID);
  const r2 = init(roomID, client2UserID);
  const r3 = init(roomID, client3UserID);

  const [clientID1, clientID2, clientID3] = await Promise.all([
    r1.clientID,
    r2.clientID,
    r3.clientID,
  ]);

  return {
    roomID,
    reflect1: r1,
    reflect2: r2,
    reflectServer: r3,
    clientID1,
    clientID2,
    clientID3,
  };
}

const DemoWrapperInternal = (
  Demo: DemoComponent,
  state: DemoReflectState | undefined,
  setState: React.Dispatch<React.SetStateAction<DemoReflectState | undefined>>,
) =>
  state &&
  state.clientID1 &&
  state.clientID2 &&
  state.reflect1 &&
  state.reflect2 &&
  state.reflectServer ? (
    <ClientIDContext.Provider
      value={{client1ID: state.clientID1, client2ID: state.clientID2}}
    >
      <Demo
        reflect1={state.reflect1}
        reflect2={state.reflect2}
        reflectServer={state.reflectServer}
        reset={async () => setState(await initDemo())}
        key={state.clientID1}
      />
    </ClientIDContext.Provider>
  ) : null;

export default function How() {
  const {ref} = useInView({
    triggerOnce: true,
    onChange: inView => {
      if (inView) {
        initHowToReflect();
      }
    },
  });
  const [iReflectState, setIReflectState] = useState<DemoReflectState>();
  const [rReflectState, setRReflectState] = useState<DemoReflectState>();

  async function initHowToReflect() {
    delayWebSocket(process.env.NEXT_PUBLIC_WORKER_HOST!.replace(/^ws/, 'http'));
    setIReflectState(await initDemo());
    setRReflectState(await initDemo());
  }

  useEffect(() => {
    const cleanup = async () => {
      console.log("Closing reflect's");
      const reflects = [
        iReflectState?.reflect1,
        iReflectState?.reflect2,
        iReflectState?.reflectServer,
        rReflectState?.reflect1,
        rReflectState?.reflect2,
        rReflectState?.reflectServer,
      ];

      for (const reflect of reflects) {
        if (reflect) {
          await reflect.clientID.then(deregisterClientConsole);
          reflect.close();
        }
      }
    };

    return () => {
      cleanup();
    };
  }, []);

  const DemoWrapper = useMemo(() => DemoWrapperInternal, []);

  return (
    <div ref={ref}>
      <Demo0 />
      {DemoWrapper(Demo1, iReflectState, setIReflectState)}
      {DemoWrapper(Demo2, rReflectState, setRReflectState)}
      {/* Step 3: Deploy */}
      <div className={styles.howStep}>
        <h3 className={styles.howHeader}>
          <strong>You&apos;re Done.</strong>
        </h3>
        <p className={styles.howDescription}>
          Reflect publishes your mutators to a unique sandboxed environment.
          Rooms are backed by Cloudflare&apos;s{' '}
          <a href="https://developers.cloudflare.com/workers/learning/using-durable-objects/">
            Durable Object
          </a>{' '}
          technology and scale horizontally by room.
        </p>
        <div className={styles.deployTerminal}>
          <img className={styles.menuControls} src="/img/menu-controls.svg" />
          <h4 className={styles.terminalHeader}>Shell</h4>
          <p className={styles.terminalLine}>
            <span className={styles.prompt}>&gt;</span>
            <span className={styles.userInputContainer}>
              <span className={styles.userInput}>reflect publish</span>
            </span>
          </p>
          <p className={`${styles.terminalLine} ${styles.terminalOutput}`}>
            &#127881; Published! Running at{' '}
            <span className={styles.terminalLink}>
              https://myapp.reflect.net/
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
