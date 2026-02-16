export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    permissions?: string[]
    createdAt?: string | Date
    updatedAt?: string | Date
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    user: User
    token: string
    refreshToken: string
    permissions?: string[]
}

export interface AuthState {
    user: User | null
    token: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    permissions: string[]
}

export interface RegisterDto {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: string
}

export interface ForgotPasswordDto {
    email: string
}

export interface ResetPasswordDto {
    token: string
    password: string
}
