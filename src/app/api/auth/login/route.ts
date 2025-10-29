import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { signToken } from "@/lib/jwt"
import { validateEmail, validatePassword } from "@/lib/validation"
import { findUserByEmail } from "@/lib/userStorage"

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown"

        const body = await req.json()
        const { email, password } = body
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao fazer login. Tente novamente."},
            { status: 500 }
        )
    }
}