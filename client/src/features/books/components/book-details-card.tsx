import { Button } from "../../../components/shared";
import type { BookDetails } from "../types/book-details";

type BookDetailsCardProps = {
    book: BookDetails;
    isAuthorized: boolean;
    onLike: () => void;
};

export default function BookDetailsCard({
    book,
    isAuthorized,
    onLike,
}: BookDetailsCardProps) {
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

                                <Button
                                    variant="secondary"
                                    className="gap-2 px-5 py-3"
                                >
                                    📖 Читаю сейчас
                                </Button>
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