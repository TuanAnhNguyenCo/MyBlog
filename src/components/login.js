import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import './login.css'; // Import your CSS file for styling
import { useEffect } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    useEffect(() => {

        var us = localStorage.getItem("username")
        var ps = localStorage.getItem("password")
        console.log(us,ps)

        if (us && ps) {
            handleLogin()
        }
    }, []
    )

    const handleLogin = () => {

        // Your Flask server URL
        const serverURL = 'http://127.0.0.1:5000/api/login';
        var us = localStorage.getItem("username")
        var ps = localStorage.getItem("password")
        var accountData = {}
        if (us && ps) {
            accountData = {
                username: us,
                password: ps
            };
        } else accountData = {
            username: username,
            password: password
        };
        // Dummy account data

        
        // Make an AJAX request using fetch
        fetch(serverURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },

            body: JSON.stringify(accountData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setIsLoggedIn(true);
                    localStorage.setItem("username", accountData.username)
                    localStorage.setItem("password", accountData.password)
                    localStorage.setItem("id", data.id)
                } else alert('Error: ' + data.message);

            })
            .catch(error => {
                setIsLoggedIn(false);
                alert('Error:', error);
            });

    }


    if (isLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login-container">

            <form className="login-form">
                <h2>Login</h2>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button onClick={e => {
                    e.preventDefault()
                    handleLogin(e)
                }
                }>Login</button>
            </form>
        </div>
    );
}

export default Login;