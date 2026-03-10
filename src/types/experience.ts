export interface Experience {
  id: string;
  title: string;
  description: string;
  scanCount: number;
  audioLocation?: string | null;
  storageLocation?: string | null;
  material?: string | null;
  period?: string | null;
  author?: string | null;
  yearCreated?: number | null;
  thumbnailURL?: string | null;
  category?: string | null;
  QRcodeUrl?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  feedbackCount?: number;
}
