import React, { useEffect } from "react";
import MainLogo from "../components/mainLogo";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

function RecoverySuccess() {
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
      <div className="mt-[8vh]">
        <MainLogo />
      </div>
      <div className="w-[35%] h-[30%] rounded-[1vh] flex flex-col z-[2] justify-center items-center">
        <div className="w-[15vw] h-[15vw] mt-[20vh]">
          <Image
            alt=""
            unoptimized
            width={500}
            height={500}
            layout="responsive"
            style={{ borderRadius: "50%" }}
            loader={() => {
              return "https://media.istockphoto.com/vectors/paper-airplane-icon-send-symbol-stock-vector-vector-id1139495297?k=20&m=1139495297&s=612x612&w=0&h=8r6yXLNqDaoXeQN-GoAB05JHBZLReFj5MJqjvecrrzs=";
            }}
            src="https://media.istockphoto.com/vectors/paper-airplane-icon-send-symbol-stock-vector-vector-id1139495297?k=20&m=1139495297&s=612x612&w=0&h=8r6yXLNqDaoXeQN-GoAB05JHBZLReFj5MJqjvecrrzs="
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[3rem] font-[600]">Success</p>
          <p>A recovery mail has been sent to your account</p>
          <p>Check your email for further instructions</p>
          <Link href="/signin">
            <p className="hover:text-cyan-400 mt-[2vh] hover:no-underline underline decoration-solid hover:cursor-pointer">
              Back to Login
            </p>
          </Link>
        </div>
      </div>
      <div className="w-[35%] h-[70%] z-[1] absolute bg-black opacity-[.4] rounded-[1vh] mt-[15.5vh]" />
    </div>
  );
}

export default RecoverySuccess;
