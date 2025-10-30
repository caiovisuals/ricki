"use client"

import { useState, useEffect, useRef } from "react"

export default function Settings() {
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)

    const deleteAccountRef = useRef<HTMLDivElement | null>(null)

    const toggleDeleteAccount = () => {
        setIsDeleteAccountOpen((prev) => !prev)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (
            (deleteAccountRef.current && !deleteAccountRef.current.contains(event.target as Node))
        ) {
            setIsDeleteAccountOpen(false)
        }
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsDeleteAccountOpen(false)
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
        <div className="size-full flex flex-col justify-center px-[22%] py-10 gap-8">
            <h1 className="text-4xl font-bold text-center">Configurações</h1>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-[600]">Assinaturas</h2>
                    <p>Você ainda não tem assinaturas ativas</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <h2 className="text-xl font-[600]">Exclução de Conta</h2>
                        <p>Excluir sua conta é uma ação permanente e irreversível. Todos os seus dados serão apagados e não poderão ser recuperados. Por favor, certifique-se de que deseja prosseguir com esta ação.</p>
                    </div>
                    <button onClick={toggleDeleteAccount} className="w-min text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[18px] p-[7.5px] px-[50px] mt-[15px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap outline-none">Excluir Conta</button>
                </div>
            </div>
            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center z-150 transition-all duration-300 ease-in-out transform ${
                isDeleteAccountOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}>
                <div ref={deleteAccountRef} className={`flex flex-col bg-[var(--background)] p-4 rounded-lg transition-all duration-300 ease-in-out transform ${isDeleteAccountOpen ? "scale-100" : "scale-90"}`}>
                    <button className="w-min text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[18px] p-[7.5px] px-[50px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap outline-none">Excluir Conta</button>
                </div>
            </div>
        </div>
    )
}
