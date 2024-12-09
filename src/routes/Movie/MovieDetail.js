import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { PiSiren } from "react-icons/pi";
import axios from "axios";
import "./MovieDetail.css";
import CommentsSection from "../Comments/CommentsSection";

function MovieDetail() {
    const { movieCd } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState(null);
    const [director, setDirector] = useState([]);
    const [cast, setCast] = useState([]);
    // const [companies, setCompanies] = useState([]);
    // const [staffs, setStaffs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);
    const [score, setScore] = useState([false, false, false, false, false, false, false, false, false, false]);

    // 로그인 상태 확인
    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    console.error("토큰이 없습니다.");
                    setIsLoggedIn(false);
                    setLoggedInUser(null);
                    return;
                }
    
                // 로그인 상태 확인 요청
                const user = await checkLoginStatus(token);
                setLoggedInUser(user);
                setIsLoggedIn(true);
            } catch (error) {
                if (error.response?.status === 401 && error.response.data.code === "token_not_valid") {
                    try {
                        // 토큰 갱신 시도
                        const newAccessToken = await refreshAccessToken();
                        if (newAccessToken) {
                            localStorage.setItem("access_token", newAccessToken);
                            const user = await checkLoginStatus(newAccessToken);
                            setLoggedInUser(user);
                            setIsLoggedIn(true);
                        } else {
                            throw new Error("토큰 갱신 실패");
                        }
                    } catch (refreshError) {
                        console.error("토큰 갱신 실패:", refreshError);
                        setIsLoggedIn(false);
                        setLoggedInUser(null);
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                    }
                } else {
                    console.error("로그인 상태 확인 중 오류 발생:", error.response?.data || error.message);
                    setIsLoggedIn(false);
                    setLoggedInUser(null);
                }
            }
        };
    
        const checkLoginStatus = async (token) => {
            const response = await axios.get("http://localhost:8000/api/accounts/auth/check-login/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsLoggedIn(response.data.is_logged_in);
            setLoggedInUser(response.data.user);
            setIsAdmin(response.data.is_admin);

            return response.data.user;
        };
    
        const refreshAccessToken = async () => {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                throw new Error("리프레시 토큰이 없습니다.");
            }
    
            const response = await axios.post("http://localhost:8000/api/token/refresh/", {
                refresh: refreshToken,
            });
            const newAccessToken = response.data.access;
            localStorage.setItem("access_token", newAccessToken);
            return newAccessToken;
        };
    
        fetchLoggedInUser();
    }, []);
    
    

    // 영화 정보 가져오기
    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const response = await axios.get(`/movie/api/movies/${movieCd}/`);
                const movieData = response.data;

                setMovie(movieData);
                setIsLoading(false);
                setDirector(
                    Array.isArray(movieData.kobis?.director) && movieData.kobis.director.length > 0
                    ? movieData.kobis.director
                    : []// director가 문자열이라면 배열로 변환
                );
                setCast(
                    Array.isArray(movieData.kobis?.actors) && movieData.kobis.actors.length > 0
                    ? movieData.kobis.actors.map((actor) => ({ peopleNm: actor.peopleNm || "Unknown" }))
                    : Array.isArray(movieData.tmdb?.cast) && movieData.tmdb.cast.length > 0
                        ? movieData.tmdb.cast.map((actor) => ({ peopleNm: actor.name || "Unknown" }))
                        : []
                );
                // setStaffs(movieData.kobis?.staffs_details?.length ? movieData.kobis.staffs_details : movieData.tmdb?.crew || []);
                // setCompanies(movieData.kobis?.companies?.length ? movieData.kobis.companies : movieData.tmdb?.production_companies || []);
            } catch (error) {
                console.error("영화 정보를 가져오는 데 실패했습니다:", error);
                setIsLoading(false);
            }
        };

        const fetchSimilarMovies = async () => {
            try {
                const response = await axios.get(`/movie/api/movies/${movieCd}/similar`);
                setRecommendations(response.data.results.slice(0, 20));
            } catch (error) {
                console.error("추천 영화를 가져오는 데 실패했습니다:", error);
            }
        };

        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`/api/accounts/reviews/movie/${movieCd}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setReviews(response.data);
            } catch (error) {
                console.error("리뷰를 가져오는 데 실패했습니다:", error);
            }
        };

        // const checkFavoriteStatus = async () => {
        //     try {
        //         const token = localStorage.getItem("access_token");
        //         const response = await axios.get(`http://localhost:8000/api/accounts/favorites/${movieCd}/`, {
        //             headers: { Authorization: `Bearer ${token}` },
        //         });
        //         setIsFavorite(!!response.data.favorite);
        //     } catch (error) {
        //         console.error("즐겨찾기 상태 확인 실패:", error.response?.data || error.message);
        //     }
        // };
    
        // if (isLoggedIn && movieCd) {
        //     checkFavoriteStatus();
        // }

        fetchMovieDetail();
        fetchSimilarMovies();
        fetchReviews();
    }, [isLoggedIn, movieCd])

    // 실제 리뷰 작성 데이터
    const handleReviewSubmit = async () => {
        if (!review.trim() || score.filter(Boolean).length === 0) return; // 리뷰와 별점이 모두 입력되어야 제출

        try {
            const token = localStorage.getItem("access_token");
            setIsLoggedIn(!!token);
            const response = await axios.post("http://localhost:8000/api/accounts/reviews/", {
                movieCd: parseInt(movieCd, 10),
                comment: review,
                rating: score.filter(Boolean).length,
                is_expert_review: false,
                // created_at: new Date().toLocaleString()
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            
            setReviews((prev) => [...prev, response.data]);
            setReview("");
            setScore([false, false, false, false, false, false, false, false, false, false]);
        } catch (error) {
            console.error("리뷰를 제출하는 데 실패했습니다: ", error);
        }
    };

    // 별점 기능
    const starScore = (index) => {
        let updatedScore = [...score];
        for (let i = 0; i < 10; i++) {
            updatedScore[i] = i <= index;
        }
        setScore(updatedScore);
    };

    // 영화 즐겨찾기 이벤트 핸들러
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavoriteClick = async () => {
        if (!movie || !movie.kobis || !movie.kobis.movieCd) {
            console.error("영화 데이터가 유효하지 않습니다.");
            return;
        }
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }
   
        try {
            // 토큰 가져오기
            const token = localStorage.getItem("access_token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
    
            // 요청에 토큰 포함
            const headers = {
                Authorization: `Bearer ${token}`, 
            };

            const BASE_URL = "http://localhost:8000";
            const response =
                isFavorite
                ? await axios.delete(`${BASE_URL}/api/accounts/favorites/${movieCd}/`, { headers })
                : await axios.post(
                    `${BASE_URL}/api/accounts/favorites/`,
                    { movieCd },
                    { headers }
                );
    
            if (response.status === 200 || response.status === 201) {
                setIsFavorite((prev) => !prev); // 상태 반전
            } else {
                console.error("즐겨찾기 처리 실패:", response.status);
            }
        } catch (error) {
            console.error("즐겨찾기 요청 중 오류:", error.response ? error.response.data : error.message);
        }
    };

    // 리뷰 좋아요/싫어요 개수 불러오는 함수
    const fetchReactionData = async (review_id) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
    
            const response = await axios.get(`http://localhost:8000/api/accounts/reviews/${review_id}/reaction/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            return response.data; // 백엔드에서 likes, dislikes를 반환한다고 가정
        } catch (error) {
            console.error(`리액션 데이터를 불러오는 데 실패했습니다: ${error}`);
            return null;
        }
    };

    // 리뷰 좋아요/싫어요 이벤트 핸들러
    const handleReaction = async (review_id, reaction) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            const token = localStorage.getItem("access_token");

            if(!token) {
                alert("유효한 토큰이 없습니다. 다시 로그인해주세요.");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };

            await axios.post(`http://localhost:8000/api/accounts/reviews/${review_id}/reaction/`, { reaction }, config);
            const updatedReactions = await fetchReactionData(review_id);
            setReviews((prev) =>
                prev.map((review) =>
                    review.id === review_id
                        ? { ...review, likes: updatedReactions.likes, dislikes: updatedReactions.dislikes }
                        : review
                )
            );
        } catch (error) {
            console.error("리뷰 반응 처리 실패:", error);
        }
    };
    
    // 불량 리뷰 신고
    const handleReport = async (review_id) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        const confirmReport = window.confirm("이 리뷰를 신고하시겠습니까?")
        if (!confirmReport) return;

        // 신고 사유와 설명 입력받기
        const reason = prompt("신고 사유를 선택하세요: spam, hate, violence, other");
        if (!reason || !["spam", "hate", "violence", "other"].includes(reason)) {
            alert("올바른 신고 사유를 선택하세요.");
            return;
        }

        const description = prompt("신고 사유에 대한 상세 설명을 입력해주세요. (선택 사항)");

        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                alert("유효한 토큰이 없습니다. 다시 로그인해주세요.");
                return;
            }

            const config = {
                headers : {
                    Authorization: `Bearer ${token}`,
                },
            };
        

        
        // 백엔드에 신고 데이터 전송
        const response = await axios.post(`http://localhost:8000/api/reviews/${review_id}/report/`, { reason, description }, config); // 백엔드에 리뷰 신고 전송

        if (response.status === 200 && response.status < 300) {
            alert("리뷰 신고가 접수되었습니다.");
        } else {
            alert("신고 처리에 실패했습니다.");
        }
        } catch (error) {
            console.error("신고 요청 오류: ", error);
            alert("신고 요청에 실패했습니다.")
        }
    };

    // 리뷰 편집 모드
    const [editMode, setEditMode] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(0);

    // 리뷰 수정 및 삭제 핸들러
    const handleEditStart = (review) => {
        setEditMode(review.id);
        setEditComment(review.comment);
        setEditRating(review.rating);
    };
    
    const handleEditSubmit = async (review_id) => {
        try {
            await axios.patch(`http://localhost:8000/api/accounts/reviews/${review_id}`, {
                comment: editComment,
                rating: editRating,
            });
    
            setReviews((prev) =>
                prev.map((review) =>
                    review.id === review_id
                        ? { ...review, comment: editComment, rating: editRating }
                        : review
                )
            );
            setEditMode(null);
            setEditComment("");
            setEditRating(0);
        } catch (error) {
            console.error("Error editing review: ", error);
        }
    };

    const handleDelete = async (review_id) => {
        try {
            await axios.delete(`http://localhost:8000/api/accounts/reviews/${review_id}/delete`);
            setReviews((prev) => prev.filter((review) => review.id !== review_id));
        } catch (error) {
            console.error("Error deleting review: ", error);
        }
    };

    // 리뷰 정렬
    const [sortOrder, setSortOrder] = useState("recent"); // 기본 정렬은 최신순

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortOrder === "expert") {
            if (b.likes > 100 && a.likes <= 100) return 1;
            if (a.likes > 100 && b.likes <= 100) return -1;
            return new Date(b.created_at) -  new Date(a.created_at);
        } else if (sortOrder === "likes") {
            return b.likes - a.likes;
        } else if (sortOrder === "rating") {
            return b.rating - a.rating;
        } else if (sortOrder === "recent") {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-detail">
            <h1>{movie.kobis.movieNm} ({movie.kobis.prdtYear})</h1>
            <div className="poster">
                {movie.tmdb?.poster_url ? (
                    <img src={movie.tmdb.poster_url} alt={movie.movieNm} />
                ) : (
                    <div>No Poster Available</div>
                )}
            </div>
            <div className="movie-info">
                <p><strong>제작연도: </strong>{movie.kobis.prdtYear}</p>
                <p><strong>개봉일: </strong>{movie.kobis.openDt}</p>
                <p><strong>장르: </strong>{movie.kobis.genreNm}</p>
                <p><strong>상영시간: </strong>{movie.kobis.showTm}분</p>
                <p><strong>관람등급: </strong>{movie.kobis.watchGradeNm}</p>
                <p><strong>제작상태: </strong>{movie.kobis.prdtStatNm}</p>
                <p><strong>제작국가: </strong>{movie.kobis.nationNm}</p>
            </div>

            {movie && (
                <div className="button-container">
                    <button
                        className={`favorite-button ${isFavorite ? "favorited" : ""}`}
                        onClick={handleFavoriteClick}
                        disabled={isLoading || !movie}
                    >
                        {isFavorite ? <FaHeart color="#007BFF"/> : <FaRegHeart />}
                        {isFavorite ? " 좋아요 취소" : " 좋아요"}
                    </button>
                </div>
            )}

            <div className="info-section">
                <h3>감독</h3>
                <ul>
                    {director.length > 0 ? (
                        director.map((dir) => (
                            <li key={dir.peopleNm}>{dir.peopleNm || dir}</li>
                        ))
                    ) : (
                        <p>감독 정보 없음</p>
                    )}
                </ul>

                <h3>출연진</h3>
                <ul>
                    {cast.map((actor) => (
                        <li key={actor.id || actor.name}>
                            {actor.peopleNm || actor.name || "N/A"}
                        </li>
                    ))}
                </ul>
                {/* <h3>참여 영화사</h3>
                <ul>
                    {companies.map((company) => (
                        <li key={company.id}>
                            {company.companyNm} ({company.companyPartNm || "N/A"})
                        </li>
                    ))}
                </ul> */}
                {/* <h3>스태프</h3>
                <ul>
                    {staffs.map((staff) => (
                        <li key={staff.id || staff.name}>
                           {staff.peopleNm || staff.name} - {staff.staffRoleNm || staff.job || "N/A"}
                        </li>
                    ))}
                </ul> */}
            </div>

            <div className="overview">
                <h3>줄거리</h3>
                <p>{movie.tmdb.overview || "줄거리 정보 없음"}</p>
            </div>

            <div className="vote-average">
                <h3>평균 별점</h3>
                <p>⭐: {movie.tmdb.vote_average ? movie.tmdb.vote_average.toFixed(2) : 'N/A'}</p>
            </div>

            {isLoggedIn && (
                <div className="review-section">
                    <h3>리뷰 작성</h3>
                    {/* 별점 선택 UI */}
                    <div className="star-rating">
                        {score.map((isFilled, index) => (
                            <FaStar
                                key={index}
                                size="24"
                                color={isFilled ? "#FFD700" : "#d3d3d3"}
                                onClick={() => starScore(index)} // 별 클릭 시 호출
                            />
                        ))}
                    </div>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="리뷰를 작성하세요..."
                    />
                    <button onClick={handleReviewSubmit}>제출</button>
                </div>
            )}
            {/* 리뷰 목록 및 정렬 버튼 */}
            {reviews.length > 0 && (
                <div className="reviews-list">
                <h3>리뷰 목록</h3>
                <div className="sort-options">
                    <button
                        className={sortOrder === "recent" ? "active" : ""}
                        onClick={() => setSortOrder("recent")}>
                        최신순
                    </button>
                    <button
                        className={sortOrder === "rating" ? "active" : ""}
                        onClick={() => setSortOrder("rating")}>
                        별점이 높은 리뷰
                    </button>
                    <button
                        className={sortOrder === "likes" ? "active" : ""}
                        onClick={() => setSortOrder("likes")}>
                        좋아요 많은 리뷰
                    </button>
                    <button
                        className={sortOrder === "expert" ? "active" : ""}
                        onClick={() => setSortOrder("expert")}>
                        전문가 리뷰
                    </button>
                </div>

                {/* 정렬된 리뷰 섹션 */}
                {sortedReviews.map((review) => (
                    <div key={review.id} className="review-item">
                        {editMode === review.id ? (
                            <div>
                                <div className="star-rating">
                                    {[...Array(10)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            size="24"
                                            color={index < editRating ? "#FFD700" : "#d3d3d3"}
                                            onClick={() => setEditRating(index + 1)}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    className={editMode === review.id ? "edit-textarea" : ""}
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                />
                                <div className="edit-buttons">
                                    <button className="review-button" onClick={() => handleEditSubmit(review.id)}>저장</button>
                                    <button className="review-button cancel-button" onClick={() => setEditMode(null)}>취소</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p><strong>
                                    <Link to={`/profile/${review.user}`} className="review-user-link">
                                    {review.nickname || "익명"}
                                    {review.likes > 100 && " 🏆"}
                                    </Link>
                                    </strong> ({new Date(review.created_at).toLocaleString()}):</p>
                                <p>{review.comment}</p>
                                <p>⭐: {review.rating.toFixed(1)}</p>
                                <div className="review-actions">
                                    {isLoggedIn ? (
                                        <>
                                            <button onClick={() => handleReaction(review.id, "like")}>
                                                <FaRegThumbsUp /> {review.likes}
                                            </button>
                                            <button onClick={() => handleReaction(review.id, "dislike")}>
                                                <FaRegThumbsDown /> {review.dislikes}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                        <button onClick={() => alert("로그인이 필요합니다")}><FaRegThumbsUp />{review.likes}</button>
                                        <button onClick={() => alert("로그인이 필요합니다")}><FaRegThumbsDown />{review.dislikes}</button>
                                        </>
                                    )}
                                    <button onClick={() => handleReport(review.id)}>
                                        <PiSiren size={20} />
                                    </button>
                                    {isLoggedIn && (
                                        <>
                                            {(isAdmin || review?.user === loggedInUser?.userid) && (
                                                <>
                                                    {review?.user === loggedInUser?.userid && (
                                                        <button onClick={() => handleEditStart(review)}>수정</button>
                                                    )}
                                                    <button onClick={() => handleDelete(review.id)}>삭제</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* 댓글 컴포넌트 */}
                        <CommentsSection key={review.id} review_id={review.id} isLoggedIn={isLoggedIn} />
                    </div>
                ))}
            </div>
            )}
            {/* 추천 영화 섹션 */}
            <h2> 추천 영화 </h2>
            <div className="recommended-movies">
                {recommendations.slice(0, 20).map((rec) => (
                    <Link key={rec.kobis.movieCd} to={`/movies/${rec.kobis.movieCd}`} className="movie-card-link">
                    <div className="movie-card">
                        <img 
                            className="movie-poster" 
                            src={rec.tmdb?.poster_url || 'https://placehold.co/500x750?text=No+Poster'} 
                            alt={rec.kobis.movieNm} 
                        />
                        <div className="movie-info">
                            <h4>{rec.kobis.movieNm}</h4>
                            <p>{rec.kobis.prdtYear}</p>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MovieDetail;