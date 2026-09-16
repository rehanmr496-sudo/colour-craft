export type ImageResolution = '1K' | '2K' | '4K';

export type ChatModelOption = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

export interface ColoringPage {
  pageNumber: number;
  title: string;
  description: string;
  imagePrompt: string;
  imageUrl: string | null;
  status: 'idle' | 'generating' | 'ready' | 'error';
  errorMessage: string | null;
}

export interface ColoringBook {
  id: string;
  childName: string;
  theme: string;
  bookTitle: string;
  bookSubtitle: string;
  coverImagePrompt: string;
  coverImageUrl: string | null;
  coverStatus: 'idle' | 'generating' | 'ready' | 'error';
  coverError: string | null;
  imageResolution: ImageResolution;
  pages: ColoringPage[];
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  modelUsed?: string;
}
