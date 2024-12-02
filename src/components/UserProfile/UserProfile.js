import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URL 매개변수 가져오기
import axios from "axios";
import { Link } from "react-router-dom";
import MoviePoster from "../MoviePoster";
import "./UserProfile.css";
import mockUserProfile from './mockUserProfile.json'

const UserProfile = () => {
    const { user_id } = useParams(); // URL에서 user_id 가져오기
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [showAllFavorites, setShowAllFavorites] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (process.env.NODE_ENV === "development") {
                // 개발 모드에서 Mock data 사용
                setUserData(mockUserProfile);
                setIsFollowing(mockUserProfile.isFollowing);
                setFavoriteMovies(mockUserProfile.favorites || []);
                setLoading(false);
            } else {
                try {
                    const userResponse = await axios.get(`/api/accounts/profile/${user_id}/`, {
                        withCredentials: true,
                    });
                    const favoriteResponse = await axios.get(`/api/accounts/favorites/`, {
                        withCredentials: true,
                    });
                    setUserData(userResponse.data);
                    setFavoriteMovies(favoriteResponse.data);
                    setIsFollowing(userResponse.data.isFollowing);

                } catch (error) {
                    setError(error.response?.data?.message || "유저 정보를 불러오지 못했습니다.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    },  [user_id]);

    // 팔로우/언팔로우 핸들러
    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                // 언팔로우
                await axios.delete(`/api/accounts/follow/${user_id}`, {
                    withCredentials: true,
                });
                setIsFollowing(false);
            } else {
                // 팔로우
                await axios.post(`/api/accounts/`, { to_user_id: user_id }, {
                    withCredentials: true,
                });
                setIsFollowing(true);
            }
        } catch (error) {
            alert("팔로우/언팔로우에 실패했습니다.");
        }
    };

    const reviewsToShow = userData?.reviews ? (showAllReviews ? userData.reviews : userData.reviews.slice(0, 3)) : [];
    const favoriteMoviesToShow = favoriteMovies ? (showAllFavorites ? favoriteMovies : favoriteMovies.slice(0, 3)) : [];


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
                    <img src={userData.profilePicture} alt="프로필 이미지" className="profile-image" />
                </div>
                <div className="profile-info">
                    <p className="nickname">{userData.nickname}</p>
                </div>
                {/* 팔로우/언팔로우 버튼 */}
                <button 
                    className={`follow-button ${isFollowing ? "following" : ""}`}
                    onClick={handleFollowToggle}
                >
                    {isFollowing ? "언팔로우" : "팔로우"}
                </button>
            </div>

            {/* 팔로우/팔로잉 통계 섹션 */}
            <div className="stats-section">
                <Link to="/followers" className="stat">
                    <p className="stat-label">팔로워</p>
                    <p className="stat-value">{userData.followers}</p>
                </Link>
                <Link to="/following" className="stat">
                    <p className="stat-label">팔로잉</p>
                    <p className="stat-value">{userData.following}</p>
                </Link>
                {/* <div className="stat">
                    <p className="stat-label">좋아요</p>
                    <p className="stat-value">{userData.totalLikes || 0}</p>
                </div> */}
            </div>

            {/* 좋아한 영화 섹션 추가 */}
            <div className="favorite-movies-section">
                <h3>{userData.nickname}님이 좋아하는 영화</h3>
                <div className="favorite-movies-list">
                    {favoriteMovies.length === 0 ? (
                        <p>좋아하는 영화가 없습니다.</p>
                    ) : (
                        favoriteMoviesToShow.map((movie) => (
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="favorite-movie-card">
                                <MoviePoster title={movie.title} posterpath={movie.posterpath} />
                            </Link>
                        ))
                    )}
                </div>
                {/* 좋아한 영화가 4개 이상일 경우 더 보기 */}
                {favoriteMovies.length > 3 && !showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(true)} className="show-more-button">
                        더 보기
                    </button>
                )}
                {showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(false)} className="show-more-button">
                        접기
                    </button>
                )}
            </div>
            
            {/* 리뷰 섹션 추가 */}
            <div className="review-list-section">
                <h3>{userData.nickname}님의 리뷰</h3>
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
                {/* 리뷰가 4개 이상일 경우 "더 보기" 버튼 표시 */}
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

export default UserProfile;
