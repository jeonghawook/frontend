import axios from 'axios';
import jwt_decode from 'jwt-decode';
import useAuthStore from '../api/store';

const baseURL = 'http://localhost:3300';

const instance = axios.create({
  baseURL,
  timeout: 20000,
});

const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp <= currentTime;
};

const Interceptor = () => {
  const { isLogIn, email, isAdmin, login, logout } = useAuthStore();

  // Request interceptor
  instance.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) {
      return config;
    }

    if (!isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    } else {
      try {
        const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        const decodedToken = jwt_decode(newAccessToken);
        const { email, userId, isAdmin } = decodedToken;

        login(email, isAdmin, userId);

        config.headers.Authorization = `Bearer ${newAccessToken}`;

        return config;
      } catch (error) {
        console.error(error);
        logout();
      }
    }
  }, (error) => {
    return Promise.reject(error);
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );

  return null; // or you can return any JSX component if needed
};

export default instance;
