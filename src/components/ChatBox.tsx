type Props = { messages: string[] }

export default function ChatBox({ messages }: Props) {
    return (
        <div className="size-full border rounded p-4 overflow-y-auto bg-white shadow">
          {messages.map((msg, i) => (
            <p key={i} className="mb-2 text-sm">{msg}</p>
          ))}
        </div>
    )
}
