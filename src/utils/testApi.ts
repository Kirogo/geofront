// src/utils/testApi.ts
import axios from '../config/axiosConfig';

export const testApiConnection = async () => {
  try {
    // Test basic connection
    const healthCheck = await axios.get('/health');
    console.log('Health check:', healthCheck.data);
  } catch (error) {
    console.error('Health check failed:', error);
  }
  
  try {
    // Test auth endpoints
    const authEndpoints = ['/auth/test', '/auth/me'];
    for (const endpoint of authEndpoints) {
      try {
        const response = await axios.get(endpoint);
        console.log(`${endpoint}:`, response.data);
      } catch (e) {
        console.log(`${endpoint} not available`);
      }
    }
  } catch (error) {
    console.error('Auth test failed:', error);
  }
  
  try {
    // Test reports endpoints
    const reportsEndpoints = ['/reports', '/reports/my-reports', '/reports/my-pending-reports'];
    for (const endpoint of reportsEndpoints) {
      try {
        const response = await axios.get(endpoint);
        console.log(`${endpoint}:`, response.data);
      } catch (e) {
        console.log(`${endpoint} not available`);
      }
    }
  } catch (error) {
    console.error('Reports test failed:', error);
  }
  
  try {
    // Test clients endpoints
    const clientsEndpoints = ['/clients', '/clients/search?q=test'];
    for (const endpoint of clientsEndpoints) {
      try {
        const response = await axios.get(endpoint);
        console.log(`${endpoint}:`, response.data);
      } catch (e) {
        console.log(`${endpoint} not available`);
      }
    }
  } catch (error) {
    console.error('Clients test failed:', error);
  }
};