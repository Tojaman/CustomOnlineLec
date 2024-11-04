// src/api/axiosInstance.js
import axios from 'axios';
import config from '../config';

const apiUrl = config.apiUrl;

const axiosInstance = axios.create({
    baseURL: apiUrl,
});

/** 요청 인터셉터
 * AccessToken을 헤더에 담아서 요청
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // 가로챈 요청 전송
    },
    (error) => {
        return Promise.reject(error);
    }
);

/** 응답 인터셉터
 * 401 응답(AccessToken 만료)
 * 1. AccessToken 재발급 요청(RefreshToken 쿠키 담아서 재발급 요청)
 * 2. 재발급 받은 AccessToken을 헤더에 담아서 재요청
 */
axiosInstance.interceptors.response.use(
    (response) => response,
    // error 객체: 서버로부터 온 error(config, response 등 여러 값이 존재)
    async (error) => {
        const originalRequest = error.config; // 에러가 발생한 요청을 보낼떄 사용된 설정 객체
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Access token 재발급 로직
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.post(`${apiUrl}/reissue`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // 필요한 경우 토큰 추가
                        },
                        withCredentials: true, // 쿠키를 포함하도록 설정
                    }
                );
                // const { accessToken } = response.data;
                const accessToken = response.headers['authorization']; // 헤더에서 직접 가져오기

                
                // 새로운 Access token 저장
                sessionStorage.setItem('token', accessToken);
                
                // 원래의 요청에 새로운 token을 추가하고 기존 요청을 다시 전송
                // ↓Authorization 헤더에 "Bearer Bearer 토큰값" 형식으로 Bearer이 두 번 들어가는 문제 발생하여 수정
                // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `${accessToken}`;
                console.log(originalRequest.headers.Authorization);
                return axios(originalRequest);
            } catch (refreshError) {
                console.log(refreshError);
                // // refresh token이 만료된 경우
                // sessionStorage.clear();
                // // 로그인 페이지로 리다이렉트 등 필요한 처리 추가
                // window.location.href = '/login';
            }
        }
    return Promise.reject(error);
    }
);

export default axiosInstance;
