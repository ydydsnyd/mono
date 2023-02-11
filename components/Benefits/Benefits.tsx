// components/Benefits/Benefits.tsx

import Image from 'next/image';
import Link from 'next/link';
import styles from './Benefits.module.css';

const Benefits = () => (
  <div className={styles.benefitsGrid}>
    {/* 60 Updates per Second */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src="/benefits/realtimeCollab.svg"
          loading="lazy"
          alt=""
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>60 Updates per Second</h3>
      <p className={styles.benefitDescription}>
        Buttery smooth cursors and dragging automatically, with no interpolation
        required. Every change, from every user, for the entire document,
        replicated frame-by-frame at 60 fps.
      </p>
    </div>

    {/* Automatic Persistence */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src="/benefits/realtimeCollab.svg"
          loading="lazy"
          alt=""
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Automatic Persistence</h3>
      <p className={styles.benefitDescription}>
        There&apos;s no separate, slower persistence API. Just write changes as
        they happen (yes, every mouse movement). Reflect stores everything
        continuously — up to 25MB/room.
      </p>
    </div>

    {/* Replay-Based Conflict Resolution */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src="/benefits/realtimeCollab.svg"
          loading="lazy"
          alt=""
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Replay-Based Conflict Resolution</h3>
      <p className={styles.benefitDescription}>
        CRDTs converge, but to what? App-specific validation isn&apos;t
        possible. Reflect uses <Link href="#">server reconciliation</Link>{' '}
        instead, a more powerful and intuitive technique pioneered by
        multiplayer games.
      </p>
    </div>

    {/* Optional Offline */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src="/benefits/realtimeCollab.svg"
          loading="lazy"
          alt=""
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Optional Offline</h3>
      <p className={styles.benefitDescription}>
        Set `enableClientStorage: true` and your data is also available offline
        on the client. Reflect&apos;s use of client storage is “cache-first”, so
        it transits online, offline, or flaky connections seamlessly.
      </p>
    </div>

    {/* Works With Your Tools */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src="/benefits/realtimeCollab.svg"
          loading="lazy"
          alt=""
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Works With Your Tools</h3>
      <p className={styles.benefitDescription}>
        Reflect data is just JSON. It&apos;s easy to integrate with any UI
        framework or state management library.
      </p>
    </div>

    {/* Fine-Grained Auth */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src="/benefits/realtimeCollab.svg"
          loading="lazy"
          alt=""
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Fine-Grained Auth</h3>
      <p className={styles.benefitDescription}>
        Implement arbitrary access rules in JavaScript for either reading or
        writing, down to individual data items.
      </p>
    </div>

    {/* Absurd Productivity */}
    <div className={styles.benefitBlockFull}>
      <div className={styles.benefitFullIconContainer}>
        <Image
          src="/benefits/itworks-white.svg"
          loading="lazy"
          alt=""
          className={styles.benefitFullIcon}
        />
      </div>
      <div className={styles.benefitInfoContainer}>
        <h3 className={styles.benefitFullTitle}>Absurd Productivity</h3>
        <p className={styles.benefitDescription}>
          No servers. No databases. No APIs. Mutate data on one client and it
          syncs to collaborators, then render changes reactively. You will build
          multiplayer faster than you build single-player today.
        </p>
      </div>
    </div>
  </div>
);

export default Benefits;
