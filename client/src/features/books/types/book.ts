import type { EStatusBadgeVariant } from "../../../enums/EStatusBadgeVariant";

export type Book = {
  id: string;
  title: string;
  author: string;
  cover?: string;
  status?: EStatusBadgeVariant;
  likes: number;
  isLiked?: boolean;
};
