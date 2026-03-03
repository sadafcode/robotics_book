import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface SummaryButtonProps {
  chapterId: string;
  chapterTitle: string;
}

const SummaryButton: React.FC<SummaryButtonProps> = ({ chapterId, chapterTitle }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await fetch('/api/v1/chat/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter_id: chapterId }),
      });

      const data = await response.json();
      setSummary(data.summary);
      setShowSummary(true);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error generating summary. Please try again.');
      setShowSummary(true);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="summary-component">
      <button
        onClick={handleSummarize}
        disabled={isSummarizing}
        className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSummarizing ? (
          <>
            <Sparkles className="w-4 h-4 animate-pulse" />
            Summarizing...
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4" />
            Summarize Chapter
          </>
        )}
      </button>

      {showSummary && summary && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Chapter Summary
          </h3>
          <div className="text-gray-700 prose prose-sm max-w-none">
            {summary}
          </div>
          <button
            onClick={() => setShowSummary(false)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Hide Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default SummaryButton;