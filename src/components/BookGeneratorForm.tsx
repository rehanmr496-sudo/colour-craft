import React, { useState } from 'react';
import { Sparkles, Palette, Layers, RefreshCw, Wand2, Info } from 'lucide-react';
import { ImageResolution } from '../types';

interface BookGeneratorFormProps {
  childName: string;
  setChildName: (name: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  resolution: ImageResolution;
  setResolution: (res: ImageResolution) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  currentStepMessage: string;
  stepProgress: number;
}

const INSPIRATION_THEMES = [
  'Space Dinosaurs in Rocket Boots',
  'Underwater Sea Animals at School',
  'Enchanted Forest Woodland Tea Party',
  'Cozy Kitten Bakery & Pastry Chefs',
  'Safari Animals Driving Mini Cars',
  'Friendly Monsters Building Treehouses',
];

export const BookGeneratorForm: React.FC<BookGeneratorFormProps> = ({
  childName,
  setChildName,
  theme,
  setTheme,
  resolution,
  setResolution,
  onGenerate,
  isGenerating,
  currentStepMessage,
  stepProgress,
}) => {
  const [showResInfo, setShowResInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !theme.trim() || isGenerating) return;
    onGenerate();
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-7 relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2 font-sans">
          <Wand2 className="w-6 h-6 text-amber-500" />
          Create a Personalized Coloring Book
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Each book includes a custom personalized cover plus 5 distinct story pages featuring crisp, thick black outlines designed specifically for crayons and markers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Child's Name */}
          <div>
            <label htmlFor="childNameInput" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Child's Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="childNameInput"
              type="text"
              required
              disabled={isGenerating}
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g., Liam, Maya, or Leo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-neutral-900 font-medium transition-all text-sm sm:text-base disabled:bg-neutral-100"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Printed prominently on the cover and headers.
            </p>
          </div>

          {/* Theme */}
          <div>
            <label htmlFor="themeInput" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Book Theme <span className="text-rose-500">*</span>
            </label>
            <input
              id="themeInput"
              type="text"
              required
              disabled={isGenerating}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., Space Dinosaurs, Puppy Astronauts"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-neutral-900 font-medium transition-all text-sm sm:text-base disabled:bg-neutral-100"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Generates 5 chronological, continuous story scenes.
            </p>
          </div>
        </div>

        {/* Quick theme suggestions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Theme Inspirations:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {INSPIRATION_THEMES.map((item) => (
              <button
                type="button"
                key={item}
                disabled={isGenerating}
                onClick={() => setTheme(item)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  theme === item
                    ? 'bg-amber-100 text-amber-800 border-amber-400 font-medium'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution selector (Affordance: 1K, 2K, 4K) */}
        <div className="bg-amber-50/70 rounded-xl p-3.5 sm:p-4 border border-amber-200/70">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Print Resolution (Image Size)
              </span>
              <button
                type="button"
                onClick={() => setShowResInfo(!showResInfo)}
                className="text-amber-600 hover:text-amber-800 transition-colors"
                title="About image sizes"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
              gemini-3-pro-image-preview
            </span>
          </div>

          {showResInfo && (
            <p className="text-xs text-amber-800/90 mb-3 bg-white/70 p-2.5 rounded-lg border border-amber-200">
              Higher resolutions render sharper vector-like line contours when printed onto standard Letter or A4 coloring sheets. 1K is fast for previews, while 2K and 4K provide ultra-crisp thick borders for printing.
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => {
              const isSelected = resolution === res;
              return (
                <button
                  type="button"
                  key={res}
                  disabled={isGenerating}
                  onClick={() => setResolution(res)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-white border-amber-500 ring-2 ring-amber-400 text-amber-950 font-bold shadow-xs'
                      : 'bg-white/60 border-amber-200/80 text-neutral-600 hover:bg-white hover:text-neutral-900 font-medium'
                  }`}
                >
                  <span className="text-sm sm:text-base font-extrabold">{res}</span>
                  <span className="text-[11px] text-neutral-500 font-normal mt-0.5">
                    {res === '1K' ? 'Standard Print' : res === '2K' ? 'High-Def (2K)' : 'Ultra-Sharp (4K)'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generation Progress Display */}
        {isGenerating && (
          <div className="bg-amber-100/60 rounded-xl p-4 border border-amber-300">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1.5">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                {currentStepMessage || 'Generating coloring book...'}
              </span>
              <span>{Math.round(stepProgress)}%</span>
            </div>
            <div className="w-full bg-amber-200/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-700/80 mt-1.5 text-center">
              Generating thick-line art using gemini-3-pro-image-preview at {resolution} resolution. This ensures pristine coloring boundaries.
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          id="generateBookButton"
          type="submit"
          disabled={isGenerating || !childName.trim() || !theme.trim()}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Crafting {childName}'s Coloring Book...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate 5-Page Coloring Book for {childName || 'Child'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
