import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import './GenreMovies.css';

// TMDB 장르 id를 장르명으로 변환
const GenreMovies = () => {
    const {genreId} = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

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
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        const fetchMoviesByGenre = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genreId}&language=ko-KR`
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error("영화를 가져오는 데 실패했습니다.", error);
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
            <h2>{genreMap[genreId] || "알 수 없는"} 장르의 인기 영화</h2>
                <div className="result-cards">
                    {movies.map((movie) => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="result-card">
                            <div className="poster">
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            </div>
                            <div className="title">{movie.title}</div>
                            <div className="score">⭐: {movie.vote_average ? movie.vote_average.toFixed(2) : 'N/A'}</div>
                        </Link>
                    ))}
                </div>
        </div>
    );
};

export default GenreMovies;