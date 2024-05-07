import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
import Providers, { ThemeProvider } from "./Providers";
import { Toaster } from "@/components/ui/toaster";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "League Of Memory",
  description: "Play memory with your favorite characters from lol",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            {children}
            <Toaster/>
            </ThemeProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
