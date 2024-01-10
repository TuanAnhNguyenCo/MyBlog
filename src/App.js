import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContext from './components/AuthContext';
import Header from './components/Header';
import Login from './components/login';
import CreateBlog from './components/CreateBlog';
import Home from './components/home';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giả sử ban đầu chưa đăng nhập

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Router>
        <Header /> {/* Thêm component Header vào đây */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;