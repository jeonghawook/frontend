import instance from './interceptor';

export const StoreReviews = async (storeId) => {
    try {
        const response = await instance.get(`stores/${storeId}/reviews`)
        return response.data;

    } catch (error) {
        console.error("리뷰조회 실패:", error);
    }
}

export const PostReview = async (reviewDto) => {
    try {
        console.log(reviewDto.storeId)
        await instance.post(`stores/${reviewDto.storeId}/reviews`, {
            review: reviewDto.review,
            rating: parseInt(reviewDto.rating)
        })
    } catch (error) {
        console.error("리뷰 작성 실패")
    }
}

export const DeleteReview = async (deleteDto) => {
    try {
        await instance.delete(`stores/${deleteDto.storeId}/reviews/${deleteDto.reviewId}`)
    } catch (error) {
        console.error("삭제 실패??")
    }
}

export const UpdateReview = async (reviewDto, storeId, reviewId) => {
    try {
        await instance.patch(`stores/${storeId}/reviews/${reviewId}`, {
            review: reviewDto.review,
            rating: parseInt(reviewDto.rating)
        })
    } catch (error) {
        console.error("수정 실패??")
    }
}