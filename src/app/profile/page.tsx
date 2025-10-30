"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import SkeletonProfile from "@/components/skeletonsscreens/SkeletonProfile"

type FormData = {
    name: string
    email: string
    username: string
    avatar: string
    gender: string
    language: string
}

export default function Profile() { // pagina de perfil do usuario logado   
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isAvatarOpen, setIsAvatarOpen] = useState(false)
    const [isBannerOpen, setIsBannerOpen] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",
        avatar: user?.avatar || "",
        gender: user?.gender || "indefinite",
        language: user?.language || "portuguese",
    })
    const [saving, setSaving] = useState(false)

    const EditingRef = useRef<HTMLDivElement | null>(null)

    const ViewAvatarRef = useRef<HTMLDivElement | null>(null)
    const ViewBannerRef = useRef<HTMLDivElement | null>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            (EditingRef.current && !EditingRef.current.contains(event.target as Node))
        ) {
            setIsEditing(false)
            setIsAvatarOpen(false)
            setIsBannerOpen(false)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsEditing(false)
            setIsAvatarOpen(false)
            setIsBannerOpen(false)
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

    const handleEdit = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            username: user?.username || "",
            avatar: user?.avatar || "",
            gender: user?.gender || "",
            language: user?.language || "",
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
            username: user?.username || "",
            avatar: user?.avatar || "",
            gender: user?.gender || "",
            language: user?.language || "",
        });
        setIsEditing(false);
    };

    if (!user) return <SkeletonProfile/>

    return (
        <div className="size-full flex flex-col px-[22%] py-10 gap-8">
            <h1 className="text-4xl font-bold">Seu Perfil</h1>

            <div className="w-full flex flex-col gap-4">
                <div onClick={() => setIsBannerOpen(true)} className="size-full aspect-[70/15] bg-gray-500 rounded-2xl cursor-pointer"/>
                <div className="w-full flex flex-row gap-6 items-center justify-between">
                    <div className="flex flex-row gap-6 items-center">
                        <div onClick={() => setIsAvatarOpen(true)} className="flex items-center justify-center size-[85px] rounded-full bg-gray-500 cursor-pointer">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="User Avatar" className="size-full object-cover" draggable="false"/>
                            ) : (
                                <div className="hidden"></div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-[30px] font-[700]">{user?.name}</h2>
                            <span>{user?.email}</span>
                        </div>
                    </div>
                    <button onClick={handleEdit} disabled={saving} className="bg-gray-500 hover:bg-gray-700 px-7.5 py-1 rounded-lg transition duration-300 cursor-pointer text-[var(--background)] flex items-center justify-center">Editar Perfil</button>
                </div>
            </div>

            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center z-150 transition-all duration-300 ease-in-out transform ${
                isEditing
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}>
                <div ref={EditingRef} className={`flex flex-col gap-4 items-start justify-center bg-[var(--background)] p-6 rounded-lg transition-all duration-300 ease-in-out transform ${isEditing ? "scale-100" : "scale-90"}`}>
                    <h2 className="text-2xl font-bold">Editar Perfil</h2>
                    <div className="group relative overflow-hidden w-full">
                        <input
                            type="file"
                            accept="image/*"
                            title="Editar Banner"
                            className="absolute inset-0 size-full opacity-0 cursor-pointer"
                        />
                        <div className="inset-0 bg-gray-600 group-hover:bg-gray-700 rounded-lg p-8 w-full flex items-center justify-center transition duration-300">
                            <svg width="80" height="65" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="26" height="18" x="0" y="3" rx="2" ry="2"/><circle cx="6" cy="9" r="2.1"/><path d="m26 15-3.086-3.086a2 2 0 0 0-2.828 0L6 20.7"/>
                            </svg>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden aspect-square border-4 border-[var(--background)] rounded-full mt-[-66px] ml-4">
                        <input
                            type="file"
                            accept="image/*"
                            title="Editar Avatar"
                            className="absolute inset-0 size-full opacity-0 cursor-pointer"
                        />
                        <div className="inset-0 bg-gray-600 group-hover:bg-gray-700 rounded-full p-4 aspect-square transition duration-300">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-row gap-4 w-full">
                            <div className="flex flex-col items-start justify-center w-[50%]">
                                <label>Nome:</label>
                                <input
                                    className="w-full border-2 p-2 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex flex-col items-start justify-center w-[50%]">
                                <label>Nome de usuário:</label>
                                <div className="relative w-full flex items-center">
                                    <input
                                        className="w-full border-2 p-2 pl-6 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                        />
                                    <span className="absolute left-2.5">@</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-center w-full">
                            <label>Email:</label>
                            <input
                                className="w-full border-2 p-2 border-gray-400 bg-transparent rounded-2xl focus:outline-none"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <div className="flex flex-col items-start justify-center w-[50%]">
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
                            <div className="flex flex-col items-start justify-center w-[50%]">
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
                    <div className="flex flex-row gap-4 mt-[15px]">
                        <button onClick={handleSave} className="w-min text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[18px] p-[7.5px] px-[120px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap outline-none">Salvar</button>
                        <button onClick={handleCancel} className="w-min text-black bg-gray-300 hover:text-white hover:bg-gray-600 text-[18px] p-[7.5px] px-[120px] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap outline-none">Cancelar</button>
                    </div>
                </div>
            </div>
            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center z-150 transition-all duration-300 ease-in-out transform ${
                isAvatarOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}>

                <div ref={ViewAvatarRef} className={`flex flex-col gap-4 items-start justify-center bg-[var(--background)] p-6 rounded-lg transition-all duration-300 ease-in-out transform ${isAvatarOpen ? "scale-100" : "scale-90"}`}>

                </div>
            </div>
            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center z-150 transition-all duration-300 ease-in-out transform ${
                isBannerOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}>
                <div ref={ViewBannerRef} className={`flex flex-col gap-4 items-start justify-center bg-[var(--background)] p-6 rounded-lg transition-all duration-300 ease-in-out transform ${isBannerOpen ? "scale-100" : "scale-90"}`}>
                    
                </div>
            </div>
        </div>
    )
}
