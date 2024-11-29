import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "./ChatApp.css";

function ChatApp({ isLoggedIn }) {
  // const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // 현재 대화 저장
  const [input, setInput] = useState(""); // 입력 필드 값
  const [conversations, setConversations] = useState([]); // 모든 대화 저장
  const [activeConversation, setActiveConversation] = useState(null); // 현재 활성화된 대화
  const chatContainerRef = useRef(null); // 채팅 스크롤 참조

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessages = [
      ...messages,
      { type: "user", text: input },
      { type: "ai", text: `AI 응답: ${input}` },
    ];
    setMessages(newMessages);
    setInput(""); // 입력창 초기화
  };

  // 엔터키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // 스크롤 하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 로그인 여부 확인 후 로그인 하지 않았으면 로그인 페이지로 리디렉션
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     alert("로그인 후 AI 채팅을 이용할 수 있습니다.");
  //     navigate('/login');
  //   }
  // }, [isLoggedIn, navigate]);

  // if (!isLoggedIn) {
  //   return null;
  // }

  // 새 채팅 생성
  const handleNewChat = () => {
    if (messages.length > 0) {
      setConversations([
        ...conversations,
        { id: conversations.length, messages },
      ]);
    }
    setMessages([]);
    setActiveConversation(null);
  };

  // 기존 채팅 불러오기
  const handleSelectConversation = (id) => {
    const selectedConversation = conversations.find((conv) => conv.id === id);
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
      setActiveConversation(id);
    }
  };

  // 채팅 삭제
  const handleDeleteConversation = (id) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== id);
    setConversations(updatedConversations);

    // 삭제된 대화가 현재 활성화된 대화인 경우 메시지를 초기화
    if (activeConversation === id) {
        setMessages([]);
        setActiveConversation(null);
    }
  }

  return (
    <div className="chat-container">
      {/* 사이드바 */}
      <div className="chat-sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>
          + 새 채팅
        </button>
        <div className="chat-history">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`chat-item ${
                activeConversation === conversation.id ? "active" : ""
              }`}
            >
              <div
                className="chat-title"
                onClick={() => handleSelectConversation(conversation.id)}
              >
                채팅 {conversation.id + 1}
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteConversation(conversation.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="chat-main">
        <div className="chat-content" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.type === "user" ? "user" : "ai"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        {/* 입력창 */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="메시지를 입력하세요..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
