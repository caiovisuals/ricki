import { SignJWT, jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'JWT-SECRET-KEY'
)

const ALGORITHM = 'HS256'

export interface JWTPayload {
    userId: string
    email: string
    name: string
    iat?: number
    exp?: number
}

export async function signToken(payload: JWTPayload): Promise<string> {
    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: ALGORITHM })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY)
    
    return token
    }

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY)
        return payload as JWTPayload
    } catch (error) {
        console.error('Token verification failed:', error)
        return null
    }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    return authHeader.substring(7)
}