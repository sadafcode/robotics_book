import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '../components/AuthProvider';
import {
  getProfile,
  saveChapterOverride,
  resetChapterOverride,
  deleteProfile,
  UserProfileData,
} from '../services/personalizationApi';

export type ExpertiseLevel = 'non_technical' | 'beginner' | 'intermediate' | 'professional';

interface PersonalizationContextType {
  level: ExpertiseLevel | null;
  profile: UserProfileData | null;
  isLoading: boolean;
  chapterLevel: (chapterId: string) => ExpertiseLevel | null;
  saveChapter: (chapterId: string, level: ExpertiseLevel) => Promise<void>;
  resetChapter: (chapterId: string) => Promise<void>;
  removeProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const level: ExpertiseLevel | null = profile?.expertise_level ?? null;

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getProfile(user.id);
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load profile when user changes
  useEffect(() => {
    if (!authLoading) {
      refreshProfile();
    }
  }, [authLoading, refreshProfile]);

  // Sync data-user-level on <body> for CSS-based adaptation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (level) {
        document.body.setAttribute('data-user-level', level);
      } else {
        document.body.removeAttribute('data-user-level');
      }
    }
  }, [level]);

  const chapterLevel = useCallback(
    (chapterId: string): ExpertiseLevel | null => {
      if (!profile) return null;
      const override = profile.chapter_preferences[chapterId];
      if (override) return override as ExpertiseLevel;
      return level;
    },
    [profile, level],
  );

  const saveChapter = useCallback(
    async (chapterId: string, newLevel: ExpertiseLevel) => {
      if (!user) return;
      await saveChapterOverride(chapterId, newLevel, user.id);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              chapter_preferences: { ...prev.chapter_preferences, [chapterId]: newLevel },
            }
          : prev,
      );
    },
    [user],
  );

  const resetChapter = useCallback(
    async (chapterId: string) => {
      if (!user) return;
      await resetChapterOverride(chapterId, user.id);
      setProfile((prev) => {
        if (!prev) return prev;
        const prefs = { ...prev.chapter_preferences };
        delete prefs[chapterId];
        return { ...prev, chapter_preferences: prefs };
      });
    },
    [user],
  );

  const removeProfile = useCallback(async () => {
    if (!user) return;
    await deleteProfile(user.id);
    setProfile(null);
  }, [user]);

  return (
    <PersonalizationContext.Provider
      value={{ level, profile, isLoading, chapterLevel, saveChapter, resetChapter, removeProfile, refreshProfile }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = (): PersonalizationContextType => {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) throw new Error('usePersonalization must be used within PersonalizationProvider');
  return ctx;
};
