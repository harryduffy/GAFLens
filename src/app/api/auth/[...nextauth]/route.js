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
          credentials?.password === "GAFPWTime001!"
        ) {
          return { id: "1", name: "Harry Duffy", email: "harry.duffy@globalalternativefunds.com" };
        }
        
        if (
          credentials?.username === "donna.willinge@globalalternativefunds.com" &&
          credentials?.password === "iLoveGAF@82"
        ) {
          return { id: "2", name: "Donna Willinge", email: "donna.willinge@globalalternativefunds.com" };
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