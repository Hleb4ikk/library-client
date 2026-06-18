import axios from "axios";
import ApiError from "@/classes/ApiError.js";

const OPEN_LIBRARY_URL = "https://openlibrary.org";

export async function searchBooks(q: string | undefined, title: string | undefined, author: string | undefined, page: number) {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page.toString());
  
  if (q) searchParams.append("q", q);
  if (title) searchParams.append("title", title);
  if (author) searchParams.append("author", author);

  const response = await axios.get(`${OPEN_LIBRARY_URL}/search.json`, {
    params: Object.fromEntries(searchParams),
  });

  const docs = response.data.docs || [];
  
  const formattedBooks = docs.map((book: any) => ({
    olid: book.key ? book.key.replace("/works/", "") : null,
    title: book.title,
    author: book.author_name ? book.author_name.join(", ") : "Неизвестный автор",
    cover_edition_key: book.cover_edition_key || null,
    cover_url: book.cover_edition_key 
      ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg` 
      : null,
  }));

  return {
    books: formattedBooks,
    total_results: response.data.numFound || 0,
    page,
  };
}

export async function getBookDetails(olid: string) {
  try {
    const response = await axios.get(`${OPEN_LIBRARY_URL}/works/${olid}.json`);
    const data = response.data;

    let description = "";
    if (typeof data.description === "string") {
      description = data.description;
    } else if (data.description && data.description.value) {
      description = data.description.value;
    }

    return {
      olid,
      title: data.title,
      description: description || "Описание отсутствует.",
      covers: data.covers || [],
      cover_url: data.covers && data.covers.length > 0 
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` 
        : null,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new ApiError(404, "Книга не найдена в Open Library");
    }
    throw error;
  }
}