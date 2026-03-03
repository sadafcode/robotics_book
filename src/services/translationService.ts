/**
 * Translation Service for Urdu translations via OpenAI GPT-4o-mini
 */

const API_BASE_URL = 'https://sadafawad-physical-ai-backend.hf.space';

export interface TranslationRequest {
  text: string;
  targetLanguage: 'ur' | 'en';
}

export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  language: string;
}

// Cache for translations to avoid repeated API calls
const translationCache: Map<string, string> = new Map();

function getCacheKey(text: string, targetLang: string): string {
  return `${targetLang}:${text.slice(0, 100)}`;
}

/**
 * Check if translation service is available
 */
export async function checkTranslationStatus(): Promise<{ available: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/translation/status`);
    if (!response.ok) throw new Error('Status check failed');
    return await response.json();
  } catch (error) {
    return { available: false, message: 'Translation service unavailable' };
  }
}

/**
 * Translate multiple texts in a single API call (batch mode — fast).
 * Use this instead of calling translateText() in a loop.
 */
export async function translateTexts(
  texts: string[],
  targetLanguage: 'ur' | 'en' = 'ur'
): Promise<string[]> {
  if (targetLanguage === 'en') return texts;

  // Separate cached from uncached
  const results: string[] = [...texts];
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    const key = getCacheKey(texts[i], targetLanguage);
    if (translationCache.has(key)) {
      results[i] = translationCache.get(key)!;
    } else if (texts[i].trim()) {
      uncachedIndices.push(i);
      uncachedTexts.push(texts[i]);
    }
  }

  if (uncachedTexts.length === 0) return results;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/translation/translate-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: uncachedTexts, target_language: targetLanguage }),
    });

    if (!response.ok) throw new Error(`Batch translation API error: ${response.status}`);

    const data = await response.json();
    const translated: string[] = data.translated_texts ?? uncachedTexts;

    // Write back results and populate cache
    for (let i = 0; i < uncachedIndices.length; i++) {
      const origIdx = uncachedIndices[i];
      const translatedText = translated[i] ?? texts[origIdx];
      results[origIdx] = translatedText;
      translationCache.set(getCacheKey(texts[origIdx], targetLanguage), translatedText);
    }
  } catch (error) {
    console.warn('Batch translation API failed:', error);
  }

  return results;
}

/**
 * Translate a single text (kept for backward compatibility).
 */
export async function translateText(
  text: string,
  targetLanguage: 'ur' | 'en' = 'ur'
): Promise<string> {
  if (!text.trim() || targetLanguage === 'en') return text;
  const results = await translateTexts([text], targetLanguage);
  return results[0] ?? text;
}

/**
 * Clear translation cache
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}
