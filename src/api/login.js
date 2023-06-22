import instance from './interceptor';
import jwt_decode from 'jwt-decode';


export const Login = async (loginDto) => {
    try {


        const response = await instance.post(`/auth/login`, {
            email: loginDto.userEmail,
            password: loginDto.password,
        })

        if (response) {
            const refreshToken = response.data.refreshToken;
            const accessToken = response.data.accessToken;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const decodedToken = jwt_decode(accessToken);

            const { isAdmin, email, userId, StoreId } = decodedToken;

            return ({ email, isAdmin, userId, StoreId });
        }

    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const Logout = async () => {
    try {
        await instance.delete(`/auth/logout`);
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    } catch (error) {
        console.log(error)
        throw error
    }
}

//유저 탈퇴 , 유저 수정, 유저 비번 수정
