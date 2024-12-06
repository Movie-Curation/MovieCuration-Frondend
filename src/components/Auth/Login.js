import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const LogIn = ({ setIsLoggedIn }) => {
    const [formData, setFormData] = useState({
        userid: "",
        password: ""
    });

    const [error, setError] = useState(""); // 에러 메시지 상태 관리
    const navigate = useNavigate();

    // 로컬 스토리지의 토큰으로 로그인 상태 확인
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            setIsLoggedIn(true);
            navigate("/"); // 이미 로그인된 상태라면 홈으로 이동
        }
    }, [setIsLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // 기존 에러 메시지 초기화

        try {
            const response = await axios.post("http://localhost:8000/api/token/", {
                userid: formData.userid,
                password: formData.password
            });

            // 로그인 성공 처리
            if (response.status === 200 && response.data.access) {

                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
                
                setIsLoggedIn(true);
                navigate("/");
            } else {
                // 백엔드에서 성공은 했지만 추가 실패 로직이 있는 경우
                setError(response.data.message || "로그인에 실패했습니다.");
            }
        } catch (err) {
            // 네트워크 오류 또는 인증 실패 처리
            if (err.response) {
                console.error("서버 응답 오류: ", err.response.data);
                setError(err.response.data.detail || "아이디 또는 비밀번호가 올바르지 않습니다.");
            } else {
                console.error("로그인 오류: ", err);
                setError("네트워크 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <label>ID:</label>
                <input type="text" name="userid" value={formData.userid} onChange={handleChange} required />
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <button type="submit">로그인</button>
            </form>
            {error && <p className="error">{error}</p>} {/*에러 메시지 표시 */}
        </div>
    );
};

export default LogIn;
