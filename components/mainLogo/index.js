import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function MainLogo({ collapsedState }) {
  function arizonnaNotCollapsed() {
    return (
      <div className="left-[5vw] font-[500] font-[montserrat] text-[3.2vw] top-[-1.5v] ">
        Arizonna
      </div>
    );
  }

  return (
    <Link href="/">
      <div className="flex h-[10vh] items-center text-white bg-black text-[5vh] font-[300] z-10 hover:cursor-pointer">
        <FontAwesomeIcon
          icon="fa-brands fa-atlassian"
          className="w-[3vw] top-0  left-[1.5vw] text-cyan-400"
        />
        {collapsedState ? "" : arizonnaNotCollapsed()}
      </div>
    </Link>
  );
}

export default MainLogo;
