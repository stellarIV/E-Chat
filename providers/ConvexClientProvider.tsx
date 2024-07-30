"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";
import React, { Children } from "react";
import LoadingLogo from "@/components/ui/shared/LoadingLogo";
type Props = {
    children: React.ReactNode;
} ;

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "youtube.com";

const convex= new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider = ({children} : Props)=>{
    return (<ClerkProvider>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading><LoadingLogo/></AuthLoading></ConvexProviderWithClerk>
    </ClerkProvider>
    ) 
    
}

export default ConvexClientProvider