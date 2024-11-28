import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(query);
        }
    };
    
    // 엔터 키 누르면 검색
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>검색</button>
        </div>
    );
}

export default SearchBar;