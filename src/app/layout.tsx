import Header from "@/components/Header"
import "./globals.css"

export const metadata = {
    title: "RIIQUI-IA",
    description: "Ia feita por dev brasileiro! Receba conselhos, feedback sugestões e respostas diretas. Experimente o RIIQUI agora mesmo!",
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
    return (
        <html lang="pt-br">
            <body className="relative min-h-screen flex flex-col">
                <Header/>
                <div className="mt-[64px] size-full">
                    {children}
                </div>
            </body>
        </html>
    )
}
