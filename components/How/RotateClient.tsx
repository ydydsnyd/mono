import React, {useEffect, useReducer, useState} from 'react';
import Slider from './Slider';
import ClientConsole from './ClientConsole';
import styles from './How.module.css';
import buttonStyles from './RotateButton.module.css';
import type {ReadTransaction, Reflect} from '@rocicorp/reflect';
import {M, registerClientConsole} from '@/demo/shared/mutators';
import useLongPress from './useLongPress';
import Roci from './Roci';
import {useClientConsoleReducer, useCount} from './howtoUtils';

function RotateClient({
  title,
  reflect,
}: {
  title: string;
  reflect: Reflect<M>;
}) {
  const onLongPress = () => {
    reflect?.mutate.increment({key: 'count', delta: 1});
  };

  const onClick = () => {
    reflect?.mutate.increment({key: 'count', delta: 1});
  };

  const longPressEvent = useLongPress(onLongPress, onClick);
  const [clientConsoleState, clientConsoleDispatch] = useClientConsoleReducer();

  const [count, countDispatch] = useReducer(
    (_state: number, action: number) => {
      return action;
    },
    0,
  );
  const [currentClientID, setCurrentClientID] = useState('');
  useCount(
    reflect,
    'count',
    (key: string, val: string, tx: ReadTransaction) => {
      clientConsoleDispatch(
        `Got change of key ${key} on client ${tx.clientID}: ${val}`,
      );
      countDispatch(parseInt(val));
    },
  );

  useEffect(() => {
    reflect.clientID.then(id => {
      setCurrentClientID(id);
      registerClientConsole(id, (log: string) => clientConsoleDispatch(log));
    });
  });

  return (
    <div className={styles.client}>
      <h4 className={styles.panelLabel}>{title}</h4>
      <Slider clientID={currentClientID} />
      <div className={styles.demo2layout}>
        <div className={buttonStyles.rotateButtonContainer}>
          <button className={buttonStyles.rotateButton} {...longPressEvent}>
            Rotate
          </button>
        </div>
        <Roci rotation={count ?? 0} />
      </div>
      <ClientConsole logs={clientConsoleState} />
    </div>
  );
}

export default RotateClient;
