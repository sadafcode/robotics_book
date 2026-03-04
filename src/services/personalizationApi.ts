const BASE = 'https://sadafawad-physical-ai-backend.hf.space/api/v1/personalization';

function headers(userId?: string): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (userId) (h as Record<string, string>)['X-User-Id'] = userId;
  return h;
}

function opts(userId?: string): RequestInit {
  return { credentials: 'include', headers: headers(userId) };
}

export interface UserProfileData {
  user_id: string;
  expertise_level: 'non_technical' | 'beginner' | 'intermediate' | 'professional';
  questionnaire_completed: boolean;
  raw_score: number;
  chapter_preferences: Record<string, string>;
}

export interface Question {
  key: string;
  question: string;
  options: { label: string; score: number }[];
}

export async function getProfile(userId?: string): Promise<UserProfileData | null> {
  const res = await fetch(`${BASE}/profile`, opts(userId));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getProfile: ${res.status}`);
  return res.json();
}

export async function submitQuestionnaire(
  answers: Record<string, number>,
  userId?: string,
): Promise<{ expertise_level: string; raw_score: number }> {
  const res = await fetch(`${BASE}/profile`, {
    ...opts(userId),
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error(`submitQuestionnaire: ${res.status}`);
  return res.json();
}

export async function deleteProfile(userId?: string): Promise<void> {
  const res = await fetch(`${BASE}/profile`, { ...opts(userId), method: 'DELETE' });
  if (!res.ok) throw new Error(`deleteProfile: ${res.status}`);
}

export async function saveChapterOverride(
  chapterId: string,
  level: string,
  userId?: string,
): Promise<void> {
  const res = await fetch(`${BASE}/chapter`, {
    ...opts(userId),
    method: 'POST',
    body: JSON.stringify({ chapter_id: chapterId, level }),
  });
  if (!res.ok) throw new Error(`saveChapterOverride: ${res.status}`);
}

export async function resetChapterOverride(
  chapterId: string,
  userId?: string,
): Promise<void> {
  const res = await fetch(`${BASE}/chapter/${encodeURIComponent(chapterId)}`, {
    ...opts(userId),
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`resetChapterOverride: ${res.status}`);
}

export async function getLearningPath(userId?: string) {
  const res = await fetch(`${BASE}/learning-path`, opts(userId));
  if (!res.ok) throw new Error(`getLearningPath: ${res.status}`);
  return res.json();
}

export async function getRecommendations(userId?: string) {
  const res = await fetch(`${BASE}/recommendations`, opts(userId));
  if (!res.ok) throw new Error(`getRecommendations: ${res.status}`);
  return res.json();
}

export async function recordProgress(
  chapterId: string,
  timeSpentSeconds: number,
  completed: boolean,
  userId?: string,
): Promise<void> {
  const res = await fetch(`${BASE}/progress`, {
    ...opts(userId),
    method: 'POST',
    body: JSON.stringify({
      chapter_id: chapterId,
      time_spent_seconds: timeSpentSeconds,
      completed,
    }),
  });
  if (!res.ok) throw new Error(`recordProgress: ${res.status}`);
}

export async function getQuestionnaireSchema(): Promise<{ questions: Question[] }> {
  const res = await fetch(`${BASE}/questionnaire-schema`);
  if (!res.ok) throw new Error(`getQuestionnaireSchema: ${res.status}`);
  return res.json();
}
