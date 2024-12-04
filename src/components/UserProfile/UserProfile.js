import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
    const { user_id } = useParams();
    const [userData, setUserData] = useState(null);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllFavorites, setShowAllFavorites] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("토큰이 없습니다. 로그인해주세요.");
                    return;
                }

                const response = await axios.get(`/api/accounts/profile/${user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setUserData(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "유저 데이터를 가져오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        const fetchFavoriteMovies = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    console.error("토큰이 없습니다. 로그인해주세요.");
                    return;
                }

                const response = await axios.get("/api/accounts/favorites/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setFavoriteMovies(response.data);
            } catch (error) {
                console.error("좋아하는 영화를 불러오지 못했습니다.", error);
            }
        };

        fetchUserData();
        fetchFavoriteMovies();
    }, [user_id]);

    const reviewsToShow = userData?.reviews
        ? showAllReviews
            ? userData.reviews
            : userData.reviews.slice(0, 3)
        : [];
    const favoriteMoviesToShow = favoriteMovies
        ? showAllFavorites
            ? favoriteMovies
            : favoriteMovies.slice(0, 3)
        : [];

    if (loading) {
        return <div className="user-profile-container">로딩 중...</div>;
    }

    if (error) {
        return <div className="user-profile-container">에러 발생: {error}</div>;
    }

    return (
        <div className="user-profile-container">
            <div className="profile-section">
                <div className="profile-picture">
                    <img
                        src={userData.profilePicture}
                        alt="프로필 이미지"
                        className="profile-image"
                    />
                </div>
                <div className="profile-info">
                    <p className="nickname">{userData.nickname}</p>
                </div>
            </div>

            <div className="favorite-movies-section">
                <h3>{userData.nickname}님이 좋아하는 영화</h3>
                <div className="favorite-movies-list">
                    {favoriteMovies.length === 0 ? (
                        <p>좋아하는 영화가 없습니다.</p>
                    ) : (
                        favoriteMoviesToShow.map((movie) => (
                            <Link
                                to={`/movie/api/movies/${movie.kobis?.movieCd}`}
                                key={movie.kobis?.movieCd}
                                className="favorite-movie-card"
                            >
                                <img
                                    src={movie.tmdb?.poster_url || "https://placehold.co/200x285?text=No+Poster"}
                                    alt={movie.kobis?.movieNm}
                                    className="favorite-movie-poster"
                                />
                                <p>{movie.kobis?.movieNm || "Unknown Title"}</p>
                            </Link>
                        ))
                    )}
                </div>
                {favoriteMovies.length > 3 && !showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(true)}>더 보기</button>
                )}
                {showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(false)}>접기</button>
                )}
            </div>

            <div className="review-list-section">
                <h3>{userData.nickname}님의 리뷰</h3>
                <div className="review-list">
                    {reviewsToShow.map((review) => (
                        <div key={review.id} className="review-card">
                            <p>{review.text}</p>
                        </div>
                    ))}
                </div>
                {userData.reviews.length > 3 && !showAllReviews && (
                    <button onClick={() => setShowAllReviews(true)}>더 보기</button>
                )}
                {showAllReviews && (
                    <button onClick={() => setShowAllReviews(false)}>접기</button>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
