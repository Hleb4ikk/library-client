import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { BookCard, Button, Input, Pagination } from "../components/shared";
import {
  getLikedBooks,
  removeLikedBook,
} from "../features/books/api/user-likes.api";
import type { Book } from "../features/books/types/book";
import ProfileLayout from "../features/profile/components/profile-layout";

const LIKED_BOOKS_PER_PAGE = 6;

type PaginationState = {
  total: number;
  totalPages: number;
  start: number;
  end: number;
};

export default function LikesPage() {
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    totalPages: 0,
    start: 0,
    end: 0,
  });

  const loadLikedBooks = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getLikedBooks({
        page,
        limit: LIKED_BOOKS_PER_PAGE,
        q: query,
      });

      setBooks(response.items);
      setCurrentPage(response.page);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        start: response.start,
        end: response.end,
      });
    } catch (e) {
      console.log(e);
      setBooks([]);
      setPagination({
        total: 0,
        totalPages: 0,
        start: 0,
        end: 0,
      });
      setError("Не удалось загрузить лайки");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLikedBooks(currentPage, searchQuery);
  }, [currentPage, searchQuery, loadLikedBooks]);

  function handleOpenBook(book: Book) {
    navigate(`/books/${book.id}`);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchValue.trim());
  }

  function handleResetSearch() {
    setSearchValue("");
    setSearchQuery("");
    setCurrentPage(1);
  }

  async function handleRemoveLike(bookId: string) {
    await removeLikedBook(bookId);

    const nextPage =
      books.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

    await loadLikedBooks(nextPage, searchQuery);
  }

  return (
    <ProfileLayout activeItem="likes">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
                <h1 className="text-2xl font-bold text-fern">Мои лайки</h1>
              </div>

              {!isLoading && pagination.total > 0 && (
                <p className="rounded-xl bg-natural/10 px-4 py-2 text-sm font-semibold text-natural-text">
                  {pagination.start}–{pagination.end} из {pagination.total}
                </p>
              )}
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-5 flex gap-2">
              <div className="flex-1">
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Поиск по названию или автору..."
                  className="bg-ivory"
                  aria-label="Поиск по понравившимся книгам"
                />
              </div>

              <Button type="submit" className="h-12 shrink-0 px-6">
                ⌕ Найти
              </Button>

              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResetSearch}
                  className="h-12 shrink-0 bg-natural/10 px-4 text-fern hover:bg-natural/20"
                >
                  Сброс
                </Button>
              )}
            </form>

            {error && (
              <div className="mt-6 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                {error}
              </div>
            )}

            <div className="mt-6">
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: LIKED_BOOKS_PER_PAGE }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-2xl border border-fern/10 bg-ivory-card shadow-card"
                      >
                        <div className="h-64 animate-pulse bg-natural/20" />

                        <div className="space-y-3 p-4">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-natural/20" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-natural/20" />

                          <div className="flex items-center justify-between pt-24">
                            <div className="h-9 w-20 animate-pulse rounded-full bg-natural/20" />
                            <div className="h-9 w-28 animate-pulse rounded-full bg-natural/20" />
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : books.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      title={book.title}
                      author={book.author}
                      cover={book.cover}
                      likes={book.likes}
                      isLiked={book.isLiked}
                      onOpen={() => handleOpenBook(book)}
                      onLike={() => handleRemoveLike(book.id)}
                    />
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="rounded-2xl border border-natural/25 bg-ivory px-6 py-12 text-center shadow-card">
                  <p className="text-lg font-bold text-fern">Ничего не найдено</p>

                  <p className="mx-auto mt-2 max-w-md text-sm text-natural-text">
                    По запросу «{searchQuery}» среди понравившихся книг ничего
                    нет.
                  </p>

                  <Button
                    variant="secondary"
                    onClick={handleResetSearch}
                    className="mx-auto mt-5 px-5 py-2"
                  >
                    Сбросить поиск
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-natural/25 bg-ivory px-6 py-12 text-center shadow-card">
                  <p className="text-lg font-bold text-fern">
                    Вы пока не лайкали книги
                  </p>

                  <p className="mx-auto mt-2 max-w-md text-sm text-natural-text">
                    Когда вы поставите лайк книге, она появится здесь.
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

      {!isLoading && books.length > 0 && (
        <Pagination
          page={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          className="mt-10"
        />
      )}
    </ProfileLayout>
  );
}
