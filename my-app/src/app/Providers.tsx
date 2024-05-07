"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from 'react';
import { GameSessionProvider, SelectedCardsProvider, JoinSuccessProvider } from "./contexts/SelectedCardsContext";

export default function Providers({ children }: { children: React.ReactNode; }) {

    const [ queryClient ] = useState(() => new QueryClient());


    return (
        <QueryClientProvider client={queryClient}>
            <GameSessionProvider>
                <JoinSuccessProvider>
                    <SelectedCardsProvider>
                        {children}
                    </SelectedCardsProvider>
                </JoinSuccessProvider>
            </GameSessionProvider>
        </QueryClientProvider>
    );
};

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}