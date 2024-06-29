"use client"

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes"


export default function Providers({ children  }: { children: React.ReactNode; }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider 
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <NextUIProvider>
                    {children}
                </NextUIProvider>
            </NextThemesProvider>
        </QueryClientProvider>
    );
};