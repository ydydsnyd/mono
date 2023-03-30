import React, {useContext} from 'react';
import {ClientIDContext} from './ClientIDContext';
import styles from './ServerConsole.module.css';

export default function ServerConsole({logs}: {logs: string[] | undefined}) {
  const {client1ID, client2ID} = useContext(ClientIDContext);
  return (
    <div className={styles.serverConsole}>
      <h4 className={styles.panelLabel}>Server Console</h4>
      <div className={styles.consoleOutput}>
        {logs &&
          logs.map((log, i) => {
            return (
              <p className={styles.consoleItem} key={i}>
                {log
                  .replace(client1ID, 'client1')
                  .replace(client2ID, 'client2')}
              </p>
            );
          })}
      </div>
    </div>
  );
}
