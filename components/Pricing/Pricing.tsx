// components/Pricing/Pricing.tsx

import styles from './Pricing.module.css';
import Link from 'next/link';

const Pricing = () => (
  <div className={styles.pricingContainer}>
    <p>
      Pricing is not final until stable release, but this is what we're
      thinking. Questions? <Link href="#">React out</Link>.
    </p>
    <div className={styles.pricingGrid}>
      {/* Pricing Grid Header */}
      <div className={styles.pricingGridHeader}>Monthly Active Profiles</div>
      <div className={styles.pricingGridHeader}>&lt; 1k</div>
      <div className={styles.pricingGridHeader}>&lt; 10k</div>
      <div className={styles.pricingGridHeader}>&lt; 100k</div>
      <div className={styles.pricingGridHeader}>&ge; 100k</div>

      {/* Pricing Grid Row 1: Reflect (monthly) */}
      <div className={styles.pricingGridData}>Reflect (monthly)</div>
      <div className={styles.pricingGridData}>$1,000</div>
      <div className={styles.pricingGridData}>$2,500</div>
      <div className={styles.pricingGridData}>$6,000</div>
      <div className={styles.pricingGridData}>$15,000</div>

      {/* Pricing Grid Row 3: Source license */}
      <div className={styles.pricingGridData}>Source License</div>
      <div className={styles.pricingGridData}>
        <img src="/pricing/pricing-x.svg" className={styles.pricingGridIcon} />
      </div>
      <div className={styles.pricingGridData}>
        <img
          src="/pricing/pricing-check.svg"
          className={styles.pricingGridIcon}
        />
      </div>
      <div className={styles.pricingGridData}>
        <img
          src="/pricing/pricing-check.svg"
          className={styles.pricingGridIcon}
        />
      </div>
      <div className={styles.pricingGridData}>
        <img
          src="/pricing/pricing-check.svg"
          className={styles.pricingGridIcon}
        />
      </div>
    </div>
  </div>
);

export default Pricing;
