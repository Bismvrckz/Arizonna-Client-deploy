import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosinstance";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

function editProfile(props) {
  const { bio, username, createdAt, isVerified, fullname, email, user_avatar } =
    props.user.dataValues;

  const [usernameError, setUsernameError] = useState(false);
  const [changes, setChanges] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [imgSource, setImgSource] = useState(
    props.user?.dataValues.user_avatar
  );
  const [pictureIsChanged, setPictureIsChanged] = useState(false);
  const [inputs, setInputs] = useState({
    inputUsername: username,
    inputFullname: fullname,
    inputBio: bio,
  });

  const router = useRouter();
  const { inputUsername, inputFullname, inputBio } = inputs;

  useEffect(() => {
    if (
      inputUsername != username ||
      inputBio != bio ||
      inputFullname != fullname
    ) {
      setChanges(true);
    }

    if (
      inputUsername == username &&
      inputBio == bio &&
      inputFullname == fullname
    ) {
      setChanges(false);
    }
  }, [inputs]);

  const handleInputChange = (prop) => (event) => {
    setInputs({ ...inputs, [prop]: event.target.value });
  };

  function onImageChange(event) {
    setAvatar(event.target.files[0]);
    setImgSource(URL.createObjectURL(event.target.files[0]));
    setPictureIsChanged(true);
    setChanges(true);
  }

  async function onSaveProfileButton() {
    try {
      const { accessToken } = props;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const resSaveUserProfile = await axiosInstance.patch(
        "/users/userCredential",
        inputs,
        config
      );

      console.log(resSaveUserProfile.data);

      router.replace("/");
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.message.includes("Username")) {
        setUsernameError(true);
      }
    }
  }

  async function onSaveImageButton() {
    try {
      const { accessToken } = props;

      const body = new FormData();

      body.append("newAvatar", avatar);

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const resSaveUserImage = await axiosInstance.patch(
        "/users/avatar",
        body,
        config
      );

      console.log({ resSaveUserImage, message: "User image saved" });

      setPictureIsChanged(false);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div className="bg-gradient-to-r flex items-center justify-center from-teal-900 to-cyan-900 w-[100vw] h-[100vh] relative">
      <div className="w-[95%] h-[95%] flex flex-col justify-evenly items-start z-[2]">
        <div id="changeUserImage" className="flex items-center">
          <img className="rounded-[50%] w-[10vw] h-[10vw]" src={imgSource} />
          <div className="flex flex-col h-[70%] items-center justify-center ea">
            <label
              for="imageInput"
              className="cursor-pointer hover:bg-cyan-500 ml-[3vw] flex items-center justify-center bg-cyan-800 h-[5vh] w-[10vw] rounded-[3vh]"
            >
              <a className="cursor-pointer font-montserrat">Change Image</a>
              <input
                onChange={onImageChange}
                id="imageInput"
                className="hidden"
                type={"file"}
              />
            </label>
            {pictureIsChanged ? (
              <button
                onClick={onSaveImageButton}
                className="hover:bg-red-500 mt-[2vh] ml-[3vw] flex items-center justify-center bg-red-800 h-[5vh] w-[10vw] rounded-[3vh]"
              >
                Save image
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <TextField
          onFocus={() => {
            setUsernameError(false);
          }}
          error={usernameError}
          onChange={handleInputChange("inputUsername")}
          className="w-[20vw]"
          label="Username"
          variant="outlined"
          value={inputs.inputUsername}
          autoComplete="off"
          color="info"
          helperText={usernameError ? "Username already exist" : ""}
        />
        <TextField
          onChange={handleInputChange("inputFullname")}
          className="w-[20vw]"
          label="Fullname"
          variant="outlined"
          value={inputs.inputFullname}
          autoComplete="off"
          color="info"
        />
        <TextField
          onChange={handleInputChange("inputBio")}
          className="w-[50vw]"
          label="Bio"
          variant="outlined"
          value={inputs.inputBio}
          autoComplete="off"
          color="info"
        />
        <div className="flex w-[20vw] justify-between">
          <Button color="error" variant="contained">
            <a href="/"> Cancel</a>
          </Button>
          {changes ? (
            <Button onClick={onSaveProfileButton} variant="contained">
              Save Profile
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="bg-black z-[1] w-[98vw] h-[98vh] opacity-[.1] rounded-[1vh] absolute" />{" "}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: "/login" } };

    const { accessToken, user_id, username } = session.user;

    // resultSession
    // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjU3OTczODQ1NTE3LCJ1c2VybmFtZSI6IjEyMyIsImlhdCI6MTY1Nzk3NDcwNX0.P3sxGVgKGbIRzGVHAPrkC8Lc6moegAFRObd-MiNuk5s";
    // user_id: 1657973845517;
    // username: "123";

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await axiosInstance.get(`/users/${user_id}`, config);

    return { props: { user: res.data, accessToken } };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}

export default editProfile;
