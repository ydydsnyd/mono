import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Pricing from '@/components/Pricing/Pricing.tsx'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Reflect</title>
        <meta name="description" content="Reflect" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section id="intro" className={`${styles.section} ${styles.introSection}`}>
          <h1 className={styles.title}>
            The next web is <span className={styles.titleEmphasized}>alive</span>.
          </h1>

          <p className={styles.featuredStatement}>
            Reflect is a web service and JavaScript library for building high-performance multiplayer web apps like Figma or Notion.
          </p>
        </section>

        <section id="pricing" className={styles.section}>
        <h2 className={styles.subheader}>
          Pricing
        </h2>
        <Pricing />
        </section>
      </main>
    </>
  )
}
