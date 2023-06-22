import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import KakaoMap from './pages/KakaoMap';
import Header from './components/header';
import StorePage from './pages/StorePage';
import AdminPage from './pages/AdminPage';
import SignupPage from './pages/Signup';
import { Box } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <div style={{
      backgroundImage: `url(${'img/image.jpg'})`,
      backgroundRepeat: 'no-repeat',
      width: "100%"
    }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Box
            bg="blue.100" // Background color
            p={4} // Padding
            borderRadius="lg" // Rounded corners
            boxShadow="md" // Box shadow
            width="500px"
            height="100vh"

            margin="auto">
            <Header />
            <Routes>
              <Route path="/" element={<KakaoMap />} />
              <Route path="/store/:storeId/page" element={<StorePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
