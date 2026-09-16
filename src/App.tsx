import React, { useState } from 'react';
import { Header } from './components/Header';
import { BookGeneratorForm } from './components/BookGeneratorForm';
import { ColoringBookView } from './components/ColoringBookView';
import { PageDetailModal } from './components/PageDetailModal';
import { ChatAssistantDrawer } from './components/ChatAssistantDrawer';
import { SAMPLE_BOOK } from './data/sampleBook';
import { ColoringBook, ColoringPage, ImageResolution } from './types';
import { generateColoringBookPDF } from './utils/pdfGenerator';
import { Sparkles, Printer, AlertTriangle } from 'lucide-react';

export default function App() {
  const [childName, setChildName] = useState<string>('Leo');
  const [theme, setTheme] = useState<string>('Space Dinosaurs');
  const [resolution, setResolution] = useState<ImageResolution>('1K');

  const [currentBook, setCurrentBook] = useState<ColoringBook>(SAMPLE_BOOK);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStepMessage, setCurrentStepMessage] = useState<string>('');
  const [stepProgress, setStepProgress] = useState<number>(0);

  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [pdfProgressText, setPdfProgressText] = useState<string>('');

  const [selectedPageForModal, setSelectedPageForModal] = useState<ColoringPage | 'cover' | null>(null);
  const [isModalGenerating, setIsModalGenerating] = useState<boolean>(false);

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Main generation handler
  const handleGenerateBook = async () => {
    if (!childName.trim() || !theme.trim() || isGenerating) return;

    setGeneralError(null);
    setIsGenerating(true);
    setStepProgress(5);
    setCurrentStepMessage(`Planning 5-page story adventure for ${childName}...`);

    try {
      // Step 1: Generate outline & prompts with Gemini
      const planRes = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName.trim(),
          theme: theme.trim(),
          ageGroup: '3-8 years',
        }),
      });

      if (!planRes.ok) {
        const errData = await planRes.json();
        throw new Error(errData.error || 'Failed to outline coloring book scenes.');
      }

      const planData = await planRes.json();
      setStepProgress(20);

      // Create new book skeleton
      const newBook: ColoringBook = {
        id: `book-${Date.now()}`,
        childName: childName.trim(),
        theme: theme.trim(),
        bookTitle: planData.bookTitle || `${childName}'s ${theme} Coloring Adventure`,
        bookSubtitle: planData.bookSubtitle || '5 distinct scenes with thick black contour lines.',
        coverImagePrompt: planData.coverImagePrompt || `Cover illustration of ${theme} with child's name banner`,
        coverImageUrl: null,
        coverStatus: 'generating',
        coverError: null,
        imageResolution: resolution,
        createdAt: Date.now(),
        pages: (planData.pages || []).slice(0, 5).map((p: any, index: number) => ({
          pageNumber: index + 1,
          title: p.title || `Scene ${index + 1}`,
          description: p.description || '',
          imagePrompt: p.imagePrompt || `${theme} scene ${index + 1}`,
          imageUrl: null,
          status: 'idle',
          errorMessage: null,
        })),
      };

      setCurrentBook(newBook);

      // Step 2: Generate Cover Image with gemini-3-pro-image-preview
      setCurrentStepMessage(`Drawing Cover for ${childName} (${resolution})...`);
      setStepProgress(30);

      try {
        const coverImgRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: newBook.coverImagePrompt,
            imageSize: resolution,
            isCover: true,
          }),
        });

        if (coverImgRes.ok) {
          const coverData = await coverImgRes.json();
          newBook.coverImageUrl = coverData.imageUrl;
          newBook.coverStatus = 'ready';
        } else {
          newBook.coverStatus = 'error';
        }
      } catch (e: any) {
        console.warn('Cover generation failed:', e);
        newBook.coverStatus = 'error';
      }

      setCurrentBook({ ...newBook });

      // Step 3: Generate the 5 distinct pages sequentially
      const totalPages = newBook.pages.length;
      for (let i = 0; i < totalPages; i++) {
        const page = newBook.pages[i];
        page.status = 'generating';
        setCurrentBook({ ...newBook });

        const currentPct = 35 + Math.round(((i + 1) / totalPages) * 60);
        setStepProgress(currentPct);
        setCurrentStepMessage(`Drawing Page ${i + 1} of ${totalPages}: ${page.title} (${resolution})...`);

        try {
          const pageImgRes = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: page.imagePrompt,
              imageSize: resolution,
              isCover: false,
            }),
          });

          if (pageImgRes.ok) {
            const pageData = await pageImgRes.json();
            page.imageUrl = pageData.imageUrl;
            page.status = 'ready';
          } else {
            page.status = 'error';
            page.errorMessage = 'Failed to generate image';
          }
        } catch (err: any) {
          console.warn(`Error generating page ${i + 1}:`, err);
          page.status = 'error';
          page.errorMessage = err.message || 'Error';
        }

        setCurrentBook({ ...newBook });
      }

      setStepProgress(100);
      setCurrentStepMessage('All 5 pages and personalized cover generated successfully!');
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    } catch (err: any) {
      console.error('Generation failure:', err);
      setGeneralError(err.message || 'Something went wrong while generating the book.');
      setIsGenerating(false);
    }
  };

  // Download combined PDF
  const handleDownloadPDF = async () => {
    if (isDownloadingPDF) return;
    setIsDownloadingPDF(true);
    setPdfProgressText('Initiating printable PDF compiler...');

    try {
      const blob = await generateColoringBookPDF(currentBook, (text, pct) => {
        setPdfProgressText(`${text} (${pct}%)`);
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = currentBook.childName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const safeTheme = currentBook.theme.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.href = url;
      link.download = `${safeName}-${safeTheme}-coloring-book.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PDF error:', err);
      alert('Could not compile PDF. Please check that images have loaded and try again.');
    } finally {
      setIsDownloadingPDF(false);
      setPdfProgressText('');
    }
  };

  // Regenerate single page
  const handleRegeneratePage = async (pageNumber: number, customPrompt?: string, targetRes?: ImageResolution) => {
    const pageIndex = currentBook.pages.findIndex((p) => p.pageNumber === pageNumber);
    if (pageIndex === -1) return;

    const page = currentBook.pages[pageIndex];
    const promptToUse = customPrompt || page.imagePrompt;
    const resToUse = targetRes || currentBook.imageResolution;

    page.status = 'generating';
    page.imagePrompt = promptToUse;
    setCurrentBook({ ...currentBook });

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          imageSize: resToUse,
          isCover: false,
        }),
      });

      if (!res.ok) throw new Error('Failed to redraw image');
      const data = await res.json();
      page.imageUrl = data.imageUrl;
      page.status = 'ready';
      page.errorMessage = null;
    } catch (e: any) {
      page.status = 'error';
      page.errorMessage = e.message || 'Error regenerating';
    } finally {
      setCurrentBook({ ...currentBook });
      if (selectedPageForModal && typeof selectedPageForModal !== 'string' && selectedPageForModal.pageNumber === pageNumber) {
        setSelectedPageForModal({ ...page });
      }
    }
  };

  // Regenerate cover
  const handleRegenerateCover = async (customPrompt?: string, targetRes?: ImageResolution) => {
    const promptToUse = customPrompt || currentBook.coverImagePrompt;
    const resToUse = targetRes || currentBook.imageResolution;

    currentBook.coverStatus = 'generating';
    currentBook.coverImagePrompt = promptToUse;
    setCurrentBook({ ...currentBook });

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          imageSize: resToUse,
          isCover: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to redraw cover');
      const data = await res.json();
      currentBook.coverImageUrl = data.imageUrl;
      currentBook.coverStatus = 'ready';
      currentBook.coverError = null;
    } catch (e: any) {
      currentBook.coverStatus = 'error';
      currentBook.coverError = e.message || 'Error regenerating cover';
    } finally {
      setCurrentBook({ ...currentBook });
    }
  };

  // Quick print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 flex flex-col font-sans selection:bg-amber-200">
      <Header
        onOpenChat={() => setIsChatOpen(true)}
        hasBook={Boolean(currentBook)}
        onPrint={handlePrint}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error notification */}
        {generalError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold">Generation Notice: </strong>
              <span>{generalError}</span>
            </div>
            <button
              onClick={() => setGeneralError(null)}
              className="text-rose-600 hover:text-rose-900 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Generator Form Section */}
        <section>
          <BookGeneratorForm
            childName={childName}
            setChildName={setChildName}
            theme={theme}
            setTheme={setTheme}
            resolution={resolution}
            setResolution={setResolution}
            onGenerate={handleGenerateBook}
            isGenerating={isGenerating}
            currentStepMessage={currentStepMessage}
            stepProgress={stepProgress}
          />
        </section>

        {/* Book Gallery & PDF Download Actions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                Printable Coloring Book Pages
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Includes custom personalized cover and 5 continuous story pages formatted for standard Letter/A4 paper.
              </p>
            </div>
          </div>

          <ColoringBookView
            book={currentBook}
            onDownloadPDF={handleDownloadPDF}
            isDownloadingPDF={isDownloadingPDF}
            pdfProgressText={pdfProgressText}
            onRegeneratePage={(pageNum) => handleRegeneratePage(pageNum)}
            onRegenerateCover={() => handleRegenerateCover()}
            onViewPageDetails={(item) => setSelectedPageForModal(item)}
            onPrint={handlePrint}
          />
        </section>
      </main>

      {/* Hidden print container: neatly prints cover + 5 pages in full 8.5x11 aspect ratio */}
      <div className="hidden print:block">
        {/* Cover Page */}
        <div className="print-page-break p-8 flex flex-col items-center justify-between h-screen box-border border-4 border-black m-4">
          <div className="text-center pt-6">
            <div className="text-2xl font-black uppercase tracking-widest">{currentBook.childName}'s</div>
            <h1 className="text-3xl font-black mt-2">{currentBook.bookTitle}</h1>
            <p className="text-sm italic text-gray-700 mt-1">{currentBook.bookSubtitle}</p>
          </div>

          {currentBook.coverImageUrl && (
            <div className="my-auto max-h-[60%] flex items-center justify-center">
              <img
                src={currentBook.coverImageUrl}
                alt="Cover"
                className="max-h-[6.5in] w-auto border-2 border-black object-contain"
              />
            </div>
          )}

          <div className="text-center pb-6 border-t-2 border-gray-400 w-full pt-4">
            <p className="text-sm font-bold">Colored with Love by: ________________________  Date: ____________</p>
            <p className="text-xs text-gray-500 mt-1">Theme: {currentBook.theme} • Personal Coloring Edition</p>
          </div>
        </div>

        {/* 5 Distinct Coloring Pages */}
        {currentBook.pages.map((p) => (
          <div
            key={p.pageNumber}
            className="print-page-break p-8 flex flex-col items-center justify-between h-screen box-border border-4 border-black m-4"
          >
            <div className="w-full flex justify-between items-center border-b-2 border-black pb-2">
              <span className="font-bold text-base">{currentBook.childName}'s Coloring Book</span>
              <span className="font-bold text-base">Page {p.pageNumber} of 5</span>
            </div>

            <div className="text-center my-2">
              <h2 className="text-2xl font-bold">{p.title}</h2>
            </div>

            {p.imageUrl && (
              <div className="my-auto flex items-center justify-center max-h-[70%]">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="max-h-[7.2in] w-auto border-2 border-black object-contain"
                />
              </div>
            )}

            <div className="text-center pt-3 border-t border-gray-300 w-full">
              <p className="text-sm font-medium text-gray-800">"{p.description}"</p>
              <p className="text-xs text-gray-500 mt-1">Coloring Book for {currentBook.childName} • {currentBook.theme}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Page Inspection & Prompt Customizer Modal */}
      {selectedPageForModal && (
        <PageDetailModal
          item={selectedPageForModal}
          book={currentBook}
          onClose={() => setSelectedPageForModal(null)}
          isGenerating={isModalGenerating}
          onRegenerate={async (prompt, targetRes) => {
            setIsModalGenerating(true);
            if (selectedPageForModal === 'cover') {
              await handleRegenerateCover(prompt, targetRes);
            } else {
              await handleRegeneratePage(selectedPageForModal.pageNumber, prompt, targetRes);
            }
            setIsModalGenerating(false);
          }}
        />
      )}

      {/* Gemini Chatbot: Story & Idea Buddy */}
      <ChatAssistantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onApplyTheme={(suggestedTheme) => {
          setTheme(suggestedTheme);
        }}
        currentTheme={theme}
        currentChildName={childName}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-neutral-800">Children's Coloring Book Generator</span>
            <span>•</span>
            <span>Powered by Gemini AI (gemini-3-pro-image-preview & gemini-3.5-flash)</span>
          </div>
          <div>
            Thick-line black & white art optimized for wax crayons, colored pencils, and washable markers.
          </div>
        </div>
      </footer>
    </div>
  );
}
