import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import MainLogo from "../../components/mainLogo";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import KeyIcon from "@mui/icons-material/Key";
import { Button, FormHelperText } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ChakraProvider } from "@chakra-ui/react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

function Login() {
  const [click, setclick] = useState(false);
  const [inputError, setinputError] = useState({
    errorType: "",
    message: "",
  });
  const [inputs, setInputs] = useState({
    usernameOrEmail: "",
    password: "",
    showPassword: false,
  });

  const router = useRouter();

  useEffect(() => {
    getSessionAsync();
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

  async function onSigninClick() {
    setclick(true);

    try {
      const { usernameOrEmail, password } = inputs;
      const res = await signIn("credentials", {
        redirect: false,
        usernameOrEmail,
        password,
      });

      if (!res?.error) {
        router.replace("/afterSignIn");
      } else {
        console.log(res.error);
        setinputError({
          ...inputError,
          message: res.error,
          errorType: res.error.includes("password")
            ? "password"
            : "usernameOrEmail",
        });
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setTimeout(() => {
        setclick(false);
      }, 3000);
    }
  }

  const handleChange = (prop) => (event) => {
    setInputs({ ...inputs, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setInputs({
      ...inputs,
      showPassword: !inputs.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="h-[100vh] font-[montserrat] bg-gradient-to-r from-blue-900 to-green-800 flex justify-center items-center flex-col relative ">
      <div className="z-10 flex flex-col w-[30%] items-center h-[100%]">
        <div className="flex mt-[6vh] justify-start pl-[10vh] w-[100%]">
          <MainLogo />
        </div>
        <p className="text-[5vh] mb-[1vh] font-[500] ml-[1vh] self-start text-white mt-[15vh]">
          Sign in
        </p>
        <p className="text-[3.4vh] font-[200] ml-[1vh] self-start text-gray-400">
          Sign in to Arizonna
        </p>
        <TextField
          error={inputError.errorType == "usernameOrEmail"}
          margin="normal"
          color="info"
          id="outlined-basic"
          label="Username or Email"
          variant="outlined"
          className="w-[95%] "
          autoComplete="off"
          onChange={handleChange("usernameOrEmail")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountBoxIcon sx={{ color: "white", opacity: "0.7" }} />
              </InputAdornment>
            ),
          }}
          helperText={
            inputError.errorType == "usernameOrEmail" ? inputError.message : ""
          }
        />{" "}
        <FormControl
          error={inputError.errorType == "password"}
          variant="outlined"
          className="w-[95%]"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            error={inputError.errorType == "password"}
            id="outlined-adornment-password"
            type={inputs.showPassword ? "text" : "password"}
            value={inputs.password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {inputs.showPassword ? (
                    <VisibilityOff sx={{ color: "white", opacity: "0.7" }} />
                  ) : (
                    <Visibility sx={{ color: "white", opacity: "0.7" }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon sx={{ color: "white", opacity: "0.7" }} />
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText className="text-red-600">
            {inputError.errorType == "password" ? inputError.message : ""}
          </FormHelperText>
        </FormControl>
        {/* <div className="flex items-center text-white self-start h-[2rem] mt-[2vh]">
          <Checkbox color="info" defaultChecked />
          <p>Remember me</p>
        </div> */}
        <div className="mb-[4vh]" />
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
            onClick={onSigninClick}
            className="w-[95%] h-[7vh]"
            variant="contained"
          >
            <p className="text-[2vh]">Sign In</p>
          </Button>
        )}
        <div className="flex bottom-[10vh] absolute flex-col items-center">
          <p className="text-[white]">
            Don't have an account? <span> </span>
            <a href="/signup" className="no-underline text-sky-500">
              Sign up
            </a>
          </p>
          <p className="text-[white]">
            <a href="/forgotpassword" className="no-underline text-sky-500">
              Forgot password?
            </a>
          </p>
        </div>
      </div>
      <div className="absolute z-[2] w-[35%]  rounded-[2vh] opacity-25 bg-black h-[65%]" />
      <ChakraProvider></ChakraProvider>
    </div>
  );
}

export default Login;
