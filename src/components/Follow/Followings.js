import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Followings.css";

const Followings = ({ user_id }) => {
    const [followings, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);

    // 백엔드에서 나를 팔로우하는 유저 목록 받아오는 기능
    useEffect(() => {
        const fetchFollowings = async () => {
            try {
                const response = await axios.get(`/api/followers/${user_id}/`, {
                    withCredentials: true,
                });
                setFollowings(response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || "팔로워 목록을 불러오지 못했습니다";
                alert(`에러 발생: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowings();
    }, [user_id]);

    if (loading) {
        return <div className="followings-container">로딩 중...</div>;
    }

    return (
        <div className="followings-container">
            <h3>팔로우하는 사람들</h3>
            {followings.length > 0 ? (
                <ul className="following-list">
                    {followings.map((following) => (
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

export default Followings;
