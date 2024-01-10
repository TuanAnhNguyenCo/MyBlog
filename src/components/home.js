import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFileAudio } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import AuthContext from './AuthContext';
import './home.css';
import { useEffect } from 'react';
import Avatar from "./avatar.jpeg"

function Home() {
    const { isLoggedIn } = useContext(AuthContext);
    const [newBlogTitle, setNewBlogTitle] = useState('');
    const [newBlogContent, setNewBlogContent] = useState('');
    const [files, setFiles] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);

    const serverURL = 'http://127.0.0.1:5000/api/blog';
    useEffect(() => {

        fetch(serverURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {

                setBlogs(data['blogs']);

            })
            .catch(error => {
                console.error('Error:', error);
            });

        fetch("http://127.0.0.1:5000/api/users", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {

                setUsers(data['users']);
                console.log('Users:', data['users']);

            })
            .catch(error => {
                console.error('Error:', error);
            });


    }, [files]
    )



    const handleCreateBlog = async () => {
        // Assuming newBlogTitle, newBlogContent, and files are already defined

        // Prepare the data to send to the server
        var img_url = "NULL"
        var audio_url = "NULL"
        if (files.length > 0) {
            if (files[0].isImage) {
                img_url = files[0].path
            } else audio_url = files[0].path
        }
        var formData = {
            user_id: localStorage.getItem('id'),
            title: newBlogTitle,
            content: newBlogContent,
            img_url: img_url,
            audio_url: audio_url,
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/create-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Blog post created successfully');
                setNewBlogContent("")
                setNewBlogTitle("")
                // Handle success, e.g., update your state or redirect to another page
            } else {
                console.error('Failed to create blog post');
                // Handle the error, e.g., show an error message to the user
            }
        } catch (error) {
            console.error('Error while creating blog post', error);
            // Handle the error, e.g., show an error message to the user
        }

        formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        fetch('http://127.0.0.1:5000/api/upload_file', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                setFiles([])
                // Handle server response (e.g., display success message or error)
            })
            .catch((error) => {
                // Handle errors
            });

    };



    const { getRootProps, getInputProps } = useDropzone({
        accept: ['image/*', 'audio/*'],
        onDrop: (acceptedFiles) => {

            const updatedFiles = acceptedFiles.map((file) => {

                const updatedFile = Object.assign(file, { preview: URL.createObjectURL(file) });
                updatedFile.isImage = file.type.includes('image');
                return updatedFile;
            });
            console.log(updatedFiles)
            setFiles(updatedFiles);
        },
    });



    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    const renderPreview = files.map((file) => (
        <div key={file.name} className="file-preview">
            {file.type.includes('image') ? (
                <img src={file.preview} alt={file.name} className="image-preview" />
            ) : (
                <FontAwesomeIcon icon={faFileAudio} />
            )}
            <span>{file.name}</span>
        </div>
    ));

    const renderBlogPosts = blogs.map((post) => (


        <div key={post.id} className="blog-item">
            <div className="user-info">

                <img style={{
                    height: "50px",
                    width: "50px"
                }} src={Avatar} alt="User Icon" className="user-icon" />
                <span className="user-name">
                    {users.find((user) => {
                       
                        if (user.id == post.user_id) {
                            console.log("user: ", user, post.user_id)
                            return user
                        }

                    })?.username}
                </span>
            </div>
            {console.log(post)}
            <h3>{post.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.img_url !== "uploads/NULL" && (
                <img src={post.img_url} alt={`Image for ${post.title}`} className="image-preview" />
            )}
            {post.audio_url !== "uploads/NULL" && (
                <audio controls>
                    <source src={post.audio_url} />
                </audio>
            )}
        </div>
    ));

    return (
        <div className="home-container">
            <h2>Welcome to the Blog</h2>
            <div className="create-blog-section">

                <input
                    type="text"
                    placeholder="Enter your blog title..."
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                />
                <ReactQuill
                    placeholder="Write your new blog post here..."
                    value={newBlogContent}
                    onChange={(value) => setNewBlogContent(value)}
                />
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>
                        <FontAwesomeIcon icon={faImage} /> <span>Drag 'n' drop images</span>{' '}
                        <FontAwesomeIcon icon={faFileAudio} /> <span>or audio files here, or click to select files</span>
                    </p>
                </div>
                <div className="preview-section">{renderPreview}</div>
                <button onClick={handleCreateBlog}>Create Blog</button>
            </div>
            <div className="blog-list">
                {renderBlogPosts}
            </div>
            {/* ...rest of the code */}
        </div>
    );
}

export default Home;