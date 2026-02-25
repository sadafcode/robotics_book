import React from 'react';
import ChatWidget from '../components/ChatWidget';

// Default implementation, that you can customize
const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
};

export default Root;