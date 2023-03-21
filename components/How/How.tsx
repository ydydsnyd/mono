import React, {useState} from 'react';
import styles from './How.module.css';
import Demo1a from './Demos/Demo1a';
import Demo1b from './Demos/Demo1b';
import Demo2a from './Demos/Demo2a';
import Demo2b from './Demos/Demo2b';
import ServerConsole from './ServerConsole';
import ClientConsole from './ClientConsole';
import DemoButton from './DemoButton';
import RotateButton from './RotateButton';
import Slider from './Slider';

export default function How() {
  const [toggleDemo1, setToggleDemo1] = useState(true);
  const toggleSwitchDemo1 = () => {
    setToggleDemo1(!toggleDemo1);
  };
  const [toggleDemo2, setToggleDemo2] = useState(true);
  const toggleSwitchDemo2 = () => {
    setToggleDemo2(!toggleDemo2);
  };

  return (
    <>
      {/* Step 1: Define mutators */}
      <div className={styles.howStep}>
        <h3 className={styles.howHeader}><strong>Step 1:</strong> Define Mutators</h3>
        <p className={styles.howDescription}>
          Mutators are functions you define to change the datastore. The UI updates <strong>instantly</strong> (in the same frame) when mutators are called. Milliseconds later, Reflect replays the mutator on the server to sync the change.
          Because of server replay, mutators handle many conflicts naturally. If two client simultaneously increment a counter, the mutator will naturally sum the changes rather than overwrite one.
        </p>
        <div className={styles.howGridLayout2}>
          <div className={styles.codeBlock}>
            {toggleDemo1 ? (
              <>
                <div className={styles.codeBlockToggle}>
                  <button className={styles.codeToggleActive}>
                    mutators.ts
                  </button>
                  <button onClick={toggleSwitchDemo1}>index.tsx</button>
                </div>
                <Demo1a />
              </>
            ) : (
              <>
                <div className={styles.codeBlockToggle}>
                  <button onClick={toggleSwitchDemo1}>mutators.ts</button>
                  <button className={styles.codeToggleActive}>index.tsx</button>
                </div>
                <Demo1b />
              </>
            )}
          </div>
          <div className={styles.client}>
            <h4 className={styles.panelLabel}>Client 1</h4>
            <Slider />
            <DemoButton />
            <ClientConsole />
          </div>
          <ServerConsole />
          <div className={styles.client}>
            <h4 className={styles.panelLabel}>Client 2</h4>
            <Slider />
            <DemoButton />
            <ClientConsole />
          </div>
        </div>
      </div>

      {/* Step 2: Render Reactively */}
      <div className={styles.howStep}>
        <h3 className={styles.howHeader}><strong>Step 2:</strong> Render Reactively</h3>
        <p className={styles.howDescription}>
          Subscribe to changes in Reflect and render your UI reactively. There&apos;s no need to interpolate. You receive updates at 60fps, just as if the collaborator was local.
        </p>
        <div className={styles.howGridLayout2}>
          <div className={styles.codeBlock}>
            {!toggleDemo2 ? (
              <>
                <div className={styles.codeBlockToggle}>
                  <button onClick={toggleSwitchDemo2}>
                    index.tsx
                  </button>
                  <button className={styles.codeToggleActive}>
                    mutators.ts
                  </button>
                </div>
                <Demo2a />
              </>
            ) : (
              <>
                <div className={styles.codeBlockToggle}>
                  <button className={styles.codeToggleActive}>index.tsx</button>
                  <button onClick={toggleSwitchDemo2}>mutators.ts</button>
                </div>
                <Demo2b />
              </>
            )}
          </div>
          <div className={styles.client}>
            <h4 className={styles.panelLabel}>Client 1</h4>
            <Slider />
            <div className={styles.demo2layout}>
              <RotateButton />
              {/* Cube component goes here */}
            </div>
            <ClientConsole />
          </div>
          <ServerConsole />
          <div className={styles.client}>
            <h4 className={styles.panelLabel}>Client 2</h4>
            <Slider />
            <div className={styles.demo2layout}>
              <RotateButton />
              {/* Cube component goes here */}
            </div>
            <ClientConsole />
          </div>
        </div>
      </div>

      {/* Step 3: Deploy */}
      <div className={styles.howStep}>
        <h3 className={styles.howHeader}><strong>Step 3:</strong> Deploy</h3>
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
