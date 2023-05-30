import classNames from 'classnames';
import {useEffect, useState} from 'react';
import styles from './ClientConsole.module.css';

export function ClientConsole({logs}: {logs: string[] | undefined}) {
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
      className={classNames(styles.clientConsole, {[styles.bright]: bright})}
    >
      <h4 className={styles.panelLabel}>Console</h4>
      <div className={styles.consoleOutput}>
        {logs &&
          logs.map((log, i) => (
            <p className={styles.consoleItem} key={i}>
              {log.replace(/[0-9a-f]+(-[0-9a-f]+)+/g, s => s.substring(0, 4))}
            </p>
          ))}
      </div>
    </div>
  );
}
