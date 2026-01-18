"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ChatInput from "@/components/ChatInput"
import { useAuth } from "@/contexts/AuthContext"

type Props = {
    user?: { name: string }
}

const defaultSuggestions  = [
    "Crie um clone do Spotify",
    "Me ajude com meu TCC",
    "Monte um site de portfólio",
    "Desenvolva umas receitas",
    "Monte uma landing page moderna",
    "Crie um app para minha loja",
    "Me ensine sobre finanças",
    "Me recomende um livro",
]

export default function Home() {
    const router = useRouter()
    const { user } = useAuth()
    const [inputValue, setInputValue] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])

    useEffect(() => {
        const shuffleArray = (array: string[]) => {
            return [...array].sort(() => Math.random() - 0.5)
        }
        setSuggestions(shuffleArray(defaultSuggestions).slice(0, 4))
    }, [])

    const handleSend = (mensagem: string) => {
        if (!mensagem.trim()) return
        router.push(`/chat?task=${encodeURIComponent(mensagem)}`)
    }

    return (
        <div className="size-full flex flex-col relative overflow-hidden">
            <div className="w-full h-[calc(100vh-64px)] flex flex-col justify-center px-[10%] md:px-[15%] xl:px-[22%] gap-[32px]">
                <h1 className="text-[38px] xl:text-[42px] 2xl:text-[48px] leading-[40px] xl:leading-[44px] font-medium"> 
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
                <div className="flex flex-col gap-3">
                    <ChatInput onSend={handleSend} type="home" text={inputValue} setText={setInputValue}/>
                    <div className="hidden flex-row items-center justify-start gap-2 lg:flex">
                        {suggestions.map((s, i) => (
                            <div key={i} className="border-2 px-5 py-1.5 rounded-[16px] bg-gray-100 hover:bg-gray-200 transition whitespace-nowrap cursor-pointer text-[15.5px] xl:text-[16px]" onClick={() => setInputValue(s)}>
                                {s}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 flex items-center justify-center w-full mb-1">
                <span className="text-[10px] font-[300] text-center">Ao utilizar o RICKI, você concorda com os <a href="/terms" className="text-gray-700 hover:text-gray-800 transition cursor-pointer">Termos e a Política de Privacidade.</a></span>
            </div>
        </div>
    )
}
