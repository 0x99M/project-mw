'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import TradingViewChart from './TradingViewChart';
import { useTickers } from '@/hooks/useTickers';
import { useBybitCandles } from '@/hooks/useBybit';
import { createBybitGetCandlesRequest } from '@/types/BybitGetCandlesRequest';

export default function ChartSwiper() {
  const [index, setIndex] = useState(0);
  const { data: tickers } = useTickers();

  const handlers = useSwipeable({
    onSwipedUp: () => setIndex((i) => (i + 1) % (tickers?.length || 1)),
    onSwipedDown: () => setIndex((i) => (i - 1 + (tickers?.length || 1)) % (tickers?.length || 1)),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const symbol = tickers?.[index]?.symbol || 'BTC';
  const { data: candles, isLoading, error } = useBybitCandles(
    createBybitGetCandlesRequest({ symbol, limit: 500 })
  );

  if (!tickers || index >= tickers.length)
    return <div>Data not found</div>;
  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading chart</div>;

  return (
    <div {...handlers} style={{ touchAction: 'none' }}>
      <TradingViewChart symbol={symbol} candles={candles || []} />
    </div>
  );
}