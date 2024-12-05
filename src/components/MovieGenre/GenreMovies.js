import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import './GenreMovies.css';

// TMDB 장르 id를 장르명으로 변환
const GenreMovies = () => {
    const {genreId} = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const genreMap = {
        28: "액션",
        12: "모험",
        16: "애니메이션",
        35: "코미디",
        80: "범죄",
        99: "다큐멘터리",
        18: "드라마",
        10751: "가족",
        14: "판타지",
        36: "역사",
        27: "공포",
        10402: "음악",
        9648: "미스터리",
        10749: "로맨스",
        878: "SF",
        10770: "TV영화",
        53: "스릴러",
        10752: "전쟁",
        37: "서부극"
    };

    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            setLoading(true);
            setError(null);

            const genreName = genreMap[genreId];
            if (!genreName) {
                setError("잘못된 장르 ID입니다");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`/movie/api/movies/genre/${genreName}/`)
                setMovies(response.data.results);
            } catch (err) {
                console.error("영화를 가져오는 데 실패했습니다.", err);
            } finally {
                setLoading(false);
            }
        };

        if (genreId) {
            fetchMoviesByGenre();
        }
    }, [genreId]);

    if (loading) {
        return <div>로딩 중...</div>
    }

    return (
        <div className="genre-movies">
            <h2>{genreMap[genreId] || "알 수 없는"} 장르의 영화 목록</h2>
                <div className="result-cards">
                    {movies.map((movie) => (
                        <Link to={`/movies/${movie.kobis.movieCd}`} key={movie.kobis.movieCd} className="result-card">
                        <div className="poster">
                            <img
                                src={movie.tmdb.poster_url || "https://placehold.co/200x285?text=No+Poster"} // 포스터 URL
                                alt={movie.kobis.movieNm}
                            />
                        </div>
                        <div className="title">{movie.kobis.movieNm}</div>
                        <div className="year">{movie.kobis.prdtYear}</div>
                        {/* <div className="nation">{movie.kobis.nationNm}</div> */}
                        </Link>
                    ))}
                </div>
        </div>
    );
};

export default GenreMovies;