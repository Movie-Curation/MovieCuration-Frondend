import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BoxOffice.css';

const BoxOffice = () => {
  const [boxOfficeData, setBoxOfficeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoxOfficeData = async () => {
      try {
        const response = await axios.get('/movie/api/boxoffice/daily/');
        console.log(response.data);
        setBoxOfficeData(response.data);
      } catch (err) {
        setError('Failed to load box office data');
      } finally {
        setLoading(false);
      }
    };

    fetchBoxOfficeData();
  }, []);

  if (loading) {
    return <div className="box-office-loading">Loading box office rankings...</div>;
  }

  if (error) {
    return <div className="box-office-error">{error}</div>;
  }

  return (
    <div className="box-office">
      <h2 className="box-office-title">오늘의 박스오피스 순위</h2>
      <div className="box-office-list">
        {boxOfficeData.map((movie, index) => (
          <div className="box-office-item" key={movie.kobis?.movieCd || index}>
            <div className="box-office-rank">{index + 1}</div>
            <div className="box-office-info">
              <h3>{movie.kobis?.movieNm || 'Unknown Title'}</h3>
              <p>{movie.kobis?.prdtYear || 'N/A'}</p>
              <p>{movie.kobis?.nationNm || 'N/A'}</p>
            </div>
            {movie.tmdb?.poster_url ? (
              <img
                className="box-office-poster"
                src={movie.tmdb.poster_url}
                alt={`${movie.kobis?.movieNm || 'Poster'}`}
              />
            ) : (
              <div className="box-office-no-poster">No Poster Available</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxOffice;
