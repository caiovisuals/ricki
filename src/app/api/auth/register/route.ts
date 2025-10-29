import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { signToken } from "@/lib/jwt"
import { validateEmail, validatePassword, validateName } from "@/lib/validation"
import { findUserByEmail, addUser } from "@/lib/userStorage"
import { randomUUID } from "crypto"

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

        // Check if user already exists
        const existingUser = findUserByEmail(email)
        if (existingUser) {
            return NextResponse.json(
                { message: "E-mail já cadastrado" },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const userId = randomUUID()
        const newUser = {
            id: userId,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            createdAt: new Date().toISOString()
        }

        // Save user to storage
        addUser(newUser)

        // Generate JWT token
        const token = await signToken({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name
        })

        // Return success response with token and user data (without password)
        return NextResponse.json(
            {
                message: "Conta criada com sucesso!",
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Register error:", error)
        return NextResponse.json(
            { message: "Erro ao criar conta. Tente novamente."},
            { status: 500 }
        )
    }
}