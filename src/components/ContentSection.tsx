import React, { ReactNode } from 'react';
import { usePersonalization, ExpertiseLevel } from '../context/PersonalizationContext';

type LevelOrAll = ExpertiseLevel | 'all';

interface ContentSectionProps {
  /** Which levels can see this content. Use 'all' to always show. */
  levels: LevelOrAll[];
  children: ReactNode;
  /** Optional label shown above the section in development mode */
  label?: string;
}

/**
 * Conditionally renders content based on the user's expertise level.
 * Falls back to showing all content when no profile is set.
 */
const ContentSection: React.FC<ContentSectionProps> = ({ levels, children, label }) => {
  const { level } = usePersonalization();

  // Graceful fallback: show content if no level is set
  if (!level || levels.includes('all')) {
    return <>{children}</>;
  }

  if (levels.includes(level)) {
    return <>{children}</>;
  }

  return null;
};

export default ContentSection;
