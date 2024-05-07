"use client"
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { useEffect, useState, } from "react";
import io from "socket.io-client";
import Home from "./home";


export default function Page() {

  return (
    <Home>
      <div className="grid grid-cols-1 md:grid-cols-6">
        <div className="col-span-2 bg-red-500 h-screen"></div>

        
        <div className="col-span-2 bg-green-500 h-screen">
          <div>
            
          </div>
        </div>
        <div className="col-span-2 bg-blue-500 h-screen"></div>
      </div>
    </Home>
  )
}
