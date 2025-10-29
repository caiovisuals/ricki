import { NextResponse } from "next/server"
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt"
import { findUserById } from "@/lib/userStorage"

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization")
        const token = extractTokenFromHeader(authHeader)

        if (!token) {
            return NextResponse.json(
                { message: "Token não fornecido" },
                { status: 401 }
            )
        }

        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { message: "Token inválido ou expirado" },
                { status: 401 }
            )
        }

        const user = findUserById(payload.userId)
        if (!user) {
            return NextResponse.json(
                { message: "Usuário não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar || "",
                    gender: user.gender || "indefinite",
                    language: user.language || "portuguese",
                }
            },
            { status: 200 }
        )
    } catch (err) {
        console.error("Auth check error:", err)
        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        )
    }
}