import {useState} from 'react';
import styles from './How.module.css';
import Demo1a from './Demos/Demo1a';
import Demo1b from './Demos/Demo1b';
import ServerConsole from './ServerConsole';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '@/demo/shared/mutators';
import IncrementClient from './IncrementClient';
import Reset from './Reset';

export default function Demo1({
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
    <div className={styles.howStep}>
      <h3 className={styles.howHeader}>
        <strong>Step 1:</strong> Define Mutators
      </h3>
      <p className={styles.howDescription}>
        Mutators are functions you define to change the datastore. The UI
        updates <strong>instantly</strong> (in the same frame) when mutators are
        called. Milliseconds later, Reflect replays the mutator on the server to
        sync the change. Because of server replay, mutators handle many
        conflicts naturally. If two client simultaneously increment a counter,
        the mutator will naturally sum the changes rather than overwrite one.
      </p>
      <div className={styles.howGridLayout2}>
        <div className={styles.codeBlock}>
          {toggleDemo ? (
            <>
              <div className={styles.codeBlockToggle}>
                <button className={styles.codeToggleActive}>mutators.ts</button>
                <button onClick={toggleSwitchDemo}>index.tsx</button>
              </div>
              <Demo1a />
            </>
          ) : (
            <>
              <div className={styles.codeBlockToggle}>
                <button onClick={toggleSwitchDemo}>mutators.ts</button>
                <button className={styles.codeToggleActive}>index.tsx</button>
              </div>
              <Demo1b />
            </>
          )}
        </div>
        <IncrementClient title="Client 1" reflect={reflect1} />
        <ServerConsole reflect={reflectServer} />
        <IncrementClient title="Client 2" reflect={reflect2} />
      </div>
      <Reset />
    </div>
  );
}
