import React from "react";
import MainLogo from "../components/mainLogo";

function successUpdatePassword() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-gradient-to-r from-teal-900 to-cyan-900 relative">
      <div className="ml-[-20vw] mt-[-10vh]">
        <MainLogo />
      </div>
      <div className="w-[30vw] h-[50vh] rounded-[1vh] z-[2] flex flex-col items-center justify-center">
        <p className="font-[700] text-[2.5rem]">Horray!</p>
        <p className="mb-[3vh] text-[1.5rem]">You have updated your password</p>
        <a
          href="/signin"
          className="underline hover:text-cyan-400 hover:no-underline"
        >
          Back to login
        </a>
      </div>
      <div className="bg-black w-[30vw] h-[50vh] absolute rounded-[1vh] opacity-[.3]" />
    </div>
  );
}

export default successUpdatePassword;
