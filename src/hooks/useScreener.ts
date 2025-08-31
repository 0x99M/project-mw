'use client';

import { screenerService } from "@/services/screenerService";
import { useQuery } from "@tanstack/react-query";

export function useScreener() {
  return useQuery({
    queryKey: ['screener'],
    queryFn: screenerService.generateScreenerData,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    gcTime: 1000 * 60 * 35, // Keep in cache for 35 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 3, // Retry failed requests 3 times
  });
}