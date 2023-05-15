import Image from 'next/image.js';
import Link from 'next/link';
import styles from './Footer.module.css';

const todaysDate = new Date();
const currentYear = todaysDate.getFullYear();

const Footer = () => (
  <footer id="about" className={styles.footer}>
    <a href="https://rocicorp.dev/" className={styles.footerLink}>
      <Image
        src="/rocicorp-lockup.svg"
        alt="Rocicorp logo"
        className={styles.footerLogo}
      />
    </a>

    <div className={styles.footerCopyright}>
      <p>
        Designed &amp; engineered by <br />
        <Link href="https://rocicorp.dev">Rocicorp</Link> &copy; 2019 &#8211;{' '}
        {currentYear}
      </p>
    </div>
  </footer>
);

export default Footer;
