import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './routes/Home';
import Navbar from './Navbar';
import GenreMovies from './components/MovieGenre/GenreMovies';
import SignUp from './components/Auth/SignUp';
import LogIn from './components/Auth/Login';
import MyPage from './components/MyPage/MyPage';
import ProfileUpdate from './components/MyPage/ProfileUpdate';
import UserProfile from './components/UserProfile/UserProfile';
import MovieDetail from './routes/Movie/MovieDetail';
import SearchResultPage from './routes/Search/SearchResultPage';
import ScrollToTop from './components/ScrollToTop';
import Followers from './components/Follow/Followers';
import Following from './components/Follow/Following';
import ChatApp from './routes/AIChat/ChatApp';
import CustomerSupport from './components/CustomerSupport/CustomerSupport';
import RecentMoviesNotice from './components/Notice/Notice';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
  <Router>
    <div className="app">
      <header className="app-header">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setIsSignUpOpen={setIsSignUpOpen} />
      </header>
      <main className="app-main">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/profile-update" element={<ProfileUpdate />} />
          <Route path="/profile/:user_id" element={<UserProfile />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/following" element={<Following />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/movies/:movieCd" element={<MovieDetail />} />
          <Route path="/genre/:genreId" element={<GenreMovies />} />
          <Route path="/chat" element={<ChatApp isLoggedIn={isLoggedIn} />} />
          <Route path="/notice" element={<RecentMoviesNotice />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 AI Movie Curator</p>
      </footer>
      {isSignUpOpen && <SignUp onClose={() => setIsSignUpOpen(false)} />}
    </div>
  </Router>
  );
}

export default App;
