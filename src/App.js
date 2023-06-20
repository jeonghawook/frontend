import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import KakaoMap from './pages/KakaoMap';
import Header from './components/header';
import StorePage from './pages/StorePage';
import AdminPage from './pages/AdminPage';
import SignupPage from './pages/Signup';

function App() {
  return (
    
    <BrowserRouter>
      <Header/> 
        <Routes>
          <Route path="/" element={<KakaoMap />} />
          <Route path="/store/:storeId/page" element={<StorePage />} />
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/admin" element ={<AdminPage />} />
        </Routes>
        </BrowserRouter>
  );
}

export default App;
