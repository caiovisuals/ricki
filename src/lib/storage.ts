// Secure localStorage wrapper with encryption and user isolation
interface StorageData {
    [key: string]: any
}

// Simple encryption/obfuscation (NOT cryptographically secure, just basic protection)
function encode(data: string): string {
    return btoa(encodeURIComponent(data))
}

function decode(data: string): string {
    try {
        return decodeURIComponent(atob(data))
    } catch {
        return ''
    }
}

// Get user-specific storage key
function getUserKey(userId: string | null, key: string): string {
    if (!userId) return `riiqui_guest_${key}`
    return `riiqui_user_${userId}_${key}`
}

// Save data to localStorage with encoding
export function saveToStorage(key: string, data: any, userId: string | null = null): void {
    if (typeof window === 'undefined') return
    
    try {
        const storageKey = getUserKey(userId, key)
        const jsonData = JSON.stringify(data)
        const encodedData = encode(jsonData)
        localStorage.setItem(storageKey, encodedData)
    } catch (error) {
        console.error('Error saving to storage:', error)
    }
}

// Load data from localStorage with decoding
export function loadFromStorage<T>(key: string, userId: string | null = null, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue
    
    try {
        const storageKey = getUserKey(userId, key)
        const encodedData = localStorage.getItem(storageKey)
        
        if (!encodedData) return defaultValue
        
        const jsonData = decode(encodedData)
        if (!jsonData) return defaultValue
        
        return JSON.parse(jsonData) as T
    } catch (error) {
        console.error('Error loading from storage:', error)
        return defaultValue
    }
}

// Remove data from localStorage
export function removeFromStorage(key: string, userId: string | null = null): void {
    if (typeof window === 'undefined') return
    
    try {
        const storageKey = getUserKey(userId, key)
        localStorage.removeItem(storageKey)
    } catch (error) {
        console.error('Error removing from storage:', error)
    }
}

// Clear all user-specific data
export function clearUserStorage(userId: string): void {
    if (typeof window === 'undefined') return
    
    try {
        const prefix = `riiqui_user_${userId}_`
        const keysToRemove: string[] = []
        
        for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
            keysToRemove.push(key)
        }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
        console.error('Error clearing user storage:', error)
    }
}

// Get current user from storage
export function getCurrentUser() {
    if (typeof window === 'undefined') return null
    
    try {
        const token = localStorage.getItem('riiqui_auth_token')
        if (!token) return null
        
        const userData = localStorage.getItem('riiqui_user_data')
        if (!userData) return null
        
        return JSON.parse(userData)
    } catch {
        return null
    }
}

// Save auth token
export function saveAuthToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('riiqui_auth_token', token)
}

// Get auth token
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('riiqui_auth_token')
}

// Clear auth token
export function clearAuthToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('riiqui_auth_token')
    localStorage.removeItem('riiqui_user_data')
}