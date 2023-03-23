import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Nav from '@/components/Nav/Nav';
import Benefits from '@/components/Benefits/Benefits';
import How from '@/components/How/How';
import GetStarted from '@/components/GetStarted/GetStarted';
import Testimonials from '@/components/Testimonials/Testimonials';
import Pricing from '@/components/Pricing/Pricing';
import Contact from '@/components/Contact/Contact';
import Demo from '@/components/Demo/Demo';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reflect</title>
        <meta name="description" content="Reflect" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <main className={styles.main}>
        <section
          id="intro"
          className={`${styles.section} ${styles.introSection}`}
        >
          <h1 className={styles.title}>The next web is </h1>
          <Demo />

          <p className={styles.featuredStatement}>
            High-performance sync for multiplayer web apps.
          </p>
        </section>

        <section id="benefits" className={styles.section}>
          <h2 className={styles.subheader}>Why Reflect?</h2>
          <Benefits />
        </section>

        <section id="how" className={styles.section}>
          <h2 className={styles.subheader}>How it Works</h2>
          <How />
        </section>

        <section id="get-started" className={styles.section}>
          <h2 className={styles.subheader}>Coming This Summer</h2>
          <GetStarted />
        </section>

        <section id="customers" className={styles.section}>
          <h2 className={styles.subheader}>Who&rsquo;s using Reflect?</h2>
          <Testimonials />
        </section>

        <section id="pricing" className={styles.section}>
          <h2 className={styles.subheader}>Simple, Usage-Based Pricing</h2>
          <Pricing />
        </section>

        <section id="contact" className={styles.section}>
          <h2 className={styles.subheader}>Contact us</h2>
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}
