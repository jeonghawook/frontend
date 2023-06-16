import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import jwt_decode from "jwt-decode";

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin, nickname } = useSelector((state) => state);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    dispatch({ type: 'LOGOUT' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email,
          password,
        });
  
        const accessToken = response.data.accessToken;
        const decodedToken = jwt_decode(accessToken); 
        const { nickname, isAdmin } = decodedToken;
  
       
        console.log('Access Token:', accessToken);
        console.log('Nickname:', nickname);
        console.log('Is Admin:', isAdmin);
  
        Cookies.set('access_token', accessToken);
        dispatch({ type: 'LOGIN', payload: { isAdmin, nickname } });

      } catch (error) {
        console.error('Login failed:', error);
      }
    
   
  };

  return (
    <header>
      <nav>
        {isLoggedIn && isAdmin ? (
          <ul>
            <li>
              Welcome, {nickname} (Admin)
            </li>
            <li>
            
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        ) : isLoggedIn && !isAdmin ? (
          <ul>
            <li>
              Welcome, {nickname}
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <form onSubmit={handleLogin}>
                <div>
                  <label>Email:</label>
                  <input type="text" value={email} onChange={handleEmailChange} />
                </div>
                <div>
                  <label>Password:</label>
                  <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <button type="submit">Login</button>
              </form>
            </li>
            <li>
              <a href="/signup">Sign up</a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
