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
    return candidates.map(c => c.output).join(" ") // simples, mas cria algo novo
}

// Função simples que encontra a melhor resposta
export function sendMessage(message: string): string {
    const vocabulary = buildVocabulary(trainingData)
    const msgVector = vectorize(message, vocabulary)

    let bestMatch = ""
    let maxSim = 0

    for (const data of trainingData) {
        const dataVector = vectorize(data.input, vocabulary)
        const sim = cosineSimilarity(msgVector, dataVector)
        if (sim > maxSim) {
            maxSim = sim
            bestMatch = data.output
        }
    }

    // Se similaridade for baixa, resposta padrão
    if (maxSim < 0.1) return "Desculpe, não entendi."
    return bestMatch
}

export function trainNewPair(input: string, output: string) {
    trainingData.push({ input, output })
}