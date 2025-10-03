import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { AttendanceResponseDto, RecordAttendanceDto } from '../types';

export const useAttendance = () => {
  const [attendances, setAttendances] = useState<AttendanceResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  const fetchAttendances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getAttendances();
      setAttendances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar presenças');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await apiService.getAttendanceStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  useEffect(() => {
    fetchAttendances();
    fetchStatistics();
  }, []);

  const recordAttendance = async (data: RecordAttendanceDto) => {
    try {
      const newAttendance = await apiService.recordAttendance(data);
      setAttendances([...attendances, newAttendance]);
      return newAttendance;
    } catch (err) {
      throw err;
    }
  };

  const recordBulkAttendance = async (data: any) => {
    try {
      const result = await apiService.bulkRecordAttendance(data);
      await fetchAttendances();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const getEventAttendance = async (eventId: string) => {
    try {
      return await apiService.getEventAttendance(eventId);
    } catch (err) {
      throw err;
    }
  };

  const getMemberAttendance = async (memberId: string) => {
    try {
      return await apiService.getMemberAttendance(memberId);
    } catch (err) {
      throw err;
    }
  };

  return {
    attendances,
    statistics,
    isLoading,
    error,
    refetch: fetchAttendances,
    recordAttendance,
    recordBulkAttendance,
    getEventAttendance,
    getMemberAttendance,
  };
};
