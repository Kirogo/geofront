import axiosInstance from './axiosConfig'
import { Client, CreateClientDto, UpdateClientDto } from '@/types/client.types'
import { PaginatedResponse } from '@/types/common.types'

export const clientsApi = {
  // Get all clients
  getClients: async (params?: any) => {
    const response = await axiosInstance.get<PaginatedResponse<Client>>('/clients', { params })
    return response
  },

  // Get client by ID
  getClientById: async (id: string) => {
    const response = await axiosInstance.get<Client>(`/clients/${id}`)
    return response
  },

  // Get client by customer number (for autopopulate)
  getClientByCustomerNumber: async (customerNumber: string) => {
    const response = await axiosInstance.get<Client>(`/clients/customer/${customerNumber}`)
    return response
  },

  // Search clients
  searchClients: async (query: string) => {
    const response = await axiosInstance.get<Client[]>('/clients/search', {
      params: { q: query },
    })
    return response
  },

  // Create new client
  createClient: async (data: CreateClientDto) => {
    const response = await axiosInstance.post<Client>('/clients', data)
    return response
  },

  // Update client
  updateClient: async (id: string, data: UpdateClientDto) => {
    const response = await axiosInstance.put<Client>(`/clients/${id}`, data)
    return response
  },

  // Delete client
  deleteClient: async (id: string) => {
    const response = await axiosInstance.delete(`/clients/${id}`)
    return response
  },

  // Get client projects
  getClientProjects: async (clientId: string) => {
    const response = await axiosInstance.get(`/clients/${clientId}/projects`)
    return response
  },

  // Get client reports
  getClientReports: async (clientId: string, page = 1, pageSize = 10) => {
    const response = await axiosInstance.get(`/clients/${clientId}/reports`, {
      params: { page, pageSize },
    })
    return response
  },
}