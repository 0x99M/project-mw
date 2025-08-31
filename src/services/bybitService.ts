const BYBIT_KLINE_API = 'https://api.bybit.com/v5/market/kline';

export const bybitService = {
  getCandles: async (symbol: string): Promise<BybitKlineResponse> => {
    const query = `category=spot&symbol=${symbol}USDT&interval=240&limit=10`;
    const response = await fetch(`${BYBIT_KLINE_API}?${query}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol} candles from Bybit - ${response.statusText}`);
    }

    return response.json();
  },
}