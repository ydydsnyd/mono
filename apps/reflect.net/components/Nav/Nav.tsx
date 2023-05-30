// components/Nav/Nav.tsx

import {Link} from 'react-scroll';
import styles from './Nav.module.css';
import {NavLogo} from './NavLogo';

export function Nav() {
  return (
    <nav
      className={styles.nav}
      style={{
        borderBottom: '1px solid rgba(0, 0, 0, 0)',
      }}
    >
      <div className={styles.navContainer}>
        <Link
          href="#"
          className={styles.navLogoLinkMobile}
          to="intro"
          smooth={true}
          duration={250}
          isDynamic={true}
        >
          <NavLogo src="/reflect.svg" height="44" alt="Reflect logo" />
        </Link>
      </div>
    </nav>
  );
}
