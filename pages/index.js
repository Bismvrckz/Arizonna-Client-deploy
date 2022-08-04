import * as React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import Navbar from "../components/navbar";
import MuiAlert from "@mui/material/Alert";
import { getSession } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import MenuIcon from "@mui/icons-material/Menu";
import axiosInstance from "../services/axiosinstance";
import InfiniteScroll from "react-infinite-scroll-component";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Home(props) {
  const { allPost } = props;
  const { allPostLength } = props;
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mainPageContent, setmainPageContent] = useState("Explore");
  const [editProfileMenu, seteditProfileMenu] = useState(false);
  const [collapsedState, setcollapsedState] = useState(true);
  const [postContent, setPostContent] = useState(allPost);
  const imgSource = props.user?.dataValues.user_avatar;
  const [offsetState, setOffsetState] = useState(1);

  const { userPosts } = props;

  const handleOpenSnackbar = (customMessage, customSeverity) => {
    setSnackbarSeverity(customSeverity);
    setSnackbarMessage(customMessage);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  function editProfileOption() {
    seteditProfileMenu(!editProfileMenu);
  }

  async function fetchMorePost() {
    try {
      const getLimit = { limit: 12 };
      const getOffset = { offset: offsetState * 12 };

      const resGetAllPostLimited = await axiosInstance.post(
        "/posts/getPostLimited",
        getOffset,
        getLimit
      );

      setPostContent([...postContent, ...resGetAllPostLimited.data.detail]);
      setOffsetState(offsetState + 1);
    } catch (error) {
      console.log({ error });
    }
  }

  async function resendVerificationMail() {
    try {
      await axiosInstance.post("users/resendVerificationMail", props);
      handleOpenSnackbar("Success resend verification", "info");
    } catch (error) {
      console.log({ error });
    }
  }

  function ExplorePage() {
    if (!props.user?.dataValues) {
      return (
        <div className="w-[98%] flex flex-col items-center justify-center h-[98%]">
          <p className="text-[2rem] mb-[3vh]">You are not Signed In</p>
          <Button variant="outlined" className="w-[6vw] h-[2vw] ">
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      );
    }

    const {
      user_id,
      bio,
      username,
      createdAt,
      isVerified,
      fullname,
      email,
      user_avatar,
    } = props.user?.dataValues;

    if (!isVerified)
      return (
        <div className="relative w-[100%] h-[100%] flex items-center justify-center">
          <div className=" flex flex-col flex items-center justify-center w-[98%] h-[98%]">
            <p>Please verify your email first.</p>
            <Button
              variant="contained"
              className="font-[montserrat] mt-[1vh]"
              onClick={() => {
                resendVerificationMail();
              }}
            >
              Resend verification mail
            </Button>
          </div>
          <div className="bg-gray-500 opacity-[.8] rounded-[1vw] blur-sm absolute w-[98%] h-[98%] -z-[3]" />
        </div>
      );

    if (!postContent.length) {
      return (
        <div className="flex items-center justify-center w-[100%] h-[100%]">
          <p>
            {" "}
            No one have even post a thing yet,{" "}
            <a href="/postImage" className="text-blue-500 hover:underline">
              Post the first image on Arizonna!
            </a>
          </p>
        </div>
      );
    }

    function renderUserPosts() {
      const postMap = postContent.map((post) => {
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
                {createdAt.slice(0, 10)}
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
        <div className="flex flex-wrap items-start justify-evenly">
          {postMap}
        </div>
      );
    }

    return (
      <div className="w-[100%] h-[100%]">
        <InfiniteScroll
          dataLength={allPostLength}
          next={() => {
            setTimeout(() => {
              fetchMorePost();
            }, 2000);
          }}
          hasMore={postContent.length < allPostLength}
          loader={
            <div className="w-[100%] flex items-center justify-center ">
              Bentar...
            </div>
          }
          endMessage={
            <div style={{ textAlign: "center" }}>
              <p className="font-[montserrat] font-[700]">
                Yay! You have seen all Arizonna's post
              </p>
            </div>
          }
        >
          {renderUserPosts()}
        </InfiniteScroll>
      </div>
    );
  }

  function MyProfilePage() {
    if (!props.user?.dataValues) {
      return (
        <div className="w-[98%] flex flex-col items-center justify-center h-[98%]">
          <p className="text-[2rem] mb-[3vh]">You are not Signed In</p>
          <Button variant="outlined" className="w-[6vw] h-[2vw] ">
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      );
    }

    const {
      user_id,
      bio,
      username,
      createdAt,
      isVerified,
      fullname,
      email,
      user_avatar,
    } = props.user?.dataValues;

    if (!isVerified)
      return (
        <div className="relative w-[100%] h-[100%] flex items-center justify-center">
          <div className=" flex flex-col flex items-center justify-center w-[98%] h-[98%]">
            <p>Please verify your email first.</p>
            <Button
              variant="contained"
              className="font-[montserrat] mt-[1vh]"
              onClick={() => {
                resendVerificationMail();
              }}
            >
              Resend verification mail
            </Button>
          </div>
          <div className="bg-gray-500 opacity-[.8] rounded-[1vw] blur-sm absolute w-[98%] h-[98%] -z-[3]" />
        </div>
      );

    function renderUserPosts() {
      if (!userPosts.length) {
        return (
          <div className="flex items-center justify-center w-[100%] h-[100%]">
            <p>
              {" "}
              You havent post anything yet,{" "}
              <a href="/postImage" className="text-blue-500 hover:underline">
                Post your first image!
              </a>
            </p>
          </div>
        );
      }

      const postMap = userPosts.map((post) => {
        return (
          <div className="w-[19vw] h-[25vw] flex flex-col items-start rounded-[1vh] border-gray-500 border mb-[1vh] relative overflow-hidden">
            <a href={`/postDetail/${post.post_id}`} className="z-[2]">
              <img
                className="w-[19vw] h-[19vw] rounded-[1vh] z-[2] "
                src={post.postImage}
              />
            </a>
            <div className="flex flex-col items-between justify-between w-[100%] h-[2rem] z-[2]">
              <p className="text-[0.9rem] text-gray-400">
                {createdAt.slice(0, 10)}
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
        <div className="flex flex-wrap items-start justify-evenly">
          {postMap}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-evenly w-[98%] h-[98%]">
        <div className="w-[79%] h-[100%] overflow-auto scrollbar">
          {renderUserPosts()}
        </div>

        <div className="bg-gray-800 w-[20%] h-[100%] flex flex-col justify-end items-center rounded-[4vh] relative">
          <div className="absolute top-[3vh] w-[100%] flex flex-col items-center">
            <p className="w-[15vw] text-[1rem]">{email}</p>
            <p className="w-[15vw] font-[300]">{bio}</p>
          </div>

          <a
            href="/editProfile"
            className={
              editProfileMenu
                ? "bg-cyan-900 hover:bg-cyan-500 z-[1] w-[90%] h-[5vh] flex items-center mb-[1vh] rounded-[2vh] justify-center ease-in-out duration-300"
                : "bg-cyan-900 hover:bg-cyan-500 -z-[1] w-[90%] h-[0vh] flex items-center mb-[1vh] rounded-[2vh] justify-center ease-in-out duration-300"
            }
          >
            Edit Profile
          </a>
          <a
            href="/postImage"
            className={
              editProfileMenu
                ? "bg-green-900 hover:bg-green-500 z-[1] w-[90%] h-[5vh] flex items-center mb-[1vh] rounded-[2vh] justify-center ease-in-out duration-300"
                : "bg-green-900 hover:bg-green-500 -z-[1] w-[90%] h-[0vh] flex items-center mb-[1vh] rounded-[2vh] justify-center ease-in-out duration-300"
            }
          >
            New Post
          </a>
          <a
            href="/userLikes"
            className={
              editProfileMenu
                ? "bg-orange-900 hover:bg-orange-500 z-[1] w-[90%] h-[5vh] flex items-center mb-[1vh] rounded-[2vh] justify-center ease-in-out duration-300"
                : "bg-orange-900 hover:bg-orange-500 -z-[1] w-[90%] h-[0vh] flex items-center mb-[1vh] rounded-[2vh] justify-center ease-in-out duration-300"
            }
          >
            My Likes
          </a>
          <div className="border-t-[0.1vh] h-[8vh] border-cyan-500 flex flex-col items-center justify-end rounded-[4vh] w-[100%] ease-in-out duration-100">
            <div className="flex justify-start items-center w-[100%]">
              <img src={imgSource} className="w-[4vw] h-[4vw] rounded-[50%]" />
              <div className="ml-[0.2vw] w-[13vw] h-[7vh] flex flex-col justify-center">
                <p className="font-[600] text-[1rem]">{username}</p>
                <p className="font-[400] text-[.7rem]">{fullname}</p>
              </div>
              <button onClick={editProfileOption}>
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function mainPageClass() {
    return collapsedState
      ? "w-[94.3vw]  flex justify-center items-center absolute top-0 right-0 h-[100vh] ease-in-out duration-300 overflow-aut fixed crollbar"
      : "w-[78vw]  flex justify-center items-center absolute top-0 right-0 h-[100vh] ease-in-out duration-300 overflow-aut fixed crollbar";
  }

  return (
    <div className="flex text-white font-[montserrat]">
      <div className="fixed">
        <Navbar
          setcollapsedState={setcollapsedState}
          collapsedState={collapsedState}
          setmainPageContent={setmainPageContent}
        />
      </div>
      <div className={mainPageClass()}>
        {mainPageContent == "Explore" ? ExplorePage() : MyProfilePage(props)}
        <div className="bg-gradient-to-r from-teal-900 to-cyan-900 w-[100%] h-[100%] -z-[1] fixed" />
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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

    const resGetUser = await axiosInstance.get(`/users/${user_id}`, config);

    const resGetUserPersonalPost = await axiosInstance.get(
      `/posts/user/${user_id}`,
      config
    );

    const getLimit = { limit: 12 };

    const resGetAllPostLimited = await axiosInstance.post(
      "/posts/getPostLimited",
      getLimit
    );

    return {
      props: {
        user: resGetUser.data,
        user_id,
        accessToken,
        userPosts: resGetUserPersonalPost.data.data,
        allPost: resGetAllPostLimited.data.detail,
        allPostLength: resGetAllPostLimited.data.allpostlength,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}

export default Home;
