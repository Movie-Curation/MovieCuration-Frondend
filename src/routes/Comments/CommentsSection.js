import React, { useEffect, useState } from "react";
import axios from "axios";
import './CommentsSection.css';


const CommentsSection = ({ review_id, isLoggedIn, loggedInUser }) => {
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState("");
    const [editComment_id, setEditComment_id] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [visibleCount, setVisibleCount] = useState(3);

    // 백엔드에 저장된 리뷰 댓글 불러오기
    useEffect(() => {
        const fetchComments = async () => {
            try {
            const response = await axios.get(`http://localhost:8000/api/accounts/reviews/${review_id}/comments/`);
            console.log("댓글 데이터:", response.data);
            setComments((prevComments) => ({
                ...prevComments,
                [review_id]: response.data, // review_id별로 배열 저장
            }));
            } catch (error) {
            console.error("Error fetching comments: ", error);
            }
        };

        fetchComments();
    }, [review_id]);

    // 리뷰 댓글 작성 후 백엔드로 전송
    const handleAddComment = async () => {
        if (!newComment.trim()) return ;

        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.post(`http://localhost:8000/api/accounts/reviews/${review_id}/comments/create/`, {
                content: newComment,
                review: review_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setComments((prevComments) => ({
                ...prevComments,
                [review_id]: [...(prevComments[review_id] || []), response.data], // 배열에 댓글 추가
            }));
            setNewComment(""); // 입력 필드 초기화
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    };

    // 리뷰 댓글 수정
    const handleEditComment = async (comment_id) => {
        if (!editCommentContent.trim()) return;
    
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                `http://localhost:8000/api/accounts/comments/${comment_id}/update/`,
                { content: editCommentContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            // 댓글 수정 후 업데이트
            setComments((prevComments) => {
                const updatedComments = { ...prevComments }; // 기존 상태 복사
                if (Array.isArray(updatedComments[review_id])) {
                    updatedComments[review_id] = updatedComments[review_id].map((comment) =>
                        comment.id === comment_id ? response.data : comment
                    );
                }
                return updatedComments;
            });
    
            setEditComment_id(null); // 수정 모드 종료
            setEditCommentContent(""); // 입력 필드 초기화
        } catch (error) {
            console.error("Error editing comment: ", error);
        }
    };

    // 리뷰 댓글 삭제
    const handleDeleteComment = async (comment_id) => {
        try {
            const token =localStorage.getItem("access_token");
            await axios.delete(`http://localhost:8000/api/accounts/comments/${comment_id}/delete/`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            setComments((prevComments) => {
                const updatedComments = { ...prevComments }; // 기존 상태 복사
                if (Array.isArray(updatedComments[review_id])) {
                    updatedComments[review_id] = updatedComments[review_id].filter(
                        (comment) => comment.id !== comment_id
                    );
                }
                return updatedComments;
            });
        } catch (error) {
            console.error("Error deleting comment: ", error);
        }
    };

    // 댓글이 4개 이상 있을 경우 추가 로드("더 보기")
    const handleShowMoreComments = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    return (
        <div className="comments-section">
            {/* 댓글 목록 */}
            {(Array.isArray(comments[review_id]) ? comments[review_id] : []).slice(0, visibleCount).map((comment) => (
                <div key={comment.id} className="comment-item">
                    {editComment_id === comment.id ? (
                        <div>
                            <textarea
                                value={editCommentContent}
                                onChange={(e) => setEditCommentContent(e.target.value)}
                            />
                            <button onClick={() => handleEditComment(comment.id)}>수정 완료</button>
                            <button onClick={() => setEditComment_id(null)}>취소</button>
                        </div>
                    ) : (
                        <div>
                            <p>
                                <strong>{comment.user|| "익명"}</strong>: {comment.content}
                            </p>
                            <p>{new Date(comment.created_at).toLocaleString()}</p>
                            {isLoggedIn && comment.user === loggedInUser && ( // 로그인한 사용자 본인만 수정/삭제 버튼 표시
                                <div className="comment-actions">
                                    <button
                                        onClick={() => {
                                            setEditComment_id(comment.id);
                                            setEditCommentContent(comment.content);
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
    
            {/* 댓글 더 보기 버튼 */}
            {Array.isArray(comments[review_id]) && comments[review_id].length > visibleCount && (
                <button onClick={handleShowMoreComments}>더 보기</button>
            )}
    
            {/* 댓글 작성 */}
            {isLoggedIn ? (
                <div className="add-comment">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 작성하세요"
                    />
                    <button onClick={handleAddComment}>댓글 추가</button>
                </div>
            ) : (
                <p>댓글을 작성하려면 로그인하세요.</p>
            )}
        </div>
    );
};

export default CommentsSection;