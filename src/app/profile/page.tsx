"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import SkeletonProfile from "@/components/skeletonsscreens/SkeletonProfile"

export default function Profile() { // pagina de perfil do usuario logado   
    const { user, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.avatar || ""
    })
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error("Erro ao salvar alterações")
            setIsEditing(false)
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (!user) return <SkeletonProfile/>

    return (
        <div className="size-full flex flex-col justify-center px-[22%] py-10 gap-8">
            <h1 className="text-4xl font-bold text-center">Profile</h1>

            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-6 items-center">
                    <div className="flex items-center justify-center size-[85px] rounded-full bg-gray-400 group-hover:bg-gray-500 transition-colors duration-300 cursor-pointer">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="User Avatar" className="size-full object-cover"/>
                        ) : (
                            <div className="hidden"></div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[28px] font-[700]">{user?.name}</h2>
                        <span>{user?.email}</span>
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <button onClick={handleSave} disabled={saving} className="bg-gray-500 hover:bg-gray-700 px-7.5 py-1 rounded-lg transition duration-300 cursor-pointer text-white flex items-center justify-center">Editar Perfil</button>
                    <button onClick={logout} disabled={saving} className="bg-gray-500 hover:bg-gray-700 px-7.5 py-1 rounded-lg transition duration-300 cursor-pointer text-white flex items-center justify-center">Sair</button>
                </div>
            </div>

            {isEditing ? (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col items-center justify-start">
                            <label>Nome:</label>
                            <input
                                className="text-[24px] font-bold border-b border-gray-400 bg-transparent focus:outline-none"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex flex-col items-center justify-start">
                            <label>Email:</label>
                            <input
                                className="text-gray-500 border-b border-gray-400 bg-transparent focus:outline-none"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <button onClick={handleSave}>Salvar</button>
                </div>
            ) : (
                <div className="hidden"/>
            )}
        </div>
    )
}
