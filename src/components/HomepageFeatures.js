import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Easy & Secure',
    Svg: require('../../static/img/secure.svg').default,
    description: (
      <>
        QBCore was built with developers in mind! Offering easy configuration,
        fantastic security and mere minutes installation time!
      </>
    ),
  },
  {
    title: 'Advanced Scripts',
    Svg: require('../../static/img/toolbox.svg').default,
    description: (
      <>
        QBCore comes pre-loaded with many unique scripts that will give you the tools needed
        for a running head start towards your final product!
      </>
    ),
  },
  {
    title: 'GNU General Public License',
    Svg: require('../../static/img/license.svg').default,
    description: (
      <>
        Flexible licensing means you can edit to your hearts content! We are a 100% open source framework!
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
