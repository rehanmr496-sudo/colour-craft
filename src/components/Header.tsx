import React from 'react';
import { BookOpen, Sparkles, MessageSquareHeart, Printer } from 'lucide-react';

interface HeaderProps {
  onOpenChat: () => void;
  hasBook: boolean;
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChat, hasBook, onPrint }) => {
  return (
    <header className="border-b border-amber-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-sm ring-2 ring-amber-200/50">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 font-sans">
                ColorCraft <span className="text-amber-600 font-normal text-sm sm:text-base">for Kids</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Thick-Line Art
              </span>
            </div>
            <p className="text-xs text-neutral-500 hidden sm:block">
              5-Page Custom Printable Coloring Books with Personalized Cover & PDF
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasBook && onPrint && (
            <button
              onClick={onPrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              title="Print current pages"
            >
              <Printer className="w-4 h-4 text-neutral-600" />
              <span className="hidden md:inline">Quick Print</span>
            </button>
          )}

          <button
            onClick={onOpenChat}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300/80 rounded-lg transition-colors shadow-xs"
          >
            <MessageSquareHeart className="w-4 h-4 text-amber-700" />
            <span>Story & Idea Buddy</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
          </button>
        </div>
      </div>
    </header>
  );
};
