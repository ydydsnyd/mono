import styles from './GetStarted.module.css'
import Link from 'next/link';

export default function GetStarted(){

  return (
    <div className={styles.getStarted}>
      <p>Reflect is in closed beta, and we are onboarding people as fast as we can. Sign up below and let us know what you’ll build with Reflect, and we’ll get you in as soon as we can.</p>
      <div className={styles.ctaWrap}>
        <Link
          href="https://replicache.typeform.com/to/AV2PmaWm"
          className={styles.buttonPrimary}
        >Beta Waitlist</Link>
      </div>
      

   </div>
  );
}
