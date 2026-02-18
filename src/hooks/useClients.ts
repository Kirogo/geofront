// src/hooks/useClients.ts
import { useState, useCallback } from 'react';
import axios from '../config/axiosConfig';
import { Client } from '../types/client.types';
import { PaginatedResponse } from '../types/common.types';
import toast from 'react-hot-toast';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchClients = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setClients([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<Client[]>(`/clients/search?q=${encodeURIComponent(searchTerm)}`);
      setClients(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to search clients';
      setError(message);
      toast.error(message);
      console.error('Error searching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getClients = useCallback(async (page = 1, pageSize = 10, search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      if (search) {
        params.append('search', search);
      }
      
      const response = await axios.get<PaginatedResponse<Client>>(`/clients?${params.toString()}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch clients';
      toast.error(message);
      console.error('Error fetching clients:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientById = useCallback(async (id: string) => {
    try {
      const response = await axios.get<Client>(`/clients/${id}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch client';
      toast.error(message);
      console.error('Error fetching client:', err);
      throw err;
    }
  }, []);

  const getClientByCustomerNumber = useCallback(async (customerNumber: string) => {
    try {
      const response = await axios.get<Client>(`/clients/customer/${customerNumber}`);
      return response.data;
    } catch (err: any) {
      if (err.response?.status !== 404) {
        const message = err.response?.data?.message || 'Failed to fetch client';
        toast.error(message);
        console.error('Error fetching client by customer number:', err);
      }
      throw err;
    }
  }, []);

  const createClient = useCallback(async (clientData: Partial<Client>) => {
    try {
      const response = await axios.post<Client>('/clients', clientData);
      toast.success('Client created successfully');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create client';
      toast.error(message);
      console.error('Error creating client:', err);
      throw err;
    }
  }, []);

  const updateClient = useCallback(async (id: string, clientData: Partial<Client>) => {
    try {
      await axios.put(`/clients/${id}`, clientData);
      toast.success('Client updated successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update client';
      toast.error(message);
      console.error('Error updating client:', err);
      throw err;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      await axios.delete(`/clients/${id}`);
      toast.success('Client deleted successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete client';
      toast.error(message);
      console.error('Error deleting client:', err);
      throw err;
    }
  }, []);

  return {
    clients,
    loading,
    error,
    searchClients,
    getClients,
    getClientById,
    getClientByCustomerNumber,
    createClient,
    updateClient,
    deleteClient
  };
};