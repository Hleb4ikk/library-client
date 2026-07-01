import { BookCard } from "../../../components/shared";
import type { Book } from "../types/book";

type BookGridProps = {
    books: Book[];
    isAuthorized?: boolean;
    onOpenBook?: (book: Book) => void;
    onLikeBook?: (book: Book) => void;
};

export default function BookGrid({
    books,
    isAuthorized = false,
    onOpenBook,
    onLikeBook,
}: BookGridProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
                <BookCard
                    key={book.id}
                    title={book.title}
                    author={book.author}
                    cover={book.cover}
                    blurhash={book.blurhash}
                    status={isAuthorized ? book.status : undefined}
                    likes={book.likes}
                    isLiked={isAuthorized ? book.isLiked : false}
                    onOpen={() => onOpenBook?.(book)}
                    onLike={
                        isAuthorized
                            ? () => onLikeBook?.(book)
                            : undefined
                    }
                />
            ))}
        </div>
    );
}