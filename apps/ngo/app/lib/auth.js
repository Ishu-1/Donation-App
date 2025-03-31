import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const existingReceiver = await db.receiver.findUnique({
          where: { email: credentials.email },
        });

        if (!existingReceiver || !existingReceiver.password) {
          throw new Error("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, existingReceiver.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: existingReceiver.id,
          email: existingReceiver.email,
          name: existingReceiver.name || "Receiver",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        let receiver = await db.receiver.findUnique({ where: { email: profile.email } });

        if (!receiver) {
          receiver = await db.receiver.create({
            data: {
              email: profile.email,
              name: profile.name || "Google User",
              password: null, // No password for Google users
            },
          });
        }

        return {
          id: receiver.id,
          email: receiver.email,
          name: receiver.name || "Receiver",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    newUser: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
