"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, loading, logout } = useAuth()
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const pathname = usePathname()
    
    const toggleDropdown = () => {
        if (pathname === "/chat") return
        setIsOpen((prev) => !prev)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
        setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    const handleLinkClick = () => {
        setIsOpen(false)
    }

    return (
        <header className="absolute w-full h-[64px] p-[16px] top-0 flex items-center justify-between z-999" ref={dropdownRef}>
            <button className="flex flex-row cursor-pointer items-center gap-[4px] outline-none border-none" aria-expanded={isOpen} onClick={toggleDropdown}>
                <span className="font-medium">RICKI</span>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" strokeWidth="2" className={` ${pathname === "/chat" ? "hidden" : ""} ${isOpen ? "rotate-180" : ""} transition-transform duration-300`}>
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </button>
            <div className={`absolute flex flex-col top-[64px] z-50 transition-all duration-300 ease-in-out transform ${
                isOpen
                    ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                    : "opacity-0 pointer-events-none -translate-y-2 scale-95"
                }`}>
                <div className="bg-white shadow-lg rounded-lg p-4 w-[200px]">
                    <ul className="space-y-2">
                        <Link href="/" className="block" onClick={handleLinkClick}>Ínicio</Link>
                        <Link href="/about" className="block" onClick={handleLinkClick}>Sobre</Link>
                        <Link href="/discover" className="block" onClick={handleLinkClick}>Explorar</Link>
                    </ul>
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                {loading ? (
                    <div className="size-[40px] rounded-full bg-gray-400 animate-pulse"/>
                ) : user ? (
                    <>
                        <span>{user.name}</span>
                        <button className="flex items-center justify-center size-[40px] rounded-full bg-gray-400 hover:bg-gray-500 transition-colors duration-300"/>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-300 transition">
                            Entrar
                        </Link>
                        <Link href="/register" className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition">
                            Criar conta
                        </Link>
                    </>
                )}
            </div>
        </header>
    )
}
