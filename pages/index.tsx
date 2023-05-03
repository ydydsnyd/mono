import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Nav from '@/components/Nav/Nav';
import Benefits from '@/components/Benefits/Benefits';
import How from '@/components/How/How';
import GetStarted from '@/components/GetStarted/GetStarted';
import Testimonials from '@/components/Testimonials/Testimonials';
import Pricing from '@/components/Pricing/Pricing';
import Demo from '@/components/Demo/Demo';
import Footer from '@/components/Footer/Footer';
import {useEffect, useState} from 'react';
import type {GetServerSideProps} from 'next';
import type {NextIncomingMessage} from 'next/dist/server/request-meta';
import {useDocumentSize} from '@/hooks/use-document-size';
import {useWindowSize} from '@/hooks/use-window-size';
import {Rect, getStage} from '@/demo/alive/util';
import {useVHStyleProp} from '@/hooks/use-vh-style-prop';
import useIsomorphicLayoutEffect from '@/hooks/use-isomorphic-layout-effect';

export type Location = {
  country: string;
  city: string;
  region: string;
} | null;

export function getLocationString(location: Location) {
  if (location === null) return null;
  const {country, city} = location;
  const flagEmoji = String.fromCodePoint(
    ...country
      .toUpperCase()
      .split('')
      .map((char: string) => 127397 + char.charCodeAt(0)),
  );
  return `${decodeURI(city)} ${flagEmoji}`;
}

export type GameMode = 'off' | 'requested' | 'active';

export const getServerSideProps: GetServerSideProps<{
  location: Location;
}> = async ({req}: {req: NextIncomingMessage}) => {
  const country = (req.headers['x-vercel-ip-country'] as string) ?? '';
  const city = (req.headers['x-vercel-ip-city'] as string) ?? '';
  const region = (req.headers['x-vercel-ip-country-region'] as string) ?? '';

  if (!country || !city || !region) {
    return {
      props: {
        location: null,
      },
    };
  }

  return {
    props: {
      location: {
        country,
        city,
        region,
      },
    },
  };
};

export default function Home({location}: {location: Location}) {
  const winSize = useWindowSize();
  const docSize = useDocumentSize();
  useVHStyleProp(winSize?.height ?? null);
  const [navHeight, setNavHeight] = useState<number | null>(null);
  const [introBottom, setIntroBottom] = useState<number | null>(null);
  const [featureStatementTop, setFeatureStatementTop] = useState<number | null>(
    null,
  );
  const [gameMode, setGameMode] = useState<GameMode>('off');

  let stage: Rect | null = null;
  if (gameMode) {
    if (winSize) {
      stage = new Rect(0, 0, winSize.width, winSize.height);
    }
  } else {
    if (
      winSize !== null &&
      docSize !== null &&
      featureStatementTop !== null &&
      introBottom !== null &&
      navHeight !== null
    ) {
      stage = getStage(
        winSize,
        docSize,
        navHeight,
        featureStatementTop,
        introBottom,
      );
    }
  }

  useIsomorphicLayoutEffect(() => {
    setNavHeight(document.querySelector('nav')?.offsetHeight ?? 0);
    setFeatureStatementTop(
      (document.querySelector('.featuredStatement') as any).offsetTop,
    );
    setIntroBottom(
      document.documentElement.scrollTop +
        document.querySelector('#intro')!.getBoundingClientRect().bottom,
    );
  }, [docSize]);

  useIsomorphicLayoutEffect(() => {
    if (!winSize) {
      return;
    }
    if (gameMode === 'active' && winSize.width < winSize.height) {
      setGameMode('off');
    }

    document.documentElement.classList.toggle(
      'game-mode',
      gameMode === 'active',
    );
  }, [gameMode, winSize]);

  // 💀💀💀 warning
  // For some reason this is necessary to avoid a weird layout bug when going
  // from requested game mode in portrait to active game mode in landscape on
  // iOS/Safari. Without this it will appear to work but all the touch targets
  // for all elements will be positioned incorrectly from Safari's pov. They
  // will render in the correct location but when looking in the inspector you
  // can see that Safari think they are in a different place.
  useEffect(() => {
    if (!winSize) {
      return;
    }
    if (gameMode === 'requested' && winSize.width > winSize.height) {
      setGameMode('active');
    }
  }, [gameMode, winSize]);

  const onSetGameMode = (gameMode: GameMode) => {
    setGameMode(gameMode);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Reflect: High-perfomance sync for multiplayer web apps.</title>
        <meta
          name="description"
          content="60FPS sync, automatic persistence, server authority, optional offline, fine-grained auth, and more..."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          href="favicon.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="favicon-dm.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32-dm.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16-dm.png"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://reflect-net.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Reflect: High-performance sync for multiplayer web apps."
        />
        <meta
          property="og:description"
          content="60FPS sync, automatic persistence, server authority, optional offline, fine-grained auth, and more..."
        />
        <meta
          property="og:image"
          content="https://reflect-net.vercel.app/reflect-og.jpg"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="reflect-net.vercel.app" />
        <meta
          property="twitter:url"
          content="https://reflect-net.vercel.app/"
        />
        <meta
          name="twitter:title"
          content="Reflect: High-performance sync for multiplayer web apps."
        />
        <meta
          name="twitter:description"
          content="60FPS sync, automatic persistence, server authority, optional offline, fine-grained auth, and more..."
        />
        <meta
          name="twitter:image"
          content="https://paint-fight.vercel.app/reflect-og.jpg"
        />
      </Head>

      <Nav gameMode={gameMode} />

      <main className={styles.main}>
        <Demo
          location={location}
          stage={stage}
          docSize={docSize}
          winSize={winSize}
          gameMode={gameMode}
          onSetGameMode={onSetGameMode}
        />

        <section id="benefits" className={styles.section}>
          <h2 className={styles.subheader}>Why Reflect?</h2>
          <Benefits />
        </section>

        <section id="how" className={styles.section}>
          <h2 className={styles.subheader}>How it Works</h2>
          <How />
        </section>

        <section id="pricing" className={styles.section}>
          <h2 className={styles.subheader}>Simple, Usage-Based Pricing</h2>
          <Pricing />
        </section>

        <section id="get-started" className={styles.section}>
          <h2 className={styles.subheader}>Coming Soon, from Rocicorp</h2>
          <GetStarted />
        </section>

        <section id="customers" className={styles.section}>
          <h2 className={styles.subheader}>Early Reactions</h2>
          <Testimonials />
        </section>
      </main>

      <Footer />
    </div>
  );
}
