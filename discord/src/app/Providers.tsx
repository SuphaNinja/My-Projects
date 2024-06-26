"use client"
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from 'react';
import { ScopeProvider } from 'jotai-scope'


export default function Providers({ children }: { children: React.ReactNode; }) {

  const [queryClient] = useState(() => new QueryClient());


  return (
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </QueryClientProvider>
    
  );
};