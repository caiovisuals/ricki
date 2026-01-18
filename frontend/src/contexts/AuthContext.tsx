"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getAuthToken, saveAuthToken, clearAuthToken, getCurrentUser } from "@/lib/storage"

interface User {
    id: string
    name: string
    username: string
    avatar?: string
    banner?: string
    email: string
    gender?: "indefinite" | "masculine" | "feminine"
    language?: "portuguese" | "english"
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (token: string, userData: User) => void
    logout: () => void
    checkAuth: () => Promise<void>  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        const token = getAuthToken()
        
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/me', {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            } else {
                clearAuthToken()
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check error:', error)
            clearAuthToken()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = (token: string, userData: User) => {
        saveAuthToken(token)
        localStorage.setItem('riiqui_user_data', JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        clearAuthToken()
        setUser(null)
        window.location.href = '/'
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}