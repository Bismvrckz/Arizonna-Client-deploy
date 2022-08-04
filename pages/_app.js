import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, fab);

function MyApp({ Component, pageProps, appHead }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="font-[montserrat] text-white">
        <Head>
          <title>Arizonna</title>

          <link
            rel="icon"
            type="image/png"
            href="https://wac-cdn-2.atlassian.com/image/upload/f_auto,q_auto/assets/img/favicons/atlassian/favicon.png"
            sizes="32x32"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
