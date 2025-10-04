"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import ChatBox from "@/components/ChatBox"
import ChatInput from "@/components/ChatInput"
import { sendMessage } from "@/lib/ml"

type Conversation = {
  id: string
  task: string
  messages: string[]
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const task = searchParams.get("task") || "Nova conversa"

  // State de várias conversas (guias)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Cria a conversa inicial na montagem
  useEffect(() => {
    if (!activeId) {
      const id = Date.now().toString()
      const newConv: Conversation = { id, task, messages: [`Você: ${task}`] }

      // Resposta inicial da IA
      const resposta = sendMessage(task)
      newConv.messages.push(`IA: ${resposta}`)

      setConversations([newConv])
      setActiveId(id)
    }
  }, [activeId, task])

  const activeConversation = conversations.find((c) => c.id === activeId)

  const handleSend = (mensagem: string) => {
    if (!activeId || !mensagem.trim()) return

    // Adiciona mensagem do usuário
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId
          ? { ...conv, messages: [...conv.messages, `Você: ${mensagem}`] }
          : conv
      )
    )

    // Resposta da IA
    const resposta = sendMessage(mensagem)

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId
          ? { ...conv, messages: [...conv.messages, `IA: ${resposta}`] }
          : conv
      )
    )
  }

  const createNewConversation = () => {
    const id = Date.now().toString()
    const newConv: Conversation = { id, task: "Nova conversa", messages: [] }
    setConversations((prev) => [...prev, newConv])
    setActiveId(id)
  }

  return (
    <div className="flex flex-row p-4">
      {/* Guias de conversas */}
      <div className="flex flex-col gap-2 mb-4 overflow-x-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setActiveId(conv.id)}
            className={`px-3 py-1 rounded whitespace-nowrap ${
              conv.id === activeId ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            {conv.task.length > 15 ? conv.task.slice(0, 15) + "..." : conv.task}
          </button>
        ))}
        <button
          onClick={createNewConversation}
          className="px-3 py-1 rounded bg-green-600 text-white"
        >
          + Nova conversa
        </button>
      </div>

      {/* ChatBox e ChatInput da conversa ativa */}
      <div className="flex flex-col flex-grow rounded p-4 overflow-hidden h-full">
        {activeConversation ? (
          <>
            <div className="flex-grow overflow-y-auto mb-4">
              <ChatBox messages={activeConversation.messages} />
            </div>
            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <p>Selecione ou crie uma conversa para começar.</p>
        )}
      </div>
    </div>
  )
}