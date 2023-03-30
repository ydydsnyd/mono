import React, {useContext} from 'react';
import styles from './ClientConsole.module.css';
import {ClientIDContext} from './ClientIDContext';

export default function ClientConsole({logs}: {logs: string[] | undefined}) {
  const {client1ID, client2ID} = useContext(ClientIDContext);

  return (
    <div className={styles.clientConsole}>
      <h4 className={styles.panelLabel}>Console</h4>
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
