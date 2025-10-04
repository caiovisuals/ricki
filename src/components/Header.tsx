"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const toggleDropdown = () => setIsOpen((prev) => !prev)

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

    return (
        <header className="w-full h-[64px] p-[16px] top-0 flex items-center justify-between" ref={dropdownRef}>
            <button className="flex flex-row cursor-pointer items-center gap-[4px]" aria-expanded={isOpen} onClick={toggleDropdown}>
                <span className="font-medium">RIIQUI-IA</span>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" strokeWidth="2" className={` ${isOpen ? "rotate-180" : ""} transition-transform duration-300`}>
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </button>
            <div className={`absolute flex flex-col top-[64px] z-50 transition-all duration-300 ease-in-out transform ${
                isOpen
                    ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                    : "opacity-0 pointer-events-none -translate-y-2 scale-95"
                }`}>
                <div className="bg-white shadow-lg rounded-lg p-4 mt-2 w-[200px]">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="block">Home</Link>
                        </li>
                        <li>
                            <Link href="/about" className="block">About</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <button className="flex items-center justify-center size-[40px] rounded-full bg-gray-400 hover:bg-gray-500 transition-colors duration-300">
                
            </button>
        </header>
    )
}
