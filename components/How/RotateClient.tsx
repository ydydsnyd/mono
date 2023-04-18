import React, {useEffect, useState, useCallback} from 'react';
import Slider from './Slider';
import ClientConsole from './ClientConsole';
import styles from './How.module.css';
import buttonStyles from './RotateButton.module.css';
import type {Reflect} from '@rocicorp/reflect';
import {M, registerClientConsole} from '@/demo/shared/mutators';
import Roci from './Roci';
import {useClientConsoleReducer, useCount} from './howtoUtils';
import GravitySlider from './GravitySlider';

function RotateClient({title, reflect}: {title: string; reflect: Reflect<M>}) {
  const [clientConsoleState, clientConsoleDispatch] = useClientConsoleReducer();

  const incrementCount = useCallback(
    (delta: number) => {
      reflect?.mutate.increment({key: 'count', delta});
    },
    [reflect],
  );

  const [currentClientID, setCurrentClientID] = useState('');
  const count = useCount(reflect, 'count', (key: string, val: number) => {
    clientConsoleDispatch({
      type: 'APPEND',
      payload: `Got change of key \`${key}\` to: ${val.toFixed(2)}`,
    });
  });

  useEffect(() => {
    reflect.clientID.then(id => {
      setCurrentClientID(id);
      registerClientConsole(id, (log: string) =>
        clientConsoleDispatch({type: 'APPEND', payload: log}),
      );
    });
  }, [reflect, clientConsoleDispatch]);

  return (
    <div className={`${styles.client} ${styles.clientExpanded}`}>
      <h4 className={styles.panelLabel}>{title}</h4>
      <Slider clientID={currentClientID} />
      <div className={styles.demo2layout}>
        <div className={buttonStyles.rotateButtonContainer}>
          <GravitySlider increment={incrementCount} />
        </div>
        <Roci rotation={count === null || isNaN(count) ? 0 : count} />
      </div>
      <ClientConsole logs={clientConsoleState} />
    </div>
  );
}

export default RotateClient;
