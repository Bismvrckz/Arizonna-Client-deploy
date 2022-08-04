import { Button, TextField } from "@mui/material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import axiosInstance from "../../services/axiosinstance";

function editPost(props) {
  const { poster } = props;
  const { userData } = props;
  const { postDetail } = props;
  const { accessToken } = props;
  const { user_id, post_id } = props;
  const { caption } = postDetail;
  const [postCaption, setPostCaption] = useState(caption);
  const router = useRouter();

  function onChangeCaption(event) {
    setPostCaption(event.target.value);
  }

  async function onClickConfirmChange() {
    try {
      const resChangeCaption = await axiosInstance.patch(
        `posts/editCaption/${post_id}`,
        { postCaption }
      );

      router.push(`../postDetail/${post_id}`);

      console.log(resChangeCaption.data);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-teal-900 to-cyan-900 w-[100vw] h-[100vh] relative">
      <div className="w-[98%] h-[98%] flex z-[2] rounded-[1vh] overflow-hidden">
        <div id="bagian-kiri" className="flex flex-col">
          <img
            src={postDetail.postImage}
            className="rounded-[1vh] w-[45vw] h-[45vw] hover:cursor-pointer"
          />
        </div>
        <div id="bagian-kanan" className="flex flex-col w-[51vw] mx-[2vw]">
          <div className="flex my-[2vh] h-[10vh] items-center">
            <img
              className="w-[2.5vw] h-[2.5vw] rounded-[50%]"
              src={poster.user_avatar}
            />
            <div className="flex flex-col pl-[1vw] grow">
              <div className="flex">
                <p className="font-[600] mr-[0.3vw]">{poster.username}</p>
              </div>
              <p>{postDetail.createdAt.slice(0, 10)}</p>
            </div>
          </div>
          <TextField
            onChange={onChangeCaption}
            value={postCaption}
            label="Caption"
          ></TextField>
          <div className="flex mt-[1vh]">
            <Button className="mr-[2vw]" color="error" variant="contained">
              <a href={`../postDetail/${post_id}`}> Cancel change</a>
            </Button>
            <Button
              onClick={onClickConfirmChange}
              color="success"
              variant="contained"
            >
              Confirm change
            </Button>
          </div>
        </div>
      </div>
      <div className="w-[98%] h-[98%] bg-black absolute opacity-[.3] rounded-[1vh] z-[1]" />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: "/" } };

    const { accessToken, user_id } = session.user;

    const { post_id } = context.params;

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const resGetUser = await axiosInstance.get(`/users/${user_id}`, config);

    const body = {
      commentLimit: 5,
      commentOffset: 0,
    };
    const resGetPostDetail = await axiosInstance.post(
      `/posts/${post_id}`,
      body,
      config
    );

    const userData = resGetUser.data.dataValues;
    const postDetail = resGetPostDetail.data.detail[0];

    const poster_id = resGetPostDetail.data.detail[0].user_id;

    const resGetPostUser = await axiosInstance.get(
      `/users/${poster_id}`,
      config
    );

    const poster = resGetPostUser.data.dataValues;

    return {
      props: { accessToken, user_id, postDetail, userData, poster, post_id },
    };
  } catch (error) {
    console.log({ error });
    const { message } = error;
    return {
      props: { message },
    };
  }
}

export default editPost;
