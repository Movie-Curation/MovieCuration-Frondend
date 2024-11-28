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
import SearchResult from './routes/Search/SearchResult';
import ScrollToTop from './components/ScrollToTop';
import Followers from './components/Follow/Followers';
import Followings from './components/Follow/Followings';
import CustomerSupport from './components/CustomerSupport/CustomerSupport';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
  <Router>
    <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/profile-update" element={<ProfileUpdate />} />
      <Route path="/profile/:user_id" element={<UserProfile />} />
      <Route path="/customer-support" element={<CustomerSupport />} />
      <Route path="/followers" element={<Followers />} />
      <Route path="/followings" element={<Followings />} />
      <Route path="/search/:query" element={<SearchResult />} />
      <Route path="/movie/:movie_id" element={<MovieDetail />} />
      <Route path="/genre/:genreId" element={<GenreMovies />} />
    </Routes>
  </Router>
  );
}

export default App;
