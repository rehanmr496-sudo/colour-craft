import React, { useState } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { ColoringBook, ColoringPage } from '../types';

interface ColoringBookViewProps {
  book: ColoringBook;
  onDownloadPDF: () => void;
  isDownloadingPDF: boolean;
  pdfProgressText: string;
  onRegeneratePage: (pageNumber: number, customPrompt?: string) => void;
  onRegenerateCover: () => void;
  onViewPageDetails: (page: ColoringPage | 'cover') => void;
  onPrint: () => void;
}

export const ColoringBookView: React.FC<ColoringBookViewProps> = ({
  book,
  onDownloadPDF,
  isDownloadingPDF,
  pdfProgressText,
  onRegeneratePage,
  onRegenerateCover,
  onViewPageDetails,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'cover' | 'pages'>('all');

  const readyPagesCount = book.pages.filter((p) => p.status === 'ready' && p.imageUrl).length;
  const isCoverReady = book.coverStatus === 'ready' && book.coverImageUrl;
  const allComplete = readyPagesCount === 5 && isCoverReady;

  const handleDownloadSingleImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & PDF Download Action Bar */}
      <div className="bg-white rounded-2xl border border-amber-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Personalized for {book.childName}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              Theme: <strong className="text-neutral-800">{book.theme}</strong> ({book.imageResolution})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
            {book.bookTitle || `${book.childName}'s ${book.theme} Coloring Book`}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            {book.bookSubtitle || '5 distinct scenes with thick black contour lines for easy coloring.'}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-neutral-700">
            <span className="flex items-center gap-1">
              <CheckCircle2 className={`w-4 h-4 ${isCoverReady ? 'text-emerald-500' : 'text-neutral-300'}`} />
              Cover: {isCoverReady ? 'Ready' : 'Pending'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className={`w-4 h-4 ${readyPagesCount === 5 ? 'text-emerald-500' : 'text-neutral-300'}`} />
              Pages: {readyPagesCount}/5 Ready
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            id="printBookButton"
            type="button"
            onClick={onPrint}
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-bold text-xs sm:text-sm transition-all"
          >
            <Printer className="w-4 h-4 text-neutral-600" />
            <span>Print Book</span>
          </button>

          <button
            id="downloadPdfButton"
            type="button"
            onClick={onDownloadPDF}
            disabled={isDownloadingPDF}
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
          >
            {isDownloadingPDF ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{pdfProgressText || 'Building PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Complete Book (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All Pages ({1 + book.pages.length})
        </button>
        <button
          onClick={() => setActiveTab('cover')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'cover'
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Cover Page
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'pages'
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Story Scenes (5 Pages)
        </button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cover Card */}
        {(activeTab === 'all' || activeTab === 'cover') && (
          <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-500 text-white tracking-wide uppercase">
                Cover Page
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onRegenerateCover()}
                  disabled={book.coverStatus === 'generating'}
                  className="p-1.5 text-neutral-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Regenerate Cover"
                >
                  <RefreshCw className={`w-4 h-4 ${book.coverStatus === 'generating' ? 'animate-spin text-amber-600' : ''}`} />
                </button>
                <button
                  onClick={() => onViewPageDetails('cover')}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Expand preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cover Preview Canvas */}
            <div className="relative aspect-[3/4] bg-neutral-50 rounded-xl border border-neutral-300 overflow-hidden flex flex-col items-center justify-center p-3 text-center">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt="Coloring book cover"
                  className="w-full h-full object-contain filter contrast-125"
                  referrerPolicy="no-referrer"
                />
              ) : book.coverStatus === 'generating' ? (
                <div className="flex flex-col items-center space-y-2 p-4 text-amber-600">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-semibold">Drawing Cover with {book.imageResolution}...</span>
                </div>
              ) : (
                <div className="p-4 text-neutral-400 flex flex-col items-center">
                  <AlertCircle className="w-8 h-8 text-neutral-300 mb-1" />
                  <span className="text-xs">Cover pending generation</span>
                  <button
                    onClick={onRegenerateCover}
                    className="mt-2 text-xs font-bold text-amber-600 hover:underline"
                  >
                    Generate Cover Now
                  </button>
                </div>
              )}

              {/* Overlay title banner simulating print */}
              {book.coverImageUrl && (
                <div className="absolute top-2 left-2 right-2 bg-white/90 backdrop-blur-xs py-1 px-2 rounded-md border border-neutral-200 text-center pointer-events-none">
                  <div className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                    {book.childName}'s
                  </div>
                  <div className="text-xs font-extrabold text-neutral-900 line-clamp-1">
                    {book.bookTitle}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3">
              <h3 className="font-extrabold text-sm text-neutral-900 line-clamp-1">
                {book.childName.toUpperCase()}'S {book.bookTitle}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">
                Features {book.childName}'s custom title, thick lines for coloring, and an "Artist Signature" badge.
              </p>

              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-400">
                  Format: 8.5" x 11" Portrait
                </span>
                {book.coverImageUrl && (
                  <button
                    onClick={() => handleDownloadSingleImage(book.coverImageUrl!, `${book.childName}-cover.png`)}
                    className="inline-flex items-center text-xs font-bold text-neutral-700 hover:text-amber-600"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    PNG
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5 Distinct Coloring Pages */}
        {(activeTab === 'all' || activeTab === 'pages') &&
          book.pages.map((page) => (
            <div
              key={page.pageNumber}
              className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-neutral-900 text-white tracking-wide">
                  Page {page.pageNumber} of 5
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onRegeneratePage(page.pageNumber)}
                    disabled={page.status === 'generating'}
                    className="p-1.5 text-neutral-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title={`Regenerate Page ${page.pageNumber}`}
                  >
                    <RefreshCw className={`w-4 h-4 ${page.status === 'generating' ? 'animate-spin text-amber-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => onViewPageDetails(page)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="View details & full size"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Page Artwork Canvas */}
              <div className="relative aspect-[3/4] bg-neutral-50 rounded-xl border border-neutral-300 overflow-hidden flex flex-col items-center justify-center p-2 text-center">
                {page.imageUrl ? (
                  <img
                    src={page.imageUrl}
                    alt={page.title}
                    className="w-full h-full object-contain filter contrast-125"
                    referrerPolicy="no-referrer"
                  />
                ) : page.status === 'generating' ? (
                  <div className="flex flex-col items-center space-y-2 p-4 text-amber-600">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-semibold">Drawing Page {page.pageNumber}...</span>
                    <span className="text-[10px] text-neutral-400">Thick line art ({book.imageResolution})</span>
                  </div>
                ) : (
                  <div className="p-4 text-neutral-400 flex flex-col items-center">
                    <AlertCircle className="w-8 h-8 text-neutral-300 mb-1" />
                    <span className="text-xs font-medium">Artwork not generated</span>
                    <button
                      onClick={() => onRegeneratePage(page.pageNumber)}
                      className="mt-2 text-xs font-bold text-amber-600 hover:underline"
                    >
                      Draw Page Now
                    </button>
                  </div>
                )}
              </div>

              {/* Page Details */}
              <div className="mt-3">
                <h3 className="font-bold text-sm text-neutral-900 line-clamp-1">
                  {page.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 mt-0.5 italic">
                  "{page.description}"
                </p>

                <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-400">
                    Thick-line black & white
                  </span>
                  {page.imageUrl && (
                    <button
                      onClick={() => handleDownloadSingleImage(page.imageUrl!, `${book.childName}-page-${page.pageNumber}.png`)}
                      className="inline-flex items-center text-xs font-bold text-neutral-700 hover:text-amber-600"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      PNG
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
