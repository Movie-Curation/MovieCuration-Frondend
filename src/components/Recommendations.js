import React from "react";
import { Link } from "react-router-dom";
import "./Recommendations.css";

function Recommendations({ recommendations }) {
    return (
        <div className="recommendations">
            <h3>추천 영화</h3>
            <div className="recommendation-cards">
                {recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="recommendation-card">
                        <Link to={`/movie/${recommendation.id}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${recommendation.poster_path}`}
                                alt={recommendation.title}
                            />
                            <div className="recommendation-title">{recommendation.title}</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recommendations;