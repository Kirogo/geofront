import axiosInstance from './axiosConfig'
import { User, RegisterDto } from '@/types/auth.types'

export const usersApi = {
    // Get all users
    getUsers: async () => {
        const response = await axiosInstance.get<User[]>('/users')
        return response
    },

    // Create a new user
    createUser: async (data: RegisterDto) => {
        const response = await axiosInstance.post<User>('/users', data)
        return response
    },

    // Update a user (using the same DTO for simplicity for now)
    updateUser: async (id: string, data: Partial<User>) => {
        const response = await axiosInstance.patch<User>(`/users/${id}`, data)
        return response
    },

    // Delete a user
    deleteUser: async (id: string) => {
        const response = await axiosInstance.delete(`/users/${id}`)
        return response
    }
}
