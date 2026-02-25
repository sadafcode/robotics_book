import { useState, useEffect, useCallback } from 'react';

interface SelectionPosition {
  x: number;
  y: number;
}

interface UIState {
  selectedText: string;
  showContextMenu: boolean;
  contextMenuPosition: SelectionPosition | null;
}

export const useUIContextTrigger = () => {
  const [uiState, setUIState] = useState<UIState>({
    selectedText: '',
    showContextMenu: false,
    contextMenuPosition: null,
  });

  // Handle text selection
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';

    if (selectedText && selection?.anchorOffset !== selection?.focusOffset) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setUIState({
        selectedText,
        showContextMenu: true,
        contextMenuPosition: { x: rect.right, y: rect.top },
      });
    } else {
      setUIState(prev => ({
        ...prev,
        showContextMenu: false,
      }));
    }
  }, []);

  // Handle "Explain this" action
  const handleExplainSelection = useCallback(() => {
    if (uiState.selectedText) {
      // Trigger the chat widget to open with the selected text
      // This would typically dispatch an event or update a global state
      // that the ChatWidget component listens to

      // For now, we'll trigger a custom event that the ChatWidget can listen to
      const event = new CustomEvent('explainSelection', {
        detail: { text: uiState.selectedText }
      });
      document.dispatchEvent(event);

      // Hide the context menu
      setUIState(prev => ({
        ...prev,
        showContextMenu: false,
        selectedText: '',
      }));
    }
  }, [uiState.selectedText]);

  // Close context menu
  const handleCloseContextMenu = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      showContextMenu: false,
      selectedText: '',
    }));
  }, []);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, [handleSelection]);

  return {
    uiState,
    handleExplainSelection,
    handleCloseContextMenu,
  };
};

// Context for global chat state
import { createContext, useContext } from 'react';

interface ChatContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedText, setSelectedText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ChatContext.Provider value={{ selectedText, setSelectedText, isChatOpen, setIsChatOpen }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};