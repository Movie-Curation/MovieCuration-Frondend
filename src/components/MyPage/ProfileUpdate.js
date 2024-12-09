import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProfileUpdate.css';

const ProfileUpdate = ({ onClose }) => { // onClose prop 추가
    const [formData, setFormData] = useState({
        id: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        nickname: "",
        profileImage: null
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get("http://localhost:8000/api/accounts/profile/",
                    {headers: {
                        "Authorization": `Bearer ${token}`
                    }}
                );
                setFormData({
                    id: response.data.id,
                    email: response.data.email,
                    password: "",
                    confirmPassword: "",
                    name: response.data.name,
                    gender: response.data.gender,
                    nickname: response.data.nickname,
                    profileImage: null
                });
            } catch (error) {
                console.error("프로필 데이터 불러오기 오류: ", error);
                setErrorMessage("프로필 정보를 불러오는 중 문제가 발생했습니다.");
            }
        };

        fetchProfileData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            profileImage:file
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (formData.password && formData.password !== formData.confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                data.append(key, formData[key]);
            }
        }

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                "http://localhost:8000/api/accounts/profile/update/",
                data,
                { headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200) {
                setSuccessMessage("프로필 정보가 성공적으로 업데이트되었습니다.");
                console.log("Response data: ", response.data);
            } else {
                setErrorMessage(response.data.message || "프로필 업데이트에 실패했습니다.");
            }
        } catch (error) {
            console.error("프로필 업데이트 오류: ", error);
            setErrorMessage("프로필 업데이트 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="profile-update-modal">
            <div className="profile-update-container">
                <button className="close-btn" onClick={onClose}>닫기</button> {/* 닫기 버튼 */}
                <h2>회원 정보 수정</h2>
                <form onSubmit={handleSubmit}>
                    {/* 폼 입력 필드 */}
                    <label>ID:</label>
                    <input type="text" name="id" value={formData.id} placeholder="아이디는 변경할 수 없습니다." disabled />

                    <label>이메일:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>비밀번호:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />

                    <label>비밀번호 확인:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

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

                    <label>프로필 이미지:</label>
                    <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button type="submit">프로필 업데이트</button>
                </form>

                {successMessage && <p className="success">{successMessage}</p>}
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default ProfileUpdate;
