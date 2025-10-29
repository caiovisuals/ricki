"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import ChatBox from "@/components/ChatBox"
import ChatInput from "@/components/ChatInput"
import { sendMessage } from "@/lib/ml"
import Link from "next/link"

type Message = {
    sender: "user" | "ia"
    content: string
}

type Conversation = {
    id: string
    task: string
    messages: Message[]
}

export default function ChatPage() {
    const searchParams = useSearchParams()
    const task = searchParams.get("task") || "Nova conversa"
    const [inputValue, setInputValue] = useState("")

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeId, setActiveId] = useState<string | null>(null)

    useEffect(() => {
        if (!activeId) {
            const initConversation = async () => {
                const id = Date.now().toString()
                const resposta = await sendMessage(task) // await aqui

                const newConv: Conversation = {
                    id,
                    task,
                    messages: [
                        { sender: "user", content: task },
                        { sender: "ia", content: resposta }
                    ]
                }

                setConversations([newConv])
                setActiveId(id)
            }

            initConversation()
        }
    }, [activeId, task])

    const activeConversation = conversations.find((c) => c.id === activeId)

    const handleSend = async (mensagem: string) => {
        if (!activeId || !mensagem.trim()) return

        const resposta = await sendMessage(mensagem)

        setConversations((prev) =>
            prev.map((conv) =>
              conv.id === activeId
                ? {
                    ...conv,
                    messages: [
                      ...conv.messages,
                      { sender: "user", content: mensagem },
                      { sender: "ia", content: resposta }
                    ]
                  }
                : conv
            )
        )
    }

    const createNewConversation = () => {
        const hasEmpty = conversations.some((conv) => conv.messages.length === 0)
        if (hasEmpty) return

        const id = Date.now().toString()
        const newConv: Conversation = { id, task: "Nova conversa", messages: [] }
        setConversations((prev) => [...prev, newConv])
        setActiveId(id)
    }

    return (
        <div className="flex flex-row p-4 pt-0 h-full overflow-hidden">
            <div className="flex flex-col gap-4 overflow-x-auto w-[225px]">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Link href="/" className="block px-3 py-1 rounded bg-[#d1d1d1] hover:bg-[#bbbbbb] transition">Ínicio</Link>
                        <Link href="/about" className="block px-3 py-1 rounded bg-[#d1d1d1] hover:bg-[#bbbbbb] transition">Sobre</Link>
                        <Link href="/discover" className="block px-3 py-1 rounded bg-[#d1d1d1] hover:bg-[#bbbbbb] transition">Explorar</Link>
                    </div>
                    <button onClick={createNewConversation} className="px-3 py-1 rounded bg-[#2C2C2D] hover:bg-[#1c1c1d] transition text-[var(--background)] outline-none border-none text-start cursor-pointer">
                        + Nova conversa
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[13px] font-bold">CHATS</h2>
                    {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setActiveId(conv.id)}
                          className={`px-3 py-1 rounded whitespace-nowrap text-start cursor-pointer ${
                            conv.id === activeId ? "bg-[#4e4e4e] hover:bg-[#414141] transition text-[var(--background)]" : "bg-gray-300"
                          }`}
                        >
                          {conv.task.length > 15 ? conv.task.slice(0, 15) + "..." : conv.task}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col flex-grow rounded p-4 pt-0 gap-4 overflow-hidden h-full">
                {activeConversation ? (
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex-grow overflow-y-auto">
                          <ChatBox messages={activeConversation.messages} />
                        </div>
                        <ChatInput onSend={handleSend} type="conversation" text={inputValue} setText={setInputValue}/>
                    </div>
                ) : (
                  <p>Selecione ou crie uma conversa para começar.</p>
                )}
            </div>
        </div>
    )
}
