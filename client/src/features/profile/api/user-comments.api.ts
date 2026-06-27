import { mockUserComments } from "../data/user-comments.mock";
import type { UserComment } from "../types/user-comment";

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

let userComments: UserComment[] = [...mockUserComments];

function delay(ms = 400) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function getUserComments({
    page,
    limit,
}: GetUserCommentsParams): Promise<PaginatedUserCommentsResponse> {
    await delay();

    const total = userComments.length;
    const totalPages = Math.ceil(total / limit);
    const safePage =
        totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);

    const offset = (safePage - 1) * limit;
    const start = total === 0 ? 0 : offset + 1;
    const end = Math.min(offset + limit, total);
    const items = userComments.slice(offset, offset + limit);

    return {
        items,
        total,
        page: safePage,
        limit,
        totalPages,
        start,
        end,
    };
}

export async function updateUserComment(
    commentId: string,
    text: string,
): Promise<UserComment> {
    await delay(250);

    const trimmedText = text.trim();

    userComments = userComments.map((comment) =>
        comment.id === commentId ? { ...comment, text: trimmedText } : comment,
    );

    const updatedComment = userComments.find(
        (comment) => comment.id === commentId,
    );

    if (!updatedComment) {
        throw new Error("Comment not found");
    }

    return updatedComment;
}

export async function deleteUserComment(commentId: string): Promise<void> {
    await delay(250);

    userComments = userComments.filter((comment) => comment.id !== commentId);
}

export async function resetMockUserComments(): Promise<void> {
    await delay(250);

    userComments = [...mockUserComments];
}