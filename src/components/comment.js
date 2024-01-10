import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import './comments.css'; // Import file CSS cho component


const PostComponent = ({ post, content, users }) => {
    const [commentInput, setCommentInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);


    // Xử lý sự kiện mousedown ngoài màn hình
    window.addEventListener("mousedown", () => {
        setIsModalOpen(false)
    });

    const handleCommentInputChange = (event) => {
        setCommentInput(event.target.value);
    };

    const handleCommentSubmit = (event) => {
        if (event.key === 'Enter' && commentInput.trim() !== '') {
            // Thực hiện hàm xử lý gửi bình luận tại đây
            console.log(`Gửi bình luận: ${commentInput}`);
            // Đặt lại trạng thái của ô nhập liệu
            setCommentInput('');
        }
    };

    const handleCommentSummaryClick = () => {
        setSelectedPost(post);
        setIsModalOpen(true);
        // Thực hiện xử lý khi click vào tổng số bình luận
        console.log('Click vào tổng số bình luận');
    };

    const CommentModal = ({ post, content, users, isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div style={{
                        overflow: "scroll",
                        height: "70vh"
                    }}>
                        <div className="user-info">

                            <img style={{
                                height: "50px",
                                width: "50px"
                            }} src='avatar.jpeg' alt="User Icon" className="user-icon" />
                            <span className="user-name">
                                {users.find((user) => {

                                    if (user.id == content.user_id) {
                                        console.log("user: ", user, content.user_id)
                                        return user
                                    }

                                })?.username}
                            </span>
                        </div>


                        <h3>{content.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: content.content }} />
                        {content.img_url !== "uploads/NULL" && (
                            <img src={content.img_url} alt={`Image for ${content.title}`} className="image-preview" />
                        )}
                        {content.audio_url !== "uploads/NULL" && (
                            <audio controls>
                                <source src={content.audio_url} />
                            </audio>
                        )}

                        <hr style={{ marginBottom: "20px", marginTop: "20px" }} />
                        <div className="comment-summary" >
                            <FontAwesomeIcon icon={faComment} /> {post.comments.length} Comments
                        </div>

                        {post.comments.map((p, index) => (
                            <div key={index} className="comment-container">
                                <img src='avatar.jpeg' alt="User Avatar" className="user-avatar" />
                                <div className="comment-content">
                                    <p className="comment-text">{p.text}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="comment-input-container-full">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className={`comment-box ${commentInput !== '' ? 'expanded' : ''}`}
                            value={commentInput}
                            onChange={handleCommentInputChange}
                            onKeyPress={handleCommentSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="comments-section">
            <div className="comment-summary" onClick={handleCommentSummaryClick}>
                <FontAwesomeIcon icon={faComment} /> {post.comments.length} Comments
            </div>



            {selectedPost &&
                <CommentModal
                    post={selectedPost}
                    content={content}
                    users={users}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            }

            {post.comments.length > 0 ? (
                <div className="comment-container">
                    <img src='avatar.jpeg' alt="User Avatar" className="user-avatar" />
                    <div className="comment-content">
                        <p className="comment-text">{post.comments[0].text}</p>
                    </div>
                </div>
            ) : null}

            <div className="comment-input-container">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    className={`comment-box ${commentInput !== '' ? 'expanded' : ''}`}
                    value={commentInput}
                    onChange={handleCommentInputChange}
                    onKeyPress={handleCommentSubmit}
                />
            </div>
        </div>
    );
};

export default PostComponent;