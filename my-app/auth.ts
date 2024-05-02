import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { encode, decode } from "next-auth/jwt";
import { User } from "@prisma/client";


const config = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [
        Github
    ],
    callbacks: {    
        async jwt({ token, user }) {
            if (user) token.user = user as User;
            return token;
        },
        
        async session({ token, session }) {
            session.user = token.user as User;
            return session;
        }
    }
} satisfies NextAuthConfig;

export const { handlers, auth,signIn,signOut } = NextAuth(config);