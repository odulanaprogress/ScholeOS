import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchSchoolProfile,
  updateSchoolProfile,
  submitSchoolOnboarding,
  setActiveSchoolId,
  type SchoolProfile,
} from '@/lib/api';

const DEFAULT_SCHOOL: SchoolProfile = {
  id: '2709a683-266f-4629-a294-f83bfcc59547',
  name: 'Apex International College',
  shortName: 'Apex College',
  address: '15 Victoria Island Crescent, Lagos, Nigeria',
  brandColor: '#4338CA',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
  currentTerm: '2025/2026 - First Term',
  stats: {
    staffCount: 3,
    studentCount: 4,
    classCount: 4,
  },
};

interface SchoolContextValue {
  school: SchoolProfile;
  isLoading: boolean;
  error: string | null;
  refreshSchool: () => Promise<void>;
  updateSchool: (data: Partial<SchoolProfile>) => Promise<void>;
  onboardSchool: (data: {
    schoolName: string;
    schoolAbbr: string;
    schoolAddress: string;
    studentRange?: string;
    accentColor?: string;
    classes?: string[];
    subjects?: string[];
    scoreComponents?: Array<{ id: string; name: string; weight: number }>;
    plan?: string;
  }) => Promise<SchoolProfile>;
}

const SchoolContext = createContext<SchoolContextValue | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [school, setSchool] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem('scholeos_active_school');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SCHOOL;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSchool = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSchoolProfile(school.id);
      if (res?.school) {
        setSchool(res.school);
        setActiveSchoolId(res.school.id);
        localStorage.setItem('scholeos_active_school', JSON.stringify(res.school));
      }
    } catch (err: any) {
      console.warn('[SchoolContext] Failed to fetch live profile, using active state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSchool();
  }, []);

  const updateSchool = async (data: Partial<SchoolProfile>) => {
    const updated = { ...school, ...data };
    setSchool(updated);
    localStorage.setItem('scholeos_active_school', JSON.stringify(updated));
    try {
      await updateSchoolProfile(data);
    } catch (err) {
      console.warn('[SchoolContext] Backend update fallback:', err);
    }
  };

  const onboardSchool = async (data: {
    schoolName: string;
    schoolAbbr: string;
    schoolAddress: string;
    studentRange?: string;
    accentColor?: string;
    classes?: string[];
    subjects?: string[];
    scoreComponents?: Array<{ id: string; name: string; weight: number }>;
    plan?: string;
  }): Promise<SchoolProfile> => {
    setIsLoading(true);
    try {
      const res = await submitSchoolOnboarding(data);
      const newSchool: SchoolProfile = {
        id: res.school.id || `sch-${Date.now()}`,
        name: data.schoolName,
        shortName: data.schoolAbbr || data.schoolName.slice(0, 8),
        address: data.schoolAddress,
        brandColor: data.accentColor || '#4338CA',
        currentTerm: '2026/2027 - First Term',
        stats: {
          staffCount: 1,
          studentCount: 0,
          classCount: data.classes?.length || 6,
        },
      };

      setSchool(newSchool);
      setActiveSchoolId(newSchool.id);
      localStorage.setItem('scholeos_active_school', JSON.stringify(newSchool));
      return newSchool;
    } catch (err) {
      console.warn('[SchoolContext] Onboarding offline fallback:', err);
      const fallbackSchool: SchoolProfile = {
        id: `sch-${Date.now()}`,
        name: data.schoolName,
        shortName: data.schoolAbbr || 'SCH',
        address: data.schoolAddress,
        brandColor: data.accentColor || '#4338CA',
        currentTerm: '2026/2027 - First Term',
        stats: {
          staffCount: 1,
          studentCount: 0,
          classCount: data.classes?.length || 6,
        },
      };
      setSchool(fallbackSchool);
      setActiveSchoolId(fallbackSchool.id);
      localStorage.setItem('scholeos_active_school', JSON.stringify(fallbackSchool));
      return fallbackSchool;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        school,
        isLoading,
        error,
        refreshSchool,
        updateSchool,
        onboardSchool,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}
