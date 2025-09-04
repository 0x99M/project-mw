export interface BybitGetCandlesRequest {
  symbol: string;
  interval: string;
  from: number;
  limit: number;
}

export function createBybitGetCandlesRequest(
  overrides: Partial<BybitGetCandlesRequest>
): BybitGetCandlesRequest {
  return {
    symbol: "BTCUSDT",
    interval: "240",
    from: Math.floor(Date.now() / 1000) - 3600 * 24, // default: 24h ago
    limit: 10,
    ...overrides, // overrides defaults if provided
  };
}