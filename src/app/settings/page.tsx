"use client"

import { useState, useEffect, useRef } from "react"

export default function Settings() {
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)

    const deleteAccountRef = useRef<HTMLDivElement | null>(null)

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const toggleDeleteAccount = () => {
        setIsDeleteAccountOpen((prev) => !prev)
        setUsername("")
        setPassword("")
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

    const handleDeleteAccount = async () => {
        if (!username || !password) {
            setError("Preencha todos os campos.")
            return
        }

        try {
            setIsLoading(true)
            setError("")

            const res = await fetch("/api/user/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || "Erro ao excluir conta.")
                setIsLoading(false)
                return
            }

            // Logout e redirecionamento após sucesso
            alert("Conta excluída com sucesso.")
            window.location.href = "/"
        } catch (error) {
            setError("Erro inesperado. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

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
                <div ref={deleteAccountRef} className={`flex flex-col gap-4 items-start justify-center min-w-120 bg-[var(--background)] p-6 rounded-2xl transition-all duration-300 ease-in-out transform ${isDeleteAccountOpen ? "scale-100" : "scale-90"}`}>
                    <h2 className="text-2xl font-bold">Confirme a Exclusão</h2>
                    <div className="flex flex-col gap-4 group relative overflow-hidden w-full">
                        <div className="flex flex-col items-start justify-center w-full">
                            <label>Nome de usuário:</label>
                            <div className="relative w-full flex items-center">
                                <input
                                    type="text"
                                    placeholder="Nome de usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border-2 p-2 pl-6 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                />
                                <span className="absolute left-2.5">@</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center w-full">
                            <label>Senha:</label>
                            <input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 p-2 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                            />
                        </div>
                    </div>
                    <button onClick={handleDeleteAccount} disabled={isLoading} className="w-full text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[18px] p-[7.5px] px-[50px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap outline-none">{isLoading ? "Excluindo..." : "Excluir Conta"}</button>
                    <p className="text-[14px] self-center -mt-2">Essa é uma ação irreversível!</p>
                </div>
            </div>
        </div>
    )
}
