import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchResult from "./SearchResult";
import './SearchResultPage.css'

function SearchResultPage() {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const location = useLocation(); // Hook to access the query parameters

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("query");
        setQuery(searchQuery);

        if (searchQuery) {
            const fetchResults = async () => {
                try {
                    const response = await fetch(`/movie/api/search/movies/?query=${searchQuery}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch search results");
                    }

                    const data = await response.json();
                    setResults(data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchResults();
        }
    }, [location.search]);

    return (
        <div className="search-result-page">
            <div className="search-result-header">
                <h1>영화 검색 결과</h1>
            </div>
            
            {results.length > 0 ? (
                <SearchResult results={results} />
            ) : (
                <div className="no-results">검색 결과가 없습니다.</div>
            )}
        </div>
    );
}

export default SearchResultPage;