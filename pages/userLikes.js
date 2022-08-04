import { getSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import axiosInstance from "../services/axiosinstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function userLikes(props) {
  const { userLikedPostsMapped } = props.userLikedPosts.data;

  function renderUserLikedPosts() {
    const postMap = userLikedPostsMapped.map((post) => {
      return (
        <div
          key={post.post_id}
          className="w-[19vw] h-[25vw] flex flex-col items-start rounded-[1vh] border-gray-500 border mb-[1vh] relative overflow-hidden"
        >
          <a href={`/postDetail/${post.post_id}`} className="z-[2]">
            <img
              className="w-[19vw] h-[19vw] rounded-[1vh] z-[2]"
              src={post.postImage}
            />
          </a>
          <div className="flex flex-col items-between justify-between w-[100%] h-[2rem] z-[2]">
            <p className="text-[0.9rem] text-gray-400">
              {post.createdAt.slice(0, 10)}
            </p>

            <div className="flex items-center">
              <p>Likes: {post.postLikes.length}</p>
            </div>
            <p className="text-[1.2rem] font-[600]"> {post.caption}</p>
          </div>
          <div className="absolute w-[100%] h-[100%] bg-white blur-[60px] opacity-[.2]" />
        </div>
      );
    });

    return (
      <div className="flex flex-wrap items-start justify-evenly">{postMap}</div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-teal-900 to-cyan-900 w-[100vw] h-[100vh] flex flex-col justify-center items-center relative">
      <div className="z-[3] w-[100%] h-[100%] flex flex-col items-center justify-start">
        <p className="w-[95%] font-[600] text-[1.5rem]">
          Here are the posts that you've liked.
        </p>
        <div className="border-[0.1vh] border-gray-700 w-[95%] h-[92%] overflow-auto rounded-[1vh]">
          {renderUserLikedPosts()}
        </div>

        <div className="w-[95%] flex justify-end">
          <Link href="/">
            <div className="hover:cursor-pointer hover:text-cyan-400 flex items-center justify-center h-[6vh]">
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-left"
                className="w-[1rem]"
              />{" "}
              <p>Back to mainpage</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="w-[98%] h-[100%] bg-black opacity-[.3] z-[1] absolute rounded-[1vh]" />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    const noSession = "Fuckoff";

    if (!session) return { props: { noSession } };

    const { accessToken, user_id } = session.user;

    // resultSession
    // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjU3OTczODQ1NTE3LCJ1c2VybmFtZSI6IjEyMyIsImlhdCI6MTY1Nzk3NDcwNX0.P3sxGVgKGbIRzGVHAPrkC8Lc6moegAFRObd-MiNuk5s";
    // user_id: 1657973845517;
    // username: "123";

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const resGetUserLikes = await axiosInstance.get(
      `/likes/userLikes/${user_id}`,
      config
    );

    return {
      props: {
        userLikedPosts: resGetUserLikes.data,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}

export default userLikes;
