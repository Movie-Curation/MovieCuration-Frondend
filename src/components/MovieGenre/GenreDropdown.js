import React from "react";
import "./GenreDropdown.css";

// 장르 드롭다운
const GenreDropdown = ({ genres, onClose, onGenreClick }) => {

    return (
        <div className="dropdown-menu">
            <ul>
                {genres.map((genre) => (
                    <li key={genre.id} onClick={() => onGenreClick(genre.id)}>{genre.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default GenreDropdown;