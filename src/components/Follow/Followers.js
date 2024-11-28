import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Followers.css";

const Followers = ({ user_id }) => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 백엔드에서 팔로워 목록 받아오는 기능
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`/api/followers/${user_id}/`, {
                    withCredentials: true,
                });
                setFollowers(response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || "팔로워 목록을 불러오지 못했습니다";
                alert(`에러 발생: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, [user_id]);

    if (loading) {
        return <div className="followers-container">로딩 중...</div>;
    }

    return (
        <div className="followers-container">
            <h3>팔로워 목록</h3>
            {followers.length > 0 ? (
                <ul className="follower-list">
                    {followers.map((follower) => (
                        <li key={follower.id} className="follower-item">
                            <Link to={`/profile/${follower.id}`}>
                                <img
                                    src={follower.profilePicture}
                                    alt={follower.nickname}
                                    className="follower-image"
                                />
                                <p>{follower.nickname}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>팔로워가 없습니다.</p>
            )}
        </div>
    );
};

export default Followers;
