import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MoviePoster from "./MoviePoster";
import "./NowPlaying.css";

function NowPlaying() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const api_key = process.env.REACT_APP_TMDB_API_KEY;
            const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=ko-KR`;
          
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
        <div className="now-playing">
          <h2>현재 상영작</h2>
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
  
  export default NowPlaying;