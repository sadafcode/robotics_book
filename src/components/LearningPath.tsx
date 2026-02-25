import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { usePersonalization } from '../context/PersonalizationContext';
import { getLearningPath } from '../services/personalizationApi';

interface Chapter {
  id: string;
  title: string;
  description: string;
  min_level: string;
  is_recommended: boolean;
  is_accessible: boolean;
}

const LEVEL_LABELS: Record<string, string> = {
  non_technical: 'Non-Technical',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  professional: 'Professional',
};

const LearningPath: React.FC = () => {
  const { user } = useAuth();
  const { level } = usePersonalization();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getLearningPath(user.id)
      .then((data) => setChapters(data.chapters))
      .catch(() => setError('Could not load learning path. Check backend connection.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="learning-path-cta">
        <p>
          <a href="/robotics_book/login">Log in</a> to get a personalized learning path.
        </p>
      </div>
    );
  }

  if (isLoading) return <p>Loading your learning path...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="learning-path">
      <div className="learning-path__header">
        <p className="learning-path__subtitle">
          Customized for your{' '}
          <strong>{LEVEL_LABELS[level ?? 'beginner']}</strong> level — {chapters.length} chapters
        </p>
      </div>

      <div className="learning-path__timeline">
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.id}
            className={`learning-path__item ${chapter.is_recommended ? 'learning-path__item--recommended' : ''}`}
          >
            <div className="learning-path__item-number">{idx + 1}</div>
            <div className="learning-path__item-content">
              <div className="learning-path__item-header">
                <h3 className="learning-path__item-title">{chapter.title}</h3>
                {chapter.is_recommended && (
                  <span className="learning-path__recommended-badge">Recommended</span>
                )}
                <span className={`learning-path__level-tag level-tag--${chapter.min_level}`}>
                  {LEVEL_LABELS[chapter.min_level]}
                </span>
              </div>
              <p className="learning-path__item-description">{chapter.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;
