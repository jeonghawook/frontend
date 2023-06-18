import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { store } from './store'; 

const baseURL = 'http://localhost:3300';

let accessToken = Cookies.get('access_token');
let refreshToken = Cookies.get('refresh_token');

const instance = axios.create({
  baseURL,
  timeout: 20000,
});


const isTokenExpired = (token) => {
  if (!token) {
    return true; // Token is not available or invalid
  }

  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp <= currentTime;
};

// Request interceptor
instance.interceptors.request.use(async (config) => {

  if (!accessToken) {
    return config;
  }

  if (!isTokenExpired(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  } else {

    try {
      const response = await axios.post(`${baseURL}/auth/refresh`, refreshToken);
      accessToken = response.data;
      refreshToken = response.data;
      Cookies.set('access_token', accessToken);

      const decodedToken = jwt_decode(accessToken);
      const { email, userId, isAdmin } = decodedToken;


      store.dispatch({ type: 'LOGIN', payload: { email, userId, isAdmin } });

      config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    
    } catch (err) {
      console.error(err);
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

export default instance
