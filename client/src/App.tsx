import { BrowserRouter, Route, Routes } from "react-router-dom";

import BookDetailsPage from "./pages/book-details-page";
import HomePage from "./pages/home-page";
import ProfilePage from "./pages/profile-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
