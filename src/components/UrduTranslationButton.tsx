import React from 'react';
import { useAuth } from './AuthProvider';
import { useTranslation } from '../context/TranslationContext';

interface UrduTranslationButtonProps {
  chapterId?: string;
}

// Debug flag - set to true to show button even when not logged in
const DEBUG_MODE = false;

const UrduTranslationButton: React.FC<UrduTranslationButtonProps> = ({ chapterId }) => {
  const { user } = useAuth();
  const { currentLanguage, isTranslating, toggleLanguage } = useTranslation();

  // Show for logged-in users (or in debug mode)
  if (!user && !DEBUG_MODE) {
    return null;
  }

  const handleToggle = () => {
    toggleLanguage();
  };

  const isUrdu = currentLanguage === 'ur';

  return (
    <button
      onClick={handleToggle}
      disabled={isTranslating}
      className={`urdu-translation-button ${isUrdu ? 'urdu-translation-button--active' : ''} ${isTranslating ? 'urdu-translation-button--loading' : ''}`}
      aria-label={isUrdu ? 'Switch to English' : 'Translate to Urdu'}
      title={isUrdu ? 'Switch to English' : 'Translate to Urdu (اردو)'}
    >
      {isTranslating ? (
        <>
          <span className="urdu-translation-button__spinner" />
          <span>Translating...</span>
        </>
      ) : (
        <>
          <span className="urdu-translation-button__icon">
            {isUrdu ? '🇬🇧' : '🇵🇰'}
          </span>
          <span className="urdu-translation-button__text">
            {isUrdu ? 'English' : 'اردو'}
          </span>
        </>
      )}
    </button>
  );
};

export default UrduTranslationButton;
