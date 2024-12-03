import React from "react";
import { Link } from "react-router-dom";
import "./SearchResult.css";

function SearchResult({ results }) {
    return (
        <div className="search-results">
            {results.length > 0 ? (
                results.map((movie, index) => (
                    <div key={index} className="movie-card">
                        <Link to={`/movies/${movie.kobis.movieCd}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.tmdb.poster_url}`} // Assuming you have the poster path in tmdb
                                alt={movie.kobis.movieNm}
                                className="movie-card-image"
                            />
                            <div className="movie-card-details">
                                <h4 className="movie-card-title">{movie.kobis.movieNm}</h4>
                                <p className="movie-card-production-year">{movie.kobis.prdtYear}</p>
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
}

export default SearchResult;