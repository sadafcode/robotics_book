import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroImageContainer}>
            <img src="/img/img.png" alt="Physical AI & Humanoid Robotics" className={styles.heroImage} />
            <div className={styles.heroOverlay}>
              <Heading as="h1" className="hero__title">
                {siteConfig.title}
              </Heading>
              <p className="hero__subtitle">{siteConfig.tagline}</p>
              <div className={styles.buttons}>
                <Link
                  className="button button--outline button--secondary button--lg"
                  to="/docs/intro">
                  Start Reading the Book - 5 min ⏱️
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description, icon}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className="text--center">
          <span style={{fontSize: '4rem'}}>{icon}</span>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

const FeatureList = [
  {
    title: 'ROS 2 Fundamentals',
    icon: '🤖',
    description: (
      <>
        Learn the communication backbone of modern robotics. Nodes, Topics,
        Services, and Actions explained for Physical AI.
      </>
    ),
  },
  {
    title: 'High-Fidelity Simulation',
    icon: '🎮',
    description: (
      <>
        Bridge the Sim-to-Real gap with Gazebo and NVIDIA Isaac Sim.
        Train robots in virtual worlds before physical deployment.
      </>
    ),
  },
  {
    title: 'Humanoid Control',
    icon: '🚶',
    description: (
      <>
        Master bipedal locomotion, whole-body control, and kinematics
        to build robots that move like humans.
      </>
    ),
  },
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="A comprehensive guide to Physical AI and Humanoid Robotics">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>

        <section className="padding-vert--xl">
          <div className="container">
            <div className="row">
              <div className="col col--10 col--offset-1">
                <Heading as="h2" className="text--center">Latest Intelligence: VLA Models</Heading>
                <p className="text--center">
                  Explore the frontier of <b>Vision-Language-Action</b> models.
                  Learn how LLMs are becoming the brains of physical robots,
                  enabling natural language understanding and general-purpose tasks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
