import Header from "@/components/Header"
import "./globals.css"

export const metadata = {
    title: "RIIQUI-IA",
    description: "Ia feita por dev brasileiro!",
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
