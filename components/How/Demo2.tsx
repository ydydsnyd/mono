import {useState} from 'react';
import styles from './How.module.css';
import ServerConsole from './ServerConsole';
import Demo2a from './Demos/Demo2a';
import Demo2b from './Demos/Demo1b';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '@/demo/shared/mutators';
import RotateClient from './RotateClient';
import Reset from './Reset';

export default function Demo2({
  reflect1,
  reflect2,
  reflectServer,
}: {
  reflect1: Reflect<M>;
  reflect2: Reflect<M>;
  reflectServer: Reflect<M>;
}) {
  const [toggleDemo, setToggleDemo] = useState(true);
  const toggleSwitchDemo = () => setToggleDemo(!toggleDemo);

  return (
    <>
      {/* Step 2: Render Reactively */}
      <div className={styles.howStep}>
        <h3 className={styles.howHeader}>
          <strong>Step 3:</strong> Render Reactively
        </h3>
        <p className={styles.howDescription}>
          Subscribe to changes in Reflect and render your UI reactively.
          There&apos;s no need to interpolate. You receive updates at 60fps,
          just as if the collaborator was local.
        </p>
        <p className={styles.howDescription}>
          <strong>Try it!</strong> Notice how even when the latency is high,
          changes playback on the receiver exactly how they happened on the
          source.
        </p>
        <div className={styles.howGridLayout2}>
          <div className={styles.codeBlock}>
            {!toggleDemo ? (
              <>
                <div className={styles.codeBlockToggle}>
                  <button onClick={toggleSwitchDemo}>client.tsx</button>
                  <button className={styles.codeToggleActive}>
                    mutators.ts
                  </button>
                </div>
                <Demo2a />
              </>
            ) : (
              <>
                <div className={styles.codeBlockToggle}>
                  <button className={styles.codeToggleActive}>
                    client.tsx
                  </button>
                  <button onClick={toggleSwitchDemo}>mutators.ts</button>
                </div>
                <Demo2b />
              </>
            )}
          </div>
          <RotateClient reflect={reflect1} title="Client 1" />
          <ServerConsole reflect={reflectServer} />
          <RotateClient title="Client 2" reflect={reflect2} />
        </div>
        <Reset />
      </div>
      {/* Step 3: Deploy */}
      <div className={styles.howStep}>
        <h3 className={styles.howHeader}>
          <strong>You&apos;re done.</strong>
        </h3>
        <p className={styles.howDescription}>
          Reflect publishes your mutators to a unique sandboxed server
          environment. Rooms are backed by Cloudflare&apos;s Durable Object
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
    </>
  );
}
