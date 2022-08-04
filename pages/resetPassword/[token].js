import React, { useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import { Button, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import OutlinedInput from "@mui/material/OutlinedInput";
import axiosInstance from "../../services/axiosinstance";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function resetPassword(props) {
  console.log({ props });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    confirmPassword: "",
    password: "",
  });
  const [inputError, setInputError] = useState({
    confirmPassword: false,
    password: false,
  });

  if (!props.user) {
    return (
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-gradient-to-r from-teal-900 to-cyan-900 relative">
        <div className="text-[2rem]">Whoops!</div>
        <div>InvalidRecoveryToken</div>
      </div>
    );
  }

  const router = useRouter();

  const handleChangeInput = (prop) => (event) => {
    setInputs({ ...inputs, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { user } = props;

  const sendNewPassword = async () => {
    try {
      if (!inputs.password || !inputs.confirmPassword) return;

      const resUpdatePassword = await axiosInstance.patch(
        `/users/updatePassword/${user.user_id}`,
        inputs
      );

      console.log({ resUpdatePassword });

      router.replace("/successUpdatePassword");
    } catch (error) {
      console.log({ error });

      if (error.response.data?.message) {
        const { errorType } = error.response.data;

        if (errorType == "password") {
          setInputError({
            ...inputError,
            password: true,
          });
          setErrorMessage(error.response.data.message);
        } else if (errorType == "confirmPassword") {
          setInputError({
            ...inputError,
            confirmPassword: true,
          });
          setErrorMessage(error.response.data.message);
        }
      }
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-gradient-to-r from-teal-900 to-cyan-900 relative">
      <div className="w-[30vw] h-[50vh] rounded-[1vh] z-[2] flex flex-col items-center">
        <p className="text-[1.5rem] font-[500] mt-[6vh]">Hi, {user.username}</p>
        <p className="text-gray-300 font-[300]">
          Insert your new password here,
        </p>
        <p className="text-gray-300 font-[300] mb-[3vh]">
          and confirm your password.
        </p>
        <FormControl sx={{ m: 1, width: "80%" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            error={inputError.password}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={inputs.password}
            onChange={handleChangeInput("password")}
            onFocus={() => {
              setInputError({
                ...inputError,
                password: false,
              });
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText className="text-red-600">
            {inputError.password ? errorMessage : ""}
          </FormHelperText>
        </FormControl>
        <TextField
          error={inputError.confirmPassword}
          onChange={handleChangeInput("confirmPassword")}
          type={"password"}
          label="Confirm new password"
          className="w-[80%] my-[.5vh]"
          onFocus={() => {
            setInputError({
              ...inputError,
              confirmPassword: false,
            });
          }}
          helperText={inputError.confirmPassword ? errorMessage : ""}
        />
        <Button
          onClick={sendNewPassword}
          className="w-[80%] h-[7vh]"
          variant="contained"
        >
          Change password
        </Button>
      </div>
      <div className="bg-black w-[30vw] h-[50vh] absolute rounded-[1vh] opacity-[.3]" />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (session) return { redirect: { destination: "/" } };

    console.log({ session });

    // resultSession
    // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjU3OTczODQ1NTE3LCJ1c2VybmFtZSI6IjEyMyIsImlhdCI6MTY1Nzk3NDcwNX0.P3sxGVgKGbIRzGVHAPrkC8Lc6moegAFRObd-MiNuk5s";
    // user_id: 1657973845517;
    // username: "123";

    const accessToken = context.params.token;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const resGetUser = await axiosInstance.get("/users/userWithToken", config);

    return {
      props: {
        user: resGetUser.data.user,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}

export default resetPassword;
