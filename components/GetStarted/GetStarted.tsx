import styles from './GetStarted.module.css';
import Link from 'next/link';

export default function GetStarted() {
  return (
    <div className={styles.getStarted}>
      <p>
        Reflect is being built by the team behind{' '}
        <a href="https://replicache.dev/">Replicache</a>, and we&apos;re working
        toward a public beta later this year.
      </p>
      <p>
        Sign up below for prioritized access &#8212; we&apos;ll let you know as
        soon as the beta is available to try. You can also contact us by{' '}
        <Link href="#">email</Link>, on <Link href="#">Twitter</Link>, or on{' '}
        <Link href="#">Discord</Link>.
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
