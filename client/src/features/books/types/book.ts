import type { EStatusBadgeVariant } from "../../../enums/EStatusBadgeVariant";

export type Book = {
  id: string;
  title: string;
  author: string;
  cover?: string;
  blurhash?: string;
  status?: EStatusBadgeVariant;
  likes: number;
  isLiked?: boolean;
  readingListItemId?: number;
};
