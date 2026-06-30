import axiosInstance from "../../../api/axios";
import type { EStatusBadgeVariant } from "../../../enums/EStatusBadgeVariant";
import type { StatusFilter } from "../../../types/StatusFilter";
import type { Book } from "../types/book";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ReadingListItem = {
  id: number;
  book_olid: string;
  status: string;
  created_at: string;
  updated_at: string | null;
};

type ReadingListItemWithDetails = ReadingListItem & {
  title: string;
  cover: string | null;
};

type ReadingListData = {
  items: ReadingListItemWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetReadingListBooksParams = {
  page: number;
  limit: number;
  status?: StatusFilter;
};

export type PaginatedBooksResponse = {
  items: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  start: number;
  end: number;
};

function mapItemToBook(item: ReadingListItemWithDetails): Book {
  return {
    id: item.book_olid,
    title: item.title,
    author: "",
    cover: item.cover ?? undefined,
    status: item.status as EStatusBadgeVariant,
    likes: 0,
    readingListItemId: item.id,
  };
}

export async function getReadingListBooks({
  page,
  limit,
  status = "all",
}: GetReadingListBooksParams): Promise<PaginatedBooksResponse> {
  const params: Record<string, string | number> = { page, limit };

  if (status !== "all") {
    params.status = status;
  }

  const response = await axiosInstance.get<ApiSuccessResponse<ReadingListData>>(
    "/reading-list",
    { params },
  );

  const { items, pagination } = response.data.data;
  const books = items.map(mapItemToBook);

  const total = pagination.total;
  const offset = (pagination.page - 1) * limit;
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, total);

  return {
    items: books,
    total,
    page: pagination.page,
    limit,
    totalPages: pagination.totalPages,
    start,
    end,
  };
}

export async function addOrUpdateBookStatus(
  bookOlid: string,
  status: EStatusBadgeVariant,
): Promise<ApiSuccessResponse<ReadingListItem>> {
  const response = await axiosInstance.post<ApiSuccessResponse<ReadingListItem>>(
    "/reading-list",
    { book_olid: bookOlid, status },
  );
  return response.data;
}

export async function updateReadingListBookStatus(
  bookOlid: string,
  status: EStatusBadgeVariant,
): Promise<void> {
  await addOrUpdateBookStatus(bookOlid, status);
}

export async function removeBookFromReadingList(itemId: number): Promise<void> {
  await axiosInstance.delete(`/reading-list/${itemId}`);
}
