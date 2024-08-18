import React from "react";
import { useState, useContext } from "react";
import { Box, TextField, Button, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";

const PageContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
  background-size: cover;
  background-position: center;
`;

const Component = styled(Box)`
  width: 400px;
  box-shadow: 5px 2px 5px 2px rgb(0 0 0 / 0.6);
  background-color: rgba(255, 255, 255, 0.6);
`;

const Image = styled("img")({
  width: 100,
  margin: "auto",
  display: "flex",
  padding: "50px 0 0",
});

const Wrapper = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  line-height: 0;
  margin-top: 10px;
  font-weight: 600;
`;

const LoginButton = styled(Button)`
  text-transform: none;
  background-color: #fb641b;
  color: #fff;
  height: 48px;
  border-radius: 2px;
`;
const SignupButton = styled(Button)`
  text-transform: none;
  background-color: #fff;
  height: 48px;
  border-radius: 2px;
`;
const loginInitialValues = {
  username: "",
  password: "",
};
const signupInitialValues = {
  name: "",
  username: "",
  password: "",
};
const Login = ({ isUserAuthenticated }) => {
  const imageURL =
    "https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png";
  const [login, setLogin] = useState(loginInitialValues);
  const [account, toggleAccount] = useState("login");
  const [signup, setSignup] = useState(signupInitialValues);
  const [error, showError] = useState("");

  const toggleSignup = () => {
    account === "signup" ? toggleAccount("login") : toggleAccount("signup");
  };
  const onValueChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const onInputChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const { setAccount } = useContext(DataContext);

  const signupUser = async () => {
    let response = await API.userSignup(signup);
    console.log(response.isSuccess);
    if (response.isSuccess) {
      showError("");
      setSignup(signupInitialValues);
      toggleAccount("login");
    } else {
      showError("Something went wrong! please try again later");
    }
  };

  const loginUser = async () => {
    let response = await API.userLogin(login);
    if (response.isSuccess) {
      showError("");

      sessionStorage.setItem(
        "accessToken",
        `Bearer ${response.data.accessToken}`
      );
      sessionStorage.setItem(
        "refreshToken",
        `Bearer ${response.data.refreshToken}`
      );
      setAccount({
        name: response.data.name,
        username: response.data.username,
      });

      isUserAuthenticated(true);
      setLogin(loginInitialValues);
      navigate("/");
    } else {
      showError("Something went wrong! please try again later");
    }
  };

  return (
    <PageContainer>
      <Component>
        <Box>
          <Image src={imageURL} alt="login" />
          {account === "login" ? (
            <Wrapper>
              <TextField
                variant="standard"
                onChange={(e) => onValueChange(e)}
                name="username"
                label="Enter Username"
              />
              <TextField
                variant="standard"
                onChange={(e) => onValueChange(e)}
                name="password"
                label="Enter Password"
              />
              <LoginButton variant="contained" onClick={() => loginUser()}>
                Login{" "}
              </LoginButton>

              <SignupButton onClick={() => toggleSignup()}>
                Create an account
              </SignupButton>
            </Wrapper>
          ) : (
            <Wrapper>
              <TextField
                variant="standard"
                onChange={(e) => onInputChange(e)}
                name="name"
                label="Name"
              />
              <TextField
                variant="standard"
                onChange={(e) => onInputChange(e)}
                name="username"
                label="Username"
              />
              <TextField
                variant="standard"
                onChange={(e) => onInputChange(e)}
                name="password"
                label="Password"
              />

              {error && <Error>{error}</Error>}
              <SignupButton onClick={() => signupUser()}>Signup</SignupButton>

              <LoginButton onClick={() => toggleSignup()} variant="contained">
                Already have an account
              </LoginButton>
            </Wrapper>
          )}
        </Box>
      </Component>
    </PageContainer>
  );
};

export default Login;
