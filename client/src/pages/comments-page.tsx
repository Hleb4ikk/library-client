import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, IconButton, Pagination, Textarea } from "../components/shared";
import {
    deleteUserComment,
    getUserComments,
    updateUserComment,
} from "../features/profile/api/user-comments.api";
import ProfileSidebar from "../features/profile/components/profile-sidebar";
import type { UserComment } from "../features/profile/types/user-comment";
import AppHeader from "../layouts/app-header";

const COMMENTS_PER_PAGE = 3;

type PaginationState = {
    total: number;
    totalPages: number;
    start: number;
    end: number;
};

function EditIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 sm:h-6 sm:w-6"
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
    );
}

function UserCommentItem({
    comment,
    editingCommentId,
    editingText,
    isSaving,
    onOpenBook,
    onStartEdit,
    onCancelEdit,
    onEditingTextChange,
    onSaveEdit,
    onDelete,
}: {
    comment: UserComment;
    editingCommentId: string | null;
    editingText: string;
    isSaving: boolean;
    onOpenBook: (bookId: string) => void;
    onStartEdit: (comment: UserComment) => void;
    onCancelEdit: () => void;
    onEditingTextChange: (text: string) => void;
    onSaveEdit: (commentId: string) => void;
    onDelete: (commentId: string) => void;
}) {
    const isEditing = editingCommentId === comment.id;

    return (
        <article className="rounded-2xl border border-natural/25 bg-ivory px-5 py-5 shadow-card transition hover:shadow-page">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <button
                    type="button"
                    onClick={() => onOpenBook(comment.bookId)}
                    className="cursor-pointer text-left text-base font-bold text-apricot transition hover:text-fern"
                    aria-label={`Открыть книгу ${comment.bookTitle}`}
                >
                    {comment.bookTitle}
                </button>

                <div className="flex shrink-0 items-center gap-2 text-sm text-natural-text">
                    <span>{comment.createdAt}</span>

                    <IconButton
                        onClick={() => onStartEdit(comment)}
                        aria-label="Редактировать комментарий"
                        title="Редактировать"
                        className="h-9 w-9 shrink-0 border-transparent bg-transparent px-0 py-0 text-natural hover:bg-natural/10 hover:text-apricot sm:h-10 sm:w-10"
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => onDelete(comment.id)}
                        aria-label="Удалить комментарий"
                        title="Удалить"
                        className="h-9 w-9 shrink-0 border-transparent bg-transparent px-0 py-0 text-error hover:bg-error/10 hover:text-error sm:h-10 sm:w-10"
                    >
                        <TrashIcon />
                    </IconButton>
                </div>
            </div>

            {isEditing ? (
                <div className="mt-4">
                    <Textarea
                        value={editingText}
                        onChange={(event) => onEditingTextChange(event.target.value)}
                        className="min-h-28 bg-ivory-card"
                        placeholder="Отредактируйте комментарий..."
                        disabled={isSaving}
                    />

                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={onCancelEdit}
                            disabled={isSaving}
                            className="px-4 py-2"
                        >
                            Отмена
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => onSaveEdit(comment.id)}
                            disabled={isSaving || !editingText.trim()}
                            className="px-4 py-2"
                        >
                            Сохранить
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="mt-4 break-words text-base leading-7 text-fern">
                    {comment.text}
                </p>
            )}
        </article>
    );
}

export default function CommentsPage() {
    const navigate = useNavigate();

    const [comments, setComments] = useState<UserComment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    const [pagination, setPagination] = useState<PaginationState>({
        total: 0,
        totalPages: 0,
        start: 0,
        end: 0,
    });

    const loadComments = useCallback(async (page: number) => {
        setIsLoading(true);
        setError("");

        try {
            const response = await getUserComments({
                page,
                limit: COMMENTS_PER_PAGE,
            });

            setComments(response.items);
            setCurrentPage(response.page);
            setPagination({
                total: response.total,
                totalPages: response.totalPages,
                start: response.start,
                end: response.end,
            });
        } catch {
            setComments([]);
            setPagination({
                total: 0,
                totalPages: 0,
                start: 0,
                end: 0,
            });
            setError("Не удалось загрузить комментарии");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadComments(currentPage);
    }, [currentPage, loadComments]);

    function handleOpenBook(bookId: string) {
        navigate(`/books/${bookId}`);
    }

    function handleStartEdit(comment: UserComment) {
        setEditingCommentId(comment.id);
        setEditingText(comment.text);
    }

    function handleCancelEdit() {
        setEditingCommentId(null);
        setEditingText("");
    }

    async function handleSaveEdit(commentId: string) {
        const trimmedText = editingText.trim();

        if (!trimmedText) return;

        setIsSaving(true);

        try {
            await updateUserComment(commentId, trimmedText);
            handleCancelEdit();
            await loadComments(currentPage);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteComment(commentId: string) {
        await deleteUserComment(commentId);

        if (editingCommentId === commentId) {
            handleCancelEdit();
        }

        const nextPage =
            comments.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

        await loadComments(nextPage);
    }

    return (
        <div className="min-h-screen bg-ivory text-fern">
            <AppHeader />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
                    <ProfileSidebar activeItem="comments" />

                    <section className="rounded-3xl border border-natural/20 bg-ivory-card p-5 shadow-page sm:p-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-fern">Комментарии</h1>

                                <p className="mt-2 text-sm text-natural-text">
                                    Здесь собраны ваши комментарии к книгам. Комментарий можно
                                    отредактировать, удалить или открыть книгу из списка.
                                </p>
                            </div>

                            {!isLoading && pagination.total > 0 && (
                                <p className="rounded-xl bg-natural/10 px-4 py-2 text-sm font-semibold text-natural-text">
                                    {pagination.start}–{pagination.end} из {pagination.total}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="mt-6 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 space-y-4">
                            {isLoading ? (
                                Array.from({ length: COMMENTS_PER_PAGE }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-natural/20 bg-ivory px-5 py-5 shadow-card"
                                    >
                                        <div className="flex animate-pulse flex-col gap-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="h-5 w-48 rounded bg-natural/20" />
                                                <div className="h-5 w-32 rounded bg-natural/20" />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="h-4 w-full rounded bg-natural/20" />
                                                <div className="h-4 w-2/3 rounded bg-natural/20" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <UserCommentItem
                                        key={comment.id}
                                        comment={comment}
                                        editingCommentId={editingCommentId}
                                        editingText={editingText}
                                        isSaving={isSaving}
                                        onOpenBook={handleOpenBook}
                                        onStartEdit={handleStartEdit}
                                        onCancelEdit={handleCancelEdit}
                                        onEditingTextChange={setEditingText}
                                        onSaveEdit={handleSaveEdit}
                                        onDelete={handleDeleteComment}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-natural/25 bg-ivory px-6 py-12 text-center shadow-card">
                                    <p className="text-lg font-bold text-fern">
                                        Вы пока не оставляли комментарии
                                    </p>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-natural-text">
                                        Когда вы напишете комментарий к книге, он появится здесь.
                                    </p>

                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate("/")}
                                        className="mx-auto mt-5 px-5 py-2"
                                    >
                                        Найти книги
                                    </Button>
                                </div>
                            )}
                        </div>

                        {!isLoading && comments.length > 0 && (
                            <Pagination
                                page={currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={setCurrentPage}
                                className="mt-7"
                            />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}