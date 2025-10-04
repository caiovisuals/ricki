"use client"

import { useRouter } from "next/navigation"
import ChatInput from "@/components/ChatInput"

type Props = {
  user?: { name: string } // ou qualquer outro dado do usuário logado
}

export default function Home({ user }: Props) {
    const router = useRouter()

    const handleSend = (mensagem: string) => {
        if (!mensagem.trim()) return
        router.push(`/chat?task=${encodeURIComponent(mensagem)}`)
    }

    return (
        <div className="size-full flex flex-col justify-center px-[22%] gap-[32px]">
            <h1 className="text-[48px] leading-[44px] font-medium">
                {user?.name ? (
                    <>
                    Bem vindo!<br/>
                    O que vamos fazer hoje, {user.name}!
                    </>
                ) : (
                    <>
                    Bem vindo!<br/>
                    O que vamos fazer hoje!
                    </>
                )}
            </h1>
            <ChatInput onSend={handleSend} type="home"/>
        </div>
    )
}
