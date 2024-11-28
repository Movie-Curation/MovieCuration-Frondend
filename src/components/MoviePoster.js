import React from "react";

// 영화 포스터 컴포넌트
function MoviePoster({title, posterpath}) {
    const imageUrl = `https://image.tmdb.org/t/p/w200${posterpath}`;

    return(
        <div className="movie-poster">
            <img src={imageUrl} alt={title} className="poster-image" />
            <h3 className="poster-title">{title}</h3>
        </div>
    );
}

export default MoviePoster;