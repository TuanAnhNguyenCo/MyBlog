import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AuthContext from './AuthContext';
import './header.css';

function Header() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [showLogout, setShowLogout] = useState(false);

    const handleLogout = () => {
        // Add logic to perform logout (e.g., clear token, redirect to login page)
        setIsLoggedIn(false); // Set isLoggedIn state to false
        localStorage.removeItem('username')
        localStorage.removeItem('password')
    };

    return (
        <header className="main-header">
            <div className="logo">
                Tuấn Anh
            </div>
            <div className="nav-links">
                {isLoggedIn && (
                    <>
                        <Link to="/">Home</Link>
                    </>
                )}
            </div>
            <div className={`logout-button ${showLogout ? 'active' : ''}`} onClick={() => setShowLogout(!showLogout)}>
                <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
            {showLogout && (
                <div className="logout-options">
                    <button onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;