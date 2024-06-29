"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { GameSessionProvider } from './contexts/SelectedCardsContext';
import { JoinSuccessProvider } from './contexts/SelectedCardsContext';
import { SelectedCardsProvider } from './contexts/SelectedCardsContext';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

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
    )
}
