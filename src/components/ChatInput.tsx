import { useState, useEffect } from "react"

type Props = { 
    onSend: (message: string) => void,
    type?: "home" | "conversation"
    text?: string,
    setText?: (value: string) => void
}

const phrases = [
  "Tire minha dúvida sobre...",
  "Como construo meu império!...",
  "Conte uma curiosidade...",
  "Me recomende um livro...",
  "Me dê uma ideia sobre...",
  "Preciso de ajuda com um bug...",
  "Explique um conceito...",
  "Me ajude a aprender algo novo...",
  "Sugira um filme...",
  "Me ajude a planejar uma viagem...",
]

export default function ChatInput({ onSend, type = "home", text = "", setText }: Props) {
    const [localText, setLocalText] = useState(text)
    const [placeholder, setPlaceholder] = useState("")
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (setText) {
            setLocalText(text)
        }
    }, [text])

    useEffect(() => {
      if (type === "conversation") {
        setPlaceholder("Pergunte ou responda com algo mais...")
        return
      }

      if (isPaused) return

      const currentPhrase = phrases[phraseIndex]
      const typingSpeed = isDeleting ? 50 : 100

      const timeout = setTimeout(() => {
        if (isDeleting) {
          if (charIndex > 0) {
            setPlaceholder((prev) => prev.slice(0, -1))
            setCharIndex((prev) => prev - 1)
          } else {
            setIsDeleting(false)
            setPhraseIndex((prev) => (prev + 1) % phrases.length)
          }
        } else {
          if (charIndex < currentPhrase.length) {
            setPlaceholder(currentPhrase.slice(0, charIndex + 1))
            setCharIndex((prev) => prev + 1)
          } else {
            setIsPaused(true)
            setTimeout(() => {
              setIsPaused(false)
              setIsDeleting(true)
            }, 2000)
          }
        }
      }, typingSpeed)

      return () => clearTimeout(timeout)
    }, [charIndex, isDeleting, phraseIndex, isPaused])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const message = setText ? text : localText
        if (!message.trim()) return
        onSend(message)
        if (setText) setText("")
        else setLocalText("")
    }

    const value = setText ? text : localText
    const handleChange = (v: string) => {
        if (setText) setText(v)
        else setLocalText(v)
    }

    return (
        <form onSubmit={handleSubmit} className="relative flex flex-col w-full rounded-[16px] border-2 border-[#2C2C2D] overflow-clip justify-between" style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 30px 0px" }}>
            <textarea
              id="mainTaskInput"
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="p-[16px] resize-none outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault() // previne qualquer quebra de linha automática
                  if (e.shiftKey) {
                    handleChange(value + "\n") // adiciona apenas 1 quebra de linha
                  } else {
                    handleSubmit(e) // envia a mensagem
                  }
                }
              }}
            />
            <div className="flex flex-row p-[16px] gap-[4px] justify-end">
                <label htmlFor="file-upload" className="cursor-pointer rounded-full bg-transparent hover:bg-[#CCC] transition-colors duration-300 size-[40px] flex items-center justify-center aspect-square">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"></path>
                    </svg>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              console.log("Arquivo selecionado:", file);
                            }
                        }}
                    />
                </label>
                <button className="cursor-pointer rounded-full bg-transparent hover:bg-[#CCC] transition-colors duration-300 size-[40px] flex items-center justify-center aspect-square" type="submit" disabled={!text.trim()}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </button>
            </div>
        </form>
    )
}