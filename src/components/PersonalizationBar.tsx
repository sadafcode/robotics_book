import React from 'react';
import { useAuth } from './AuthProvider';
import { usePersonalization, ExpertiseLevel } from '../context/PersonalizationContext';
import PersonalizationBadge from './PersonalizationBadge';
import PersonalizationButton from './PersonalizationButton';

interface PersonalizationBarProps {
  chapterId: string;
}

const PersonalizationBar: React.FC<PersonalizationBarProps> = ({ chapterId }) => {
  const { user } = useAuth();
  const { level, chapterLevel } = usePersonalization();

  const effectiveLevel = chapterLevel(chapterId) ?? level;

  if (!user) {
    // Show a subtle login prompt for unauthenticated users
    return (
      <div className="personalization-bar personalization-bar--unauthenticated">
        <span className="personalization-bar__prompt">
          <a href="/robotics_book/login">Log in</a> to personalize content
        </span>
      </div>
    );
  }

  if (!level) {
    // User logged in but no questionnaire done
    return (
      <div className="personalization-bar personalization-bar--no-profile">
        <span className="personalization-bar__prompt">
          <a href="/robotics_book/questionnaire">Set up your learning profile</a> for personalized content
        </span>
      </div>
    );
  }

  return (
    <div className="personalization-bar">
      <div className="personalization-bar__left">
        <span className="personalization-bar__label">Content level:</span>
        <PersonalizationBadge level={effectiveLevel} size="sm" />
      </div>
      <div className="personalization-bar__right">
        <PersonalizationButton chapterId={chapterId} />
      </div>
    </div>
  );
};

export default PersonalizationBar;
