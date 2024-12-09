import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import ProfileUpdate from "./ProfileUpdate";
import './MyPage.css';

const MyPage = () => {
    const [userData, setUserData] = useState(
        { nickname: "",
        email: "",
        userid: "",
        gender: "",
        genres: [],
        name: "",
        reviews: [],
        profileImage: null });
    // const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [showAllFavorites, setShowAllFavorites] = useState(false);
    // const [showAllReviews, setShowAllReviews] = useState(false);

    // const mockupUserData = {
    //     nickname: "MovieLover123",
    //     email: "movielover@example.com",
    //     userid: "user123",
    //     gender: "female",
    //     genres: ["Action", "Comedy", "Drama"],
    //     name: "Jane Doe",
    //     reviews: [
    //         {
    //             id: 1,
    //             movie: {
    //                 kobis: { movieCd: "001", movieNm: "Inception", prdtYear: "2010", nationNm: "USA" },
    //                 tmdb: { poster_url: "https://placehold.co/200x285?text=Inception+Poster" },
    //             },
    //             text: "Mind-blowing! The plot twists are incredible.",
    //         },
    //         {
    //             id: 2,
    //             movie: {
    //                 kobis: { movieCd: "002", movieNm: "Parasite", prdtYear: "2019", nationNm: "South Korea" },
    //                 tmdb: { poster_url: "https://placehold.co/200x285?text=Parasite+Poster" },
    //             },
    //             text: "A masterpiece. Social commentary at its finest.",
    //         },
    //         {
    //             id: 3,
    //             movie: {
    //                 kobis: { movieCd: "003", movieNm: "Interstellar", prdtYear: "2014", nationNm: "USA" },
    //                 tmdb: { poster_url: "https://placehold.co/200x285?text=Interstellar+Poster" },
    //             },
    //             text: "An emotional journey through space and time.",
    //         },
    //     ],
    //     followers: 120,
    //     following: 85,
    // };
    
    // const mockupFavoriteMovies = [
    //     {
    //         kobis: { movieCd: "101", movieNm: "The Dark Knight", prdtYear: "2008", nationNm: "USA" },
    //         tmdb: { poster_url: "https://placehold.co/200x285?text=The+Dark+Knight+Poster" },
    //     },
    //     {
    //         kobis: { movieCd: "102", movieNm: "Avengers: Endgame", prdtYear: "2019", nationNm: "USA" },
    //         tmdb: { poster_url: "https://placehold.co/200x285?text=Avengers+Poster" },
    //     },
    //     {
    //         kobis: { movieCd: "103", movieNm: "The Godfather", prdtYear: "1972", nationNm: "USA" },
    //         tmdb: { poster_url: "https://placehold.co/200x285?text=The+Godfather+Poster" },
    //     },
    // ];
    
    // useEffect(() => {
    //     setUserData(mockupUserData);
    //     setFavoriteMovies(mockupFavoriteMovies);
    //     setUserReviews(mockupUserData.reviews);
    //     setLoading(false); // 로딩 완료 표시
    // }, []);
   

    useEffect (() => {
        // 백엔드에서 사용자 데이터 가져오기
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("토큰이 없습니다. 로그인해주세요.")
                    return;
                }

                const userResponse = await axios.get("http://localhost:8000/api/accounts/profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    // withCredentials: true, // 쿠키 인증이 필요한 경우 추가
                });


                console.log("유저 데이터 요청 시작");
                console.log(userResponse.data.data);

                const reviewData= userResponse.data.data.reviews.data || [];
                console.log("리뷰 데이터 확인:", reviewData);

                setUserData(userResponse.data.data);
                setUserReviews(reviewData);

            } catch (error) {
                    console.log (error);
                    console.log(error.response || "Error response가 없습니다.");
                    setError(error.response?.data?.message || "유저 데이터를 불러오지 못했습니다."); // 에러 메시지 저장
            } finally {
                    setLoading(false);
            }
            }
        
        // const fetchFavoriteMovies = async () => {
        //     try {
        //         const token = localStorage.getItem("access_token");
        //         if (!token) {
        //             console.error("토큰이 없습니다. 로그인해주세요.");
        //             return;
        //         }

        //         const response = await axios.get("http://localhost:8000/api/accounts/favorites/", {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             // withCredentials: true, // 쿠키 인증이 필요한 경우 추가
        //         });
        //         setFavoriteMovies(response.data || []);
        //     } catch (error) {
        //         console.error("좋아하는 영화를 불러오는 데 실패했습니다: ", error);
        //     }
        // };

        fetchUserData();
        // fetchFavoriteMovies();
    }, []);

    const navigate = useNavigate();

    const handleProfileUpdateClick = () => {
        setIsProfileUpdateOpen(true);
    };

    const reviewsToShow = userReviews;
    // const favoriteMoviesToShow = favoriteMovies?.length > 0 ? (showAllFavorites ? favoriteMovies : favoriteMovies.slice(0, 3)) : [];

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
                    {userData.profileImage ? (
                        <img
                            src={userData.profile?.profileImage}
                            alt="사용자 프로필"
                            className="profile-image"
                        />
                    ) : (
                        <img
                            src="https://placehold.co/100x100?text=No+Image"
                            alt="기본 프로필 이미지"
                            className="profile-image"
                        />
                    )}
                </div>
                <div className="profile-info">
                    <p className="nickname">{userData.profile?.nickname}</p>
                </div>
                <div className="profile-option">
                    <FaGear className="profile-update" onClick={handleProfileUpdateClick} />
                </div>
                {/* ProfileUpdate 모달 */}
                {isProfileUpdateOpen && (
                <ProfileUpdate onClose={() => setIsProfileUpdateOpen(false)} />
                )}
            </div>
            {/* 팔로우/팔로잉/좋아요 섹션 */}
            <div className="stats-section">
                <Link to="/followers" className="stat">
                    <p className="stat-label">팔로워</p>
                    <p className="stat-value">{userData.followers || 0}</p>
                </Link>
                <Link to="/following" className="stat">
                    <p className="stat-label">팔로잉</p>
                    <p className="stat-value">{userData.following || 0}</p>
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
            {/* <div className="favorite-movies-section">
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
                {/* {favoriteMovies.length > 3 && !showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(true)} className="show-more-button">
                        더 보기
                    </button>
                )} */}

                {/* "접기" 버튼 표시 */}
                {/* {showAllFavorites && (
                    <button onClick={() => setShowAllFavorites(false)} className="show-more-button">
                        접기
                    </button>
                )}
            </div> */}

            {/* 내가 쓴 리뷰 섹션 */}
            <div className="review-list">
                {reviewsToShow.length === 0 ? (
                    <p>리뷰가 없습니다.</p>
                ) : (
                    reviewsToShow.map((review) => (
                        <div
                            key={review.id}
                            className="review-card"
                            onClick={() => review.movieCd && navigate(`http://localhost:8000/movie/api/movies/${review.movieCd}`)}
                            style={{ cursor: review.movieCd ? "pointer" : "default" }}
                        >
                            <div className="review-card-content">
                                {/* 영화 포스터 */}
                                {review.poster_url ? (
                                    <img
                                        className="review-movie-poster"
                                        src={review.poster_url}
                                        alt={review.movieNm || "Poster"}
                                    />
                                ) : (
                                    <div className="review-no-poster">
                                        <img src="https://placehold.co/200x285?text=No+Poster" alt="No Poster Available" />
                                    </div>
                                )}

                                {/* 영화 정보 및 리뷰 내용 */}
                                <div className="review-text-content">
                                    <h4>{review.movieNm || "Unknown Title"}</h4>
                                </div>
                                <div className="review-card-content">
                                    <p className="review-text">"{review.comment}"</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

                {/* "더 보기" 버튼 표시 */}
                {/* {userData?.reviews.length > 3 && !showAllReviews && (
                    <button onClick={() => setShowAllReviews(true)} className="show-more-button">
                        더 보기
                    </button>
                )} */}

                {/* "접기" 버튼 표시 */}
                {/* {showAllReviews && (
                    <button onClick={() => setShowAllReviews(false)} className="show-more-button">
                        접기
                    </button>
                )} */}
            </div>
  
    );
};

export default MyPage;