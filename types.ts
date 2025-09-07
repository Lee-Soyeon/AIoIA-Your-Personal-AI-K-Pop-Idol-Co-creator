export interface OriginalImage {
  base64: string;
  mimeType: string;
  // Optional: only present for user-uploaded files
  file?: File;
  url?: string;
}

export interface GeneratedImage {
  base64: string | null;
  text: string | null;
}

export interface Message {
    id: string;
    sender: 'user' | 'ai';
    content: React.ReactNode;
    suggestions?: string[];
}