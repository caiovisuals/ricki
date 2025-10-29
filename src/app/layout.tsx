import Header from "@/components/Header"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

export const metadata = {
    title: "RICKI-IA",
    description: "Ia feita por dev brasileiro! Receba conselhos, feedback sugestões e respostas diretas. Experimente o RIIQUI agora mesmo!",
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
    return (
        <html lang="pt-br">
            <body className="relative min-h-screen flex flex-col">
                <AuthProvider>
                    <Header/>
                    <div className="mt-[64px] size-full">
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
