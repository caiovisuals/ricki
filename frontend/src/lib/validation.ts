export interface ValidationResult {
    valid: boolean
    error?: string
}

export function validateName(name: string): ValidationResult {
    if (!name || name.trim() === '') {
        return { valid: false, error: 'Nome é obrigatório' }
    }

    if (name.length < 2) {
        return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres' }
    }

    if (name.length > 75) {
        return { valid: false, error: 'Nome muito longo' }
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/
    if (!nameRegex.test(name)) {
        return { valid: false, error: 'Nome contém caracteres inválidos' }
    }

    return { valid: true }
}

export function validateUsername(username: string): ValidationResult {
    if (!username || username.trim() === '') {
        return { valid: false, error: 'Nome de usuário é obrigatório' }
    }

    if (username.length < 2) {
        return { valid: false, error: 'Nome de usuário deve ter pelo menos 2 caracteres' }
    }

    if (username.length > 50) {
        return { valid: false, error: 'Nome de usuário muito longo' }
    }

    return { valid: true }
}

export function validateEmail(email: string): ValidationResult {
    if (!email || email.trim() === '') {
        return { valid: false, error: 'E-mail é obrigatório' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'E-mail inválido' }
    }

    if (email.length > 255) {
        return { valid: false, error: 'E-mail muito longo' }
    }

    return { valid: true }
}

export function validatePassword(password: string): ValidationResult {
    if (!password || password.trim() === '') {
        return { valid: false, error: 'Senha é obrigatória' }
    }

    if (password.length < 8) {
        return { valid: false, error: 'Senha deve ter pelo menos 8 caracteres' }
    }

    if (password.length > 128) {
        return { valid: false, error: 'Senha muito longa' }
    }

    return { valid: true }
}

export function validateMessage(message: string): ValidationResult {
    if (!message || message.trim() === '') {
        return { valid: false, error: 'Mensagem não pode estar vazia' }
    }

    if (message.length > 5000) {
        return { valid: false, error: 'Mensagem muito longa (máximo 5000 caracteres)' }
    }

    return { valid: true }
}
