import axiosInstance from "../../../api/axios";
import type { Book } from "../types/book";
import { toggleBookLike } from "./books.api";

type ApiSuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

type BackendUserBook = {
    olid: string;
    title: string;
    author: string;
    cover_url: string | null;
    is_liked: boolean;
    reading_list_status: string | null;
    likes_count: number;
};

type SearchUserBooksData = {
    books: BackendUserBook[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type GetLikedBooksParams = {
    page: number;
    limit: number;
};

export type PaginatedLikedBooksResponse = {
    items: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    start: number;
    end: number;
};

function mapToBook(book: BackendUserBook): Book {
    return {
        id: book.olid,
        title: book.title,
        author: book.author,
        cover: book.cover_url ?? undefined,
        likes: book.likes_count,
        isLiked: book.is_liked,
    };
}

export async function getLikedBooks({
    page,
    limit,
}: GetLikedBooksParams): Promise<PaginatedLikedBooksResponse> {
    const response = await axiosInstance.get<
        ApiSuccessResponse<SearchUserBooksData>
    >("/me/books/search", {
        params: { type: "likes", page, limit },
    });

    const { books, pagination } = response.data.data;
    const items = books.map(mapToBook);

    const total = pagination.total;
    const offset = (pagination.page - 1) * limit;
    const start = total === 0 ? 0 : offset + 1;
    const end = Math.min(offset + limit, total);

    return {
        items,
        total,
        page: pagination.page,
        limit,
        totalPages: pagination.totalPages,
        start,
        end,
    };
}

export async function removeLikedBook(bookId: string): Promise<void> {
    await toggleBookLike(bookId);
}
