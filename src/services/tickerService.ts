const TICKERS_API = '/api/tickers';

export const tickerService = {
  getAll: async (): Promise<Ticker[]> => {
    const response = await fetch(`${TICKERS_API}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tickres - ${response.statusText}`);
    }

    return response.json();
  },

  create: async (ticker: Ticker): Promise<Ticker> => {
    const response = await fetch(`${TICKERS_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticker),
    });

    if (!response.ok) {
      throw new Error(`Failed to add ticker - ${response.statusText}`);
    }

    return response.json();
  },
}