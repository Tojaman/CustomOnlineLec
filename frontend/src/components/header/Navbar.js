import React from "react";
import logo from "../../assets/img/UUJJ.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TfiMenu } from "react-icons/tfi";
import Swal from "sweetalert2";

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
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

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
  const handleLogout = () => {
    sessionStorage.clear();
    if (history.location.pathname === "/") {
      history.go(0);
    } else {
      history.push("/");
    }
  };

  return (
    <NavContainer>
      <Link to="/">
        <LogoImage />
      </Link>
      <NavElement>
        <TfiMenuStyled />
        <NavItem to="/">Home</NavItem>
        <NavItem to="/attach" onClick={handleUploadClick}>
          강의 업로드
        </NavItem>
        <NavItem to="/videoList" onClick={handleVideoListClick}>강의 목록</NavItem>
        {token ? <NavItem to="/mypage">마이페이지</NavItem> : null}
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
