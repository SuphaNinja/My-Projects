import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import * as bcrypt from "bcrypt";
import { encode, decode } from "next-auth/jwt";
import { User } from "@prisma/client";




const credentialsConfig = CredentialsProvider({
    name: "Credentials",
    
    credentials: {
        userName: { label: "Email", type: "text", placeholder: "Enter your username." },
        password: { label: "Password", type: "password" },
    },

    async authorize(credentials, req) {
        const InputUserName = credentials.userName as string;
        const InputPassword = credentials.password as string;
        const user = await prisma.user.findUnique({
            where: {
                email: InputUserName,
            }
        });

        if(!user) throw new Error("Username or password is incorrect.");
        
       if(!credentials?.password) throw new Error("Please provide a password.");
       const isPasswordCorrect = user.password && await bcrypt.compare(InputPassword, user.password);

       if(!isPasswordCorrect) throw new Error("Email or password is incorrect.");

       const { password, ...userWithoutPass } = user;
       return userWithoutPass ;
    }
});

export const config = {
    secret: process.env.SECRET,
    pages: {
        signIn: "/auth/signin",
    },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [
        Google({
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
            },
        }),
        Github,
        credentialsConfig,
    ],
    callbacks: {    
        async jwt({ token, user }) {
            if (user) token.user = user as User;
            return token;
        },
        
        async session({ token, session }) {
            session.user = token.user;
            return session;
        }
    }
}  satisfies NextAuthConfig;

export const {handlers, auth,signIn,signOut } = NextAuth(config);