import { User } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: User;
    }
}



declare module "next-auth/jwt" {
    interface JWT {
        user: User;
    }
}

export interface UserWithAccount extends User {
    accounts: Account[]
    followed: any
    following: any
    isFollowing: boolean
    posts: any
}

export interface SectionProps {
    left?: any;
    middle?: any;
    right?: any;
    children?: any;
    className?: any;
}