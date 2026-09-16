import React, { useState } from 'react';
import { X, Download, RefreshCw, Printer, Wand2, Layers } from 'lucide-react';
import { ColoringPage, ColoringBook, ImageResolution } from '../types';

interface PageDetailModalProps {
  item: ColoringPage | 'cover';
  book: ColoringBook;
  onClose: () => void;
  onRegenerate: (customPrompt?: string, resolution?: ImageResolution) => void;
  isGenerating: boolean;
}

export const PageDetailModal: React.FC<PageDetailModalProps> = ({
  item,
  book,
  onClose,
  onRegenerate,
  isGenerating,
}) => {
  const isCover = item === 'cover';
  const initialPrompt = isCover ? book.coverImagePrompt : (item as ColoringPage).imagePrompt;
  const [promptText, setPromptText] = useState(initialPrompt || '');
  const [selectedRes, setSelectedRes] = useState<ImageResolution>(book.imageResolution);

  const title = isCover
    ? `${book.childName.toUpperCase()}'S ${book.bookTitle || 'Cover'}`
    : `Page ${(item as ColoringPage).pageNumber}: ${(item as ColoringPage).title}`;

  const description = isCover
    ? book.bookSubtitle || 'Custom personalized cover with thick-line framing'
    : (item as ColoringPage).description;

  const imageUrl = isCover ? book.coverImageUrl : (item as ColoringPage).imageUrl;

  const handlePrintThisPage = () => {
    if (!imageUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: letter portrait; margin: 0.4in; }
            body { margin: 0; padding: 0; font-family: sans-serif; text-align: center; }
            .frame { border: 2px solid #222; padding: 12px; height: 9.8in; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
            h1 { margin: 0; font-size: 20pt; font-weight: bold; }
            p { margin: 4px 0 10px; font-size: 12pt; color: #444; }
            img { max-height: 7.8in; max-width: 100%; object-fit: contain; border: 1.5px solid #333; margin: auto; }
            .foot { font-size: 9pt; color: #666; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="frame">
            <div>
              <h1>${title}</h1>
              <p>${description}</p>
            </div>
            <img src="${imageUrl}" />
            <div class="foot">${book.childName}'s Coloring Edition • Theme: ${book.theme}</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = isCover ? `${book.childName}-cover.png` : `${book.childName}-page-${(item as ColoringPage).pageNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              {isCover ? 'Cover Inspection' : `Scene ${(item as ColoringPage).pageNumber} of 5`}
            </span>
            <h3 className="text-lg font-black text-neutral-900 line-clamp-1">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Preview Canvas */}
          <div className="flex flex-col items-center justify-center bg-neutral-100 rounded-xl p-3 border border-neutral-300 min-h-[340px] relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="max-h-[500px] w-auto object-contain rounded-lg shadow-xs filter contrast-125"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-6 text-neutral-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
                <p className="text-sm font-medium">Drawing page with gemini-3-pro-image-preview...</p>
              </div>
            )}
          </div>

          {/* Controls & Prompt Customizer */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Story Caption
                </label>
                <p className="text-sm text-neutral-800 font-medium mt-0.5 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  "{description}"
                </p>
              </div>

              <div className="mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Art Generation Prompt (Thick Lines)
                </label>
                <textarea
                  rows={4}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none resize-none font-mono text-neutral-800"
                  placeholder="Describe scene elements with thick black outlines..."
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Prompt is automatically prepended with thick continuous line art instructions for optimal coloring.
                </p>
              </div>

              {/* Resolution Affordance (1K, 2K, 4K) */}
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  Target Image Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                    <button
                      type="button"
                      key={res}
                      onClick={() => setSelectedRes(res)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                        selectedRes === res
                          ? 'bg-amber-100 text-amber-900 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {res} ({res === '1K' ? 'Standard' : res === '2K' ? 'High-Def' : 'Ultra'})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => onRegenerate(promptText, selectedRes)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Redrawing Art with {selectedRes}...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Redraw with {selectedRes} Resolution</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrintThisPage}
                  disabled={!imageUrl}
                  className="py-2 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <Printer className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Print Single Page</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={!imageUrl}
                  className="py-2 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
