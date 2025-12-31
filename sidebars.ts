import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '1. ROS 2 Fundamentals',
      items: [
        'module-1-ros2/ros2-architecture',
        'module-1-ros2/publishers-subscribers',
        'module-1-ros2/services-actions',
      ],
    },
    {
      type: 'category',
      label: '2. Simulation Environments',
      items: [
        'module-2-simulation/simulation-basics',
        'module-2-simulation/gazebo-simulation',
        'module-2-simulation/isaac-sim',
      ],
    },
    {
      type: 'category',
      label: '3. Humanoid Control',
      items: [
        'module-3-humanoid-control/humanoid-kinematics',
        'module-3-humanoid-control/balance-wbc',
        'module-3-humanoid-control/humanoid-locomotion',
      ],
    },
    {
      type: 'category',
      label: '4. VLA Models',
      items: [
        'module-4-vla/vla-introduction',
        'module-4-vla/openvla-models',
        'module-4-vla/vla-future',
      ],
    },
  ],
};

export default sidebars;
