import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import BookDetailsPage from "./pages/book-details-page";
import HomePage from "./pages/home-page";
import ProfilePage from "./pages/profile-page";
import ReadingListPage from "./pages/reading-list-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reading-list" element={<ReadingListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;