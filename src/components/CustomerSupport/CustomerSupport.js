import React, { useState } from "react";
import "./CustomerSupport.css";

const CustomerSupport = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null);
    
    const faqs = [
        { question: "로그인 버튼이 보이지 않아요", answer: "브라우저를 새로고침하거나 쿠키를 삭제해 보세요."},
        { question: "찾는 영화가 없어요", answer: "다른 키워드로 검색해 보세요."},
        { question: "DB 정보가 올바르지 않아요.", answer: "관리자에게 문의해 주세요. support@example.com"},
        { question: "리뷰를 쓸 수 없어요.", answer: "로그인 상태를 확인하고, 인터넷 연결 상태를 점검하세요."}
    ];

    const filteredFaqs = faqs.filter((faq) => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const toggleAnswer = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    }

return (
    <div className="customer-support">
        <div className="search-bar">
            <input
                type="text"
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <h2 className="faq-header">FAQ</h2>
        <div className="faq-list">
            {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                    <div key={index} className="faq-item-container">
                        <div
                            className="faq-item"
                            onClick={() => toggleAnswer(index)}
                        >
                            {faq.question}
                        </div>
                        {expandedIndex === index && (
                            <div className="faq-answer">
                                {faq.answer}
                            </div>
                            )}
                    </div>
                ))
            ) : (
                <p className="no-results">결과가 없습니다.</p>
            )}
        </div>
    </div>
    );
};

export default CustomerSupport;