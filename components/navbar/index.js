import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import MainLogo from "../mainLogo";
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
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
        <div className="ml-[-.5vw] mt-[5vh]">
          <MainLogo collapsedState={collapsedState} />
        </div>
        <MenuItem
          onClick={() => {
            setmainPageContent("Explore");
          }}
        >
          <div className="mt-[5vh] flex items-center w-[10vw] h-[3vh]">
            <FontAwesomeIcon
              icon="fa-solid fa-compass"
              className="text-[1.5rem] w-[2vw] mr-[1vw]"
            />
            <span className="text-[1.5rem] font-[500]">
              {collapsedState ? "" : "Explore"}
            </span>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setmainPageContent("");
          }}
        >
          <div className="mt-[5vh] flex items-center w-[10vw] h-[3vh]">
            <FontAwesomeIcon
              icon="fa-solid fa-user-astronaut"
              className="text-[1.5rem] w-[2vw] mr-[1vw]"
            />
            <span className="text-[1.5rem] font-[500]">
              {collapsedState ? "" : "My Profile"}
            </span>
          </div>
        </MenuItem>
        <MenuItem>
          {currentSession ? (
            <div
              onClick={() => {
                signOut();
              }}
              className="mt-[5vh] flex items-center w-[10vw] h-[3vh]"
            >
              <FontAwesomeIcon
                icon="fa-solid fa-person-through-window"
                className="text-[1.5rem] w-[2vw] mr-[1vw]"
              />
              <span className="text-[1.5rem] font-[500]">
                {collapsedState ? "" : "Sign Out"}
              </span>
            </div>
          ) : (
            <Link href="/signin">
              <div className="mt-[5vh] flex items-center w-[10vw] h-[3vh]">
                <FontAwesomeIcon
                  icon="fa-solid fa-arrow-right-to-bracket"
                  className="text-[1.5rem] w-[2vw] mr-[1vw]"
                />
                <span className="text-[1.5rem] font-[500]">
                  {collapsedState ? "" : "Sign In"}
                </span>
              </div>
            </Link>
          )}
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}

export default Navbar;
