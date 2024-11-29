import React, { useState } from "react";
import "./CustomerSupport.css";

const CustomerSupport = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null);
    
    const faqs = [
        { question: "로그인 버튼이 보이지 않아요", answer: "페이지를 새로고침하거나 브라우저 캐시를 지운 후 다시 시도해 보세요. 문제가 지속되면 고객센터에 문의해 주세요."},
        { question: "찾는 영화가 없어요", answer: "영화 데이터는 주기적으로 업데이트됩니다. 다른 키워드로 검색해 보시거나 다음 업데이트를 기다려 주세요."},
        { question: "DB 정보가 올바르지 않아요.", answer: "잘못된 정보 발견 시 고객센터에 신고해 주시면 신속히 수정하겠습니다. support@example.com"},
        { question: "리뷰를 쓸 수 없어요.", answer: "로그인이 되어 있는지 확인 후, 문제가 계속되면 브라우저를 변경하거나 고객센터로 문의해 주세요."}
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