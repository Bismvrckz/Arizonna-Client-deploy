import React, { useState } from "react";
import { Button } from "@mui/material";
import MainLogo from "../components/mainLogo";
import TextField from "@mui/material/TextField";
import axiosInstance from "../services/axiosinstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

function ForgotPassword() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState(false);

  const onSendRecoveryMailClick = async () => {
    try {
      await axiosInstance.post("/users/recoverPassword", { emailInput });

      router.replace("/recoverySuccess");
    } catch (error) {
      console.log({ error });
      if (error.response.data?.message == "User not found") {
        setEmailError(true);
      }
    }
  };

  return (
    <div className="h-[100vh] bg-gradient-to-r from-blue-900 to-green-800 flex justify-start items-center flex-col relative">
      <div className="flex justify-start mt-[10vh] pl-[10vh] w-[30%]">
        <MainLogo />
      </div>

      <img
        src="https://static.vecteezy.com/system/resources/previews/000/690/821/original/blue-mailbox-with-red-flag-and-letters-vector.jpg"
        className="rounded-[50%] mt-[8vh] w-[15%] z-[3] m-[0vh] opacity-[.8]"
      />

      <div className="w-[30%] z-[3] mt-[-10vh] font-[montserrat] flex flex-col items-center justify-center h-[60%] ">
        <div className="flex flex-col justify-center w-[80%]">
          <div className="text-[2vw] my-[1vh] font-[500] text-white">
            Forgot password ?
          </div>
          <p className="text-[1vw] font-[200] mb-[1vh] text-gray-400">
            Please enter your registered email address. <br />
            We'll send instructions to help reset your <br />
            password.
          </p>

          <TextField
            error={emailError}
            onChange={(event) => {
              setEmailInput(event.target.value);
            }}
            color="info"
            autoComplete="off"
            id="outlined-basic"
            label="Email"
            sx={{ m: 0, width: "100%" }}
            variant="outlined"
            helperText={emailError ? "User not found" : ""}
          />
          <Button
            onClick={onSendRecoveryMailClick}
            className="w-[100%] h-[7vh] my-[1vh]"
            variant="contained"
          >
            Send reset instructions
          </Button>
        </div>
      </div>

      <a className="z-[2] absolute left-[2vw] top-[3vh]" href="/signin">
        <FontAwesomeIcon icon="fa-solid fa-arrow-left" className="w-[1vw]" />{" "}
        Back to Login
      </a>

      <div className="absolute z-[1] w-[30%] mt-[20vh] rounded-[2vh] opacity-25 bg-black h-[70%]" />
    </div>
  );
}

export default ForgotPassword;
