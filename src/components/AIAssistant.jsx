import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Minimize2,
  Wheat,
  Languages,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import { askKrushiMitraAssistant } from '../services/geminiService';

const STORAGE_KEY_HISTORY = 'krushimitra_ai_chat_history_v2';
const STORAGE_KEY_LANG = 'krushimitra_ai_chat_lang_v2';
const STORAGE_KEY_OPEN = 'krushimitra_ai_chat_open_v2';

const LANGUAGES = [
  { id: 'mr', label: 'मराठी', flag: '🇮🇳', speechLang: 'mr-IN' },
  { id: 'hi', label: 'हिंदी', flag: '🇮🇳', speechLang: 'hi-IN' },
  { id: 'en', label: 'English', flag: '🇬🇧', speechLang: 'en-IN' },
];

const QUICK_PROMPTS = {
  mr: [
    'डाळिंबावरील तेल्या रोगावर उपाय?',
    'कांद्याचे बाजारभाव कसे राहतील?',
    'ज्वारी खत व्यवस्थापन',
    'सोलापूर बाजार समिती आजचे दर',
  ],
  hi: [
    'अनार के रोगों की रोकथाम?',
    'प्याज के मंडी भाव कब सुधरेंगे?',
    'ज्वार के लिए खाद',
    'सोलापुर मंडी के ताजा भाव',
  ],
  en: [
    'Pomegranate disease cure?',
    'Solapur onion price trend?',
    'Best fertilizer for Jowar',
    'Solapur APMC live rates',
  ],
};

const WELCOME_MESSAGES = {
  mr: 'नमस्कार बळीराजा! मी आपला **कृषी मित्र AI सल्लागार** आहे. मी पिकांवरील रोग, खत व्यवस्थापन, हवामान सल्ला आणि सोलापूर APMC चालू बाजारभावांबाबत मार्गदर्शन करू शकतो. आपण खाली लिहून किंवा माइकवर बोलून प्रश्न विचारू शकता!',
  hi: 'नमस्ते किसान साथी! मैं आपका **कृषि मित्र AI सलाहकार** हूँ। मैं फसलों के रोग, खाद की मात्रा, मौसम सलाह और सोलापुर मंडी के ताजा भावों के बारे में सहायता कर सकता हूँ। आप लिखकर या माइक पर बोलकर पूछ सकते हैं!',
  en: 'Hello! I am your **KrushiMitra AI Agricultural Advisor**. I can guide you on crop diseases, fertilizer dosage, weather advisories, and live Solapur APMC mandi rates. Type your query or tap the microphone to speak!',
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_OPEN) === 'true';
    } catch {
      return false;
    }
  });

  const [language, setLanguage] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_LANG) || 'mr';
    } catch {
      return 'mr';
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: WELCOME_MESSAGES['mr'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_OPEN, isOpen ? 'true' : 'false');
    } catch (e) {
      // Ignore
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_LANG, language);
    } catch (e) {
      // Ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(messages));
    } catch (e) {
      // Ignore
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, isListening]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Web Speech Recognition Handler
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        language === 'en'
          ? 'Voice input is not supported in this browser. Please type your message.'
          : language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया लिखकर पूछें।'
          : 'आपल्या ब्राउझरमध्ये आवाज ओळख (Voice Input) सुविधा उपलब्ध नाही. कृपया लिहून विचारा.'
      );
      setTimeout(() => setSpeechError(''), 4500);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const currentLangObj = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
      recognition.lang = currentLangObj.speechLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          setInputQuery(transcript);
          // Auto-send transcribed query
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError(
            language === 'en'
              ? 'Microphone permission denied. Please allow microphone access.'
              : language === 'hi'
              ? 'माइक की अनुमति नहीं मिली। कृपया माइक्रोफोन की अनुमति दें।'
              : 'मायक्रोफोनची परवानगी नाकारली गेली. कृपया ब्राऊझरमध्ये मायक्रोफोन चालू करा.'
          );
        } else if (event.error !== 'no-speech') {
          setSpeechError(
            language === 'en'
              ? 'Could not hear clearly. Please try again.'
              : language === 'hi'
              ? 'आवाज स्पष्ट सुनाई नहीं दिया। कृपया पुनः प्रयास करें।'
              : 'आवाज स्पष्ट ऐकू आला नाही. कृपया पुन्हा बोला.'
          );
        }
        setTimeout(() => setSpeechError(''), 4500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = typeof textToSend === 'string' ? textToSend : inputQuery;
    if (!query || !query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);
    setSpeechError('');

    try {
      const responseText = await askKrushiMitraAssistant(query.trim(), updatedMessages, language);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Gemini API Error in KrushiMitra Chat:', err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text:
          language === 'en'
            ? '⚠️ Could not fetch an answer from KrushiMitra AI right now. Please tap to retry your question.'
            : language === 'hi'
            ? '⚠️ कृषि मित्र AI से उत्तर प्राप्त नहीं हो सका। कृपया अपना प्रश्न पुनः पूछें।'
            : '⚠️ कृषीमित्र AI कडून उत्तर मिळवण्यात अडचण आली आहे. कृपया आपला प्रश्न पुन्हा विचारून पहा.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const resetMsg = {
      id: Date.now().toString(),
      sender: 'assistant',
      text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES['mr'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([resetMsg]);
    setSpeechError('');
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // If only welcome message exists, update it to the new language
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: WELCOME_MESSAGES[newLang] || WELCOME_MESSAGES['mr'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const currentPrompts = QUICK_PROMPTS[language] || QUICK_PROMPTS['mr'];

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (fixed bottom-6 right-6 z-50) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Floating Idle Badge: "कृषी AI मित्र" */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-950/90 to-teal-950/90 hover:from-emerald-900 hover:to-teal-900 text-white px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-500/30 text-xs font-black cursor-pointer transition-all hover:scale-105 active:scale-95 backdrop-blur-md animate-in fade-in slide-in-from-right-4"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>कृषी AI मित्र</span>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-1.5 py-0.2 rounded">
              {language.toUpperCase()}
            </span>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative p-3.5 sm:p-4 rounded-2xl shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-400/50 ${
            isOpen
              ? 'bg-gray-950 text-white rotate-90 hover:bg-gray-900 ring-2 ring-white/30'
              : 'bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 text-white hover:scale-105 active:scale-95 shadow-emerald-950/50 ring-2 ring-amber-300/40'
          }`}
          aria-label={isOpen ? 'Close Agri Assistant' : 'Open KrushiMitra AI Agri Assistant'}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Wheat className="w-6 h-6 text-amber-300 animate-pulse" />
              {/* Active pulsing green ping indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-emerald-900"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* 2. CHAT DRAWER / POPUP WINDOW */}
      {isOpen && (
        <div
          className="fixed bottom-22 sm:bottom-24 right-3 sm:right-6 z-50 w-[94vw] sm:w-[430px] max-h-[84vh] h-[610px] bg-white rounded-3xl shadow-2xl border border-gray-200/90 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-label="KrushiMitra AI Agriculture Advisor"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 shrink-0 shadow-md">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

            <div className="relative z-10 space-y-3">
              {/* Top Row: Mascot, Title & Controls */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-[10px] bg-emerald-950 flex items-center justify-center text-amber-300 font-black">
                      <Bot className="w-5 h-5 text-amber-300" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-none">
                        कृषी मित्र AI सल्लागार
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <p className="text-[11px] text-emerald-100 font-medium mt-0.5">
                      Multi-Lingual Agri Assistant (Voice & Chat)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClearHistory}
                    className="p-1.5 rounded-lg bg-black/25 hover:bg-black/40 border border-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                    title="संभाषण रीफ्रेश करा (Refresh / Clear Chat)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-black/25 hover:bg-black/40 border border-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                    title="बंद करा (Close)"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Language Selector Switch (मराठी, हिंदी, English) */}
              <div className="flex items-center justify-between bg-emerald-950/50 backdrop-blur-md p-1 rounded-xl border border-white/15 text-xs">
                <div className="flex items-center gap-1 text-[11px] text-emerald-200 px-2 font-semibold">
                  <Languages className="w-3.5 h-3.5 text-amber-300" />
                  <span>भाषा:</span>
                </div>
                <div className="flex items-center gap-1">
                  {LANGUAGES.map((lang) => {
                    const isActive = language === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => handleLanguageChange(lang.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'bg-amber-400 text-gray-950 shadow-xs'
                            : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Speech Error Banner if any */}
          {speechError && (
            <div className="px-3.5 py-2 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center gap-2 shrink-0 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="flex-1">{speechError}</span>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/70 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1 ${isAssistant ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl shadow-xs leading-relaxed text-xs sm:text-[13px] ${
                        isAssistant
                          ? 'bg-white text-gray-900 border border-gray-200/90 rounded-tl-xs'
                          : 'bg-emerald-700 text-white rounded-tr-xs font-medium'
                      }`}
                    >
                      <div className="whitespace-pre-line select-text">
                        {msg.text.split('\n').map((line, idx) => {
                          const parsedLine = line.replace(/\*\*(.*?)\*\*/g, '$1');
                          return (
                            <p
                              key={idx}
                              className={
                                line.startsWith('-') || line.startsWith('*')
                                  ? 'ml-2 my-0.5 font-medium'
                                  : 'my-0.5'
                              }
                            >
                              {parsedLine}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 block px-1">{msg.timestamp}</span>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-gray-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <User className="w-3.5 h-3.5 text-gray-200" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                </div>
                <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="font-bold text-emerald-800 ml-1">
                    {language === 'en'
                      ? 'KrushiMitra is thinking...'
                      : language === 'hi'
                      ? 'कृषि मित्र विचार कर रहा है...'
                      : 'कृषीमित्र विचार करत आहे...'}
                  </span>
                </div>
              </div>
            )}

            {/* Listening Wave Animation */}
            {isListening && (
              <div className="flex gap-2.5 justify-center py-2 animate-in fade-in">
                <div className="inline-flex items-center gap-2.5 bg-rose-50 border border-rose-200 px-4 py-2 rounded-full text-xs font-bold text-rose-700 shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                  </span>
                  <span>
                    {language === 'en'
                      ? 'Listening... Speak now'
                      : language === 'hi'
                      ? 'सुन रहा हूँ... बोलिए'
                      : 'ऐकत आहे... बोला'}
                  </span>
                  <button
                    onClick={stopVoiceInput}
                    className="ml-2 text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-full cursor-pointer"
                  >
                    थांबवा
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompts Carousel */}
          <div className="bg-white border-t border-gray-100 p-2.5 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
            {currentPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading || isListening}
                className="shrink-0 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 hover:border-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
          >
            {/* Microphone Voice Button */}
            <button
              type="button"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={isLoading}
              className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
              title={
                language === 'en'
                  ? 'Click to speak (Voice Input)'
                  : language === 'hi'
                  ? 'बोलने के लिए माइक दबाएं'
                  : 'बोलून विचारण्यासाठी माइक दाबा'
              }
              aria-label="Voice input microphone"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Ask anything about crops, pests, fertilizers, mandi...'
                  : language === 'hi'
                  ? 'फसल, खाद, रोग या मंडी भाव के बारे में पूछें...'
                  : 'पीक, रोग, खत किंवा सोलापूर बाजारभावाबद्दल विचारा...'
              }
              disabled={isLoading || isListening}
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-semibold disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading || isListening}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

