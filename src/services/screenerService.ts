import { bybitService } from "./bybitService";
import { tickerService } from "./tickerService";

export const screenerService = {
  generateScreenerData: async (): Promise<ScreenerData> => {
    try {
      const tickers = await tickerService.getAll();
      const promises = tickers.map(ticker => bybitService.getCandles(ticker.symbol));
      const responses = await Promise.all(promises);
      return { tickersData: responses };
    } catch (error) {
      console.error('Error fetching screener data: ', error);
      throw error;
    }
  },
}