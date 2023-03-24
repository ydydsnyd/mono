// components/Nav/Nav.tsx

import React, {Component} from 'react';
import * as Scroll from 'react-scroll';
import NavLogo from './NavLogo';
import styles from './Nav.module.css';
import MobileNav from './MobileNav';

let Link = Scroll.Link;

export default class Nav extends Component {
  state = {
    scrollPosition: 0,
  };

  listenToScrollEvent = () => {
    document.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        this.calculateScrollDistance();
      });
    });
  };

  calculateScrollDistance = () => {
    const scrollTop = window.pageYOffset; // how much the user has scrolled by
    const winHeight = window.innerHeight;
    const docHeight = this.getDocHeight();

    const totalDocScrollLength = docHeight - winHeight;
    const scrollPosition = Math.floor((scrollTop / totalDocScrollLength) * 100);

    this.setState({
      scrollPosition,
    });
  };

  getDocHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
    );
  };

  componentDidMount() {
    this.listenToScrollEvent();
  }

  navSepCalc = () => {
    if (this.state.scrollPosition > 0) {
      return '0.1';
    } else {
      return '0';
    }
  };

  render() {
    return (
      <nav
        className={styles.nav}
        style={{
          borderBottom: '1px solid rgba(0, 0, 0, ' + this.navSepCalc() + ')',
        }}
      >
        <div className={styles.navContainer}>
          <Link
            href="#"
            className={styles.navLogoLinkMobile}
            to="intro"
            smooth={true}
            duration={250}
          >
            <NavLogo src="/reflect.svg" height="44" alt="Reflect logo" />
          </Link>
          <ul role="list" className={styles.navArray}>
            <li id="logo" className={styles.navLogoContainer}>
              <Link
                href="#"
                className={styles.navLogoLink}
                to="intro"
                smooth={true}
                duration={250}
              >
                <NavLogo src="/reflect.svg" height="44" alt="Reflect logo" />
              </Link>
            </li>
            <li></li>
            <li>
              <Link
                href="#"
                className={styles.navLink}
                activeClass={styles.navLinkActive}
                to="benefits"
                spy={true}
                smooth={true}
                duration={250}
              >
                Benefits
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={styles.navLink}
                activeClass={styles.navLinkActive}
                to="how"
                spy={true}
                smooth={true}
                duration={250}
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={styles.navLink}
                activeClass={styles.navLinkActive}
                to="customers"
                spy={true}
                smooth={true}
                duration={250}
              >
                Customers
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={styles.navLink}
                activeClass={styles.navLinkActive}
                to="pricing"
                spy={true}
                smooth={true}
                duration={250}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={styles.navLink}
                activeClass={styles.navLinkActive}
                to="contact"
                spy={true}
                smooth={true}
                duration={250}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={styles.buttonPrimary}
                to="get-started"
                smooth={true}
                duration={250}
              >
                Get started
              </Link>
            </li>
          </ul>
          <MobileNav />
        </div>
      </nav>
    );
  }
}
