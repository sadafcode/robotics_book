import React, { useState } from 'react';
import { Bot } from 'lucide-react';

const SimpleChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#3B82F6',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Bot size={24} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          width: '300px',
          height: '400px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: '#f3f4f6',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Chat Assistant</span>
          </div>
          <div style={{
            padding: '16px',
            height: 'calc(100% - 50px)',
            overflowY: 'auto',
          }}>
            <p>Hello! I'm your book assistant.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChatWidget;