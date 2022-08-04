import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "../../../services/axiosinstance";

const credentialInstance = CredentialsProvider({
  async authorize(credentials) {
    try {
      const { usernameOrEmail, password } = credentials;

      const resUserLogin = await axiosInstance.post("/users/login", {
        usernameOrEmail,
        password,
      });
      // console.log({ resUserLogin });

      const user = resUserLogin.data.data.result;

      return user;
    } catch (error) {
      console.log(error.response.data);
      throw error.response.data;
    }
  },
});

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [credentialInstance],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});
