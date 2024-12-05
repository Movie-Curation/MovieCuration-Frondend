import React, { useState } from "react";
import './SignUp.css';

const SignUp = ({ onClose }) => {
    const [formData, setFormData] = useState({
        userid: "",
        email: "",
        password: "",
        password2: "",
        name: "",
        gender: "",
        nickname: "",
        genres: []
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (formData.password !== formData.password2) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 회원가입 요청 로직
        setSuccessMessage("회원가입이 완료되었습니다.");
        setTimeout(() => onClose(), 2000); // 성공 메시지 후 2초 후 모달 닫기
    };

    return (
        <div className="signup-modal">
            <div className="signup-container">
                <button className="close-btn" onClick={onClose}>닫기</button>
                <h2>회원가입</h2>
                <form onSubmit={handleSubmit}>
                    <label>ID:</label>
                    <input
                        type="text"
                        name="userid"
                        value={formData.userid}
                        onChange={handleChange}
                        required
                    />

                    <label>이메일:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>비밀번호:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <label>비밀번호 확인:</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                    />

                    <label>이름:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>성별:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">선택하세요</option>
                        <option value="M">남성</option>
                        <option value="F">여성</option>
                        <option value="O">기타</option>
                    </select>

                    <label>닉네임:</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">회원가입</button>
                </form>

                {successMessage && <p className="success">{successMessage}</p>}
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default SignUp;