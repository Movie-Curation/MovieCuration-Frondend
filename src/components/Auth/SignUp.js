import React, { useState } from "react";
import axios from "axios";
import './SignUp.css';

const genres = [
    "액션", "모험", "애니메이션", "코미디", "범죄", "다큐멘터리", "드라마",
    "가족", "판타지", "역사", "공포", "음악", "미스터리", "로맨스", "SF",
    "TV영화", "스릴러", "전쟁", "서부극"
]

const SignUp = () => {
    const [formData, setFormData] = useState({
        id: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        nickname: "",
        favoriteGenres: []
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleGenreChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setFormData((prevState) => ({
                ...prevState,
                favoriteGenres: [...prevState.favoriteGenres, value]
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                favoriteGenres: prevState.favoriteGenres.filter((genre) => genre !== value)
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.")
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/signup/", formData); 
            // API 엔드포인트는 api/signup/

            if (response.status === 201) {
                setSuccessMessage("회원가입이 완료되었습니다.");
                console.log("Response data: ", response.data);
                setFormData({
                    id: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    name: "",
                    gender: "",
                    nickname: "",
                    favoriteGenres: []
                }); // 폼 초기화
            } else {
                setErrorMessage(response.data.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원가입 오류: ", error);
            setErrorMessage("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <label>ID:</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} required />

                <label>이메일:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>비밀번호:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>비밀번호 확인:</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

                <label>이름:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>성별:</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">선택하세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="secret">비밀</option>
                </select>

                <label>닉네임:</label>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required />

                <label>좋아하는 영화 장르:</label>
                <div className="genre-checkboxes">
                    {genres.map((genre) => (
                        <div key={genre}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={genre}
                                    checked={formData.favoriteGenres.includes(genre)}
                                    onChange={handleGenreChange}
                                />
                                {genre}
                            </label>
                        </div>
                    ))}
                </div>
                
                <button type="submit">회원가입</button>
            </form>

                {successMessage && <p className="success">{successMessage}</p>}
                {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
};

export default SignUp;

