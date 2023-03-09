// components/Pricing/Pricing.tsx

import styles from './Pricing.module.css';
import Link from 'next/link';
import Included from './Included';
import NotIncluded from './NotIncluded';

const Pricing = () => (
  <div className={styles.pricingContainer}>
    <p>
      Pricing is not final until stable release, but this is what we&apos;re
      thinking. Questions? <Link href="#contact">Reach out</Link>.
    </p>
    <div className={styles.pricingGrid}>
      {/* Pricing Grid Header */}
      <div className={styles.pricingGridHeader}></div>
      <div className={styles.pricingGridHeader}>Hobby</div>
      <div className={styles.pricingGridHeader}>Pro</div>
      <div className={styles.pricingGridHeader}>Startup</div>
      <div className={styles.pricingGridHeader}>Enterprise</div>
      <div className={styles.pricingGridHeader}>White Glove</div>

      {/* Pricing Grid Row 1: Hours included */}
      <div className={styles.pricingGridHeader}>Hours included</div>
      <div className={styles.pricingGridData}>1,000</div>
      <div className={styles.pricingGridData}>2,000</div>
      <div className={styles.pricingGridData}>20,000</div>
      <div className={styles.pricingGridData}>200,000</div>
      <div className={styles.pricingGridData}><span className={styles.infinity}>&infin;</span></div>

      {/* Pricing Grid Row 2: Base price */}
      <div className={styles.pricingGridHeader}>Base price</div>
      <div className={styles.pricingGridData}>Free</div>
      <div className={styles.pricingGridData}>$30</div>
      <div className={styles.pricingGridData}>$300</div>
      <div className={styles.pricingGridData}>$3,000</div>
      <div className={styles.pricingGridData}>$30,000</div>

      {/* Pricing Grid Row 3: Additional hours */}
      <div className={styles.pricingGridHeader}>Add&apos;l hours</div>
      <div className={styles.pricingGridData}>N/A</div>
      <div className={styles.pricingGridData}>$0.005</div>
      <div className={styles.pricingGridData}>$0.002</div>
      <div className={styles.pricingGridData}>$0.001</div>
      <div className={styles.pricingGridData}>Free</div>

      {/* Pricing Grid Row 4: Source access */}
      <div className={styles.pricingGridHeader}>Source access</div>
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
      <div className={styles.pricingGridData}>
        <Included />
      </div>

      {/* Pricing Grid Row 5: Business Continuity */}
      <div className={styles.pricingGridHeader}>Business continuity</div>
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
      <div className={styles.pricingGridData}>
        <Included />
      </div>

      {/* Pricing Grid Row 5: Jurisdiction controls */}
      <div className={styles.pricingGridHeader}>Jurisdiction controls</div>
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
      <div className={styles.pricingGridData}>
        <Included />
      </div>

      {/* Pricing Grid Row 6: Private discord channel */}
      <div className={styles.pricingGridHeader}>Private Discord channel</div>
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
      <div className={styles.pricingGridData}>
        <Included />
      </div>

      {/* Pricing Grid Row 7: Managed onprem */}
      <div className={styles.pricingGridHeader}>Managed onprem</div>
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
        <NotIncluded />
      </div>
      <div className={styles.pricingGridData}>
        <Included />
      </div>

    </div>
  </div>
);

export default Pricing;
