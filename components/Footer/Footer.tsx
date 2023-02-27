import styles from './Footer.module.css';
import Link from 'next/link';


const todaysDate = new Date();
const currentYear = todaysDate.getFullYear();

const Footer = () => (
  <footer id="about" className={styles.footer}>
    <h2 className={styles.subheader}>Who&apos;s Behind This?</h2>
    <div className={styles.footerInnerContainer}>
      <a href="https://rocicorp.dev/" className={styles.footerLink}>
        <img src='/rocicorp-lockup.svg' alt="Rocicorp logo" className={styles.footerLogo} />
      </a>
      <p className={styles.footerMessage}>
        Reflect is a product of <Link href="https://rocicorp.dev#">Rocicorp</Link>. We also make <Link href="https://replicache.dev">Replicache</Link>, the client-only version of this system.
      </p>
    </div>   

    <div className={styles.footerCopyright}>
      <p>
        Designed &amp; engineered by <Link href="https://rocicorp.dev">Rocicorp</Link> &copy; 2019 - {currentYear}
      </p>
    </div>
  </footer>
);

export default Footer;
