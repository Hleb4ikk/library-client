<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from "react-router-dom";

import BookDetailsPage from "./pages/book-details-page";
import HomePage from "./pages/home-page";
import ProfilePage from "./pages/profile-page";
import ReadingListPage from "./pages/reading-list-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reading-list" element={<ReadingListPage />} />
      </Routes>
    </BrowserRouter>
  );
=======
import AuthPage from "./pages/AuthPage";

function App() {
    return <AuthPage />;
>>>>>>> 0e4e3e78588c932f709166b29fa3b4bd7e32b7ef
}

export default App;