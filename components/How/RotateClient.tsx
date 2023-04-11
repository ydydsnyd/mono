import React, { useEffect, useState, useCallback, Dispatch } from 'react';
import Slider from './Slider';
import ClientConsole from './ClientConsole';
import styles from './How.module.css';
import buttonStyles from './RotateButton.module.css';
import type { ReadTransaction, Reflect } from '@rocicorp/reflect';
import { M, registerClientConsole } from '@/demo/shared/mutators';
import useLongPress from './useLongPress';
import Roci from './Roci';
import { ConsoleAction, useCount } from './howtoUtils';

function RotateClient({
  title,
  reflect,
  clientConsoleDispatch,
  clientConsoleState,
}: {
  title: string;
  reflect: Reflect<M>;
  clientConsoleDispatch: Dispatch<ConsoleAction>;
  clientConsoleState: string[];
}) {
  const incrementCount = useCallback(() => {
    reflect?.mutate.increment({ key: 'count', delta: 1 });
  }, [reflect]);

  const longPressEvent = useLongPress(incrementCount, incrementCount);

  const [currentClientID, setCurrentClientID] = useState('');
  const count = useCount(
    reflect,
    'count',
    (key: string, val: string, tx: ReadTransaction) => {
      clientConsoleDispatch({
        type: 'APPEND',
        payload: `Got change of key ${key} on client ${tx.clientID}: ${val}`,
      });
      const parsedVal = parseInt(val);
      return parsedVal == null || isNaN(parsedVal) ? 0 : parsedVal;
    },
  );

  useEffect(() => {
    reflect.clientID.then(id => {
      setCurrentClientID(id);
      registerClientConsole(id, (log: string) =>
        clientConsoleDispatch({ type: 'APPEND', payload: log }),
      );
    });
  }, [reflect, clientConsoleDispatch]);

  return (
    <div className={`${styles.client} ${styles.clientExpanded}`}>
      <h4 className={styles.panelLabel}>{title}</h4>
      <Slider clientID={currentClientID} />
      <div className={styles.demo2layout}>
        <div className={buttonStyles.rotateButtonContainer}>
          <button className={buttonStyles.rotateButton} {...longPressEvent}>
            Rotate
          </button>
        </div>
        <Roci rotation={count === null || isNaN(count) ? 0 : count} />
      </div>
      <ClientConsole logs={clientConsoleState} />
    </div>
  );
}

export default RotateClient;
