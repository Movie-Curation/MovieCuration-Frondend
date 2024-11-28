import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./SearchResult.css";

function SearchResult() {
    const { query } = useParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query) {
            fetchResults(query);
        }
    }, [query]);

    // 검색값(query) 입력하면 TMDB에서 검색 결과 불러옴 - DB 구축되면 수정할 것
    const fetchResults = async (query) => {
        try {
            const api_key = process.env.REACT_APP_TMDB_API_KEY;
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&language=ko-KR`
            );
            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="search-results">
            <h2>{`${query} `}검색 결과</h2>
            <div className="result-cards">
                {results.map((result) => (
                    <Link to={`/movie/${result.id}`} key={result.id} className="result-card">
                        <div className="poster">
                            <img
                                src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                                alt={result.title}
                            />
                        </div>
                        <div className="title">{result.title}</div>
                        <div className="score">⭐: {result.vote_average? result.vote_average.toFixed(2) : 'N/A'}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SearchResult;