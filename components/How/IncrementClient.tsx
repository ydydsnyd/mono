import React, {useEffect, useState} from 'react';
import Slider from './Slider';
import ClientConsole from './ClientConsole';
import styles from './How.module.css';
import demoButtonStyles from './DemoButton.module.css';
import type {ReadTransaction, Reflect} from '@rocicorp/reflect';
import {M, registerClientConsole} from '@/demo/shared/mutators';
import {useClientConsoleReducer, useCount} from './howtoUtils';

function IncrementClient({
  title,
  reflect,
}: {
  title: string;
  reflect: Reflect<M>;
}) {
  const increment = async (reflect: Reflect<M>) =>
    await reflect?.mutate.increment({key: 'count', delta: 1});

  const [clientConsoleState, clientConsoleDispatch] = useClientConsoleReducer();
  const [currentClientID, setCurrentClientID] = useState('');

  useCount(reflect, 'count', (key: string, val: string, tx: ReadTransaction) =>
    clientConsoleDispatch(
      `Got change of key ${key} on client ${tx.clientID}: ${val}`,
    ),
  );

  useEffect(() => {
    reflect.clientID.then(id => {
      registerClientConsole(id, (log: string) => clientConsoleDispatch(log));
      setCurrentClientID(id);
    });
  }, [clientConsoleDispatch, reflect.clientID]);

  return (
    <div className={styles.client}>
      <h4 className={styles.panelLabel}>{title}</h4>
      <Slider clientID={currentClientID} />
      <div className={demoButtonStyles.demoContainer}>
        <button
          onClick={() => increment(reflect)}
          className={demoButtonStyles.demoButton}
        >
          Increment
        </button>
      </div>
      <ClientConsole logs={clientConsoleState} />
    </div>
  );
}

export default IncrementClient;
