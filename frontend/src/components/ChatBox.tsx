type Message = {
  sender: "user" | "ia"
  content: string
}

type Props = { messages: Message[] }

export default function ChatBox({ messages }: Props) {
    return (
        <div className="size-full overflow-y-auto bg-[var(--background)] flex flex-col gap-1.5" style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 30px 0px" }}>
            {messages.map((msg, i) => {
                const isIA = msg.sender === "ia"
                return (
                    <div key={i} className={`flex ${isIA ? "justify-start" : "justify-end"}`}>
                        <p className={`text-[16px] px-3 py-2 rounded-xl max-w-[70%] ${
                                isIA
                                    ? "text-black"
                                    : "bg-[#2C2C2D] text-[var(--background)]"
                            }`}>
                            {msg.content}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}
