import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetcher = async (url: string): Promise<Ticker[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};

export function useTickers() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tickers'],
    queryFn: () => fetcher('/api/tickers')
  });

  const addMutation = useMutation({
    mutationFn: (ticker: Ticker) =>
      fetch('/api/tickers', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticker),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickers'] });
    }
  });

  return {
    tickers: data || [],
    isLoading,
    error,
    addTicker: addMutation.mutate,
  };
}