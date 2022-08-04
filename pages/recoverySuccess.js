import React, { useEffect } from "react";
import MainLogo from "../components/mainLogo";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

function recoverySuccess() {
  const router = useRouter();

  const getSessionAsync = async () => {
    const session = await getSession();
    if (session) {
      router.replace("/");
    }
  };

  useEffect(() => {
    getSessionAsync();
  });

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start bg-gradient-to-r from-blue-900 to-green-800 relative">
      <div className="mt-[8vh] ml-[-17vw]">
        <MainLogo />
      </div>
      <div className="w-[35%] h-[30%] rounded-[1vh] flex flex-col z-[2] justify-center items-center">
        <img
          src="https://cdn2.vectorstock.com/i/thumb-large/93/46/paper-plane-icon-set-origami-vector-28489346.jpg"
          className="rounded-[50%] w-[15vw] h-[15vw]"
        />
        <div className="flex flex-col items-center">
          <p className="text-[3rem] font-[600]">Success</p>
          <p>A recovery mail has been sent to your account</p>
          <p>Check your email for further instructions</p>
          <a
            href="/signin"
            className="hover:text-cyan-400 mt-[2vh] hover:no-underline underline decoration-solid"
          >
            Back to Login
          </a>
        </div>
      </div>
      <div className="w-[35%] h-[30%] z-[1] absolute bg-black opacity-[.4] rounded-[1vh] mt-[15.5vh]" />
    </div>
  );
}

export default recoverySuccess;
