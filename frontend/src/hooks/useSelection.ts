import { useState, useEffect } from 'react';

interface SelectionState {
  text: string;
  position: { x: number; y: number } | null;
  rect: DOMRect | null;
}

const useSelection = (): SelectionState => {
  const [selection, setSelection] = useState<SelectionState>({
    text: '',
    position: null,
    rect: null,
  });

  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString().trim() || '';

      if (selectedText) {
        const selectionObj = window.getSelection();
        if (selectionObj && selectionObj.rangeCount > 0) {
          const range = selectionObj.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setSelection({
            text: selectedText,
            position: { x: rect.right, y: rect.top },
            rect: rect,
          });
        }
      } else {
        setSelection({ text: '', position: null, rect: null });
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  return selection;
};

export default useSelection;