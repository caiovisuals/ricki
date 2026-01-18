import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { name, email, avatar, gender, language } = body

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nome e email são obrigatórios" },
                { status: 400 }
            )
        }

        const updatedUser = {
            id: "1",
            name,
            email,
            avatar: avatar || null,
            gender: gender || "indefinite",
            language: language || "portuguese",
            updatedAt: new Date().toISOString(),
        }

        return NextResponse.json({
            message: "Usuário atualizado com sucesso",
            user: updatedUser,
        })
    } catch (err) {
        console.error("Erro no Update", err)
        return NextResponse.json(
            { error: "Erro ao atualizar usuário" },
            { status: 500 }
        )
    }
}
