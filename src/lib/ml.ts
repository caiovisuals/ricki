"use client"

import { TrainingData, trainingData } from "./trainingData"

function buildVocabulary(data: TrainingData[]): string[] {
    const vocabSet = new Set<string>()
    data.forEach(d => d.input.toLowerCase().split(/\s+/).forEach(w => vocabSet.add(w)))
    return Array.from(vocabSet)
}

function vectorize(sentence: string, vocabulary: string[]): number[] {
    const words = sentence.toLowerCase().split(/\s+/)
    return vocabulary.map(v => (words.includes(v) ? 1 : 0))
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] ** 2
        normB += b[i] ** 2
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10)
}

function combineResponses(input: string): string {
    const keywords = input.toLowerCase().split(/\s+/)
    const candidates = trainingData.filter(d =>
        d.input.toLowerCase().split(/\s+/).some(w => keywords.includes(w))
    )

    if (candidates.length === 0) return "Desculpe, não entendi."

    // Combina outputs e cria pequenas variações aleatórias
    const base = candidates.map(c => c.output).join(" ")
    const variations = [
        "Sabia disso?",
        "Interessante, né?",
        "Quer saber mais?",
        "Posso te contar outra coisa sobre isso!",
        "Curioso isso!"
    ]

    return `${base} ${variations[Math.floor(Math.random() * variations.length)]}`
}

function getContextHistory(): { input: string; output: string }[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("riiqui_context")
    return stored ? JSON.parse(stored) : []
}

function saveContextHistory(history: { input: string; output: string }[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("riiqui_context", JSON.stringify(history))
}

function learnWord(word: string) {
    if (typeof window === "undefined") return
    const learned = JSON.parse(localStorage.getItem("riiqui_vocab") || "[]")
    if (!learned.includes(word)) {
        learned.push(word)
        localStorage.setItem("riiqui_vocab", JSON.stringify(learned))
    }
}

function storeLearnedPair(input: string, output: string) {
    if (typeof window === "undefined") return
    const stored = JSON.parse(localStorage.getItem("riiqui_learned") || "[]")
    stored.push({ input, output })
    localStorage.setItem("riiqui_learned", JSON.stringify(stored))
}

function getLearnedPairs(): TrainingData[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("riiqui_learned")
    return stored ? JSON.parse(stored) : []
}

async function fetchWikipediaSummary(query: string): Promise<string | null> {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        return data.extract || null;
    } catch (e) {
        return null;
    }
}

export async function sendMessage(message: string): Promise<string> {
    const learnedPairs = getLearnedPairs()
    const fullTraining = [...trainingData, ...learnedPairs]

    const vocabulary = buildVocabulary(fullTraining)
    const msgVector = vectorize(message, vocabulary)
    const contextHistory = getContextHistory() as { input: string; output: string }[]

    let bestMatch = ""
    let maxSim = 0

    for (const data of fullTraining) {
        const dataVector = vectorize(data.input, vocabulary)
        const sim = cosineSimilarity(msgVector, dataVector)
        if (sim > maxSim) {
            maxSim = sim
            bestMatch = data.output
        }
    }

    if (maxSim < 0.15) {
        const wiki = await fetchWikipediaSummary(message);
        if (wiki) {
            contextHistory.push({ input: message, output: wiki });
            saveContextHistory(contextHistory);
            return wiki;
        }

        if (contextHistory.length > 0) {
            const last = contextHistory[contextHistory.length - 1];
            if (message.includes("e você") || message.includes("e o seu")) {
                return `Como eu disse antes, ${last.output.toLowerCase()}`;
            }
        }

        const generated = combineResponses(message);
        contextHistory.push({ input: message, output: generated });
        saveContextHistory(contextHistory);
        return generated;
    }
    
    const lowerMsg = message.toLowerCase()
    if (lowerMsg.includes("triste") || lowerMsg.includes("mal")) {
        bestMatch += " Espero que você fique bem"
    } else if (lowerMsg.includes("feliz") || lowerMsg.includes("bom")) {
        bestMatch += " Que ótimo!"
    }

    contextHistory.push({ input: message, output: bestMatch })
    if (contextHistory.length > 10) contextHistory.shift()
    saveContextHistory(contextHistory)

    return bestMatch
}

export function trainNewPair(input: string, output: string) {
    trainingData.push({ input, output })
    storeLearnedPair(input, output)
}