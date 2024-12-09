import React, { useState } from "react";
import axios from "axios";
import './SignUp.css';

const genres = [
    {id:28, name: "액션"},
    {id:12, name: "모험"},
    {id:16, name: "애니메이션"},
    {id:35, name: "코미디"},
    {id:80, name: "범죄"},
    {id:99, name: "다큐멘터리"},
    {id:18, name: "드라마"},
    {id:10751, name: "가족"},
    {id:14, name: "판타지"},
    {id:36, name: "역사"},
    {id:27, name: "공포"},
    {id:10402, name: "음악"},
    {id:9648, name: "미스터리"},
    {id:10749, name: "로맨스"},
    {id:878, name: "SF"},
    {id:10770, name: "TV영화"},
    {id:53, name: "스릴러"},
    {id:10752, name: "전쟁"},
    {id:37, name: "서부극"}
]

const SignUp = ({ onClose }) => {
    const [formData, setFormData] = useState({
        userid: "",
        email: "",
        password: "",
        password2: "",
        name: "",
        gender: "",
        nickname: "",
        favoriteGenres: [],
        profileImage: null
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

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profileImage: e.target.files[0]
        });
    };

    const handleGenreChange = (e) => {
        const { value, checked } = e.target;
        const genreId = parseInt(value, 10);

        if (checked) {
            setFormData((prevState) => ({
                ...prevState,
                favoriteGenres: [...prevState.favoriteGenres, genreId]
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                favoriteGenres: prevState.favoriteGenres.filter((id) => id !== genreId)
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (formData.password !== formData.password2) {
            setErrorMessage("비밀번호가 일치하지 않습니다.")
            return;
        }

        try {
            const form = new FormData(); // FormData 객체 생성
            form.append("userid", formData.userid);
            form.append("email", formData.email);
            form.append("password", formData.password);
            form.append("password2", formData.password2);
            form.append("name", formData.name);
            form.append("gender", formData.gender);
            form.append("nickname", formData.nickname);
            formData.favoriteGenres.forEach((genreId) => form.append("genres", genreId));
            if (formData.profileImage) {
                form.append("profile_image", formData.profileImage); // 이미지 파일 추가
            }

            const response = await axios.post(
                "http://localhost:8000/api/accounts/register/",
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // 멀티파트 데이터로 설정
                    },
                }
            );

            setSuccessMessage("회원가입이 완료되었습니다.");
            setTimeout(() => onClose(), 2000); // 성공 메시지 후 2초 후 모달 닫기
        } catch (error) {
            if (error.response) {
                console.error("Validation Errors:", error.response.data);
                console.log (error);
                setErrorMessage(error.response.data.message || "회원가입에 실패했습니다.");
            } else {
                setErrorMessage("네트워크 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="signup-modal" onClick={onClose}>
            <div className="signup-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={onClose}>닫기</button>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <label>ID:</label>
                <input type="text" name="userid" value={formData.userid} onChange={handleChange} required />

                <label>이메일:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>비밀번호:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>비밀번호 확인:</label>
                <input type="password" name="password2" value={formData.password2} onChange={handleChange} required />

                <label>이름:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>성별:</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">선택하세요</option>
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                    <option value="O">기타</option>
                </select>

                <label>닉네임:</label>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required />

                <label>좋아하는 영화 장르:</label>
                <div className="genre-checkboxes">
                    {genres.map((genre) => (
                        <div key={genre.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={genre.id}
                                    checked={formData.favoriteGenres.includes(genre.id)}
                                    onChange={handleGenreChange}
                                />
                                {genre.name}
                            </label>
                        </div>
                    ))}
                </div>

                <label>프로필 이미지:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                
                <button type="submit">회원가입</button>
            </form>

                {successMessage && <p className="success">{successMessage}</p>}
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default SignUp;