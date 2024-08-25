'use client'
import { SessionProvider } from "next-auth/react";

// communication with /api/auth/session endpoint of next-auth

export default function AuthProvider({
    children,
}: {children: React.ReactNode}){
    return (
        <SessionProvider>{children}</SessionProvider>
    )
}