import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { signToken } from "@/lib/jwt"
import { validateEmail, validatePassword, validateName } from "@/lib/validation"
import { findUserByEmail, addUser } from "@/lib/userStorage"

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown"

        const body = await req.json()
        const { name, email, password } = body

        const nameValidation = validateName(name)

        if (!nameValidation.valid) {
            return NextResponse.json(
                { message: nameValidation.error },
                { status: 400 }
            )
        }

        const emailValidation = validateEmail(email)
        if (!emailValidation.valid) {
            return NextResponse.json(
                { message: emailValidation.error },
                { status: 400 }
            )
        }

        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { message: passwordValidation.error },
                { status: 400 }
            )
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao criar conta. Tente novamente."},
            { status: 500 }
        )
    }
}