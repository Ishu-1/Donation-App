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

        const existingDonor = await db.donor.findUnique({
          where: { email: credentials.email },
        });

        if (!existingDonor || !existingDonor.password) {
          throw new Error("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, existingDonor.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: existingDonor.id,
          email: existingDonor.email,
          name: existingDonor.firstName || "Donor",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        let donor = await db.donor.findUnique({ where: { email: profile.email } });

        if (!donor) {
          donor = await db.donor.create({
            data: {
              email: profile.email,
              firstName: profile.given_name || "",
              lastName: profile.family_name || "",
              password: null, // No password for Google users
            },
          });
        }

        return {
          id: donor.id,
          email: donor.email,
          name: donor.firstName || "Donor",
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
