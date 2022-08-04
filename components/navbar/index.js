import { getSession, signOut } from "next-auth/react";
import * as React from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import MainLogo from "../mainLogo";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar({ collapsedState, setcollapsedState, setmainPageContent }) {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState(false);

  useEffect(() => {
    getSessionAsync();
  }, []);

  const getSessionAsync = async () => {
    try {
      const session = await getSession();
      if (session) {
        setCurrentSession(true);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  // return <div className="bg-black">sdasd</div>;

  return (
    <ProSidebar
      width={"22vw"}
      collapsedWidth={"5.7vw"}
      className={"relative ease-in-out duration-300"}
      collapsed={collapsedState}
      onMouseOver={() => {
        setcollapsedState(false);
      }}
      onMouseLeave={() => {
        setcollapsedState(true);
      }}
    >
      <div className="absolute -z-[2] bg-gradient-to-r from-gray-900 to-teal-900 w-[100%] h-[100vh] "></div>
      <div className="absolute blur-xl -z-[1] bg-white opacity-[.1] w-[100%] h-[100vh]"></div>

      <Menu className="w-[15vw] pl-[2vw] h-[30vh] absolute z-10">
        <div className=" ml-[-2.5vw] mt-[-5vh] absolute">
          <MainLogo collapsedState={collapsedState} />
        </div>
        <MenuItem
          className="my-[6vh] flex"
          onClick={() => {
            setmainPageContent("Explore");
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-compass" className="w-[1vw]" />
          <p className="mt-[-3vh] mb-[-4vh] ml-[1.1vw] text-[1.5rem] font-[500]">
            {collapsedState ? "" : "Explore"}
          </p>
        </MenuItem>
        <MenuItem
          className="my-[6vh] flex"
          onClick={() => {
            setmainPageContent("");
          }}
        >
          <FontAwesomeIcon
            icon="fa-solid fa-user-astronaut"
            className="w-[1vw]"
          />
          <p className="mt-[-3vh] mb-[-4vh] ml-[1.1vw] text-[1.5rem] font-[500]">
            {collapsedState ? "" : "My Profile"}
          </p>
        </MenuItem>
        <MenuItem className="my-[7vh]">
          {currentSession ? (
            <a
              onClick={() => {
                signOut();
              }}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-person-through-window"
                className="w-[1vw]"
              />
              <p className="mt-[-3vh] ml-[1.2vw] text-[1.5rem] font-[500]">
                {" "}
                {collapsedState ? "" : " Sign Out"}
              </p>
            </a>
          ) : (
            <a href="/signin">
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-right-to-bracket"
                className="w-[1vw]"
              />
              <p className="mt-[-3.2vh] ml-[1.2vw] text-[1.5rem] font-[500]">
                {" "}
                {collapsedState ? "" : " Sign In"}
              </p>
            </a>
          )}
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}

export default Navbar;
