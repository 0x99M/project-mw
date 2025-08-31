import { bybitService } from "./bybitService";
import { tickerService } from "./tickerService";

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

export const screenerService = {
  generateScreenerData: async (): Promise<ScreenerData> => {
    try {
      const tickers = await tickerService.getAll();
      const promises = tickers.map(ticker => bybitService.getCandles(ticker.symbol));
      const responses = await Promise.all(promises);

      const tickersData: ScreenerTickerData[] = responses.map((response, index) => {
        const symbol = tickers[index].symbol;

        if (response.retCode !== 0) {
          return {
            symbol,
            candlesChangePercentages: [],
          };
        }

        return processKlineData(symbol, response.result.list);
      });

      return { tickersData };
    } catch (error) {
      console.error('Error fetching screener data: ', error);
      throw error;
    }
  },
}