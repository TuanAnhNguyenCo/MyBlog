import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

function CreateBlog() {
    const { isLoggedIn } = useContext(AuthContext);

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h2>Create a new blog post</h2>
            {/* Add your blog creation form here */}
        </div>
    );
}

export default CreateBlog;