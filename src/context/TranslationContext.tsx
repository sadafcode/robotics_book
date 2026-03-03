import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translateText } from '../services/translationService';

type Language = 'en' | 'ur';

interface TranslationContextType {
  currentLanguage: Language;
  isTranslating: boolean;
  translatedContent: Map<string, string>;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  translateContent: (content: string, contentId: string) => Promise<string>;
  getTranslatedContent: (contentId: string, originalContent: string) => string;
  clearTranslations: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<Map<string, string>>(new Map());

  const toggleLanguage = useCallback(() => {
    setCurrentLanguage(prev => prev === 'en' ? 'ur' : 'en');
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
  }, []);

  const translateContent = useCallback(async (content: string, contentId: string): Promise<string> => {
    if (currentLanguage === 'en') return content;
    if (translatedContent.has(contentId)) {
      return translatedContent.get(contentId)!;
    }

    setIsTranslating(true);
    try {
      const translated = await translateText(content, 'ur');
      setTranslatedContent(prev => {
        const newMap = new Map(prev);
        newMap.set(contentId, translated);
        return newMap;
      });
      return translated;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, translatedContent]);

  const getTranslatedContent = useCallback((contentId: string, originalContent: string): string => {
    if (currentLanguage === 'en') return originalContent;
    return translatedContent.get(contentId) || originalContent;
  }, [currentLanguage, translatedContent]);

  const clearTranslations = useCallback(() => {
    setTranslatedContent(new Map());
    setCurrentLanguage('en');
  }, []);

  const value: TranslationContextType = {
    currentLanguage,
    isTranslating,
    translatedContent,
    toggleLanguage,
    setLanguage,
    translateContent,
    getTranslatedContent,
    clearTranslations,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
