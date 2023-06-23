import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../api/interceptor";
import useAuthStore from "../api/store";
import LoginModal from '../components/loginModal'
import {
  Box, Button, Flex, Heading, Input, Text, VStack, Select, Card,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Login } from '../api/loginAPI'
import ReviewPage from "./reviewPage";

function StorePage() {
  const { storeId } = useParams();
  const { isLogIn, login } = useAuthStore();
  const [storeData, setStoreData] = useState(null);
  const [number, setNumber] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    fetchStoreData()
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      const response = await instance.get(`/stores/${storeId}`);
      const storeData = response.data;
      setStoreData(storeData);
      console.log(storeData);
    } catch (error) {
      console.error("Failed to fetch store data:", error);
    }
  };


  //예약 숫자 팀
  const handleChange = (e) => {
    const value = e.target.value;
    if (value >= 1 && value <= 4) {
      setNumber(value);
      setError("");
    } else {
      setNumber("");
      setError("웨이팅은 1~4명!");
    }
  };



  //예약 버튼 
  const handleClick = async (e) => {
    e.preventDefault();
    if (isLogIn) {
      try {
        const response = await instance.post(`/stores/${storeId}/waitings`, {
          peopleCnt: parseInt(number),
        });
        console.log(response.data);
      } catch (error) {
        console.error("Failed to send number to backend:", error);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  //비로그인 시 예약 로그인 모달 팝업 
  const userLogin = useMutation(Login, {
    onSuccess: ({ email, isAdmin, userId, StoreId }) => {
      login(email, isAdmin, userId, StoreId)
      setShowLoginModal(false)
    }
  })

  const handleLogin = (loginDto) => {
    userLogin.mutate(loginDto)
  }

  if (!storeData) {
    return <div>Loading...</div>;
  }

  return (
    <VStack>
      <Box p={4}>
        <Heading
          size="lg"
          mb={1}
          backgroundColor="white"
          borderRadius="10px"
          textAlign="center"
        >
          {storeData.storeName}
        </Heading>
        <Text textAlign="center" mb={10}>
          {storeData.category}
        </Text>
        <Text fontSize="md" mb={4}>
          주소: {storeData.newAddress}
        </Text>

        <form onSubmit={handleClick}>
          <Box background="white" padding="4px" borderRadius="10px">
            <Flex align="center" justify="space-between">
              <Text>별점 {storeData.rating}</Text>
              <Flex align="center">
                <Input
                  type="number"
                  id="number"
                  value={number}
                  width="50px"
                  onChange={handleChange}
                  backgroundColor="white"
                />
                <Button type="submit" colorScheme="blue" ml={2}>
                  예약하기
                </Button>
              </Flex>
            </Flex>
          </Box>
          {error && (
            <Box textAlign="right" color="red.450" fontSize="sm" mt={2}>
              {error}
            </Box>
          )}
        </form>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          handleLogin={handleLogin}
        />
        <ReviewPage storeId={storeId} />
      </Box>
    </VStack>
  );
}

export default StorePage;
