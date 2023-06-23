import React, { useState } from 'react';
import useAuthStore from '../api/store';
import { Link } from 'react-router-dom';
import { Button, Icon, VStack, Box } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa'
import { Login, Logout } from '../api/loginAPI'
import { useMutation } from 'react-query';
import LoginModal from '../components/loginModal'

const Header = () => {
  const { isLogIn, email, isAdmin, logout, login } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const userLogout = useMutation(Logout, {
    onSuccess: () => {
      logout()
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleLogout = () => {
    userLogout.mutate()
  }

  const userLogin = useMutation(Login, {
    onSuccess: ({ email, isAdmin, userId, StoreId }) => {
      login(email, isAdmin, userId, StoreId)
    }
  })

  const handleLogin = (loginDto) => {
    userLogin.mutate(loginDto)
  };

  return (
    <Box
    >
      <header>
        <nav>
          {isLogIn && isAdmin ? (
            <ul>
              <li>
                Welcome, {email}
              </li>
              <li>
                <Link to={'/admin'}>AdminPage</Link>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          ) : isLogIn && !isAdmin ? (


            <VStack align="center">
              <Box>
                {email}
                <Button
                  size="sm"
                  icon={<Icon as={FaUser} boxSize={4} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </VStack>


          ) : (
            <ul>

              <VStack align="center">
                <Button
                  size="sm"
                  icon={<Icon as={FaUser} boxSize={4} />}
                  onClick={() => setShowLoginModal(true)}
                  className="person-button">
                  <Box as={FaUser} boxSize={4} />
                </Button>
                {showLoginModal && (
                  <LoginModal isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    handleLogin={handleLogin} />
                )}
              </VStack>

            </ul>
          )}
        </nav>
      </header>
    </Box>
  );
};

export default Header;
