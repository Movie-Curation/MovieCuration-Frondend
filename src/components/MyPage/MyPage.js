import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import './MyPage.css';

const MyPage = () => {
    const [userData, setUserData] = useState(null);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllFavorites, setShowAllFavorites] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect (() => {
        // 백엔드에서 사용자 데이터 가져오기
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("토큰이 없습니다. 로그인해주세요.")
                    return;
                }

                const response = await axios.get("/api/accounts/profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true, // 쿠키 인증이 필요한 경우 추가
                });
                setUserData(response.data);
            } catch (error) {
                    setError(error.response?.data?.message || "Failed to fetch user data"); // 에러 메시지 저장
            } finally {
                    setLoading(false);
            }
            }
        
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
                    withCredentials: true, // 쿠키 인증이 필요한 경우 추가
                });
                setFavoriteMovies(response.data);
            } catch (error) {
                console.error("좋아하는 영화를 불러오는 데 실패했습니다: ", error);
            }
        };

        fetchUserData();
        fetchFavoriteMovies();
    }, []);

    const navigate = useNavigate();

    const handleProfileUpdateClick = () => {
        navigate("/profile-update");
    };

    const reviewsToShow = userData?.reviews && userData.reviews.length > 0 ? (showAllReviews ? userData.reviews : userData.reviews.slice(0, 3)) : [];
    const favoriteMoviesToShow = favoriteMovies?.length > 0 ? (showAllFavorites ? favoriteMovies : favoriteMovies.slice(0, 3)) : [];

    if (loading) {
        return <div className="mypage-container">로딩 중...</div>;
    }

    if (error) {
        return <div className="mypage-container">에러 발생: {error}</div>;
    }

    if (!userData) {
        return <div className="mypage-container">사용자 데이터가 없습니다.</div>;
    }

    return (
        <div className="mypage-container">
            {/* 사용자 프로필 섹션 */}
            <div className="profile-section">
                <div className="profile-picture">
                    {userData.profilePicture ? (
                        <img
                            src={userData.profilePicture}
                            alt="사용자 프로필"
                            className="profile-image"
                        />
                    ) : (
                        "프로필 이미지"
                    )}
                </div>
                <div className="profile-info">
                    <p className="nickname">{userData.nickname}</p>
                </div>
                <div className="profile-option">
                    <FaGear className="profile-update" onClick={handleProfileUpdateClick} />
                </div>
            </div>
            {/* 팔로우/팔로잉/좋아요 섹션 */}
            <div className="stats-section">
                <Link to="/followers" className="stat">
                    <p className="stat-label">팔로우</p>
                    <p className="stat-value">{userData.followers}</p>
                </Link>
                <Link to="/following" className="stat">
                    <p className="stat-label">팔로잉</p>
                    <p className="stat-value">{userData.following}</p>
                </Link>
                {/* <div className="stat">
                    <p className="stat-label">전체 좋아요 수</p>
                    <p className="stat-value">{userData.totalLikes}</p>
                </div> */}
            </div>

            {/* 내가 최근 쓴 리뷰 섹션
            <div className="recent-review-section">
                <h3>내가 최근 쓴 리뷰</h3>
                <div className="recent-review">
                    {userData.recentReview || "최근 작성한 리뷰가 없습니다."}
                </div>
            </div> */}

            {/* 내가 좋아한 영화 섹션 */}
            <div className="favorite-movies-section">
                <h3>내가 좋아한 영화</h3>
                <div className="favorite-movies-list">
                {favoriteMovies.length === 0 ? (
                        <p>좋아한 영화가 없습니다.</p>
                    ) : (
                        favoriteMoviesToShow.map((movie) => (
                            <div
                                key={movie.kobis?.movieCd}
                                className="favorite-movie-card"
                                onClick={() => navigate(`/movie/api/movies/${movie.kobis?.movieCd}`)}
                                style={{ cursor: "pointer" }}
                            >
                                {movie.tmdb?.poster_url ? (
                                    <img
                                        className="favorite-movie-poster"
                                        src={movie.tmdb.poster_url}
                                        alt={movie.kobis?.movieNm}
                                    />
                                ) : (
                                    <div className="favorite-movie-no-poster">
                                        <img src="https://placehold.co/200x285?text=No+Poster" alt="No Poster Available" />
                                    </div>
                                )}
                                <h3>{movie.kobis?.movieNm || "Unknown Title"}</h3>
                                <p>{movie.kobis?.prdtYear || "N/A"}</p>
                                <p>{movie.kobis?.nationNm || "N/A"}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* "더 보기" 버튼 표시 */}
                {favoriteMovies.length > 3 && !showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(true)} className="show-more-button">
                        더 보기
                    </button>
                )}

                {/* "접기" 버튼 표시 */}
                {showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(false)} className="show-more-button">
                        접기
                    </button>
                )}
            </div>

            {/* 내가 쓴 리뷰 섹션 */}
            <div className="review-list-section">
                <h3>내가 쓴 리뷰 리스트</h3>
                <div className="review-list">
                    {userData?.reviews?.length === 0 ? (
                        <p>리뷰가 없습니다.</p>
                    ) : (
                        reviewsToShow.map((review) => (
                            <div
                                key={review.id}
                                className="review-card"
                                onClick={() => navigate(`/movie/api/movies/${review.movie.kobis?.movieCd}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="review-card-content">
                                    {/* 영화 포스터 */}
                                    {review.movie.tmdb?.poster_url ? (
                                        <img
                                            className="review-movie-poster"
                                            src={review.movie.tmdb.poster_url}
                                            alt={review.movie.kobis?.movieNm || "Poster"}
                                        />
                                    ) : (
                                        <div className="review-no-poster">
                                            <img src="https://placehold.co/200x285?text=No+Poster" alt="No Poster Available" />
                                        </div>
                                    )}

                                    {/* 영화 정보 및 리뷰 내용 */}
                                    <div className="review-text-content">
                                        <h4>{review.movie.kobis?.movieNm || "Unknown Title"}</h4>
                                        <p>{review.movie.kobis?.prdtYear || "N/A"}</p>
                                        <p>{review.movie.kobis?.nationNm || "N/A"}</p>
                                        <p className="review-text">"{review.text}"</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* "더 보기" 버튼 표시 */}
                {userData?.reviews.length > 3 && !showAllReviews && (
                    <button onClick={() => setShowAllReviews(true)} className="show-more-button">
                        더 보기
                    </button>
                )}

                {/* "접기" 버튼 표시 */}
                {showAllReviews && (
                    <button onClick={() => setShowAllReviews(false)} className="show-more-button">
                        접기
                    </button>
                )}
            </div>
        </div>        
    );
};

export default MyPage;