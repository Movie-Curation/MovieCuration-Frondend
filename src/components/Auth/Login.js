import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const LogIn = ({ setIsLoggedIn }) => {
    const [formData, setFormData] = useState({
        id: "",
        password: ""
    });

    const [error, setError] = useState("") // 에러 메시지 상태 관리
    const navigate = useNavigate();

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
            const response = await axios.post("http://localhost:8000/api/login/", {
                id: formData.id,
                password: formData.password
            }); // 여기서 로그인 API 엔드포인트는 'api/login/' 필요하면 나중에 수정

            // 로그인 성공 처리
            if (response.status === 200 && response.data.success) {
                console.log("로그인 성공: ", response.data);
                setIsLoggedIn(true);
                navigate("/");
            } else {
                // 백엔드에서 성공은 했지만 추가 실패 로직이 있는 경우
                setError(response.data.message || "로그인에 실패했습니다.");
            }
        } catch (err) {
            // 네트워크 오류 또는 인증 실패 처리
            console.error("로그인 오류: ", err);
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <label>ID:</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} required />
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <button type="submit">로그인</button>
            </form>
            {error && <p className="error">{error}</p>} {/*에러 메시지 표시 */}
        </div>
    );
};

export default LogIn;