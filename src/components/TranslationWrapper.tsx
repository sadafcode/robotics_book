import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import UrduTranslationButton from './UrduTranslationButton';
import { translateTexts, loadPrebuiltTranslations } from '../services/translationService';

interface TranslationWrapperProps {
  chapterId?: string;
  children: React.ReactNode;
}

// Uppercase = HTML elements, lowercase = SVG/MathML elements (DOMParser returns lowercase for SVG)
const SKIP_TAGS = new Set([
  'CODE', 'PRE', 'SCRIPT', 'STYLE', 'KBD', 'SAMP', 'VAR',
  'svg', 'SVG', // Mermaid diagrams — skip entirely
]);

function isInsideSkippedTag(node: Node | null): boolean {
  let current = node instanceof Text ? node.parentElement : (node as Element);
  while (current) {
    const tag = current.tagName;
    if (SKIP_TAGS.has(tag)) return true;
    // Also skip anything inside an SVG (text, tspan, g, etc.)
    if (tag === 'svg' || tag === 'SVG') return true;
    if (current.closest?.('svg')) return true;
    current = current.parentElement;
  }
  return false;
}

/**
 * Force all Mermaid / SVG text to black directly on the element's inline style.
 * CSS selectors can't reliably override SVG presentation attributes (fill="gray"),
 * so we fix it in JS on the captured HTML document.
 */
function fixDiagramTextColors(doc: Document): void {
  // SVG <text> and <tspan> — use fill for SVG text
  doc.querySelectorAll('svg text, svg tspan').forEach(el => {
    (el as SVGElement).style.fill = '#1c1e21';
    el.removeAttribute('fill'); // remove SVG presentation attribute
  });

  // Mermaid v10 uses <foreignObject> with HTML <p>/<div>/<span> for node labels
  doc.querySelectorAll('svg foreignObject *').forEach(el => {
    (el as HTMLElement).style.color = '#1c1e21';
  });

  // Edge/node labels rendered outside foreignObject as HTML siblings of SVG
  doc.querySelectorAll('[class*="edgeLabel"], [class*="nodeLabel"], [class*="cluster-label"]').forEach(el => {
    (el as HTMLElement).style.color = '#1c1e21';
  });
}

/**
 * Parse HTML into a temporary document, translate all text nodes,
 * and return the translated HTML string. Never touches the real React DOM.
 */
async function translateHtmlString(html: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Fix diagram colors before translating (modifies inline styles directly)
  fixDiagramTextColors(doc);

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  let node = walker.nextNode();
  while (node) {
    const text = (node.textContent ?? '').trim();
    if (text.length > 2 && !isInsideSkippedTag(node)) {
      textNodes.push(node as Text);
    }
    node = walker.nextNode();
  }

  // Split into chunks of 50 and translate all chunks in PARALLEL
  const originals = textNodes.map(n => n.textContent ?? '');
  const CHUNK_SIZE = 50;
  const chunks: string[][] = [];
  for (let i = 0; i < originals.length; i += CHUNK_SIZE) {
    chunks.push(originals.slice(i, i + CHUNK_SIZE));
  }

  const translatedChunks = await Promise.all(chunks.map(chunk => translateTexts(chunk, 'ur')));
  const translations = translatedChunks.flat();

  textNodes.forEach((node, i) => {
    node.textContent = translations[i] ?? node.textContent;
  });

  return doc.body.innerHTML;
}

const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ chapterId, children }) => {
  const { currentLanguage } = useTranslation();
  const isUrdu = currentLanguage === 'ur';

  const contentRef = useRef<HTMLDivElement>(null);
  const originalHtmlRef = useRef<string | null>(null);

  const [translatedHtml, setTranslatedHtml] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Pre-load build-time translations into cache as soon as component mounts
  useEffect(() => { loadPrebuiltTranslations(); }, []);

  // Capture original HTML every render (only stores once — when ref is first set)
  useEffect(() => {
    const el = contentRef.current;
    if (el && !originalHtmlRef.current) {
      originalHtmlRef.current = el.innerHTML;
    }
  });

  // Reset when navigating to a different chapter
  useEffect(() => {
    originalHtmlRef.current = null;
    setTranslatedHtml(null);
  }, [chapterId]);

  // Trigger translation when switching to Urdu
  useEffect(() => {
    if (!isUrdu) return;
    if (translatedHtml) return; // already translated for this chapter

    const html = originalHtmlRef.current ?? contentRef.current?.innerHTML;
    if (!html) return;

    setIsTranslating(true);
    translateHtmlString(html)
      .then(setTranslatedHtml)
      .catch(console.error)
      .finally(() => setIsTranslating(false));
  }, [isUrdu, translatedHtml]);

  return (
    <div
      className={`translation-wrapper ${isUrdu ? 'translation-wrapper--urdu' : ''} ${isTranslating ? 'translation-wrapper--loading' : ''}`}
      dir={isUrdu ? 'rtl' : 'ltr'}
      lang={isUrdu ? 'ur' : 'en'}
    >
      <div className="translation-wrapper__header">
        <UrduTranslationButton chapterId={chapterId} />
      </div>

      {isTranslating && (
        <div className="translation-wrapper__overlay">
          <div className="translation-wrapper__loading-indicator">
            <span className="translation-wrapper__spinner" />
            <span>Translating content to Urdu...</span>
          </div>
        </div>
      )}

      <div className="translation-wrapper__content">
        {isUrdu && translatedHtml ? (
          // Render translated HTML directly — bypasses React reconciliation entirely
          <div dangerouslySetInnerHTML={{ __html: translatedHtml }} />
        ) : (
          // Normal React render — capture innerHTML for later translation
          <div ref={contentRef}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationWrapper;
