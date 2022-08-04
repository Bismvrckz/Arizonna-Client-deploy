import { getSession } from "next-auth/react";
import React from "react";
import axiosInstance from "../../services/axiosinstance";

function MyProfilePage() {
  console.log();
  // const { user } = props;
  return (
    <div className="bg-gray-500 opacity-[1] flex items-center justify-center w-[98%] h-[98%]">
      {" "}
      My Profile Page
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return (props = null);

    const { accessToken, user_id, username } = session;
    const test = "test";

    // resultSession
    // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjU3OTczODQ1NTE3LCJ1c2VybmFtZSI6IjEyMyIsImlhdCI6MTY1Nzk3NDcwNX0.P3sxGVgKGbIRzGVHAPrkC8Lc6moegAFRObd-MiNuk5s";
    // user_id: 1657973845517;
    // username: "123";

    // const config = {
    //   Headers: { Authorization: `Bearer ${accessToken}` },
    // };

    // const res = await axiosInstance.get(`/users/${user_id}`, config);

    // console.log(res);

    // props: { user: res.data.data.result },

    return { props: { test } };
  } catch (error) {
    console.log({ error });
    return (props = null);
  }
}

export default MyProfilePage;
