import styles from './GetStarted.module.css';
import Link from 'next/link';

export default function GetStarted() {
  return (
    <div className={styles.getStarted}>
      <p>
        We expect a public beta of Reflect in Summer 2023. Let us know if
        you&apos;re interested in getting access earlier.
      </p>
      <div className={styles.ctaWrap}>
        <Link
          href="https://replicache.typeform.com/to/AV2PmaWm"
          className={styles.buttonPrimary}
        >
          Beta Waitlist
        </Link>
      </div>
    </div>
  );
}
