import axios from 'axios';

const apiUrl = 'YOUR_API_URL'; // 여기에 API URL을 설정합니다.


const refreshAccessToken = async () => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await axios.post(
            `${apiUrl}/reissue`, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 필요한 경우 토큰 추가
                },
                withCredentials: true, // 리프레시 토큰을 쿠키에서 포함(null값인 쿠키를 응답받아서 기존의 리프레시 토큰 폐기)
            }
        );
        const newAccessToken = response.data.accessToken; // 서버에서 반환된 새로운 액세스 토큰
        sessionStorage.setItem('token', newAccessToken); // 세션 스토리지에 새로운 토큰 저장
        return newAccessToken;
    } catch (error) {
        console.error("액세스 토큰 재발급 실패: ", error);
        // 필요한 경우 로그인 페이지로 리다이렉트 하거나 에러 처리
    }
};