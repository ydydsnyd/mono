import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Benefits from '@/components/Benefits/Benefits.tsx';
import Pricing from '@/components/Pricing/Pricing.tsx';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reflect</title>
        <meta name="description" content="Reflect" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section
          id="intro"
          className={`${styles.section} ${styles.introSection}`}
        >
          <h1 className={styles.title}>
            The next web is{' '}
            <span className={styles.titleEmphasized}>alive</span>.
          </h1>

          <p className={styles.featuredStatement}>
            Reflect is a web service and JavaScript library for building
            high-performance multiplayer web apps like Figma or Notion.
          </p>
        </section>

        <section id="benefits" className={styles.section}>
          <h2 className={styles.subheader}>Benefits</h2>
          <Benefits />
        </section>

        <section id="pricing" className={styles.section}>
          <h2 className={styles.subheader}>Pricing</h2>
          <Pricing />
        </section>
      </main>
    </div>
  );
}
