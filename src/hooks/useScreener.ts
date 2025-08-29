'use client';

import { useQuery } from '@tanstack/react-query';

const SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOGE', 'DOT'];

interface TickerData {
  ticker: string;
  '4h': string;
  '8h': string;
  '12h': string;
  '16h': string;
  '20h': string;
  '24h': string;
};

interface BybitKlineResponse {
  retCode: number;
  retMsg: string;
  result: {
    symbol: string;
    category: string;
    list: string[][];
  };
  retExtInfo: object;
  time: number;
};

function calculatePriceChange(currentPrice: number, previousPrice: number): string {
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  return change.toFixed(2);
};

async function fetchSymbolKlines(symbol: string): Promise<BybitKlineResponse> {
  const url = `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}USDT&interval=240&limit=6`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${symbol}: ${response.statusText}`);
  }

  return response.json();
};

function processKlineData(symbol: string, klineData: string[][]): TickerData {
  const currentPrice = parseFloat(klineData[0][4]);

  const changes = {
    '4h': '0.00', // Current 4h candle (always 0 as it's ongoing)
    '8h': '0.00',
    '12h': '0.00',
    '16h': '0.00',
    '20h': '0.00',
    '24h': '0.00'
  };

  // 4h change (current vs previous 4h candle)
  if (klineData.length > 1) {
    const prev4hPrice = parseFloat(klineData[1][4]);
    changes['4h'] = calculatePriceChange(currentPrice, prev4hPrice);
  }

  // 8h change (current vs 2 candles ago)
  if (klineData.length > 2) {
    const prev8hPrice = parseFloat(klineData[2][4]);
    changes['8h'] = calculatePriceChange(currentPrice, prev8hPrice);
  }

  // 12h change (current vs 3 candles ago)
  if (klineData.length > 3) {
    const prev12hPrice = parseFloat(klineData[3][4]);
    changes['12h'] = calculatePriceChange(currentPrice, prev12hPrice);
  }

  // 16h change (current vs 4 candles ago)
  if (klineData.length > 4) {
    const prev16hPrice = parseFloat(klineData[4][4]);
    changes['16h'] = calculatePriceChange(currentPrice, prev16hPrice);
  }

  // 20h change (current vs 5 candles ago)
  if (klineData.length > 5) {
    const prev20hPrice = parseFloat(klineData[5][4]);
    changes['20h'] = calculatePriceChange(currentPrice, prev20hPrice);
  }

  // 24h change (extrapolated from available data)
  // Since we only have 24h of 4h candles, we use the oldest available price
  if (klineData.length > 5) {
    const prev24hPrice = parseFloat(klineData[5][4]);
    changes['24h'] = calculatePriceChange(currentPrice, prev24hPrice);
  }

  return {
    ticker: symbol,
    ...changes
  };
};

async function fetchScreenerData(): Promise<TickerData[]> {
  try {
    const promises = SYMBOLS.map(symbol => fetchSymbolKlines(symbol));
    const responses = await Promise.all(promises);

    const tickerData: TickerData[] = responses.map((response, index) => {
      const symbol = SYMBOLS[index];

      if (response.retCode !== 0) {
        return {
          ticker: symbol,
          '4h': '0.00',
          '8h': '0.00',
          '12h': '0.00',
          '16h': '0.00',
          '20h': '0.00',
          '24h': '0.00'
        };
      }

      return processKlineData(symbol, response.result.list);
    });

    return tickerData;
  } catch (error) {
    console.error('Error fetching screener data: ', error);
    throw error;
  }
}

export function useScreener() {
  return useQuery({
    queryKey: ['screener'],
    queryFn: fetchScreenerData,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    gcTime: 1000 * 60 * 35, // Keep in cache for 35 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 3, // Retry failed requests 3 times
  });
};