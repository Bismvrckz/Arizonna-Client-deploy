import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function MainLogo({ collapsedState }) {
  return (
    <Link href="/">
      <div className="flex z-10 w-[15vw] h-[8vh] items-center justify-between text-white text-[5vh] font-[300] hover:cursor-pointer">
        <FontAwesomeIcon
          icon="fa-brands fa-atlassian"
          className="w-[3vw] text-cyan-400"
        />
        {collapsedState ? (
          ""
        ) : (
          <p className="font-[500] font-[montserrat] text-[3rem]">Arizonna</p>
        )}
      </div>
    </Link>
  );
}

export default MainLogo;
