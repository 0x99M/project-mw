'use client';

import { bybitService } from '@/services/bybitService';
import { BybitGetCandlesRequest } from '@/types/BybitGetCandlesRequest';
import { useQuery } from '@tanstack/react-query';

export function useBybitCandles(request: BybitGetCandlesRequest) {
  return useQuery({
    queryKey: ['bybitCandles', request.symbol, request.interval, request.limit],
    queryFn: () => bybitService.getCandlesV2(request),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}

export function useBybit() {
  return useQuery({
    queryKey: ['bybitTickers'],
    queryFn: () => bybitService.getTickers(),
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    gcTime: 1000 * 60 * 35, // Keep in cache for 35 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 3, // Retry failed requests 3 times
  });
}