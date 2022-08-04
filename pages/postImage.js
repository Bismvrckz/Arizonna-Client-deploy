import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import axiosInstance from "../services/axiosinstance";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

function postImage(props) {
  const [imgSource, setImgSource] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [caption, setCaption] = useState("");
  const router = useRouter();

  const { user_id } = props;

  function onAddImage(event) {
    setAvatar(event.target.files[0]);
    setImgSource(URL.createObjectURL(event.target.files[0]));
  }

  async function onClickPost() {
    try {
      const { accessToken } = props;

      const body = new FormData();

      body.append("newPosts", avatar);
      body.append("caption", caption);

      console.log({ accessToken });

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
        caption,
      };

      const resCreateNewPost = await axiosInstance.post(
        `/posts/newPosts/${user_id}`,
        body,
        config
      );

      router.replace("/");

      console.log({ resCreateNewPost });
    } catch (error) {
      console.log({ error });
    }
  }

  function onCaptionChange(event) {
    setCaption(event.target.value);
  }

  return (
    <div className="bg-gradient-to-r from-teal-900 to-cyan-900 h-[100vh] w-[100vw] flex items-center justify-center relative">
      <div className="z-[2] w-[98vw] h-[98vh] rounded-[1vh] flex overflow-hidden">
        <div className="w-[30%] flex justify-center ">
          {imgSource ? (
            <div>
              <img
                className="w-[40vh] h-[40vh] mt-[10vh] rounded-[3vh]"
                src={imgSource}
              />
              <label for="changeImage" className="">
                <p className="cursor-pointer flex items-center justify-center w-[100%] h-[5vh] mt-[5vh] rounded-[2vh] hover:bg-cyan-500 bg-cyan-900">
                  Change Image
                </p>
                <input
                  className="hidden"
                  onChange={onAddImage}
                  id="changeImage"
                  type={"file"}
                />
              </label>
            </div>
          ) : (
            <label
              for="inputImage"
              className="w-[40vh] h-[40vh] mt-[10vh] rounded-[3vh] border-2 cursor-pointer flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon="fa-solid fa-plus"
                className="w-[20%] h-[20%]"
              />
              <input
                className="hidden"
                onChange={onAddImage}
                id="inputImage"
                type={"file"}
              />
            </label>
          )}
        </div>
        {imgSource ? (
          <div className="w-[70%] flex flex-col">
            <p className="mt-[15vh] text-[3rem] font-[600]">
              2. Write a caption!
            </p>
            <p className="font-[montserrat] mb-[2vh]">Make it a lovely one.</p>
            <TextField
              autoComplete="off"
              onChange={onCaptionChange}
              className="w-[50%]"
              variant="outlined"
              focused
            />
            <div className="my-[1vh]" />
            <Button
              onClick={onClickPost}
              variant="outlined"
              className="w-[30%] h-[5vh] font-[montserrat]"
            >
              3. Post It!
            </Button>
          </div>
        ) : (
          <p className="font-[montserrat] text-[3rem] font-[600] mt-[15vh]">
            1. Choose an image.
          </p>
        )}
      </div>
      <div className="bg-black z-[1] w-[98vw] h-[98vh] opacity-[.1] rounded-[1vh] absolute" />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    const noSession = "Fuckoff";

    if (!session) return { props: { noSession } };

    const { user_id, accessToken } = session.user;

    return {
      props: {
        user_id,
        accessToken,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    console.log({ error });
    return {
      props: {
        errorMessage,
      },
    };
  }
}

export default postImage;
