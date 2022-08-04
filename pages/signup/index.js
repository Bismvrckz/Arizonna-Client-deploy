import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InputAdornment from "@mui/material/InputAdornment";
import axiosInstance from "../../services/axiosinstance";
import PasswordIcon from "@mui/icons-material/Password";
import GppGoodIcon from "@mui/icons-material/GppGood";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect, useState } from "react";
import AlertTitle from "@mui/material/AlertTitle";
import MainLogo from "../../components/mainLogo";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { getSession } from "next-auth/react";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
const taiPasswordStrength = require("tai-password-strength");

function SignUp() {
  const router = useRouter();
  const [click, setclick] = useState(false);
  const [isRegistered, setisRegistered] = useState(false);
  const [bottomAlert, setBottomAlert] = useState({
    isShowed: false,
    severity: "error",
    message: "",
    errorType: "",
  });
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function getSessionAsync() {
    try {
      const session = await getSession();
      if (session) {
        router.replace("/");
      }
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    if (isRegistered) {
      setTimeout(() => {
        router.replace("/verificationsent");
      }, 2000);
    }
    getSessionAsync();
  }, [isRegistered]);

  async function onSignupClick() {
    setclick(true);
    try {
      await axiosInstance.post("users/register", inputs);
      setBottomAlert({
        ...bottomAlert,
        isShowed: true,
        severity: "success",
        message: "Success register user",
        errorType: "",
      });
      setisRegistered(true);
    } catch (error) {
      if (error.response.data?.message) {
        console.log(error.response.data);
        if (!error.response.data.errorType) {
          return setBottomAlert({
            ...bottomAlert,
            isShowed: true,
            message: error.response.data.message,
          });
        }
        return setBottomAlert({
          ...bottomAlert,
          isShowed: false,
          message: error.response.data.message,
          errorType: error.response.data.errorType,
        });
      }
      setBottomAlert({
        ...bottomAlert,
        isShowed: true,
        message: error.message,
      });
      console.log({ error });
    } finally {
      setTimeout(() => {
        setclick(false);
      }, 3000);
    }
  }

  function passwordStrengthNotif() {
    if (!inputs.password) return;
    const strengthTester = new taiPasswordStrength.PasswordStrength();
    const passwordResults = strengthTester.check(inputs.password);

    let textColor;
    let textWord;

    switch (passwordResults.strengthCode) {
      case "VERY_WEAK":
        textColor = "text-red-500";
        textWord = "Very Weak";
        break;
      case "WEAK":
        textColor = "text-yellow-500";
        textWord = "Weak";
        break;
      case "REASONABLE":
        textColor = "text-orange-500";
        textWord = "Reasonable";
        break;
      case "STRONG":
        textColor = "text-green-500";
        textWord = "Strong";
        break;
      case "VERY_STRONG":
        textColor = "text-cyan-500";
        textWord = "Very Strong";
        break;
    }
    return <p className={`${textColor} w-[6vw]`}>{textWord}</p>;
  }

  const handleChange = (prop) => (event) => {
    setInputs({ ...inputs, [prop]: event.target.value });
  };

  return (
    <div className="h-[100vh] bg-gradient-to-r from-blue-900 to-green-800 flex justify-start items-start flex-col">
      <div className="flex justify-start ml-[7vh] w-[90%]">
        <MainLogo />
      </div>
      <div className="grow grid grid-cols-2 w-[100%]">
        <div className="flex justify-center items-center ">
          <img
            src="https://www.utviklingssenter.no/aktiviteter/kompetanseutvikling/prosjektlederskolen?pid=Utviklingssenter-ArticlePage-Image&r_n_d=23103_&adjust=1&x=843&from=0"
            className="rounded-[50%] w-[80%] brightness-[.85]"
          />
        </div>

        <div className="flex flex-col justify-start w-[75%]">
          <p className="text-[5vh] mb-[1vh] font-[500] ml-[1vh] self-start text-white mt-[3vh]">
            Create your account
          </p>
          <p className="text-[3.4vh] font-[200] ml-[1vh] self-start text-gray-400">
            Created for developers by developers
          </p>
          <TextField
            error={
              bottomAlert.errorType == "username" ||
              bottomAlert.errorType == "emptyFields"
            }
            margin="dense"
            color="info"
            id="outlined-basic"
            label="Username"
            variant="outlined"
            className="w-[95%] "
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBoxIcon sx={{ color: "white", opacity: "0.7" }} />
                </InputAdornment>
              ),
            }}
            helperText={
              bottomAlert.errorType == "username" ? bottomAlert.message : ""
            }
            onChange={handleChange("username")}
          />
          <TextField
            error={
              bottomAlert.errorType == "email" ||
              bottomAlert.errorType == "emptyFields"
            }
            margin="dense"
            color="info"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            className="w-[95%] "
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailIcon sx={{ color: "white", opacity: "0.7" }} />
                </InputAdornment>
              ),
            }}
            helperText={
              bottomAlert.errorType == "email" ? bottomAlert.message : ""
            }
            onChange={handleChange("email")}
          />
          <TextField
            error={
              bottomAlert.errorType == "password" ||
              bottomAlert.errorType == "emptyFields"
            }
            margin="dense"
            color="info"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            className="w-[95%] "
            autoComplete="off"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon sx={{ color: "white", opacity: "0.7" }} />
                </InputAdornment>
              ),
              endAdornment: <>{passwordStrengthNotif()}</>,
            }}
            helperText={
              bottomAlert.errorType == "password" ? bottomAlert.message : ""
            }
            onChange={handleChange("password")}
          />
          <TextField
            error={
              bottomAlert.errorType == "confirmPassword" ||
              bottomAlert.errorType == "emptyFields"
            }
            margin="dense"
            color="info"
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            className="w-[95%] "
            autoComplete="off"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GppGoodIcon sx={{ color: "white", opacity: "0.7" }} />
                </InputAdornment>
              ),
            }}
            helperText={
              bottomAlert.errorType == "confirmPassword" ||
              bottomAlert.errorType == "emptyFields"
                ? bottomAlert.message
                : ""
            }
            onChange={handleChange("confirmPassword")}
          />
          <div className="flex items-center text-white self-start h-[2rem] my-[2vh]">
            <Checkbox color="info" defaultChecked />
            <p>I Agree with the Terms and Conditions</p>
          </div>
          {click ? (
            <LoadingButton
              loading
              className="w-[95%] h-[7vh]"
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              Bentar...
            </LoadingButton>
          ) : (
            <Button
              onClick={onSignupClick}
              className="w-[95%] h-[7vh]"
              variant="contained"
            >
              <p className="text-[2vh]">Sign Up</p>
            </Button>
          )}
          <p className="mt-[3vh] ml-[10vw] text-[white]">
            Already have an account? <span> </span>
            <a href="/signin" className="no-underline text-sky-500">
              Sign in
            </a>
          </p>
          {bottomAlert.isShowed ? (
            <Alert
              severity={bottomAlert.severity}
              className="w-[95%] mt-[1vh] justify-self-start"
            >
              <AlertTitle>{bottomAlert.severity}</AlertTitle>
              <strong>—{bottomAlert.message} </strong>
            </Alert>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
