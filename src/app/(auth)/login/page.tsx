"use client"

import { useState } from "react";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const showPasswordIcon = () => {
        if (showPassword) {
            return (
                <>
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3"></circle>
                </>
            );
        } else {
            return (
                <>
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path>
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path>
                    <path d="m2 2 20 20"></path>
                </>
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailOrUsername,
                    password: password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setLoading(false)
                return
            }

            localStorage.setItem('riiqui_auth_token', data.token)
            localStorage.setItem('riiqui_user_data', JSON.stringify(data.user))

            window.location.href = '/'
        } catch (error) {
            console.error('Login error:', error)
            setLoading(false)
        }
    }
    
    return (
        <div className="size-full flex flex-col justify-center items-center px-[22px]">
            <h1 className="text-[32px] mb-[15px]">Fazer Login</h1>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[10px] items-center max-w-[500px]">
                <div className="flex flex-col gap-[3px] w-full">
                    <label htmlFor="email" className="text-[20px]">
                        E-mail ou Usuário
                    </label>
                    <input
                    id="emailorusername"
                    type="text"
                    placeholder="Digite seu e-mail ou usuário"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full border-2 bg-[#333] border-[#444] p-[5px] px-[11.25px] text-[18px] text-[white] rounded-[15px] outline-none focus:border-[#555] transition-all duration-300 ease-in-out"
                    required
                    />
                </div>

                <div className="flex flex-col gap-[3px] w-full relative">
                    <label htmlFor="password" className="text-[20px]">
                        Senha
                    </label>
                    <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 bg-[#333] border-[#444] p-[5px] px-[11.25px] text-[18px] text-[white] rounded-[15px] outline-none focus:border-[#555] transition-all duration-300 ease-in-out"
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[10px] top-[41.5px] flex items-center justify-center bg-transparent outline-none"
                    tabIndex={-1}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width={24}
                            height={24}
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            >
                            {showPasswordIcon()}
                        </svg>
                    </button>
                </div>

                <button
                    type="submit"
                    className={`w-min text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[20px] p-[7.5px] px-[90px] mt-[15px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap`}
                    disabled={loading}>
                    {loading ? "Fazendo Login" : "Fazer Login"}
                </button>

                <p className="text-center mt-[-5px]">
                    Não tem uma conta?{" "}
                    <a href="/register" className="text-gray-500">
                    Criar conta
                    </a>
                </p>
            </form>
        </div>
    )
}
