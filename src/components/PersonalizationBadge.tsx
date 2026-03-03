import React from 'react';
import { usePersonalization, ExpertiseLevel } from '../context/PersonalizationContext';

const LEVEL_CONFIG: Record<ExpertiseLevel, { label: string; className: string }> = {
  non_technical: { label: 'Non-Technical', className: 'badge--non-technical' },
  beginner: { label: 'Beginner', className: 'badge--beginner' },
  intermediate: { label: 'Intermediate', className: 'badge--intermediate' },
  professional: { label: 'Professional', className: 'badge--professional' },
};

interface PersonalizationBadgeProps {
  level?: ExpertiseLevel | null;
  size?: 'sm' | 'md';
}

const PersonalizationBadge: React.FC<PersonalizationBadgeProps> = ({ level: propLevel, size = 'md' }) => {
  const { level: contextLevel } = usePersonalization();
  const level = propLevel ?? contextLevel;

  if (!level) return null;

  const config = LEVEL_CONFIG[level];
  if (!config) return null;

  return (
    <span className={`personalization-level-badge ${config.className} personalization-level-badge--${size}`}>
      {config.label}
    </span>
  );
};

export default PersonalizationBadge;
