import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const auth = req.headers.get("authorization")
        if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 })

        const parts = auth.split(" ")
        if (parts.length !== 2 || parts[0] !== "Bearer") return NextResponse.json({ message: "Token inválido" }, { status: 401 })
            
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Erro interno" }, { status: 500 })
    }
}