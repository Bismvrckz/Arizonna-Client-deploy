import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../services/axiosinstance";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button, TextField } from "@mui/material";
import { getSession } from "next-auth/react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/router";

function postDetail(props) {
  const { poster } = props;
  const { userData } = props;
  const { postDetail } = props;
  const { accessToken } = props;
  const { user_id, post_id } = props;
  const [liked, setLiked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentsOffset, setCommentsOffset] = useState(1);
  const [comments, setComments] = useState(postDetail.postComments);
  const [likesCount, setLikesCount] = useState(postDetail.postLikes.length);
  const [postOwner, setPostOwner] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const open = Boolean(anchorEl);
  const commentsMap = comments.map((comment) => {
    return (
      <div
        key={comment.comment_id}
        className="w-[90%] flex items-center my-[1vh]"
      >
        {/* <img
          src={comment.user_avatar}
          className="w-[2.5vw] h-[2.5vw] rounded-[50%] mr-[1vw]"
        /> */}
        <div>
          <p className="font-[600]">{comment.username}</p>
          <p className="text-[.9rem]">-{comment.commentPhrase}</p>
        </div>
      </div>
    );
  });

  useEffect(() => {
    const isLikedByCurrentUser = postDetail.postLikes.find((postLike) => {
      return postLike.user_id == userData.user_id;
    });

    if (isLikedByCurrentUser) {
      setLiked(true);
    }

    if (postDetail.user_id == userData.user_id) {
      setPostOwner(true);
    }
  }, []);

  async function getMoreComments() {
    const { accessToken } = props;

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const { post_id } = props;

    const body = {
      commentLimit: 5,
      commentOffset: commentsOffset * 5,
    };

    const resGetPostComments = await axiosInstance.post(
      `/posts/${post_id}`,
      body,
      config
    );

    const moreComment = resGetPostComments.data.detail[0].postComments;

    setComments([...comments, ...moreComment]);

    setCommentsOffset(commentsOffset + 1);
  }

  async function onDeletePostClick() {
    try {
      // const resDeleteComments = await axiosInstance.delete(
      //   `/comments/${post_id}`
      // );

      const resDeletePost = await axiosInstance.delete(
        `/posts/${postDetail.post_id}`
      );

      console.log({ resDeletePost });

      setTimeout(() => {
        router.replace("/");
      }, 2000);
    } catch (error) {
      console.log({ error });
    }
  }

  async function alterLikeTrigger() {
    if (liked) {
      const likeData = { user_id, post_id };

      const resRemoveLike = await axiosInstance.post(
        `/likes/alterLike`,
        likeData
      );

      console.log({ resRemoveLike });

      setLikesCount(likesCount - 1);
      setLiked(false);
    } else if (!liked) {
      const likeData = { user_id, post_id };

      const resAddLike = await axiosInstance.post(`/likes/alterLike`, likeData);

      console.log({ resAddLike });

      setLikesCount(likesCount + 1);
      setLiked(true);
    }
  }

  async function onClickAddComment() {
    try {
      if (!commentInput) return;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const body = { postDetail, userData, commentInput };

      const resPostComments = await axiosInstance.post(
        "/comments",
        body,
        config
      );

      setComments([
        {
          username: userData.username,
          user_avatar: userData.user_avatar,
          commentPhrase: commentInput,
        },
        ...comments,
      ]);
    } catch (error) {
      console.log({ error });
    } finally {
      setCommentInput("");
    }
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  function handleOpenModal() {
    setOpenModal(true);
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function onCommentInputChange(event) {
    setCommentInput(event.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-teal-900 to-cyan-900 w-[100vw] h-[100vh] relative">
      <div className="w-[98%] h-[98%] flex z-[2] rounded-[1vh] overflow-hidden">
        <div id="bagian-kiri" className="flex flex-col">
          <img
            onDoubleClick={alterLikeTrigger}
            src={postDetail.postImage}
            className="rounded-[1vh] w-[45vw] h-[45vw] hover:cursor-pointer"
          />
          <div className="ml-[1vw]">
            <p className="font-[600] text-[1.5rem]">{poster.username}</p>
            <p className="font-[200]">
              <FontAwesomeIcon
                onClick={alterLikeTrigger}
                icon="fa-solid fa-heart"
                className={
                  liked
                    ? "mr-[1vw] text-red-500 hover:cursor-pointer"
                    : "mr-[1vw] hover:cursor-pointer"
                }
              />
              {likesCount} Likes
            </p>
          </div>
        </div>
        <div id="bagian-kanan" className="flex flex-col w-[51vw] mx-[2vw]">
          <div className="flex my-[2vh] h-[10vh] items-center">
            <img
              className="w-[2.5vw] h-[2.5vw] rounded-[50%]"
              src={poster.user_avatar}
            />
            <div className="flex flex-col pl-[1vw] grow">
              <div className="flex">
                <p className="font-[600] mr-[0.3vw]">{poster.username}</p> -
                <p className="mx-[0.3vw]">"{postDetail.caption}"</p>
              </div>
              <p>{postDetail.createdAt.slice(0, 10)}</p>
            </div>
            <div id="editPost">
              {postOwner ? (
                <FontAwesomeIcon
                  onClick={handleClick}
                  id="editPost"
                  icon="fa-solid fa-ellipsis"
                  className="text-[1.5vw] hover:cursor-pointer"
                />
              ) : (
                ""
              )}
              <Popover
                id={"editPost"}
                open={open}
                // sx={{  }}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Typography
                  sx={{
                    p: 2,
                    bgcolor: "#242424",
                    color: "white",
                    width: "10vw",
                    height: "4vw",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
                  }}
                >
                  <a
                    href={`../editPost/${post_id}`}
                    className="hover:cursor-pointer hover:text-cyan-600"
                  >
                    Edit
                  </a>
                  <p
                    onClick={handleOpenModal}
                    className="hover:cursor-pointer hover:text-red-600"
                  >
                    Delete
                  </p>
                </Typography>
              </Popover>
              <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    transform: "translate(-50%, -50%)",
                    position: "absolute",
                    bgcolor: "#242424",
                    color: "white",
                    boxShadow: 24,
                    border: "10px",
                    left: "50%",
                    top: "50%",
                    width: 400,
                    p: 4,
                  }}
                >
                  <p className="font-[montserrat] font-[600]">Delete Post?</p>
                  <div className="flex w-[5vw]">
                    <p
                      onClick={onDeletePostClick}
                      className="font-[montserrat] hover:text-red-500 hover:cursor-pointer mr-[1vw]"
                    >
                      Yes
                    </p>
                    <p
                      onClick={handleCloseModal}
                      className="font-[montserrat] hover:text-gray-500 hover:cursor-pointer"
                    >
                      No
                    </p>
                  </div>
                </Box>

                {/* <div className="absolute bg-[#242424] top-[50%] left-[50%] w-[12vw] h-[7vh]"></div> */}
              </Modal>
            </div>
          </div>
          <div className="w-[100%] flex">
            <TextField
              onChange={onCommentInputChange}
              value={commentInput}
              sx={{ width: "75%" }}
              variant="outlined"
              label="Add a comment"
              autoComplete="off"
            />
            <Button
              onClick={onClickAddComment}
              sx={{ width: "20%", ml: "1vw" }}
              variant="contained"
            >
              Post comment
            </Button>
          </div>
          <div className="w-[51vw] h-[65.6vh] flex flex-col border border-gray-500 rounded-[1vh] items-center justify-start mt-[3vh] overflow-auto scrollbar">
            {comments.length ? (
              commentsMap
            ) : (
              <p className="mt-[3vh]">"Nobody has commented yet."</p>
            )}
            {comments.length == 5 ? (
              <Button onClick={getMoreComments} variant="text">
                See more
              </Button>
            ) : (
              ""
            )}
          </div>
          <div
            onClick={() => router.replace("/")}
            className="mt-[2vh] w-[100%] flex justify-end items-center hover:text-cyan-600 hover:cursor-pointer"
          >
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            <p className="mx-[0.5vw]">Back to Home</p>
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

export default postDetail;
