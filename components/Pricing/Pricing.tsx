// components/Pricing/Pricing.tsx

import styles from './Pricing.module.css';
import Included from './Included';
import NotIncluded from './NotIncluded';

const Pricing = () => (
  <div className={styles.pricingContainer}>
    <p>
      Simple, transparent usage-based pricing by hours of room usage. A
      room-hour is an hour a had at least one user in it. For example, if Bob
      was in a room from 8a-10a, and Sally was in the same room from 9a-11a,
      that would be 2 room-hours.
    </p>
    <div className={styles.pricingGrid}>
      {/* Pricing Grid Header */}
      <div className={styles.pricingGridHeader}></div>
      <div className={styles.pricingGridHeader}>Hobby</div>
      <div className={styles.pricingGridHeader}>Pro</div>
      <div className={styles.pricingGridHeader}>Startup</div>
      <div className={styles.pricingGridHeader}>Enterprise</div>

      {/* Pricing Grid Row 1: Hours included */}
      <div className={styles.pricingGridHeader}>Room-Hours Included</div>
      <div className={styles.pricingGridData}>1,000</div>
      <div className={styles.pricingGridData}>2,000</div>
      <div className={styles.pricingGridData}>20,000</div>
      <div className={styles.pricingGridData}>Custom</div>

      {/* Pricing Grid Row 2: Base price */}
      <div className={styles.pricingGridHeader}>Base Price</div>
      <div className={styles.pricingGridData}>Free</div>
      <div className={styles.pricingGridData}>$30</div>
      <div className={styles.pricingGridData}>$300</div>
      <div className={styles.pricingGridData}>Custom</div>

      {/* Pricing Grid Row 3: Additional hours */}
      <div className={styles.pricingGridHeader}>Add&apos;l Room-Hours</div>
      <div className={styles.pricingGridData}>N/A</div>
      <div className={styles.pricingGridData}>$0.005</div>
      <div className={styles.pricingGridData}>$0.002</div>
      <div className={styles.pricingGridData}>Custom</div>

      {/* Pricing Grid Row 4: Source access */}
      <div className={styles.pricingGridHeader}>Source License</div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <Included />
      </div>
      <div className={styles.pricingGridData}>
        <Included />
      </div>

      {/* Pricing Grid Row 5: Jurisdiction controls */}
      <div className={styles.pricingGridHeader}>Jurisdiction Controls</div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <Included />
      </div>
      <div className={styles.pricingGridData}>
        <Included />
      </div>

      {/* Pricing Grid Row 6: Private discord channel */}
      <div className={styles.pricingGridHeader}>Private Discord Channel</div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <Included />
      </div>

      {/* Pricing Grid Row 7: Managed onprem */}
      <div className={styles.pricingGridHeader}>Managed On-Prem</div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <Included />
      </div>
    </div>
  </div>
);

export default Pricing;
