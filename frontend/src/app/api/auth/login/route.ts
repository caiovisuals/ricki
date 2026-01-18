import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { signToken } from "@/lib/jwt"
import { validateEmail, validateUsername, validatePassword } from "@/lib/validation"
import { findUserByEmail } from "@/lib/userStorage"

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown"

        const body = await req.json()
        const { email, password } = body

        // Validate email
        const emailValidation = validateEmail(email)
        if (!emailValidation.valid) {
            return NextResponse.json(
                { message: "E-mail ou senha inválidos" },
                { status: 401 }
            )
        }

        // Validate username
        const usernameValidation = validateUsername(username)
        if (!usernameValidation.valid) {
            return NextResponse.json(
                { message: "Nome de usuário invalido" },
                { status: 401 }
            )
        }

        // Validate password
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { message: "E-mail ou senha inválidos" },
                { status: 401 }
            )
        }

        // Find user by email
        const user = findUserByEmail(email.toLowerCase().trim())
        if (!user) {
            return NextResponse.json(
                { message: "E-mail ou senha inválidos" },
                { status: 401 }
            )
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return NextResponse.json(
                { message: "E-mail ou senha inválidos" },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = await signToken({
            userId: user.id,
            email: user.email,
            username: user.username,
            name: user.name
        })

        // Return success response with token and user data (without password)
        return NextResponse.json(
            {
                message: "Login realizado com sucesso!",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { message: "Erro ao fazer login. Tente novamente."},
            { status: 500 }
        )
    }
}