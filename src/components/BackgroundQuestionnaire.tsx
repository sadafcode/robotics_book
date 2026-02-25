import React, { useState, useEffect } from 'react';
import { usePersonalization } from '../context/PersonalizationContext';
import { getQuestionnaireSchema, submitQuestionnaire, Question } from '../services/personalizationApi';
import { useAuth } from './AuthProvider';

interface BackgroundQuestionnaireProps {
  onComplete?: (level: string) => void;
}

const LEVEL_LABELS: Record<string, string> = {
  non_technical: 'Non-Technical',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  professional: 'Professional',
};

const BackgroundQuestionnaire: React.FC<BackgroundQuestionnaireProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { refreshProfile } = usePersonalization();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ level: string; score: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuestionnaireSchema()
      .then(({ questions: qs }) => {
        setQuestions(qs);
        // Pre-fill answers with first option (score 0)
        const initial: Record<string, number> = {};
        qs.forEach((q) => { initial[q.key] = 0; });
        setAnswers(initial);
      })
      .catch(() => setError('Could not load questionnaire. Check backend connection.'))
      .finally(() => setIsLoading(false));
  }, []);

  const currentQ = questions[step];
  const isLastStep = step === questions.length - 1;

  const handleNext = () => {
    if (step < questions.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError('');
    try {
      const data = await submitQuestionnaire(answers, user.id);
      setResult({ level: data.expertise_level, score: data.raw_score });
      await refreshProfile();
      onComplete?.(data.expertise_level);
    } catch (e) {
      setError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="questionnaire-loading">
        <p>Loading questionnaire...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="questionnaire-error">
        <p>{error}</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="questionnaire-result">
        <h2>Your Learning Profile</h2>
        <div className={`level-badge level-badge--${result.level}`}>
          {LEVEL_LABELS[result.level] ?? result.level}
        </div>
        <p className="result-description">
          Based on your answers (score: {result.score}/21), we've customized your learning path.
        </p>
        <div className="result-actions">
          <a className="button button--primary" href="/robotics_book/learning-path">
            View Your Learning Path
          </a>
          <a className="button button--secondary" href="/robotics_book/">
            Start Reading
          </a>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <div className="questionnaire-progress-bar">
          <div className="questionnaire-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="questionnaire-step-indicator">
          Question {step + 1} of {questions.length}
        </span>
      </div>

      <div className="questionnaire-body">
        <h2 className="questionnaire-question">{currentQ.question}</h2>

        <div className="questionnaire-options">
          {currentQ.options.map((opt, idx) => (
            <label key={idx} className={`questionnaire-option ${answers[currentQ.key] === idx ? 'selected' : ''}`}>
              <input
                type="radio"
                name={currentQ.key}
                value={idx}
                checked={answers[currentQ.key] === idx}
                onChange={() => setAnswers((prev) => ({ ...prev, [currentQ.key]: idx }))}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="questionnaire-footer">
        <button className="button button--secondary" onClick={handleBack} disabled={step === 0}>
          Back
        </button>

        {isLastStep ? (
          <button
            className="button button--primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Get My Learning Profile'}
          </button>
        ) : (
          <button className="button button--primary" onClick={handleNext}>
            Next
          </button>
        )}
      </div>

      {error && <p className="questionnaire-error-inline">{error}</p>}
    </div>
  );
};

export default BackgroundQuestionnaire;
