import React, { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Text,
    VStack,
    Card,
} from "@chakra-ui/react";
import useAuthStore from "../api/store";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from "react-router-dom";
import { DeleteReview, PostReview, StoreReviews } from "../api/reviewAPI";

function ReviewPage() {
    const { storeId } = useParams();
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();
    //const [storeData, setStoreData]
    const [reviewInput, setReviewInput] = useState("");
    const [ratingNumber, setRatingNumber] = useState("");


    // useEffect(() => {
    //     const fetchStoreData = async () => {
    //         try {
    //             const response = await instance.get(`stores/${storeId}/reviews`);
    //             const storeData = response.data;
    //             setStoreData(storeData);
    //             console.log("웨");
    //         } catch (error) {
    //             console.error("Failed to fetch store data:", error);
    //         }
    //     };
    //     fetchStoreData()
    // }, [])

    const { data } = useQuery('store-review', () => StoreReviews(storeId), { refetchOnWindowFocus: false });

    const postReview = useMutation('store-review', PostReview, {
        onSuccess: () => {
            queryClient.invalidateQueries('store-review');
            setReviewInput("");
            setRatingNumber("");
        },
        onError: (error) => {
            console.error("Failed to post review:", error);
        }
    });

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const reviewDto = {
            review: reviewInput,
            rating: ratingNumber,
            storeId: storeId
        };
        handlePostReview(reviewDto);
    };

    const handlePostReview = (reviewDto) => {

        postReview.mutate(reviewDto);
    };


    const deleteReview = useMutation('store-review', DeleteReview, {
        onSuccess: () => {
            queryClient.invalidateQueries('store-review')
        },
        onError: (error) => {
            console.error("삭제 실패:", error);
        }
    })

    const handleDeleteReview = (reviewId) => {
        const deleteDto = { storeId, reviewId }
        deleteReview.mutate(deleteDto)
    }



    const handleReviewText = (e) => {
        setReviewInput(e.target.value);
    };

    const handleRating = (e) => {
        setRatingNumber(e.target.value);
    };



    return (
        <>
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
                        value={reviewInput}
                        onChange={handleReviewText}
                        placeholder="리뷰쓰기"
                        width="70%"
                        marginRight="1rem"
                        background="white"
                    />
                    <Button type="submit" colorScheme="blue">
                        등록
                    </Button>
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
                        {data?.map((review, index) => (
                            <Card
                                key={index}
                                variant="filled"
                                backgroundColor="white"
                                mt={2}
                            >
                                {userId === review.UserId
                                    &&
                                    <Button onClick={() => handleDeleteReview(review.reviewId)} >삭제</Button>}

                                <Box height="100px">
                                    <Box height="100px">
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <Text>아이디부분</Text>
                                            <Text>{review.rating} 점</Text>
                                        </Flex>
                                        <Text>내용: {review.review}</Text>

                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </div>
                </Box>
            </Box>
        </>
    );
}

export default ReviewPage;
