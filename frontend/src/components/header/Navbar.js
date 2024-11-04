import React from "react";
import logo from "../../assets/img/UUJJ.png";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { TfiMenu } from "react-icons/tfi";
import Swal from "sweetalert2";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import config from '../../config';

const apiUrl = config.apiUrl;

const NavContainer = styled.div`
  width: 100%;
  height: 60px;
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  z-index: 1000;
`;

const LogoImage = styled.img.attrs({
  src: logo,
})`
  align-items: center;
  width: 100px;
  height: 35px;
  margin-left: 10px;
`;

const NavElement = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TfiMenuStyled = styled(TfiMenu)`
  font-size: 20px;
  margin-top: 3px;
  margin-left: 100px;
`;

const NavItem = styled(NavLink)`
  margin-left: 60px;
  text-decoration: none;
  color: #222831;
  font-size: 16px;

  &.active {
    font-weight: bold;
    color: #499be9;
  }
  &:hover {
    font-weight: bold;
    color: #499be9;
  }
`;

const BeforeLogin = styled.div`
  display: flex;
  align-items: center;
`;

const LoginButton = styled.button`
  width: 80px;
  height: 30px;
  background: #ffffff;
  border-radius: 60px;
  border: 1px solid #e1dddd;
  font-family: "Inter";
  font-weight: 600;
  font-size: 12px;
  color: #499be9;
  margin-right: 10px;
  cursor: pointer;
`;

const RegisterButton = styled.button`
  width: 80px;
  height: 30px;
  background: #499be9;
  border-radius: 60px;
  border: 1px solid #ffffff;
  font-family: "Inter";
  font-weight: 600;
  font-size: 12px;
  color: #ffffff;
  margin-right: 10px;
  cursor: pointer;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const location = useLocation();

  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  const handleUploadClick = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "로그인 필요",
        text: "강의 업로드를 하시려면 로그인이 필요합니다.",
        toast: true,
      }).then(() => {
        navigate("/");
      });
    }
  };

  const handleVideoListClick = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "로그인 필요",
        text: "강의 목록을 확인하시려면 로그인이 필요합니다.",
        toast: true,
      }).then(() => {
        navigate("/");
      });
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("token");
  
    try {
      const response = await axios.post(
        `${apiUrl}/logout`,{}, // 로그아웃 요청에 본문 데이터가 필요 없을 경우 빈 객체 전달
        {
          headers: {
            Authorization: `Bearer ${token}`, // 필요한 경우 토큰 추가
          },
          withCredentials: true, // 리프레시 토큰을 쿠키에서 포함(null값인 쿠키를 응답받아서 기존의 리프레시 토큰 폐기)
        }
      );
  
      if (response.status === 200) {
        // 로그아웃 성공 시 세션 스토리지에서 사용자 데이터 삭제
        sessionStorage.clear();
        navigate("/");
        showToast("성공적으로 로그아웃되었습니다.");
      }
    } catch (error) {
      console.error("로그아웃 요청 실패: ", error);
  
      if (error.response) {
        console.error("Status:", error.response.status);
        if (error.response.status === 401) {
          showToastError("로그인 정보가 만료되었습니다.");
        } else {
          showToastError("로그아웃 중 오류가 발생했습니다.");
        }
      } else {
        showToastError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };
  const showToast = () => {
    Swal.fire({
      icon: "success",
      title: "로그아웃 성공",
      toast: true,
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      navigate("/");
    });
  };

  const showToastError = (message) => {
    Swal.fire({
      icon: "error",
      title: "로그아웃 실패",
      text: message,
      toast: true,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <NavContainer>
      <Link to="/">
        <LogoImage />
      </Link>
      <NavElement>
        <TfiMenuStyled />
        <NavItem to="/">Home</NavItem>
        <NavItem
          to="/attach"
          onClick={handleUploadClick}
          style={{
            color: location.pathname === "/attach" || location.pathname === "/modify" || location.pathname === "/inform" ? "#499be9" : "",
            fontWeight:
              location.pathname === "/attach" || location.pathname === "/modify" || location.pathname === "/inform" ? "bold" : "normal",
          }}
        >
          강의 업로드
        </NavItem>
        <NavItem
          to="/videoList"
          onClick={handleVideoListClick}
          style={{
            color: location.pathname === "/videoList" || location.pathname === "/select" ? "#499be9" : "",
            fontWeight: location.pathname === "/videoList" || location.pathname === "/select" ? "bold" : "normal",
          }}
        >
          강의 목록
        </NavItem>
        {token ? (
          <NavItem
            to="/mypage"
            style={{
              color: location.pathname === "/mypage" || location.pathname === "/uploadList" ? "#499be9" : "",
              fontWeight: location.pathname === "/mypage" || location.pathname === "/uploadList" ? "bold" : "normal",
            }}
          >
            마이페이지
          </NavItem>
        ) : null}
        {role === "ROLE_ADMIN" && (
          <NavItem
            to="/manage"
            style={{
              color: location.pathname === "/manage" ? "#499be9" : "",
              fontWeight: location.pathname === "/manage" ? "bold" : "normal",
            }}
          >
            대시보드
          </NavItem>
        )}
      </NavElement>
      {!token && (
        <BeforeLogin>
          <Link to="/login">
            <LoginButton>로그인</LoginButton>
          </Link>
          <Link to="/register">
            <RegisterButton>회원가입</RegisterButton>
          </Link>
        </BeforeLogin>
      )}
      {token ? (
        <BeforeLogin>
          <Link to="/">
            <RegisterButton onClick={handleLogout}>로그아웃</RegisterButton>
          </Link>
        </BeforeLogin>
      ) : null}
    </NavContainer>
  );
};

export default Navbar;
