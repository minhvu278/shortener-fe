// types/link.ts
export interface Link {
  id: number;
  title?: string;
  originalUrl: string;
  shortCode: string;
  slug?: string;
  expiresAt?: Date | null;
  createdAt?: Date;
}