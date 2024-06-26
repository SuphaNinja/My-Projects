import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "auth";






const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord",
  description: "A clone of Discord",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  return (
    <html lang="en" className="" >
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            {children}
            <ToastContainer />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
