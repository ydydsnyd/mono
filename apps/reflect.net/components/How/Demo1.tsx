import type {M} from '@/demo/shared/mutators';
import type {Reflect} from '@rocicorp/reflect';
import styles from './How.module.css';
import {IncrementClient} from './IncrementClient';
import {ServerConsole} from './ServerConsole';

export function Demo1({reflect}: {reflect: Reflect<M> | undefined}) {
  return (
    <div className={styles.howStep}>
      <div className={styles.howGridLayout2}>
        <IncrementClient reflect={reflect} />
        <ServerConsole reflect={reflect} />
      </div>
    </div>
  );
}
