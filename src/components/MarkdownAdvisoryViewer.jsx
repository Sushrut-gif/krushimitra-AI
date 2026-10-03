import React, { useState } from 'react';
import {
  Check,
  Copy,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
  Clock,
  Briefcase,
  Layers,
} from 'lucide-react';

/**
 * Custom High-Quality Marathi Markdown Advisory Reader
 * Parses AI-generated market markdown and renders clean, readable typography
 * with custom callout blocks, alert styles, and responsive cards.
 */
export default function MarkdownAdvisoryViewer({
  markdownText = '',
  sourceLabel = 'Gemini AI थेट विश्लेषण',
  timestamp = '',
  isLiveGenerated = true,
  cropName = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!markdownText) return;
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse inline styles (bold, code, highlights)
  const renderInlineFormatted = (text) => {
    if (!text) return null;

    // Split on **bold**
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        // Highlight critical Marathi keywords
        if (
          inner.includes('विक्री करा') ||
          inner.includes('रोखून ठेवा') ||
          inner.includes('Hold') ||
          inner.includes('Sell') ||
          inner.includes('तेजी') ||
          inner.includes('सर्वोत्तम वेळ')
        ) {
          return (
            <strong
              key={idx}
              className="font-black text-emerald-950 bg-emerald-100/90 px-1.5 py-0.5 rounded-md border border-emerald-300"
            >
              {inner}
            </strong>
          );
        }
        return (
          <strong key={idx} className="font-extrabold text-gray-950">
            {inner}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Parse lines into blocks
  const parseMarkdownBlocks = (rawText) => {
    const lines = rawText.split('\n');
    const blocks = [];
    let currentList = null;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
        return;
      }

      // H1 Header (# )
      if (trimmed.startsWith('# ')) {
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
        blocks.push({
          type: 'h1',
          content: trimmed.replace(/^#\s+/, ''),
        });
        return;
      }

      // H2 Header (## )
      if (trimmed.startsWith('## ')) {
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
        blocks.push({
          type: 'h2',
          content: trimmed.replace(/^##\s+/, ''),
        });
        return;
      }

      // H3 Header (### )
      if (trimmed.startsWith('### ')) {
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
        blocks.push({
          type: 'h3',
          content: trimmed.replace(/^###\s+/, ''),
        });
        return;
      }

      // Blockquote (> )
      if (trimmed.startsWith('> ')) {
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
        blocks.push({
          type: 'quote',
          content: trimmed.replace(/^>\s+/, ''),
        });
        return;
      }

      // Bullet List (- or * )
      if (/^[-*]\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^[-*]\s+/, '');
        if (!currentList || currentList.type !== 'ul') {
          if (currentList) blocks.push(currentList);
          currentList = { type: 'ul', items: [itemText] };
        } else {
          currentList.items.push(itemText);
        }
        return;
      }

      // Numbered List (1. , 2. )
      if (/^\d+\.\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s+/, '');
        if (!currentList || currentList.type !== 'ol') {
          if (currentList) blocks.push(currentList);
          currentList = { type: 'ol', items: [itemText] };
        } else {
          currentList.items.push(itemText);
        }
        return;
      }

      // Regular Paragraph
      if (currentList) {
        blocks.push(currentList);
        currentList = null;
      }
      blocks.push({
        type: 'p',
        content: trimmed,
      });
    });

    if (currentList) {
      blocks.push(currentList);
    }

    return blocks;
  };

  const blocks = parseMarkdownBlocks(markdownText);

  // Icon selector based on header title
  const getHeaderIcon = (title) => {
    if (title.includes('विश्लेषण') || title.includes('आवक') || title.includes('सद्यस्थिती')) {
      return <TrendingUp className="w-5 h-5 text-emerald-700 shrink-0" />;
    }
    if (title.includes('शेतकरी') || title.includes('विक्री') || title.includes('थांबावे')) {
      return <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />;
    }
    if (title.includes('व्यापारी') || title.includes('खरेदी') || title.includes('वेळ')) {
      return <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />;
    }
    return <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-300 shadow-md overflow-hidden">
      {/* Top Advisory Reader Ribbon */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 px-5 py-3 text-white flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-400/40 text-emerald-300">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-white uppercase">
                {cropName ? `${cropName} - AI अधिकृत बाजार सल्ला` : 'सोलापूर APMC AI बाजार सल्ला'}
              </span>
              {isLiveGenerated ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                  थेट AI जनरेटेड
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  अधिकृत APMC बुलेटिन
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-200/80">
              {sourceLabel} • {timestamp || 'आजचे दैनिक अद्यतन'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-700/60 transition-all cursor-pointer shadow-xs active:scale-95"
          title="सल्ला प्रत कॉपी करा"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-300" />}
          <span>{copied ? 'कॉपी झाले!' : 'सल्ला कॉपी करा'}</span>
        </button>
      </div>

      {/* Reader Content Body */}
      <div className="p-5 sm:p-7 space-y-5 bg-gradient-to-b from-emerald-50/20 via-white to-white text-gray-900 leading-relaxed font-sans">
        {blocks.map((block, idx) => {
          if (block.type === 'h1') {
            return (
              <h1
                key={idx}
                className="text-xl sm:text-2xl font-black text-emerald-950 border-b-2 border-emerald-600/30 pb-2.5 pt-1"
              >
                {renderInlineFormatted(block.content)}
              </h1>
            );
          }

          if (block.type === 'h2') {
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 pt-3 pb-1 border-b border-gray-100 mt-2"
              >
                {getHeaderIcon(block.content)}
                <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                  {renderInlineFormatted(block.content)}
                </h2>
              </div>
            );
          }

          if (block.type === 'h3') {
            return (
              <h3
                key={idx}
                className="text-sm sm:text-base font-extrabold text-emerald-900 pt-2 flex items-center gap-2"
              >
                <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                {renderInlineFormatted(block.content)}
              </h3>
            );
          }

          if (block.type === 'quote') {
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-xs sm:text-sm font-semibold text-amber-950 shadow-2xs space-y-1"
              >
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>महत्त्वाची नोंद (APMC Advisory Note)</span>
                </div>
                <div>{renderInlineFormatted(block.content)}</div>
              </div>
            );
          }

          if (block.type === 'ul') {
            return (
              <ul key={idx} className="space-y-2.5 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-800 leading-relaxed"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5 ring-2 ring-emerald-200" />
                    <span>{renderInlineFormatted(item)}</span>
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === 'ol') {
            return (
              <ol key={idx} className="space-y-2.5 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-800 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-300">
                      {itemIdx + 1}
                    </span>
                    <span>{renderInlineFormatted(item)}</span>
                  </li>
                ))}
              </ol>
            );
          }

          return (
            <p key={idx} className="text-xs sm:text-sm text-gray-800 leading-relaxed">
              {renderInlineFormatted(block.content)}
            </p>
          );
        })}
      </div>

      {/* Reader Footer Attribution */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>अधिकृत संदर्भ: सोलापूर APMC आवक व मोडल दर डेटा • कृषिमित्र AI इंजिन</span>
        </div>
        <span className="text-gray-400">
          शेतकऱ्यांच्या आर्थिक हितासाठी प्रमाणित विश्लेषण
        </span>
      </div>
    </div>
  );
}
