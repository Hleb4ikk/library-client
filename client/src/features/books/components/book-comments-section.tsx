import { useState } from "react";

import { Badge, Button, IconButton, Textarea } from "../../../components/shared";
import { createBookComment } from "../api/comments.api";
import type { BookComment } from "../types/book-details";

type BookCommentsSectionProps = {
    bookId: string;
    comments: BookComment[];
    isAuthorized: boolean;
    currentUsername?: string;
    onCommentCreated: (comment: BookComment) => void;
};

function getInitials(username: string) {
    return username.slice(0, 2).toUpperCase();
}

export default function BookCommentsSection({
    bookId,
    comments,
    isAuthorized,
    currentUsername = "user",
    onCommentCreated,
}: BookCommentsSectionProps) {
    const [commentText, setCommentText] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    async function handleCreateComment() {
        const trimmedText = commentText.trim();

        if (!trimmedText || !isAuthorized) return;

        setIsCreating(true);

        try {
            const createdComment = await createBookComment({
                bookId,
                text: trimmedText,
                authorName: currentUsername,
                authorInitials: getInitials(currentUsername),
            });

            onCommentCreated(createdComment);
            setCommentText("");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <section className="rounded-3xl border border-natural/20 bg-ivory-card px-4 py-6 shadow-page sm:px-8 sm:py-7">
            <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-7">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-fern">
                    <span className="text-apricot">▱</span>
                    Комментарии
                </h2>

                <span className="rounded-full bg-apricot px-2 py-1 text-sm font-bold text-ivory">
                    {comments.length}
                </span>
            </div>

            {isAuthorized ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <Textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Поделитесь мнением о книге..."
                        disabled={isCreating}
                        className="min-h-28 resize-none bg-ivory"
                    />

                    <Button
                        onClick={handleCreateComment}
                        disabled={isCreating || !commentText.trim()}
                        className="h-12 w-full shrink-0 rounded-2xl px-0 text-xl sm:mt-14 sm:w-12"
                        aria-label="Добавить комментарий"
                        title="Добавить комментарий"
                    >
                        +
                    </Button>
                </div>
            ) : (
                <div className="rounded-2xl border border-natural/20 bg-ivory px-5 py-4 text-sm text-natural-text">
                    Войдите в аккаунт, чтобы оставить комментарий.
                </div>
            )}

            <div className="mt-6 space-y-4">
                {comments.map((comment) => (
                    <article
                        key={comment.id}
                        className="overflow-hidden rounded-2xl border border-natural/20 bg-ivory px-4 py-4"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-natural text-sm font-bold text-ivory">
                                    {comment.authorInitials}
                                </div>

                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <p className="min-w-0 truncate font-bold text-fern">
                                        {comment.authorName}
                                    </p>

                                    {isAuthorized && comment.isOwn && (
                                        <Badge>Вы</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm text-natural-text sm:w-auto sm:justify-end">
                                <span className="shrink-0">
                                    {comment.createdAt}
                                </span>

                                {isAuthorized && comment.isOwn && (
                                    <div className="flex shrink-0 items-center gap-1">
                                        <IconButton
                                            aria-label="Редактировать"
                                            title="Редактировать"
                                            className="h-9 w-9 shrink-0 text-natural hover:text-apricot sm:h-10 sm:w-10 lg:h-11 lg:w-11"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                                            </svg>
                                        </IconButton>

                                        <IconButton
                                            aria-label="Удалить"
                                            title="Удалить"
                                            className="h-9 w-9 shrink-0 text-error hover:text-error sm:h-10 sm:w-10 lg:h-11 lg:w-11"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 6h18" />
                                                <path d="M8 6V4h8v2" />
                                                <path d="M19 6l-1 14H6L5 6" />
                                                <path d="M10 11v6" />
                                                <path d="M14 11v6" />
                                            </svg>
                                        </IconButton>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="mt-4 break-words text-base leading-6 text-fern">
                            {comment.text}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}