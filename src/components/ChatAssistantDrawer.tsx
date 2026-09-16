import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Brain,
  MessageSquareHeart,
  ArrowRight,
  RotateCcw,
  Check,
} from 'lucide-react';
import { ChatMessage, ChatModelOption } from '../types';

interface ChatAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: string) => void;
  currentTheme?: string;
  currentChildName?: string;
}

const QUICK_PROMPTS = [
  '💡 Brainstorm 5 imaginative coloring themes with cute animals',
  '🎨 What fun crayon color palettes do you recommend for our scenes?',
  '📖 Write a playful 5-scene rhyming story for our coloring book',
  '🖍️ What coloring tips work best for toddlers using thick crayons?',
];

export const ChatAssistantDrawer: React.FC<ChatAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onApplyTheme,
  currentTheme,
  currentChildName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi there! I'm Doodle, your Coloring Book Guide & Story Companion. 🌟\n\nNeed inspiration for themes, 5-page story ideas, fun color palette suggestions, or rhyming captions for ${currentChildName || 'your child'}? Ask me anything!`,
      timestamp: Date.now(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ChatModelOption>('gemini-3.5-flash');
  const [appliedThemeFeedback, setAppliedThemeFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query.trim(),
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          modelPreference: selectedModel,
          contextInfo: {
            currentChildName,
            currentTheme,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with chat model');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: Date.now(),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `Oops! I had a hiccup: ${err.message || 'Unable to connect to assistant'}. Please try again.`,
        timestamp: Date.now(),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `Fresh canvas! Ready for new coloring book concepts, rhymes, and creative ideas. What shall we dream up?`,
        timestamp: Date.now(),
        modelUsed: selectedModel,
      },
    ]);
  };

  // Extract possible theme suggestions inside quotes or bullet points
  const extractPossibleThemes = (text: string): string[] => {
    const lines = text.split('\n');
    const themes: string[] = [];
    for (const line of lines) {
      const match = line.match(/^[-*•\d.]+\s*(?:\*\*)?([^:\n*]{4,50})(?:\*\*)?/);
      if (match && match[1]) {
        const candidate = match[1].replace(/["']/g, '').trim();
        if (candidate.length > 3 && candidate.length < 50 && !candidate.toLowerCase().startsWith('here')) {
          themes.push(candidate);
        }
      }
    }
    return themes.slice(0, 3);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-neutral-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-l border-amber-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-amber-200 bg-amber-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-base flex items-center gap-1.5">
                Story & Idea Buddy
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-sm bg-amber-200 text-amber-900">
                  AI Guide
                </span>
              </h3>
              <p className="text-xs text-neutral-500">Brainstorm themes, stories, and color palettes</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleClearHistory}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-amber-100/60 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-amber-100/60 rounded-lg transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Selector Bar (Meets Requirement: gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general tasks, gemini-3.1-flash-lite for fast tasks) */}
        <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 shrink-0">
            Model:
          </span>
          <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
              }`}
              title="gemini-3.1-flash-lite: Best for fast instant ideas"
            >
              <Zap className="w-3 h-3" />
              <span>Fast (Lite)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.5-flash')}
              className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedModel === 'gemini-3.5-flash'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
              }`}
              title="gemini-3.5-flash: Best for general storytelling and coloring advice"
            >
              <Sparkles className="w-3 h-3" />
              <span>General (Flash)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
              className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedModel === 'gemini-3.1-pro-preview'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
              }`}
              title="gemini-3.1-pro-preview: Best for complex rhymes, intricate story arcs, and character design"
            >
              <Brain className="w-3 h-3" />
              <span>Complex (Pro)</span>
            </button>
          </div>
        </div>

        {/* Applied Theme Notification Toast */}
        {appliedThemeFeedback && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Applied "{appliedThemeFeedback}" to generator!
            </span>
            <button
              onClick={() => setAppliedThemeFeedback(null)}
              className="text-emerald-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const suggestedThemes = !isUser ? extractPossibleThemes(msg.text) : [];

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[88%]">
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-neutral-900 text-white rounded-br-xs'
                        : 'bg-amber-50/60 text-neutral-800 border border-amber-200/80 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Extracted Theme Quick-Action Chips */}
                    {suggestedThemes.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-amber-200/60">
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
                          Use Suggested Theme:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestedThemes.map((themeCandidate, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                onApplyTheme(themeCandidate);
                                setAppliedThemeFeedback(themeCandidate);
                                setTimeout(() => setAppliedThemeFeedback(null), 3500);
                              }}
                              className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-neutral-800 font-medium rounded-lg shadow-2xs transition-colors"
                            >
                              <span>{themeCandidate}</span>
                              <ArrowRight className="w-3 h-3 text-amber-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="mt-1 px-9 text-[10px] text-neutral-400 flex items-center space-x-2">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl rounded-bl-xs px-4 py-3 text-sm text-neutral-500 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Doodle is thinking with {selectedModel}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-neutral-50 border-t border-neutral-200 overflow-x-auto flex space-x-1.5 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 bg-white hover:bg-amber-50 border border-neutral-200 hover:border-amber-300 text-neutral-700 font-medium rounded-lg whitespace-nowrap transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-neutral-200 bg-white flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask for theme ideas, story verses, or coloring palettes..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium text-neutral-900 disabled:bg-neutral-100"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
