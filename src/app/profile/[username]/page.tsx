"use client"

interface User {
    name?: string;
    email?: string;
    username?: string;
    avatar?: string;
    gender?: string;
    language?: string;
}
interface UserProfileProps {
    user: User;
}

export default function UserProfile({user}: UserProfileProps) { // pagina de perfil do usuario da url (não pode ser o logado)

    if (!user) {
        return (
        <div className="size-full flex items-center justify-center px-[22%] py-10 gap-8">
            <span>Usuário não encontrado</span>
        </div>
    )}

    return (
        <div className="size-full flex flex-col justify-center px-[22%] py-10 gap-8">
            <h1 className="text-4xl font-bold text-center">{user.name}</h1>
            <div className="flex flex-row items-center gap-6 justify-start">
                <div className="flex items-center justify-center size-[85px] rounded-full bg-gray-500 cursor-pointer">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="User Avatar" className="size-full object-cover" draggable="false"/>
                    ) : (
                        <div className="hidden"></div>
                    )}
                </div>
                <div>
                    <span>{user.name}</span>
                    <span>{user.username}</span>
                </div>
            </div>
        </div>
    )
}