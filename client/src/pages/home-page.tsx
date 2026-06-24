import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Logo, Pagination } from "../components/shared";
import { useUser } from "../features/auth/user-provider";
import {
  getBooks,
  getCachedBooks,
  isRequestAborted,
  validateSearchQuery,
} from "../features/books/api/books.api";
import BookGrid from "../features/books/components/book-grid";
import BookSearchForm from "../features/books/components/book-search-form";
import type { Book } from "../features/books/types/book";
import AppHeader from "../layouts/app-header";

export default function HomePage() {
  const { user } = useUser();
  const isAuthorized = Boolean(user);

  const [books, setBooks] = useState<Book[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBooksLoading, setIsBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    let isActualRequest = true;

    async function loadBooks() {
      const validationError = validateSearchQuery(searchQuery);

      if (validationError) {
        setBooks([]);
        setTotalPages(1);
        setBooksError(validationError);
        setIsBooksLoading(false);
        return;
      }

      const cachedBooks = getCachedBooks(searchQuery, currentPage);

      if (cachedBooks) {
        setBooks(cachedBooks.items);
        setTotalPages(cachedBooks.totalPages);

        setIsBooksLoading(false);
      } else {
        setIsBooksLoading(true);
        setBooks([]);
      }

      setBooksError(null);

      try {
        const result = await getBooks({
          query: searchQuery,
          page: currentPage,
          signal: abortController.signal,
        });

        if (!isActualRequest) {
          return;
        }

        setBooks(result.items);
        setTotalPages(result.totalPages);
        setBooksError(null);
      } catch (error) {
        if (!isActualRequest || isRequestAborted(error)) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Ошибка поиска книг";

        setBooksError(message);
      } finally {
        if (isActualRequest) {
          setIsBooksLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      isActualRequest = false;
      abortController.abort();
    };
  }, [searchQuery, currentPage, reloadKey]);

  function handleRetrySearch() {
    setBooksError(null);
    setReloadKey((key) => key + 1);
  }

  function handleSearchSubmit() {
    const trimmedSearchValue = searchValue.trim();
    const validationError = validateSearchQuery(trimmedSearchValue);

    if (validationError) {
      setBooksError(validationError);
      setBooks([]);
      setTotalPages(1);
      setIsBooksLoading(false);
      return;
    }

    setBooksError(null);
    setCurrentPage(1);
    setSearchQuery(trimmedSearchValue);
  }

  function handleResetSearch() {
    setSearchValue("");
    setSearchQuery("");
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    document.getElementById("books-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div id="top" className="min-h-screen bg-ivory text-fern">
      <AppHeader />

      <main>
        <section className="bg-linear-to-br from-fern via-fern to-fern-dark px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <Logo variant="hero" className="justify-center" />

            <p className="mx-auto mt-6 max-w-3xl text-base text-natural sm:text-lg">
              Открывайте новые книги, делитесь впечатлениями, формируйте
              библиотеку мечты
            </p>

            <BookSearchForm
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearchSubmit}
            />
          </div>
        </section>

        <section
          id="books-section"
          className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-fern sm:text-2xl">
                {searchQuery ? "Результаты поиска" : "Популярные книги"}
              </h2>
            </div>

            {searchQuery && (
              <Button
                variant="outline"
                className="w-fit px-4 py-2"
                onClick={handleResetSearch}
              >
                Сбросить поиск
              </Button>
            )}
          </div>

          {isBooksLoading && books.length === 0 ? (
            <div className="rounded-2xl border border-natural/25 bg-ivory-card px-6 py-12 text-center shadow-card">
              <p className="text-lg font-bold text-fern">Загружаем книги...</p>
            </div>
          ) : booksError && books.length === 0 ? (
            <div className="rounded-2xl border border-error/25 bg-error/10 px-6 py-12 text-center shadow-card">
              <p className="text-lg font-bold text-error">{booksError}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleRetrySearch}
              >
                Повторить
              </Button>
            </div>
          ) : books.length > 0 ? (
            <>
              {booksError && (
                <div className="mb-4 rounded-xl border border-error/25 bg-error/10 px-4 py-3 text-sm text-error">
                  {booksError}
                </div>
              )}

              {isBooksLoading && (
                <p className="mb-4 text-sm text-natural-text">
                  Обновляем результаты...
                </p>
              )}

              <BookGrid
                books={books}
                isAuthorized={isAuthorized}
                onOpenBook={(book) => navigate(`/books/${book.id}`)}
                onLikeBook={(book) => console.log("like book", book.id)}
              />

              <Pagination
                className="mt-10"
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-natural/25 bg-ivory-card px-6 py-12 text-center shadow-card">
              <p className="text-lg font-bold text-fern">Ничего не найдено</p>
              <p className="mt-2 text-sm text-natural-text">
                Попробуйте изменить запрос или поискать книгу по автору.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
