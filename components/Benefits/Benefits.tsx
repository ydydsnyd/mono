// components/Benefits/Benefits.tsx

import Image from 'next/image';
import styles from './Benefits.module.css';

// static images
import realtimeCollab from '@/public/benefits/realtimeCollab.svg';
import persistence from '@/public/benefits/persistence.svg';
import conflictResolution from '@/public/benefits/conflict-resolution.svg';
import offline from '@/public/benefits/offline.svg';
import tools from '@/public/benefits/tools.svg';
import auth from '@/public/benefits/auth.svg';
import productivity from '@/public/benefits/productivity.svg';

const Benefits = () => (
  <div className={styles.benefitsGrid}>
    {/* 60 Updates per Second */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src={realtimeCollab}
          loading="lazy"
          alt="60 FPS cursor"
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Impossibly Smooth Motion</h3>
      <p className={styles.benefitDescription}>
        Across town, or across the globe &#8212; 60FPS sync with dynamic
        buffering provides perfect, buttery playback. No interpolation required.
      </p>
    </div>

    {/* Automatic Persistence */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src={persistence}
          loading="lazy"
          alt="Persistence"
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Automatic Persistence</h3>
      <p className={styles.benefitDescription}>
        Write changes as they happen (yes, every mouse movement). Reflect stores
        everything continuously, up to 25MB/room.
      </p>
    </div>

    {/* Transactional Conflict Resolution */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src={conflictResolution}
          loading="lazy"
          alt="Conflict resolution"
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Server Authority</h3>
      <p className={styles.benefitDescription}>
        CRDTs converge, but to what? Validation isn&apos;t possible. Reflect
        runs <strong>your code</strong> server-side, giving you complete control
        over what gets stored.
      </p>
    </div>

    {/* Optional Offline */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src={offline}
          loading="lazy"
          alt="Offline"
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Optional Offline</h3>
      <p className={styles.benefitDescription}>
        Set <code className={styles.inlineCode}>clientPersistence: true</code>&nbsp;
        and data is synced to the client, providing instant (“local-first”)
        startup, navigation, and offline support.
      </p>
    </div>

    {/* Fine-Grained Auth */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src={auth}
          loading="lazy"
          alt="Authorization"
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Fine-Grained Auth</h3>
      <p className={styles.benefitDescription}>
        Implement arbitrary access rules in JavaScript for reading or writing,
        down to individual data items.
      </p>
    </div>

    {/* Works With Your Tools */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src={tools}
          loading="lazy"
          alt="Tools"
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>Works With Your Tools</h3>
      <p className={styles.benefitDescription}>
        Reflect data is just JSON. It&apos;s easy to integrate with any UI
        framework or state management library.
      </p>
    </div>

    {/* Absurd Productivity */}
    <div className={styles.benefitBlockFull}>
      <div className={styles.benefitFullIconContainer}>
        <Image
          src={productivity}
          loading="lazy"
          alt="Productivity"
          className={styles.benefitFullIcon}
        />
      </div>
      <div className={styles.benefitInfoContainer}>
        <h3 className={styles.benefitFullTitle}>Even More Coming Soon</h3>
        <p className={styles.benefitDescription}>
          First-class history, branching, painless migrations, optional on-prem
          deployment, and more! Reflect&apos;s architecture is harder to build
          up-front, but enables features that are difficult to build otherwise.
        </p>
      </div>
    </div>
  </div>
);

export default Benefits;
