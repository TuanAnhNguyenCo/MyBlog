import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import './comments.css'; // Import file CSS cho component

const PostComponent = ({ post }) => {
    const [commentInput, setCommentInput] = useState('');

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
        // Thực hiện xử lý khi click vào tổng số bình luận
        console.log('Click vào tổng số bình luận');
    };

    return (
        <div className="comments-section">
            <div className="comment-summary" onClick={handleCommentSummaryClick}>
                <FontAwesomeIcon icon={faComment} /> {post.comments.length} Comments
            </div>

            {/* {post.comments.map((comment, index) => (
                <div key={index} className="comment-container">
                    <img src={comment.userAvatar} alt="User Avatar" className="user-avatar" />
                    <div className="comment-content">
                        <p className="comment-text">{comment.text}</p>
                    </div>
                </div>
            ))} */}

            {post.comments.length > 0 ? (
                <div  className="comment-container">
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