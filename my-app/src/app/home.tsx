"use client"
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { useEffect, useState, } from "react";
import io from "socket.io-client";


export default function Home({ children }: any) {

    return (
        <div>
            <NavBar />
            <div>
                {children}
            </div>
        </div>
    )
}