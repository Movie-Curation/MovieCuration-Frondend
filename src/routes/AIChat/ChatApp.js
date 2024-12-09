import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Axios 추가
import "./ChatApp.css";
import { useNavigate } from "react-router-dom";

function ChatApp({ isLoggedIn }) {
  const [messages, setMessages] = useState([]);
  const [newChatTitle, setNewChatTitle] = useState("새 채팅");
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingConversation, setEditingConversation] = useState(null);
  const [newTitle, setNewTitle] = useState(""); // 새로운 제목
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  const API_BASE_URL = "http://localhost:8000/ai/api"; // 백엔드 API 기본 URL

  // 토큰 갱신 함수
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("갱신 토큰이 없습니다.");
      const response = await axios.post(`http://localhost:8000/api/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      navigate("/login");
      throw error;
    }
  };

  // API 요청 함수 (토큰 자동 처리)
  const sendRequestWithToken = async (url, method = "GET", data = null) => {
    try {
      let token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      return await axios({ url, method, data, headers });
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          const headers = { Authorization: `Bearer ${newToken}` };
          return await axios({ url, method, data, headers });
        } catch (refreshError) {
          console.error("갱신 후 요청 실패:", refreshError);
          throw refreshError;
        }
      }
      throw error;
    }
  };

  // 로그인 여부 확인
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 메시지 전송 함수
  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // 입력창 초기화
    setIsLoading(true); // 로딩 시작

    try {
      const url = `${API_BASE_URL}/chatbot/${activeConversation || 1}`;
      const response = await sendRequestWithToken(url, "POST", { message: input });
      const aiMessage = { type: "ai", text: response.data.ai_response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("메시지 전송 중 오류:", error);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "오류가 발생했습니다. 다시 시도해주세요."},
      ]);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 새 채팅 생성
  const handleNewChat = async () => {
    try {
      const url = `${API_BASE_URL}/chatbox/create/`;
      const response = await sendRequestWithToken(url, "POST", { title: newChatTitle });
      setConversations((prev) => [
        ...prev,
        { id: response.data.chatbox_id, title: response.data.title, messages: [] },
      ]);
      setMessages([]);
      setActiveConversation(response.data.chatbox_id);
      setNewChatTitle("새 채팅");
    } catch (error) {
      console.error("새 채팅 생성 오류:", error);
    }
  };

  // 기존 채팅 불러오기
  const handleSelectConversation = async (chatbox_id) => {
    if (isLoading) return; // 로딩 중에는 다른 채팅 선택 방지
    setIsLoading(true); //로딩 시작
    try {
      const url = `${API_BASE_URL}/chatbox/${chatbox_id}/log/`;
      const response = await sendRequestWithToken(url, "GET");
      setMessages(response.data.logs.map((log) => ({
        type: log.is_from_user ? "user" : "ai",
        text: log.message,
      })));
      setActiveConversation(chatbox_id);
    } catch (error) {
      console.error("채팅 불러오기 오류:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 채팅 삭제
  const handleDeleteConversation = async (chatbox_id) => {
    try {
      const url = `${API_BASE_URL}/chatbox/${chatbox_id}/delete/`;
      const response = await sendRequestWithToken(url, "DELETE");
      setConversations((prev) => prev.filter((conv) => conv.id !== chatbox_id));
      if (activeConversation === chatbox_id) {
        setMessages([]);
        setActiveConversation(null);
      }
    } catch (error) {
      console.error("채팅 삭제 오류:", error);
    }
  };

  // 제목 수정 API 호출
  const handleUpdateTitle = async (chatbox_id) => {
    if (!newTitle.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    try {
      const url = `${API_BASE_URL}/chatbox/${chatbox_id}/update/`;
      await sendRequestWithToken(url, "PATCH", { new_title: newTitle });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === chatbox_id ? { ...conv, title: newTitle } : conv
        )
      );
      setEditingConversation(null);
      setNewTitle("");
    } catch (error) {
      console.error("제목 수정 중 오류:", error);
      alert("제목 수정에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      {/* 사이드바 */}
      <div className="chat-sidebar">
        <button className="new-chat-btn" onClick={handleNewChat} disabled={isLoading}>
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
              {editingConversation === conversation.id ? (
                <div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="새 제목 입력"
                  />
                  <button onClick={() => handleUpdateTitle(conversation.id)}>
                    저장
                  </button>
                  <button onClick={() => setEditingConversation(null)}>
                    취소
                  </button>
                </div>
              ) : (
                <div className="chat-title"
                      onClick={() => handleSelectConversation(conversation.id)}>
                  {conversation.title}
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingConversation(conversation.id);
                      setNewTitle(conversation.title);
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteConversation(conversation.id)}
                    disabled={isLoading}
                  >X</button>
                </div>
              )}
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
          {isLoading && (
            <div className="chat-message ai">AI 응답을 기다리는 중...</div>
          )}
        </div>

        {/* 입력창 */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="메시지를 입력하세요..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            disabled={isLoading} // 로딩 중 입력창 비활성화
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? "전송 중..." : "전송"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
