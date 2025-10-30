"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
    const { user, logout } = useAuth()
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)
    const pathname = usePathname()

    const navRef = useRef<HTMLDivElement | null>(null)
    const userRef = useRef<HTMLDivElement | null>(null)

    const toggleNav = () => {
        if (pathname === "/chat") return
        setIsNavOpen((prev) => !prev)
        setIsUserOpen(false)
    }

    const toggleUser = () => {
        setIsUserOpen((prev) => !prev)
        setIsNavOpen(false)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (
            (navRef.current && !navRef.current.contains(event.target as Node)) &&
            (userRef.current && !userRef.current.contains(event.target as Node))
        ) {
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

    const handleLinkClick = () => {
        setIsNavOpen(false)
        setIsUserOpen(false)
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <header className="absolute w-full h-[64px] p-[16px] top-0 flex items-center justify-between z-99">
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
                                <img src={user.avatar} alt="User Avatar" className="size-full object-cover" draggable="false"/>
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
                        <Link href="/register" className="px-4 py-2 rounded-md bg-gray-800 text-[var(--background)] hover:bg-gray-600 transition">
                            Criar conta
                        </Link>
                    </>
                )}
            </div>
            <div ref={navRef} className={`absolute flex flex-col top-[64px] z-50 transition-all duration-300 ease-in-out transform ${
                isNavOpen
                    ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                    : "opacity-0 pointer-events-none -translate-y-2 scale-90"
                }`}>
                <div className="bg-[var(--background)] border-2 border-gray-400 rounded-xl p-2 w-[250px]">
                    <ul className="space-y-1">
                        <Link href="/" className={`group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer ${pathname === "/" ? "bg-gray-300" : ""}`} onClick={handleLinkClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            </svg>
                            Ínicio
                        </Link>
                        <Link href="/about" className={`group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer ${pathname === "/about" ? "bg-gray-300" : ""}`} onClick={handleLinkClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                            </svg>
                            Sobre
                        </Link>
                        <Link href="/discover" className={`group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer ${pathname === "/discover" ? "bg-gray-300" : ""}`} onClick={handleLinkClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"/><path d="m13.56 11.747 4.332-.924"/><path d="m16 21-3.105-6.21"/><path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"/><path d="m6.158 8.633 1.114 4.456"/><path d="m8 21 3.105-6.21"/><circle cx="12" cy="13" r="2"/>
                            </svg>
                            Explorar
                        </Link>
                    </ul>
                </div>
            </div>
            <div ref={userRef} className={`absolute flex flex-col top-[64px] right-[16px] z-50 transition-all duration-300 ease-in-out transform ${
                isUserOpen
                    ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                    : "opacity-0 pointer-events-none -translate-y-2 scale-90"
                }`}>
                <div className="bg-[var(--background)] border-2 border-gray-400 rounded-xl p-2 w-[300px]">
                    <ul className="space-y-1">
                        <div className="w-full flex flex-col leading-tight px-1">
                            <span className="text-[15px] font-[600]">{user?.name}</span>
                            <span className="text-[15px] text-gray-500">{user?.email}</span>
                        </div>
                        <div className="border-1 border-gray-400 my-2 rounded-full"/>
                        {/* <a className={`group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer ${theme === "light" ? "bg-gray-300" : ""}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                            </svg>
                            Tema Claro
                        </a>
                        <a className={`group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer ${theme === "dark" ? "bg-gray-300" : ""}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
                            </svg>
                            Tema Escuro
                        </a>*/}
                        <Link href="/profile" className={`group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer ${pathname === "/profile" ? "bg-gray-300" : ""}`} onClick={handleLinkClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                            </svg>
                            Perfil
                        </Link>
                        <Link href="/settings" className={`group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer ${pathname === "/settings" ? "bg-gray-300" : ""}`} onClick={handleLinkClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                            Configurações
                        </Link>
                        <div className="border-1 border-gray-400 my-2 rounded-full"/>
                        <a onClick={logout} className="group flex flex-row items-center justify-start gap-2 px-2 py-1 hover:bg-gray-300 rounded-lg transition cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-10 transition">
                                <path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            </svg>
                            Sair
                        </a>
                    </ul>
                </div>
            </div>
        </header>
    )
}
