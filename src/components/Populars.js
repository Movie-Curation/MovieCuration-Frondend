import React, { useState, useEffect } from "react";
import MoviePoster from "./MoviePoster";
import { Link } from "react-router-dom";
import "./Populars.css";

function Populars() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const api_key = process.env.REACT_APP_TMDB_API_KEY;
            const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=ko-KR`;
          
            try {
                const response = await fetch(url);
                const data = await response.json();
                setMovies(data.results);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="populars">
          <h2>인기 영화</h2>
          <div className="movie-list">
            {movies.map((movie) => (
              <div key={movie.id}>
              <MoviePoster
                posterpath={movie.poster_path}
              />
              <Link to={`/movie/${movie.id}`} className="movie-title-link">
                {movie.title}
              </Link>
              </div>
            ))}
          </div>
        </div>
      );
    }
  
  export default Populars;