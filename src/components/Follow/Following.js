import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Following.css";

const Following = ({ user_id }) => {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    // 백엔드에서 유저가 팔로우하는 유저 목록 받아오는 기능
    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`/api/following/${user_id}/`, {
                    withCredentials: true,
                });
                setFollowing(response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || "팔로우 목록을 불러오지 못했습니다";
                alert(`에러 발생: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowing();
    }, [user_id]);

    if (loading) {
        return <div className="following-container">로딩 중...</div>;
    }

    return (
        <div className="following-container">
            <h3>팔로우하는 사람들</h3>
            {following.length > 0 ? (
                <ul className="following-list">
                    {following.map((following) => (
                        <li key={following.id} className="following-item">
                            <Link to={`/profile/${following.id}`}> 
                                <img
                                    src={following.profilePicture}
                                    alt={following.nickname}
                                    className="following-image"
                                />
                                <p>{following.nickname}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>아무도 팔로우하지 않습니다.</p>
            )}
        </div>
    );
};

export default Following;
