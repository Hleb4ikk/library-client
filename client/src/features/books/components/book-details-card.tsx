import { Badge, Button, Dropdown } from "../../../components/shared";
import type { DropdownOption } from "../../../components/shared/dropdown";
import { EStatusBadgeVariant } from "../../../enums/EStatusBadgeVariant";
import type { BookDetails } from "../types/book-details";

type BookDetailsCardProps = {
    book: BookDetails;
    isAuthorized: boolean;
    onLike: () => void;
    onStatusChange?: (status: EStatusBadgeVariant) => void;
    isStatusLoading?: boolean;
};

export default function BookDetailsCard({
    book,
    isAuthorized,
    onLike,
    onStatusChange,
    isStatusLoading = false,
}: BookDetailsCardProps) {
    const statusOptions: DropdownOption[] = [
        {
            value: EStatusBadgeVariant.WANT,
            label: "Хочу прочитать",
            icon: "📚",
        },
        {
            value: EStatusBadgeVariant.READING,
            label: "Читаю сейчас",
            icon: "📖",
        },
        {
            value: EStatusBadgeVariant.DONE,
            label: "Прочитано",
            icon: "✅",
        },
    ];

    function getStatusBadgeVariant(
        status: EStatusBadgeVariant
    ): "want" | "reading" | "done" {
        switch (status) {
            case EStatusBadgeVariant.WANT:
                return "want";
            case EStatusBadgeVariant.READING:
                return "reading";
            case EStatusBadgeVariant.DONE:
                return "done";
        }
    }
    return (
        <section className="overflow-hidden rounded-3xl border border-natural/20 bg-ivory-card shadow-page">
            <div className="grid gap-0 md:grid-cols-[260px_1fr]">
                <div className="h-80 overflow-hidden bg-ivory-muted md:h-full">
                    {book.cover ? (
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm font-semibold text-natural">
                            Нет обложки
                        </div>
                    )}
                </div>

                <div className="flex flex-col px-6 py-7 sm:px-8">
                    <h1 className="font-playfair text-3xl font-bold text-fern sm:text-4xl">
                        {book.title}
                    </h1>

                    <p className="mt-3 text-sm text-natural-text sm:text-base">
                        {book.author} · {book.year}
                    </p>

                    <p className="mt-7 max-w-3xl text-base leading-7 text-natural-text">
                        {book.description}
                    </p>

                    <div className="mt-8">
                        {isAuthorized ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant={book.isLiked ? "primary" : "outline"}
                                        onClick={onLike}
                                        className="gap-2 px-5 py-3"
                                    >
                                        ♡ Нравится
                                        <span className="rounded-full bg-ivory/70 px-2 py-0.5 text-xs text-apricot">
                                            {book.likes}
                                        </span>
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-fern">
                                            Статус чтения:
                                        </span>
                                        {book.readingStatus && (
                                            <Badge
                                                variant={getStatusBadgeVariant(
                                                    book.readingStatus
                                                )}
                                            >
                                                {book.readingStatus}
                                            </Badge>
                                        )}
                                    </div>

                                    <Dropdown
                                        options={statusOptions}
                                        value={book.readingStatus || null}
                                        onChange={(value) =>
                                            onStatusChange?.(value as EStatusBadgeVariant)
                                        }
                                        placeholder="Добавить в список чтения"
                                        disabled={isStatusLoading}
                                        className="max-w-xs"
                                    />
                                    {isStatusLoading && (
                                        <span className="text-xs text-natural-text">
                                            Обновление статуса...
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-natural/20 bg-ivory px-5 py-4 text-sm text-natural-text">
                                Войдите в аккаунт, чтобы поставить лайк и добавить
                                книгу в список чтения.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}