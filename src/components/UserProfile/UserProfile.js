import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
    const { user_id } = useParams();
    const [userData, setUserData] = useState({ reviews: { data: [] } });
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showAllFavorites, setShowAllFavorites] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const navigate = useNavigate();

    // const mockupUserData = {
    //     userId: "user_456",
    //     nickname: "Test5",
    //     profilePicture: "https://placehold.co/150x150?text=User+Image",
    //     followers: 0,
    //     following: 1,
    //     isFollowing: false,
    //     reviews: [
    //         {
    //             id: 1,
    //             movie: {
    //                 kobis: { movieCd: "004", movieNm: "The Shawshank Redemption", prdtYear: "1994", nationNm: "USA" },
    //                 tmdb: { poster_url: "https://placehold.co/200x285?text=Shawshank+Poster" },
    //             },
    //             text: "An absolute masterpiece. Every scene is pure magic.",
    //         },
    //         {
    //             id: 2,
    //             movie: {
    //                 kobis: { movieCd: "005", movieNm: "The Godfather", prdtYear: "1972", nationNm: "USA" },
    //                 tmdb: { poster_url: "https://placehold.co/200x285?text=Godfather+Poster" },
    //             },
    //             text: "One of the greatest movies ever made. Iconic performances.",
    //         },
    //         {
    //             id: 3,
    //             movie: {
    //                 kobis: { movieCd: "006", movieNm: "Spirited Away", prdtYear: "2001", nationNm: "Japan" },
    //                 tmdb: { poster_url: "https://placehold.co/200x285?text=Spirited+Away+Poster" },
    //             },
    //             text: "A magical journey into the world of Studio Ghibli.",
    //         },
    //     ],
    // };
    
    // const mockupFavoriteMovies = [
    //     {
    //         kobis: { movieCd: "007", movieNm: "Inception", prdtYear: "2010", nationNm: "USA" },
    //         tmdb: { poster_url: "https://placehold.co/200x285?text=Inception+Poster" },
    //     },
    //     {
    //         kobis: { movieCd: "008", movieNm: "Parasite", prdtYear: "2019", nationNm: "South Korea" },
    //         tmdb: { poster_url: "https://placehold.co/200x285?text=Parasite+Poster" },
    //     },
    //     {
    //         kobis: { movieCd: "009", movieNm: "The Dark Knight", prdtYear: "2008", nationNm: "USA" },
    //         tmdb: { poster_url: "https://placehold.co/200x285?text=Dark+Knight+Poster" },
    //     },
    // ];
    
    // useEffect(() => {
    //     setUserData(mockupUserData);
    //     setFavoriteMovies(mockupFavoriteMovies);
    //     setLoading(false); // Mock 데이터 로드 완료 후 로딩 상태 false로 설정
    // }, []);
   

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("토큰이 없습니다. 로그인해주세요.");
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/accounts/profile/${user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                const data = response.data.data;

                console.log(data);
                if (data) {
                    setUserData({
                        ...data,
                        reviews: {
                            ...data.reviews,
                            data: Array.isArray(data.reviews?.data) ? data.reviews.data : [],
                        },
                    });

                    if (data.isFollowing !== undefined) {
                        setIsFollowing(data.isFollowing);
                    }
                }
            } catch (error) {
                console.log(error);
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

    const handleFollowToggle = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if(!token) {
                alert("로그인이 필요합니다.")
                return;
            }

            if (isFollowing) {
                await axios.delete(`http://localhost:8000/api/accounts/follow/${user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsFollowing(false);
            } else {
                await axios.post(`http://localhost:8000/api/accounts/follow/${user_id}/`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsFollowing(true)
            }
        } catch (error) {
            console.error("팔로우/언팔로우 요청 실패:", error);
            alert("다시 시도해주세요.");
        }
    };

    const reviewsToShow = Array.isArray(userData?.reviews?.data) ? userData.reviews.data : [];
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
                <div className="profile-image">
                <img
                    src={
                        userData.profile_image
                            ? userData.profile_image 
                            : "https://placehold.co/80x80?text=No+Image"
                    }
                    alt="프로필 이미지"
                    className="profile-image"
                />
                </div>
                <div className="profile-info">
                    <p className="nickname">{userData.profile.nickname}</p>
                    <button
                        className={`follow-button ${isFollowing ? "following" : ""}`}
                        onClick={handleFollowToggle}
                    >
                        {isFollowing ? "언팔로우" : "팔로우"}
                    </button>
                </div>
            </div>

            {/* 팔로워/팔로잉 섹션 */}
            <div className="stats-section">
                <Link to={`http://localhost:8000/followers/${user_id}/`} className="stat">
                    <p className="stat-label">팔로워</p>
                    <p className="stat-value">{userData.followers || 0}</p>
                </Link>
                <Link to={`http://localhost:8000/following/${user_id}/`} className="stat">
                    <p className="stat-label">팔로잉</p>
                    <p className="stat-value">{userData.following || 0}</p>
                </Link>
            </div>

            <div className="favorite-movies-section">
                <h3>{userData.profile.nickname}님이 좋아하는 영화</h3>
                <div className="favorite-movies-list">
                    {favoriteMovies.length === 0 ? (
                        <p>좋아하는 영화가 없습니다.</p>
                    ) : (
                        favoriteMoviesToShow.map((movie) => (
                            <Link
                                to={`/movies/${movie.movieCd}`}
                                key={movie.movieCd}
                                className="favorite-movie-card"
                            >
                                <img
                                    src={movie.tmdb?.poster_url || "https://placehold.co/200x285?text=No+Poster"}
                                    alt={movie.movieName}
                                    className="favorite-movie-poster"
                                />
                                <p>{movie.movieName || "Unknown Title"}</p>
                            </Link>
                        ))
                    )}
                </div>
                                {favoriteMovies.length > 3 && !showAllFavorites && (
                                    <button className="show-more-button" onClick={() => setShowAllFavorites(true)}>더 보기</button>
                                )}
                                {showAllFavorites && (
                                    <button className="show-more-button" onClick={() => setShowAllFavorites(false)}>접기</button>
                                )}
                            </div>

                            <div className="review-list-section">
                                <h3>{userData.profile.nickname}님의 리뷰</h3>
                                <div className="review-list">
                    {Array.isArray(reviewsToShow) && reviewsToShow.length > 0 ? (
                        reviewsToShow.map((review) => (
                            <div key={review.id} className="review-card"
                            onClick={() => review.movieCd && navigate(`/movies/${review.movieCd}/`)}
                            style={{ cursor: "pointer" }}>
                                <div className="review-card-content">
                                    {review.poster ? (
                                        <img
                                            className="review-movie-poster"
                                            src={review.poster}
                                            alt={review.movieName || "Poster"}
                                        />
                                    ) : (
                                        <div className="review-no-poster">
                                            <img src="https://placehold.co/200x285?text=No+Poster" alt="No Poster Available" />
                                        </div>
                                    )}
                                    <div className="review-text-content">
                                        <h4>{review.movieName || "Unknown Title"}</h4>
                                        <p className="review-text">"{review.comment}"</p>
                                        <p className="review-rating">평점: {review.rating || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>리뷰가 없습니다.</p>
                    )}
                </div>
            </div>
            {Array.isArray(userData?.reviews?.data) && userData.reviews.data.length > 3 && !showAllReviews && (
                <button className="show-more-button" onClick={() => setShowAllReviews(true)}>더 보기</button>
            )}
            {showAllReviews && (
                <button className="show-more-button" onClick={() => setShowAllReviews(false)}>접기</button>
            )}
        </div>
    );
};

export default UserProfile;
