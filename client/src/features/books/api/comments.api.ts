import axiosInstance from "../../../api/axios";
import type { BookComment } from "../types/book-details";

type ApiSuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

type BackendComment = {
    id: number;
    text: string;
    createdAt: string;
    updatedAt: string | null;
    user: { id: number; username: string } | { id: null; username: null } | null;
};

type BookCommentsData = {
    comments: BackendComment[];
    total_results: number;
    limit: number;
    page: number;
};

function getInitials(username: string) {
    return username.slice(0, 2).toUpperCase();
}

function formatDate(value: string | null) {
    return value ? value.slice(0, 10) : "";
}

function mapComment(
    comment: BackendComment,
    bookId: string,
    currentUserId?: number,
): BookComment {
    const username = comment.user?.username ?? "Пользователь";

    return {
        id: String(comment.id),
        bookId,
        authorName: username,
        authorInitials: getInitials(username),
        text: comment.text,
        createdAt: formatDate(comment.createdAt),
        isOwn:
            currentUserId != null &&
            comment.user?.id != null &&
            comment.user.id === currentUserId,
    };
}

export async function getBookComments(
    bookId: string,
    page = 1,
    currentUserId?: number,
): Promise<{ comments: BookComment[]; total: number }> {
    const response = await axiosInstance.get<
        ApiSuccessResponse<BookCommentsData>
    >(`/books/${bookId}/comments`, {
        params: { page },
    });

    const data = response.data.data;

    return {
        comments: data.comments.map((comment) =>
            mapComment(comment, bookId, currentUserId),
        ),
        total: data.total_results,
    };
}

export async function createBookComment(
    bookId: string,
    text: string,
    currentUserId?: number,
): Promise<BookComment> {
    const response = await axiosInstance.post<ApiSuccessResponse<BackendComment>>(
        `/books/${bookId}/comments`,
        { text },
    );

    const created = mapComment(response.data.data, bookId, currentUserId);

    return { ...created, isOwn: true };
}
