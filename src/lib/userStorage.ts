export interface User {
    id: string
    name: string
    email: string
    password: string
    createdAt: string
}

// Use global object to persist data across API routes
if (typeof global !== 'undefined') {
    if (!(global as any).appUsers) {
        (global as any).appUsers = []
    }
}

export function getUsers(): User[] {
    if (typeof global !== 'undefined') {
        return (global as any).appUsers || []
    }
    return []
}

export function addUser(user: User): void {
    if (typeof global !== 'undefined') {
        if (!(global as any).appUsers) {
            (global as any).appUsers = []
        }
        (global as any).appUsers.push(user)
    }
}

export function findUserByEmail(email: string): User | undefined {
    return getUsers().find(u => u.email === email)
}

export function findUserById(id: string): User | undefined {
    return getUsers().find(u => u.id === id)
}