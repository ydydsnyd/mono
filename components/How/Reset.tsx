import styles from './Reset.module.css';
import Image from 'next/image';
import resetIcon from '@/public/how-it-works/reset.svg';
import type {ConsoleAction} from './howtoUtils';
import type {Dispatch} from 'react';

export default function Reset({
  reset,
  clientConsole1Dispatch,
  clientConsole2Dispatch,
}: {
  reset: () => void;
  clientConsole1Dispatch: Dispatch<ConsoleAction>;
  clientConsole2Dispatch: Dispatch<ConsoleAction>;
}) {
  return (
    <button
      className={styles.resetButton}
      onClick={() => {
        reset();
        clientConsole1Dispatch({type: 'CLEAR'});
        clientConsole2Dispatch({type: 'CLEAR'});
      }}
    >
      <Image src={resetIcon} className={styles.resetIcon} alt="Reset" />
      <span className={styles.resetLabel}>Reset demo</span>
    </button>
  );
}
