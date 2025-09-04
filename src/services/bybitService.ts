import { BybitGetCandlesRequest } from "@/types/BybitGetCandlesRequest";

const BYBIT_BASE_API = 'https://api.bybit.com/v5/market';

const BYBIT_KLINE_API = `${BYBIT_BASE_API}/kline`;
const BYBIT_TICKERS_API = `${BYBIT_BASE_API}/tickers`;

function calculatePriceChange(currentPrice: number, previousPrice: number): string {
  if (isNaN(currentPrice) || isNaN(previousPrice) || previousPrice === 0) return '0.00';

  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  return change.toFixed(2);
}

function processKlineData(symbol: string, klineData: string[][]): ScreenerTickerData {
  return {
    symbol,
    candlesChangePercentages: klineData.map(candle => {
      if (!candle || candle.length < 5) return '0.00';
      const close = parseFloat(candle[4]);
      const open = parseFloat(candle[1]);
      return calculatePriceChange(close, open);
    })
  };
}

export const bybitService = {
  getCandlesV2: async (request: BybitGetCandlesRequest): Promise<Candle[]> => {
    const symbol = request.symbol;
    const query = `category=spot&symbol=${symbol}USDT&interval=${request.interval}&limit=${request.limit}`;
    const response = await fetch(`${BYBIT_KLINE_API}?${query}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol} candles from Bybit - ${response.statusText}`);
    }

    const data: BybitKlineResponse = await response.json();

    if (data.retCode !== 0) {
      return [];
    }

    return data.result.list.map(([time, open, high, low, close]: string[]) => ({
      time: parseInt(time) / 1000,
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
    })).reverse();
  },

  getCandles: async (request: BybitGetCandlesRequest): Promise<ScreenerTickerData> => {
    const symbol = request.symbol;
    const query = `category=spot&symbol=${symbol}USDT&interval=${request.interval}&limit=${request.limit}`;
    const response = await fetch(`${BYBIT_KLINE_API}?${query}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol} candles from Bybit - ${response.statusText}`);
    }

    const data: BybitKlineResponse = await response.json();

    if (data.retCode !== 0) {
      return {
        symbol,
        candlesChangePercentages: [],
      };
    }

    return processKlineData(symbol, data.result.list);
  },

  getTickers: async (): Promise<Ticker[]> => {
    const query = `category=spot`;
    const response = await fetch(`${BYBIT_TICKERS_API}?${query}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tickers from Bybit - ${response.statusText}`);
    }

    const data: BybitTickersResponse = await response.json();

    if (data.retCode !== 0) {
      throw new Error(`Failed to fetch tickers from Bybit - ${response.statusText}`);
    }

    return data.result.list
      .filter(ticker => ticker.symbol.endsWith('USDT'))
      .map(ticker => ({
        symbol: ticker.symbol.replace(/USDT$/, ''),
      }));
  },
}