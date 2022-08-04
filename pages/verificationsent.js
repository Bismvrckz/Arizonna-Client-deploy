import React from "react";
import MainLogo from "../components/mainLogo";
import NextLink from "next/link";

function verificationSent() {
  return (
    <div className="h-[100vh] relative w-screen bg-gradient-to-r from-blue-900 to-green-800 flex justify-center items-center flex-col">
      <div className="flex self-start items-start justify-start ml-[7vh] mt-[2vh]">
        <MainLogo />
      </div>
      <div className="flex grow flex-col w-full items-center justify-start z-[2]">
        <img
          className="rounded-[50%] w-[10vw] mt-[25vh]"
          src="https://png.pngtree.com/png-vector/20220521/ourmid/pngtree-mail-question-gradient-linear-vector-icon-png-image_4683487.png"
        />
        <p className="text-[2rem] font-[600] text-blue-400">
          Email confirmation needed.
        </p>
        <p className="mt-[5vh] mb-[3vh] text-[2vh]">
          We've sent a verification to your mail, Please check to verify your
          account.
        </p>
        <a href="/signin" className="hover:text-blue-400">
          Back to Login
        </a>
      </div>
      <div className="absolute z-[1] w-1/2 h-1/2 bg-black opacity-[.4] rounded-[1vh] " />
    </div>
  );
}

export default verificationSent;
