// src/hooks/useFacility.ts
import { useState, useCallback } from 'react';
import axios from '../config/axiosConfig';
import toast from 'react-hot-toast';

// Match your backend DTO exactly
export interface Milestone {
  id: number;
  description: string;
  milestoneOrder: number;
  allocatedAmount: number;
  isAchieved: boolean;
  achievedDate?: string;
}

export interface Tranche {
  id: number;
  trancheNumber: string;
  amount: number;
  requestDate: string;
  disbursementDate?: string;
  status: string;
}

export interface Facility {
  id: number;
  ibpsNumber: string;
  customerName: string;
  totalApprovedAmount: number;
  projectDescription?: string;
  siteLatitude?: number;
  siteLongitude?: number;
  allowedGeoFenceRadius: number;
  milestones: Milestone[];
  tranches: Tranche[];
}

// Simplified version for form auto-population
export interface FacilityLookupResult {
  clientId: string;
  customerName: string;
  projectName: string;
  siteAddress: string;
  loanType: string;
  totalAmount: number;
  siteLatitude?: number;
  siteLongitude?: number;
  milestones: Milestone[];
  tranches: Tranche[];
}

export const useFacility = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facility, setFacility] = useState<Facility | null>(null);

  const getFacilityByIBPS = useCallback(async (ibpsNumber: string): Promise<FacilityLookupResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<Facility>(`/facility/${ibpsNumber}`);
      const facilityData = response.data;
      setFacility(facilityData);
      
      // Transform to format needed for form auto-population
      const lookupResult: FacilityLookupResult = {
        clientId: facilityData.id.toString(),
        customerName: facilityData.customerName,
        projectName: facilityData.projectDescription || 'N/A',
        siteAddress: '', // This would need to come from a separate source or be added to Facility model
        loanType: 'construction', // Default or derive from data
        totalAmount: facilityData.totalApprovedAmount,
        siteLatitude: facilityData.siteLatitude,
        siteLongitude: facilityData.siteLongitude,
        milestones: facilityData.milestones,
        tranches: facilityData.tranches
      };
      
      toast.success('Facility details loaded successfully');
      return lookupResult;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const message = `Facility with IBPS number ${ibpsNumber} not found`;
        setError(message);
        toast.error(message);
      } else {
        const message = err.response?.data || 'Failed to fetch facility';
        setError(message);
        toast.error(message);
      }
      console.error('Error fetching facility:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateIBPS = useCallback(async (ibpsNumber: string): Promise<boolean> => {
    try {
      const response = await axios.get<boolean>(`/facility/${ibpsNumber}/validate`);
      return response.data;
    } catch (err) {
      console.error('Error validating IBPS:', err);
      return false;
    }
  }, []);

  const getMilestones = useCallback((): Milestone[] => {
    return facility?.milestones || [];
  }, [facility]);

  const getTranches = useCallback((): Tranche[] => {
    return facility?.tranches || [];
  }, [facility]);

  const getTotalDisbursed = useCallback((): number => {
    return facility?.tranches
      .filter(t => t.status.toLowerCase() === 'disbursed' && t.disbursementDate)
      .reduce((sum, t) => sum + t.amount, 0) || 0;
  }, [facility]);

  const getRemainingAmount = useCallback((): number => {
    if (!facility) return 0;
    const disbursed = getTotalDisbursed();
    return facility.totalApprovedAmount - disbursed;
  }, [facility, getTotalDisbursed]);

  const getAchievedMilestones = useCallback((): Milestone[] => {
    return facility?.milestones.filter(m => m.isAchieved) || [];
  }, [facility]);

  const getPendingMilestones = useCallback((): Milestone[] => {
    return facility?.milestones.filter(m => !m.isAchieved) || [];
  }, [facility]);

  const getNextMilestone = useCallback((): Milestone | undefined => {
    return facility?.milestones
      .filter(m => !m.isAchieved)
      .sort((a, b) => a.milestoneOrder - b.milestoneOrder)[0];
  }, [facility]);

  const getNextTranche = useCallback((): Tranche | undefined => {
    return facility?.tranches
      .filter(t => t.status.toLowerCase() !== 'disbursed')
      .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime())[0];
  }, [facility]);

  return {
    loading,
    error,
    facility,
    getFacilityByIBPS,
    validateIBPS,
    getMilestones,
    getTranches,
    getTotalDisbursed,
    getRemainingAmount,
    getAchievedMilestones,
    getPendingMilestones,
    getNextMilestone,
    getNextTranche
  };
};