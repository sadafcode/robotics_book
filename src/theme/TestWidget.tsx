import React from 'react';

const TestWidget: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'red',
      color: 'white',
      padding: '10px',
      zIndex: 1000,
      border: '2px solid yellow'
    }}>
      TEST WIDGET
    </div>
  );
};

export default TestWidget;