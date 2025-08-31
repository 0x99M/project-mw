'use client';

import { useScreener } from '@/hooks/useScreener';

export default function Screener() {
  const { data, isLoading, error, isError } = useScreener();

  const formatPercentage = (value: string) => {
    const numValue = parseFloat(value);
    const colorClass = numValue >= 0 ? 'text-green-400' : 'text-red-400';
    const formattedValue = numValue >= 0 ? `+${value}%` : `${value}%`;
    return { value: formattedValue, colorClass };
  };

  if (isLoading) {
    return (
      <div className='h-screen flex items-center justify-center' >Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="overflow-hidden text-center">
        <div className="h-screen overflow-auto relative flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold text-red-400 mb-2">Failed to load data</h2>
            <p className="text-gray-300 mb-4">{error?.message || 'Something went wrong'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4">
      <div className="overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-[120px] gap-4">
          {data?.tickersData.map(ticker => (
            <div key={ticker.symbol} className="flex flex-col justify-center items-center gap-6 text-center">
              <h3 className="px-4 py-3 font-bold text-white">
                {ticker.symbol}
              </h3>
              {ticker.candlesChangePercentages.map((candleChange, i) => {
                const { value, colorClass } = formatPercentage(candleChange);
                return (
                  <div key={i + '.' + ticker.symbol + '.' + value} className={`px-4 py-3 font-medium ${colorClass}`} >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}