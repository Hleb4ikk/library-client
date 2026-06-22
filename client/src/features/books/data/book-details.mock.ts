import type { BookDetails } from "../types/book-details";

export const mockBookDetailsList: BookDetails[] = [
    {
        id: "thinking-fast-and-slow",
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        year: 2011,
        cover: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg",
        description:
            "Daniel Kahneman explains how human thinking works through two systems: fast intuitive thinking and slow analytical thinking. The book helps understand decision-making, cognitive biases and the mistakes people often make when evaluating information.",
        likes: 142,
        isLiked: false,
        comments: [
            {
                id: "comment-1",
                bookId: "thinking-fast-and-slow",
                authorName: "alex_reads",
                authorInitials: "AL",
                text: "Очень интересная книга про мышление и принятие решений.",
                createdAt: "2024-03-15",
            },
            {
                id: "comment-2",
                bookId: "thinking-fast-and-slow",
                authorName: "maria_k",
                authorInitials: "MA",
                text: "Книга сложная, но полезная. Лучше читать медленно.",
                createdAt: "2024-04-02",
                isOwn: true,
            },
        ],
    },
    {
        id: "the-great-gatsby",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        cover: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
        description:
            "A classic novel about wealth, dreams, love and disillusionment in the Jazz Age. The story follows Jay Gatsby and his obsession with the past.",
        likes: 287,
        isLiked: true,
        comments: [
            {
                id: "comment-3",
                bookId: "the-great-gatsby",
                authorName: "booklover",
                authorInitials: "BL",
                text: "Красиво написанная книга, атмосфера очень сильная.",
                createdAt: "2024-02-21",
            },
        ],
    },
    {
        id: "1984",
        title: "1984",
        author: "George Orwell",
        year: 1949,
        cover: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
        description:
            "A dystopian novel about surveillance, propaganda, control and the loss of personal freedom in a totalitarian society.",
        likes: 412,
        isLiked: false,
        comments: [
            {
                id: "comment-4",
                bookId: "1984",
                authorName: "reader_one",
                authorInitials: "RO",
                text: "Книга тяжёлая, но очень важная.",
                createdAt: "2024-05-10",
            },
        ],
    },
    {
        id: "to-kill-a-mockingbird",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        cover: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
        description:
            "A powerful story about justice, childhood, prejudice and moral courage in the American South.",
        likes: 356,
        isLiked: true,
        comments: [],
    },
    {
        id: "pride-and-prejudice",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        year: 1813,
        cover: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
        description:
            "A classic novel about love, reputation, family and social expectations. The story follows Elizabeth Bennet and Mr. Darcy.",
        likes: 231,
        isLiked: false,
        comments: [],
    },
    {
        id: "the-little-prince",
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        year: 1943,
        cover: "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg",
        description:
            "A poetic philosophical tale about childhood, friendship, love and seeing what is truly important.",
        likes: 525,
        isLiked: false,
        comments: [],
    },
    {
        id: "brave-new-world",
        title: "Brave New World",
        author: "Aldous Huxley",
        year: 1932,
        cover: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg",
        description:
            "A dystopian novel about a future society shaped by technology, control, pleasure and social conditioning.",
        likes: 198,
        isLiked: false,
        comments: [],
    },
    {
        id: "the-hobbit",
        title: "The Hobbit",
        author: "J. R. R. Tolkien",
        year: 1937,
        cover: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
        description:
            "A fantasy adventure about Bilbo Baggins, a journey with dwarves, a dragon and the beginning of a much larger story.",
        likes: 674,
        isLiked: false,
        comments: [],
    },
];

export function getMockBookDetailsById(bookId?: string): BookDetails {
    return (
        mockBookDetailsList.find((book) => book.id === bookId) ??
        mockBookDetailsList[0]
    );
}