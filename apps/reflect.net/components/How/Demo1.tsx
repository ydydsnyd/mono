import type {M} from '@/demo/shared/mutators';
import type {Latency} from '@/demo/shared/types';
import type {Reflect} from '@rocicorp/reflect';
import styles from './How.module.css';
import {IncrementClient} from './IncrementClient';
import {Reset} from './Reset';
import {ServerConsole} from './ServerConsole';

export function Demo1({
  reflect1,
  reflect2,
  reflectServer,
  reset,
  latency1,
  latency2,
  setLatency1,
  setLatency2,
}: {
  reflect1: Reflect<M> | undefined;
  reflect2: Reflect<M> | undefined;
  reflectServer: Reflect<M> | undefined;
  reset: () => void;
  key?: string | undefined;
  latency1?: Latency | undefined;
  latency2?: Latency | undefined;
  setLatency1: (latency: Latency) => void;
  setLatency2: (latency: Latency) => void;
}) {
  return (
    <div className={styles.howStep}>
      <div className={styles.howGridLayout2}>
        <IncrementClient
          title="Client 1"
          reflect={reflect1}
          latency={latency1}
          setLatency={setLatency1}
        />
        <ServerConsole reflect={reflectServer} />
        <IncrementClient
          title="Client 2"
          reflect={reflect2}
          latency={latency2}
          setLatency={setLatency2}
        />
      </div>
      <Reset reset={reset} />
    </div>
  );
}
