// components/Nav/MobileNav.tsx

import styles from './MobileNav.module.css'


const MobileNav = () => (
  <div className={styles.mobileNav}>
    <button
      type="button"
      className={styles.mobileNavButton}
      aria-label="Toggle Menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#2a2c2e"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
    </button>
  </div>
);

export default MobileNav;
