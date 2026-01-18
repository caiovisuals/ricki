export type Entity = {
    type: 'number' | 'date' | 'time' | 'name' | 'location' | 'url' | 'email'
    value: string
    start: number
    end: number
}

// Detectar números
function detectNumbers(text: string): Entity[] {
    const entities: Entity[] = []
    const numberRegex = /\b\d+(?:[.,]\d+)?\b/g
    let match
    
    while ((match = numberRegex.exec(text)) !== null) {
        entities.push({
            type: 'number',
            value: match[0],
            start: match.index,
            end: match.index + match[0].length
        })
    }
    
    return entities
}

// Detectar datas
function detectDates(text: string): Entity[] {
    const entities: Entity[] = []
    const datePatterns = [
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, // DD/MM/YYYY
        /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g, // DD-MM-YYYY
        /\b(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+\d{4}\b/gi,
        /\b\d{1,2}\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b/gi
    ]
    
    for (const pattern of datePatterns) {
        let match
        while ((match = pattern.exec(text)) !== null) {
            entities.push({
                type: 'date',
                value: match[0],
                start: match.index,
                end: match.index + match[0].length
            })
        }
    }
    
    return entities
}

// Detectar URLs
function detectUrls(text: string): Entity[] {
    const entities: Entity[] = []
    const urlRegex = /https?:\/\/[^\s]+/g
    let match
    
    while ((match = urlRegex.exec(text)) !== null) {
        entities.push({
            type: 'url',
            value: match[0],
            start: match.index,
            end: match.index + match[0].length
        })
    }
    
    return entities
}

// Detectar emails
function detectEmails(text: string): Entity[] {
    const entities: Entity[] = []
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    let match
    
    while ((match = emailRegex.exec(text)) !== null) {
        entities.push({
            type: 'email',
            value: match[0],
            start: match.index,
            end: match.index + match[0].length
        })
    }
    
    return entities
}

// Detectar horários
function detectTimes(text: string): Entity[] {
    const entities: Entity[] = []
    const timeRegex = /\b\d{1,2}:\d{2}(?::\d{2})?\b/g
    let match
    
    while ((match = timeRegex.exec(text)) !== null) {
        entities.push({
            type: 'time',
            value: match[0],
            start: match.index,
            end: match.index + match[0].length
        })
    }
    
    return entities
}

// Detectar nomes próprios (palavras capitalizadas)
function detectNames(text: string): Entity[] {
    const entities: Entity[] = []
    const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g
    let match
    
    // Lista de palavras comuns que não são nomes
    const commonWords = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    while ((match = nameRegex.exec(text)) !== null) {
        if (!commonWords.includes(match[0])) {
            entities.push({
                type: 'name',
                value: match[0],
                start: match.index,
                end: match.index + match[0].length
            })
        }
    }
    
    return entities
}

// Função principal para extrair todas as entidades
export function extractEntities(text: string): Entity[] {
    const entities: Entity[] = [
        ...detectNumbers(text),
        ...detectDates(text),
        ...detectTimes(text),
        ...detectUrls(text),
        ...detectEmails(text),
        ...detectNames(text)
    ]
    
    // Ordenar por posição
    return entities.sort((a, b) => a.start - b.start)
}

// Verificar se a mensagem contém certos tipos de entidades
export function hasEntityType(text: string, type: Entity['type']): boolean {
    const entities = extractEntities(text)
    return entities.some(e => e.type === type)
}

// Extrair apenas valores de um tipo específico
export function getEntityValues(text: string, type: Entity['type']): string[] {
    const entities = extractEntities(text)
    return entities.filter(e => e.type === type).map(e => e.value)
}