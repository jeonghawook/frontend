import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import KakaoMap from './pages/KakaoMap';
import Header from './components/header';
import StorePage from './pages/StorePage';

function App() {
  return (
    <BrowserRouter>
  
      <Header/> 
        <Routes>
          <Route path="/" element={<KakaoMap />} />
          <Route path="/store/:storeId" element={<StorePage />} />
      {/* <Route path="/admin" element ={<AdminPage />} /> */}
        </Routes>
        </BrowserRouter>
  );
}

export default App;
