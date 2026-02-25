import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { usePersonalization, ExpertiseLevel } from '../context/PersonalizationContext';

interface PersonalizationButtonProps {
  chapterId: string;
}

const LEVELS: { value: ExpertiseLevel; label: string; description: string }[] = [
  { value: 'non_technical', label: 'Non-Technical', description: 'High-level concepts, visual explanations' },
  { value: 'beginner', label: 'Beginner', description: 'Simple examples, step-by-step instructions' },
  { value: 'intermediate', label: 'Intermediate', description: 'Detailed explanations, more complex examples' },
  { value: 'professional', label: 'Professional', description: 'Cutting-edge techniques, implementation details' },
];

const PersonalizationButton: React.FC<PersonalizationButtonProps> = ({ chapterId }) => {
  const { user } = useAuth();
  const { chapterLevel, saveChapter, resetChapter, level: globalLevel } = usePersonalization();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ExpertiseLevel>(
    chapterLevel(chapterId) ?? globalLevel ?? 'beginner',
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div className="personalization-prompt">
        <p>
          <a href="/robotics_book/login">Log in</a> to personalize this content to your skill level.
        </p>
      </div>
    );
  }

  const hasOverride = !!chapterLevel(chapterId) && chapterLevel(chapterId) !== globalLevel;

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await saveChapter(chapterId, selectedLevel);
      setMessage('Saved!');
      setTimeout(() => { setMessage(''); setIsOpen(false); }, 1200);
    } catch {
      setMessage('Failed to save. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      await resetChapter(chapterId);
      setSelectedLevel(globalLevel ?? 'beginner');
      setMessage('Reset to default.');
      setTimeout(() => { setMessage(''); setIsOpen(false); }, 1200);
    } catch {
      setMessage('Failed to reset.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="personalization-container">
      <button
        className="personalization-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Close' : 'Personalize Content'}
        {hasOverride && <span className="personalization-override-badge"> (custom)</span>}
      </button>

      {isOpen && (
        <div className="personalization-panel">
          <h3>Adjust Content Level</h3>
          <p>Select the complexity level for this chapter:</p>

          <div className="level-selector">
            {LEVELS.map((lvl) => (
              <label key={lvl.value} className="level-option">
                <input
                  type="radio"
                  name="personalization-level"
                  value={lvl.value}
                  checked={selectedLevel === lvl.value}
                  onChange={() => setSelectedLevel(lvl.value)}
                />
                <div className="level-info">
                  <strong>{lvl.label}</strong>
                  <span>{lvl.description}</span>
                </div>
              </label>
            ))}
          </div>

          {message && <p className="personalization-message">{message}</p>}

          <div className="button-group">
            <button className="save-button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save for this chapter'}
            </button>
            {hasOverride && (
              <button className="cancel-button" onClick={handleReset} disabled={isSaving}>
                Reset to default
              </button>
            )}
            <button className="cancel-button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationButton;
