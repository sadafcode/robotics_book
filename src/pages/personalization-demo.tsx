import React from 'react';
import Layout from '@theme/Layout';
import ContentSection from '../components/ContentSection';
import PersonalizationBadge from '../components/PersonalizationBadge';
import { usePersonalization } from '../context/PersonalizationContext';

const PersonalizationDemoPage: React.FC = () => {
  const { level, profile } = usePersonalization();

  return (
    <Layout title="Personalization Demo" description="Demo of adaptive content features">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Personalization Demo</h1>

            <div className="demo-status-bar">
              <span>Your current level: </span>
              {level ? (
                <PersonalizationBadge />
              ) : (
                <span className="demo-no-level">
                  Not set —{' '}
                  <a href="/robotics_book/questionnaire">complete the questionnaire</a>
                </span>
              )}
            </div>

            <p style={{ opacity: 0.8 }}>
              The sections below adapt based on your expertise level. Switch levels via the
              questionnaire or chapter personalization button.
            </p>

            <article>
              <h2>ROS 2 Nodes — Adaptive Explanation</h2>

              {/* Shown to everyone when no profile, or specifically to non_technical */}
              <ContentSection levels={['non_technical', 'beginner']}>
                <section className="content-section content-section--beginner">
                  <h3>What is a ROS 2 Node?</h3>
                  <p>
                    A <strong>node</strong> is like a worker in a factory. Each worker does one
                    specific job — one worker might read sensor data, another might drive the
                    motors. They communicate by passing notes (called <em>messages</em>) through
                    a bulletin board (called a <em>topic</em>).
                  </p>
                  <p>
                    You can run many workers at once, and they all work together to make the
                    robot function.
                  </p>
                </section>
              </ContentSection>

              <ContentSection levels={['intermediate']}>
                <section className="content-section content-section--intermediate">
                  <h3>ROS 2 Node Architecture</h3>
                  <p>
                    A ROS 2 node is a process that uses the rclpy or rclcpp client libraries to
                    participate in the ROS 2 graph. Nodes communicate via:
                  </p>
                  <ul>
                    <li><strong>Topics</strong> — async pub/sub with DDS</li>
                    <li><strong>Services</strong> — synchronous request/response</li>
                    <li><strong>Actions</strong> — long-running tasks with feedback</li>
                  </ul>
                  <pre><code className="language-python">{`import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.pub = self.create_publisher(String, 'topic', 10)
        self.timer = self.create_timer(0.5, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello ROS 2'
        self.pub.publish(msg)`}</code></pre>
                </section>
              </ContentSection>

              <ContentSection levels={['professional']}>
                <section className="content-section content-section--professional">
                  <h3>Node Lifecycle & DDS Middleware</h3>
                  <p>
                    ROS 2 nodes use managed lifecycle (rclcpp_lifecycle) for deterministic
                    startup/shutdown. The DDS middleware (FastDDS, CycloneDDS) handles discovery
                    via SPDP/SEDP and QoS negotiation.
                  </p>
                  <p>
                    For real-time systems, configure the executor with a MultiThreadedExecutor
                    and pin callback groups to specific threads using thread affinity.
                  </p>
                  <pre><code className="language-cpp">{`auto node = std::make_shared<rclcpp_lifecycle::LifecycleNode>("rt_node");
rclcpp::executors::MultiThreadedExecutor exec;
exec.add_node(node->get_node_base_interface());
exec.spin();`}</code></pre>
                </section>
              </ContentSection>

              {/* Always visible */}
              <ContentSection levels={['all']}>
                <section className="content-section content-section--all">
                  <h3>Summary</h3>
                  <p>
                    ROS 2 nodes are the fundamental building blocks of any robotic system built
                    with the Robot Operating System.
                  </p>
                </section>
              </ContentSection>
            </article>

            <div style={{ marginTop: '2rem', padding: '16px', background: 'rgba(0,168,255,0.1)', borderRadius: '8px' }}>
              <h3>Test Adaptive Content</h3>
              <p>
                Go to <a href="/robotics_book/questionnaire">the questionnaire</a> to change your
                level, then return here to see different content sections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalizationDemoPage;
