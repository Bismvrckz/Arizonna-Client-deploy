import { getSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import axiosInstance from "../services/axiosinstance";

function afterSignIn(props) {
  const { username } = props.user.dataValues;

  return (
    <div className="h-[100vh] text-[5rem] font-[500] font-[montserrat] bg-gradient-to-r from-blue-900 to-green-800 flex justify-center items-center flex-col relative ">
      Welcome {username}!
      <Link href="/">
        <p className="text-[1rem] hover:text-blue-500 hover:cursor-pointer">
          Continue to Arizonna
        </p>
      </Link>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    const noSession = "Fuckoff";

    if (!session) return { props: { noSession } };

    const { accessToken, user_id, username } = session.user;

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

export default afterSignIn;
