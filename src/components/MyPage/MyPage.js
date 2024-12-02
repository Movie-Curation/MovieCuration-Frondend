import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import MoviePoster from "../MoviePoster";
import { FaGear } from "react-icons/fa6";
import mockUserData from './mockUserData.json'
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
            if (process.env.NODE_ENV === "development") {
                setUserData(mockUserData);
                setFavoriteMovies(mockUserData.favorites);
                setLoading(false); // 개발자 모드에서 Mockup Data 사용
            } else {
                try {
                    const response = await axios.get("api/accounts/profile/", {
                        withCredentials: true, // 쿠키 인증이 필요한 경우 추가, api 엔드포인트는 api/profile/mypage
                    });
                    setUserData(response.data);
                } catch (error) {
                    setError(error.response?.data?.message || "Failed to fetch user data"); // 에러 메시지 저장
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchFavoriteMovies = async () => {
            try {
                const response = await axios.get("api/accounts/favorites", {
                    withCredentials: true, // 쿠키 인증이 필요한 경우 추가 API 엔드포인트는 api/favorites
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

    const reviewsToShow = userData?.reviews ? (showAllReviews ? userData.reviews : userData.reviews.slice(0, 3)) : [];
    const favoriteMoviesToShow = favoriteMovies ? (showAllFavorites ? favoriteMovies : favoriteMovies.slice(0, 3)) : [];

    if (loading) {
        return <div className="mypage-container">로딩 중...</div>;
    }

    if (error) {
        return <div className="mypage-container">에러 발생: {error}</div>;
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
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="favorite-movie-card">
                                <MoviePoster title={movie.title} posterpath={movie.posterpath} />
                            </Link>
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
                    {userData && userData.reviews.length === 0 ? (
                        <p>리뷰가 없습니다.</p>
                    ) : (
                        reviewsToShow?.map((review) => (
                            <Link to={`/movie/${review.movie_id}`} key={review.movie_id} className="review-card">
                                <MoviePoster title={review.title} posterpath={review.posterpath} />
                                <div className="review-text">
                                    <p>{review.text}</p>
                                </div>
                            </Link>
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