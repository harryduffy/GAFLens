import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ Replace with your secure authentication logic
        if (
          credentials?.username === "harry.duffy@globalalternativefunds.com" &&
          credentials?.password === "password"
        ) {
          return { id: "1", name: "Harry Duffy", email: "harry.duffy@globalalternativefunds.com" };
        }
        // ❌ Invalid credentials
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // custom sign-in page (optional)
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };