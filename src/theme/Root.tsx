import React from 'react';
import { AuthProvider } from '../components/AuthProvider';
import { PersonalizationProvider } from '../context/PersonalizationContext';
import { TranslationProvider } from '../context/TranslationContext';
import ChatWidget from './ChatWidget';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PersonalizationProvider>
        <TranslationProvider>
          {children}
          <ChatWidget />
        </TranslationProvider>
      </PersonalizationProvider>
    </AuthProvider>
  );
}
