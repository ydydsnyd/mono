import styles from './Reset.module.css';
import Image from 'next/image';
import resetIcon from '@/public/how-it-works/reset.svg';

export default function Reset() {

    return (
      <button className={styles.resetButton}>
        <Image src={resetIcon} className={styles.resetIcon} alt="Reset" />
        <span className={styles.resetLabel}>
            Reset demo
        </span>
      </button>
    );
  }
  