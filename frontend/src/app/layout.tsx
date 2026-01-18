import Header from "@/components/Header"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

export const metadata = {
    title: "RICKI-IA",
    description: "Ia feita por dev brasileiro! Receba conselhos, feedback sugestões e respostas diretas. Experimente o RIIQUI agora mesmo!",
    metadataBase: new URL("https://ricki-ia.com"),
    keywords: [ 
        "artificial intelligence", "chat-box", "assistant"
    ],
    openGraph: {
        type: "website",
        locale: "pt_BR",
        images: [{
            url: "https://www.ricki-ia.com/ogimage.png",
            width: 2400,
            height: 1260,
            alt: "Preview do Vtrack",
            type: "image/png"
        }],
        countryName: "Brasil",
    },
    twitter: {
        card: "summary_large_image",
        site: "@caioba2007",
        images: ["https://ricki-ia.com/ogimage.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
        },
    },
    alternates: {
        languages: {
            'pt-BR': '/'
        }
    },
    icons: {
        icon: "/icon.png",
        apple: "/apple-icon.png",
    },
    other: {
        "google": "notranslate",
        "application-name": "RICKI-IA",
    }
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
