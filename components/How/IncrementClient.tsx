import React, {useCallback, useEffect, useState} from 'react';
import Slider from './Slider';
import ClientConsole from './ClientConsole';
import styles from './How.module.css';
import demoButtonStyles from './DemoButton.module.css';
import type {Reflect} from '@rocicorp/reflect';
import {M, registerClientConsole} from '@/demo/shared/mutators';
import {useClientConsoleReducer, useCount} from './howtoUtils';
import type {Latency} from '@/demo/shared/types';

function IncrementClient({
  title,
  reflect,
  latency,
  setLatency,
}: {
  title: string;
  reflect: Reflect<M>;
  latency: Latency;
  setLatency: (latency: Latency) => void;
}) {
  const [clientConsoleState, clientConsoleDispatch] = useClientConsoleReducer();

  const increment = useCallback(async (reflect: Reflect<M>) => {
    await reflect?.mutate.increment({key: 'count', delta: 1});
  }, []);

  const [currentClientID, setCurrentClientID] = useState('');

  useCount(reflect, 'count', (key: string, val: number) => {
    clientConsoleDispatch({
      type: 'APPEND',
      payload: `Key "${key}" changed to: ${val}`,
    });
  });

  useEffect(() => {
    reflect.clientID.then(id => {
      registerClientConsole(id, (log: string) =>
        clientConsoleDispatch({type: 'APPEND', payload: log}),
      );
      setCurrentClientID(id);
    });
  }, [clientConsoleDispatch, reflect.clientID]);

  return (
    <div className={styles.client}>
      <h4 className={styles.panelLabel}>{title}</h4>
      <Slider
        clientID={currentClientID}
        clientLatency={latency}
        setClientLatency={setLatency}
      />
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
