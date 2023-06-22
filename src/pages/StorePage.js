import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../api/interceptor";
import useAuthStore from "../api/store";
import LoginModal from '../components/loginModal'
import {
  Box, Button, Flex, Heading, Input, Text, VStack, Select, Card,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Login } from '../api/login'
import { PostReview, StoreReviews } from "../api/review";
function StorePage() {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [storeReview, setStoreReview] = useState([]);
  const [number, setNumber] = useState("");
  const { isLogIn, userId, isAdmin, logout, login } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [error, setError] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [ratingNumber, setRatingNumber] = useState("");
  const [trigger, setTrigger] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      await fetchStoreData();
      await fetchReviewsData();
    };
    console.log("Check");
    if (trigger === true) {
      console.log("cjdma");
      fetchData();
      setTrigger(false);
    }
  }, [trigger, storeId]);

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

  const { isLoading, isError, data } = useQuery('store-review', () => StoreReviews(storeId))

  const storeReviews = useMutation('store-review', StoreReviews, {
    onSuccess: (reviews) => {
      setStoreReview(reviews)
    }, onError: {}
  })


  const handleStoreReviews = () => {
    storeReviews.mutate(storeId)
  }

  const postReview = useMutation('store-review', PostReview, {
    onSuccess: () => {
      queryClient.invalidateQueries('store-review')
      setReviewInput(""),
        setRatingNumber("");
    }
  })

  const handlePostReview = (reviewDto) => {
    postReview.mutate(reviewDto, storeId)
  }



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


  //리뷰 글
  const handleReviewChange = (e) => {
    setReviewInput(e.target.value);
  };
  //리뷰 별점
  const handleRating = (e) => {
    setRatingNumber(e.target.value);
  };



  const handleDeleteReview = async (reviewId) => {

    try {
      const response = await instance.delete(`stores/${storeId}/reviews/${reviewId}`)
      console.log(response.data)
      setTrigger(true);
    } catch (error) {
      console.error("delete" + error)
    }
  }

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
        <form onSubmit={handleReviewSubmit}>
          <Flex align="center" justify="space-between" mt={4}>
            <Select

              value={ratingNumber}
              onChange={handleRating}
              placeholder="별점"
              width="25%"
              marginRight="1rem"
              backgroundColor='white'
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
            <Input
              type="text"
              value={isEditing ? updatedReview : reviewInput}
              onChange={isEditing ? handleReviewChange : handleReviewChange}
              placeholder="리뷰쓰기"
              width="70%"
              marginRight="1rem"
              background="white"
            />
            {isEditing ? (
              <Button colorScheme="blue" onClick={handleCancelEdit}>
                취소
              </Button>
            ) : (
              <Button type="submit" colorScheme="blue">
                등록
              </Button>
            )}
            {isEditing ? (
              <Button
                type="submit"
                colorScheme="green"
                onClick={() => handleUpdateReview(review)}
              >
                수정
              </Button>
            ) : null}
          </Flex>
        </form>
        <Box paddingTop="200px">
          <Box
            height="380px"
            overflowY="auto"
            overflowX="hidden"
            width="450px"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <div>
              {storeReview.map((review, index) => (
                <Card
                  key={index}
                  variant="filled"
                  backgroundColor="white"
                  mt={2}
                >
                  <Box height="100px">
                    <Box height="100px">
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text>아이디부분</Text>
                        <Text>{review.rating} 점</Text>
                      </Flex>
                      <Text>내용: {review.review}</Text>

                      {userId === review.UserId && (
                        <Flex justifyContent="flex-end">
                          <Button
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateReview(review)}
                          >
                            수정
                          </Button>
                          <Button
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReview(review.reviewId)}
                          >
                            삭제
                          </Button>
                        </Flex>
                      )}
                    </Box>
                  </Box>
                </Card>
              ))}
            </div>
          </Box>
        </Box>
      </Box>
    </VStack>
  );
}

export default StorePage;
