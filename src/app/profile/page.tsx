"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import SkeletonProfile from "@/components/skeletonsscreens/SkeletonProfile"

export default function Profile() { // pagina de perfil do usuario logado   
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.avatar || "",
        gender: user?.gender || "indefinite",
        language: user?.language || "portuguese",
    })
    const [saving, setSaving] = useState(false)

    const handleEdit = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.avatar || "",
            gender: user?.gender || "indefinite",
            language: user?.language || "portuguese",
        });
        setIsEditing(true);
    };

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

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.avatar || "",
            gender: user?.gender || "indefinite",
            language: user?.language || "portuguese",
        });
        setIsEditing(false);
    };

    if (!user) return <SkeletonProfile/>

    return (
        <div className="size-full flex flex-col justify-center px-[22%] py-10 gap-8">
            <h1 className="text-4xl font-bold text-center">Perfil</h1>

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
                <button onClick={handleEdit} disabled={saving} className="bg-gray-500 hover:bg-gray-700 px-7.5 py-1 rounded-lg transition duration-300 cursor-pointer text-[var(--background)] flex items-center justify-center">Editar Perfil</button>
            </div>

            {isEditing ? (
                <div className="flex flex-col gap-4 items-center">
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-row gap-4 w-full">
                            <div className="flex flex-col items-center justify-start w-[50%]">
                                <label>Nome:</label>
                                <input
                                    className="w-full border-2 p-2 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex flex-col items-center justify-start w-[50%]">
                                <label>Email:</label>
                                <input
                                    className="w-full border-2 p-2 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <div className="flex flex-col items-center justify-start w-[50%]">
                                <label>Gênero:</label>
                                <select
                                    className="w-full border-2 p-2 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="indefinite">Prefiro não informar</option>
                                    <option value="masculine">Masculino</option>
                                    <option value="feminine">Feminino</option>
                                </select>
                            </div>
                            <div className="flex flex-col items-center justify-start w-[50%]">
                                <label>Idioma:</label>
                                <select
                                    className="w-full border-2 p-2 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                >
                                    <option value="portuguese">Português</option>
                                    <option value="english">Inglês</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <button onClick={handleSave} className="w-min text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[18px] p-[7.5px] px-[120px] mt-[15px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap outline-none">Salvar</button>
                        <button onClick={handleCancel} className="w-min text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[18px] p-[7.5px] px-[120px] mt-[15px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap outline-none">Cancelar</button>
                    </div>
                </div>
            ) : (
                <div className="hidden"/>
            )}
        </div>
    )
}
