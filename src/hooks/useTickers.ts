import { tickerService } from '@/services/tickerService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTickers() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tickers'],
    queryFn: () => tickerService.getAll(),
  });

  const addMutation = useMutation({
    mutationFn: (ticker: Ticker) => tickerService.create(ticker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickers'] });
    }
  });

  return {
    data,
    isLoading,
    error,
    addTicker: addMutation.mutate,
    isLoadingAdd: addMutation.isPending,
    errorAdd: addMutation.error,
  };
}