import axiosInstance from "../../../api/axios";
import type { UserComment } from "../types/user-comment";

type ApiSuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

type BackendUserComment = {
    id: number;
    text: string;
    book_olid: string;
    book_title: string;
    book_cover: string | null;
    created_at: string;
    updated_at: string | null;
};

type UserCommentsData = {
    comments: BackendUserComment[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type GetUserCommentsParams = {
    page: number;
    limit: number;
};

export type PaginatedUserCommentsResponse = {
    items: UserComment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    start: number;
    end: number;
};

function formatDate(value: string | null) {
    return value ? value.slice(0, 10) : "";
}

function mapComment(comment: BackendUserComment): UserComment {
    return {
        id: String(comment.id),
        bookId: comment.book_olid,
        bookTitle: comment.book_title,
        text: comment.text,
        createdAt: formatDate(comment.created_at),
    };
}

export async function getUserComments({
    page,
    limit,
}: GetUserCommentsParams): Promise<PaginatedUserCommentsResponse> {
    const response = await axiosInstance.get<
        ApiSuccessResponse<UserCommentsData>
    >("/me/comments", {
        params: { page, limit },
    });

    const { comments, pagination } = response.data.data;
    const items = comments.map(mapComment);

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

export async function updateUserComment(
    commentId: string,
    text: string,
): Promise<void> {
    await axiosInstance.put(`/comments/${commentId}`, { text });
}

export async function deleteUserComment(commentId: string): Promise<void> {
    await axiosInstance.delete(`/comments/${commentId}`);
}
