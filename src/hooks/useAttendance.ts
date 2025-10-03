import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { AttendanceResponseDto, RecordAttendanceDto } from '../types';

export const useAttendance = () => {
  const [attendances, setAttendances] = useState<AttendanceResponseDto[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [attendancesData, statsData] = await Promise.all([
        apiService.getAttendances(),
        apiService.getAttendanceStatistics(),
      ]);
      setAttendances(attendancesData);
      setStatistics(statsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar presenças');
      console.error('Erro ao buscar presenças:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const recordAttendance = async (data: RecordAttendanceDto) => {
    try {
      const newAttendance = await apiService.recordAttendance(data);
      setAttendances(prev => [...prev, newAttendance]);
      return newAttendance;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao registrar presença';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const bulkRecordAttendance = async (data: any) => {
    try {
      const result = await apiService.bulkRecordAttendance(data);
      await fetchAttendances(); // Refresh data
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao registrar presenças';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getEventAttendance = async (eventId: string) => {
    try {
      return await apiService.getEventAttendance(eventId);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar presenças do evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getMemberAttendance = async (memberId: string) => {
    try {
      return await apiService.getMemberAttendance(memberId);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar presenças do membro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  return {
    attendances,
    statistics,
    isLoading,
    error,
    refetch: fetchAttendances,
    recordAttendance,
    bulkRecordAttendance,
    getEventAttendance,
    getMemberAttendance,
  };
};
