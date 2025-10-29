"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)
    const { user, logout } = useAuth()
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const pathname = usePathname()

    const toggleNav = () => {
        if (pathname === "/chat") return
        setIsNavOpen((prev) => !prev)
        setIsUserOpen(false)
    }

    const toggleUser = () => {
        if (pathname === "/chat") return
        setIsUserOpen((prev) => !prev)
        setIsNavOpen(false)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsNavOpen(false)
            setIsUserOpen(false)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsNavOpen(false)
            setIsUserOpen(false)
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
        setIsNavOpen(false)
        setIsUserOpen(false)
    }

    return (
        <header className="absolute w-full h-[64px] p-[16px] top-0 flex items-center justify-between z-999" ref={dropdownRef}>
            <button className="flex flex-row cursor-pointer items-center justify-start gap-1 px-2 rounded-lg outline-none border-none" aria-expanded={isNavOpen} onClick={toggleNav}>
                <span className="font-medium">RICKI</span>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" strokeWidth="2" className={` ${pathname === "/chat" ? "hidden" : ""} ${isNavOpen ? "rotate-180" : ""} transition-transform duration-300`}>
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </button>
            <div className="flex flex-row items-center justify-end gap-2 px-2 rounded-lg">
                {user ? (
                    <button aria-expanded={isUserOpen} onClick={toggleUser} className="group flex flex-row items-center gap-2 cursor-pointer">
                        <span>{user.name}</span>
                        <div className="flex items-center justify-center size-[40px] rounded-full bg-gray-400 group-hover:bg-gray-500 transition-colors duration-300 cursor-pointer">
                            {user.avatar ? (
                                <img src={user.avatar} alt="User Avatar" className="size-full object-cover"/>
                            ) : (
                                <div className="hidden"></div>
                            )}
                        </div>
                    </button>
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
            <div className={`absolute flex flex-col top-[64px] z-50 transition-all duration-300 ease-in-out transform ${
                isNavOpen
                    ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                    : "opacity-0 pointer-events-none -translate-y-2 scale-90"
                }`}>
                <div className="bg-white border-2 border-gray-400 rounded-xl p-2 w-[200px]">
                    <ul className="space-y-1">
                        <Link href="/" className="block px-2 py-1 hover:bg-gray-300 rounded-lg transition" onClick={handleLinkClick}>Ínicio</Link>
                        <Link href="/about" className="block px-2 py-1 hover:bg-gray-300 rounded-lg transition" onClick={handleLinkClick}>Sobre</Link>
                        <Link href="/discover" className="block px-2 py-1 hover:bg-gray-300 rounded-lg transition" onClick={handleLinkClick}>Explorar</Link>
                    </ul>
                </div>
            </div>
            <div className={`absolute flex flex-col top-[64px] right-[16px] z-50 transition-all duration-300 ease-in-out transform ${
                isUserOpen
                    ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                    : "opacity-0 pointer-events-none -translate-y-2 scale-90"
                }`}>
                <div className="bg-white border-2 border-gray-400 rounded-xl p-2 w-[275px]">
                    <div className="w-full flex flex-col leading-tight border-b-2 border-gray-400 pb-2 mb-2">
                        <span className="text-[15px] font-[600]">{user?.name}</span>
                        <span className="text-[15px] text-gray-500">{user?.email}</span>
                    </div>
                    <ul className="space-y-1">
                        <a onClick={logout} className="block px-2 py-1 hover:bg-gray-300 rounded-lg transition">Sair</a>
                    </ul>
                </div>
            </div>
        </header>
    )
}
