import React, { useEffect, useState } from "react";
import './Notice.css'

const RecentMoviesNotice = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {

        const fetchRecentMovies = async () => {
            try {
                const response = await fetch(`movie/api/movies/recent/`);
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error("최근 추가된 영화를 불러오는 데 문제가 발생하였습니다: ", error);
            }
        };

        fetchRecentMovies();
    }, []);

    return (
        <div className="recent-movies-notice">
            <h2>최근 3일간 추가된 영화</h2>
            {movies.length > 0 ? (
                <ul>
                    {movies.map((movie, index) => (
                        <li key={index}>
                            <strong>{movie.kobis.movieNm}</strong> - 감독: {movie.kobis.director}
                            <br />
                            추가된 날짜: {new Date(movie.tmdb.created_at).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>최근 추가된 영화가 없습니다.</p>
            )}
        </div>
    );
};

export default RecentMoviesNotice;