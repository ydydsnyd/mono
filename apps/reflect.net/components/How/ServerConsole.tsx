import type {M} from '@/demo/shared/mutators';
import type {Reflect} from '@rocicorp/reflect';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import styles from './ServerConsole.module.css';
import {useServerLogs} from './howtoUtils';

export function ServerConsole({reflect}: {reflect: Reflect<M> | undefined}) {
  const logs = useServerLogs(reflect);
  const [bright, setBright] = useState(false);

  useEffect(() => {
    if (logs?.length === 0) return;
    setBright(true);
    const timer = setTimeout(() => {
      setBright(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [logs]);

  return (
    <div
      className={classNames(styles.serverConsole, {[styles.bright]: bright})}
    >
      <h4 className={styles.panelLabel}>Server</h4>
      <div className={styles.consoleOutput}>
        {logs &&
          logs.slice(-10).map((log, i) => (
            <p className={styles.consoleItem} key={i}>
              {log.replace(/[0-9a-f]+(-[0-9a-f]+)+/g, s => s.substring(0, 4))}
            </p>
          ))}
      </div>
    </div>
  );
}
