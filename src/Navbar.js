import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./routes/Search/SearchBar";
import GenreDropdown from "./components/MovieGenre/GenreDropdown";
import "./Navbar.css";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const [query, setQuery] = useState("");
    const [isDropdownOpen, setIsDropDownOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const dropdownRef = useRef(null);

    // 장르 id 장르명으로 변경하는 함수
    const getGenreNameById = (id) => {
        const genreMap = {
            28: "액션",
            12: "모험",
            16: "애니메이션",
            35: "코미디",
            80: "범죄",
            99: "다큐멘터리",
            18: "드라마",
            10751: "가족",
            14: "판타지",
            36: "역사",
            27: "공포",
            10402: "음악",
            9648: "미스터리",
            10749: "로맨스",
            878: "SF",
            10770: "TV영화",
            53: "스릴러",
            10752: "전쟁",
            37: "서부극"
        };
        return genreMap[id] || "기타";
    };

    // 스크롤 이벤트 처리 함수
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setShowNav(false);
            } else {
                setShowNav(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // 장르 드롭다운에서 장르명 불러오는 함수
    useEffect(() => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=ko-KR`
                );
                const genreList = response.data.genres.map((genre) => ({
                    id: genre.id,
                    name: getGenreNameById(genre.id)
                }));
                setGenres(genreList);
            } catch (error) {
                console.error("장르 정보를 가져오는 데 실패했습니다.", error);
            }
        };

        fetchGenres();
    }, []);

    // 장르 목록 드롭다운
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropDownOpen(false);
            }
        };
        
        if(isDropdownOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => { // 드롭다운 창 밖을 클릭하면 드롭다운이 닫힘
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isDropdownOpen]);

    // 검색창 함수
    const handleSearch = (query) => {
        setQuery(query);
        navigate(`/search/${query}`);
    };

    // 로고 클릭하면 메인으로 돌아오는 함수
    const handleLogoClick = () => {
        navigate("/");
    }

    // 로그인 버튼 클릭하면 로그인 창으로 이동
    const handleLoginClick = () => {
        navigate("/login");
    };

    // 로그아웃 후 메인화면으로 이동
    const handleLogOut = () => {
        setIsLoggedIn(false);
        navigate("/");
    };

    // 회원가입 버튼 클릭하면 회원가입 창으로 이동
    const handleSignUpClick = () => {
        navigate("/signup");
    };

    // 로그인 후 클릭하면 마이페이지로 이동
    const handleMyPageClick = () => {
        navigate("/mypage");
    };

    // 장르 드롭다운에서 장르 클릭하면 이동/genreId? genre_id? 일단 TMDB에는 genreId로 되어있음
    const handleGenreClick = (genreId) => { 
        setIsDropDownOpen(false);
        navigate(`/genre/${genreId}`);
    };

    // 고객지원 페이지로 이동
    const handleCustomerSupportClick = () => {
        navigate("customer-support");
    }

    return (
        <header className={`navbar ${showNav ? "show" : "hide"}`}>
            <div className="navbar__top">
                <div className="logo" onClick={handleLogoClick}>AI-Curator</div>
                <SearchBar onSearch={handleSearch} />
                {isLoggedIn ? ( // 로그인 시 상단 navigation bar 버튼 변경
                    <>
                    <button className="my-page-btn" onClick={handleMyPageClick}>마이페이지</button>
                    <button className="logout-btn" onClick={handleLogOut}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <button className="login-btn" onClick={handleLoginClick}>로그인</button>
                        <button className="signup-btn" onClick={handleSignUpClick}>회원가입</button>
                    </>
                )}
                <button className="customer-service-btn" onClick={handleCustomerSupportClick}>고객지원</button>
            </div>
            <div className="navbar__bottom">
                <div className="category" onClick={() => setIsDropDownOpen((prev) => !prev)}>카테고리</div>
                <button className="ai-btn">Your AI</button>
            </div>

            {isDropdownOpen && (
                <div ref={dropdownRef}>
                    <GenreDropdown genres={genres} onGenreClick={handleGenreClick} />
                </div>
            )}
        </header>
    );
}

export default Navbar;