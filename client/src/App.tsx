import { BrowserRouter, Route, Routes } from "react-router-dom";

import BookDetailsPage from "./pages/book-details-page";
import HomePage from "./pages/home-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;