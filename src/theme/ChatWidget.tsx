import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatWidgetProps {
  onClose?: () => void;
}

// Simple icon components (no external dependency)
const BotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const text = window.getSelection()?.toString().trim();
      if (text && text.length > 0 && text.length < 5000) {
        setSelectedText(text);
      }
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://sadafawad-physical-ai-backend.hf.space/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          selected_text: selectedText,
          session_id: 'docusaurus-session',
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        content: data.content,
        role: 'assistant',
        timestamp: new Date(),
      }]);
      setSelectedText('');
    } catch (err) {
      setError('Backend not connected. Start backend server.');
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: 'Backend server not running. Please start: cd backend && python -m uvicorn src.main:app --reload',
        role: 'assistant',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Styles matching the dark theme
  const styles = {
    container: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-end',
      gap: '12px',
    },
    toggleButton: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #00a8ff 0%, #0097e6 100%)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0, 168, 255, 0.4)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    chatWindow: {
      width: '380px',
      height: '500px',
      background: '#0a0e2a',
      borderRadius: '16px',
      border: '1px solid #00a8ff',
      display: 'flex',
      flexDirection: 'column' as const,
      boxShadow: '0 8px 32px rgba(0, 168, 255, 0.3)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(135deg, #0a0e2a 0%, #1a1e3a 100%)',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #00a8ff',
    },
    headerTitle: {
      color: '#00d4ff',
      margin: 0,
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#00d4ff',
      cursor: 'pointer',
      padding: '4px',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#e6f7ff',
      textAlign: 'center' as const,
      opacity: 0.7,
    },
    userMessage: {
      alignSelf: 'flex-end',
      background: 'linear-gradient(135deg, #00a8ff 0%, #0097e6 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '16px 16px 4px 16px',
      maxWidth: '80%',
    },
    assistantMessage: {
      alignSelf: 'flex-start',
      background: '#1a1e3a',
      color: '#e6f7ff',
      padding: '12px 16px',
      borderRadius: '16px 16px 16px 4px',
      maxWidth: '80%',
      border: '1px solid #00a8ff33',
    },
    inputArea: {
      padding: '16px',
      borderTop: '1px solid #00a8ff33',
      background: '#0a0e2a',
    },
    contextBox: {
      background: '#1a1e3a',
      border: '1px solid #00d4ff',
      borderRadius: '8px',
      padding: '8px 12px',
      marginBottom: '12px',
      fontSize: '12px',
      color: '#00d4ff',
    },
    inputWrapper: {
      display: 'flex',
      gap: '8px',
    },
    input: {
      flex: 1,
      background: '#1a1e3a',
      border: '1px solid #00a8ff',
      borderRadius: '12px',
      padding: '12px 16px',
      color: '#e6f7ff',
      fontSize: '14px',
      outline: 'none',
    },
    sendButton: {
      background: 'linear-gradient(135deg, #00a8ff 0%, #0097e6 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 16px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: '#ff6b6b',
      fontSize: '12px',
      marginBottom: '8px',
    },
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <h3 style={styles.headerTitle}>
              <BotIcon /> Physical AI Assistant
            </h3>
            <button style={styles.closeButton} onClick={() => { onClose?.(); setIsOpen(false); }}>
              <CloseIcon />
            </button>
          </div>

          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <BotIcon />
                <p style={{ marginTop: '12px' }}>Ask me about Physical AI & Robotics</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Select text on page for context</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                  {msg.content}
                </div>
              ))
            )}
            {isLoading && (
              <div style={styles.assistantMessage}>Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            {error && <div style={styles.errorText}>{error}</div>}
            {selectedText && (
              <div style={styles.contextBox}>
                Context: "{selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}"
              </div>
            )}
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about robotics..."
                disabled={isLoading}
              />
              <button
                style={{ ...styles.sendButton, opacity: !inputValue.trim() || isLoading ? 0.5 : 1 }}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        style={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        aria-label="Open chat"
      >
        {isOpen ? <CloseIcon /> : <BotIcon />}
      </button>
    </div>
  );
};

export default ChatWidget;