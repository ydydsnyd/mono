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
      <h3 className={styles.benefitTitle}>Perfectly Smooth Motion</h3>
      <p className={styles.benefitDescription}>
        Great multiplayer starts with framerate. To look alive, motion has to
        run at at least 60&nbsp;FPS.
      </p>
      <p className={styles.benefitDescription}>
        Reflect captures and replays changes at 120&nbsp;FPS. Batching and
        adaptive buffering ensure buttery smooth, precision playback &#8212;
        across town or across the globe.
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
        Reflect data is stored in <em>rooms</em>. Changes are saved continously
        and automatically.
      </p>
      <p className={styles.benefitDescription}>
        There&apos;s no separate, slower persistence API to juggle. Write
        changes as they happen (yes, every mouse movement) and they are stored
        transparently, up to 50MB/room.
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
        CRDTs converge, but to what? Your application has no control. Validation
        and custom business logic aren&apos;t possible.
      </p>
      <p className={styles.benefitDescription}>
        Reflect uses a more flexible and intuitive technique based on{' '}
        <a href="https://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html">
          Server Reconciliation
        </a>
        .
      </p>
      <p className={styles.benefitDescription}>
        <strong>Your mutation code</strong> runs server-side, and clients are
        guaranteed to converge with server state.
      </p>
    </div>

    {/* On-Prem */}
    <div className={styles.benefitBlock}>
      <div className={styles.benefitIconContainer}>
        <Image
          src={tools}
          loading="lazy"
          alt="Tools"
          className={styles.benefitIcon}
        />
      </div>
      <h3 className={styles.benefitTitle}>On-&ldquo;Prem&rdquo; Available</h3>
      <p className={styles.benefitDescription}>
        Use Reflect as a traditional SaaS, or deploy it to your own Cloudflare
        account.
      </p>
      <p className={styles.benefitDescription}>
        We&apos;ll run, monitor, and update it. You maintain control and
        ownership.
      </p>
      <p className={styles.benefitDescription}>
        Enjoy complete business continuity security with a perpetual source
        license to each version.
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
        Set <code className="inline">clientPersistence: true</code>
        &nbsp; and data is also stored on the client, providing instant
        (“local-first”) startup, navigation, and offline support.
      </p>
    </div>

    {/* 
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
          First-class history, branching, painless migrations, and more!
        </p>
      </div>
    </div>
        */}
  </div>
);

export default Benefits;
