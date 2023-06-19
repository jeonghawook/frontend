import React, { useState } from 'react';
import  useAuthStore from '../api/store';
import jwt_decode from 'jwt-decode'
import instance  from '../api/interceptor';

const Header = () => {
  const { isLogIn, email, isAdmin, logout, login } = useAuthStore();
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post(`/auth/login`, {
        email :userEmail,
        password,
      });
      console.log("login")
      if (response) {
        const refreshToken = response.data.refreshToken;
        const accessToken = response.data.accessToken;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const decodedToken = jwt_decode(accessToken);
        const { isAdmin, email, userId } = decodedToken;

        login(email, isAdmin, userId);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <header>
      <nav>
        {isLogIn && isAdmin ? (
          <ul>
            <li>
              Welcome, {email}
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        ) : isLogIn && !isAdmin ? (
          <ul>
            <li>
              Welcome, {email}
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
                  <input type="text" value={userEmail} onChange={handleEmailChange} />
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