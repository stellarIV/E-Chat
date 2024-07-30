"use client"

import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Error
({error}: {error : Error}){
    const router = useRouter();

    useEffect(() =>{
        router.push("/conversations");
    }, [error, router]);

    return <ConversationFallback/>;
}