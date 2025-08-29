'use client';

import { useScreener } from '@/hooks/useScreener';

export default function Screener() {
  const { data, isLoading, error, isError, refetch, isFetching } = useScreener();
  
  const columns = ['4h', '8h', '12h', '16h', '20h', '24h'];
  
  // Helper function to format percentage and get color class
  const formatPercentage = (value: string) => {
    const numValue = parseFloat(value);
    const colorClass = numValue >= 0 ? 'text-green-400' : 'text-red-400';
    const formattedValue = numValue >= 0 ? `+${value}%` : `${value}%`;
    return { value: formattedValue, colorClass };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="overflow-hidden text-center">
        <div className="h-screen overflow-auto relative">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-white sticky top-0 z-20">
                <th className="bg-background sticky left-0 z-30 font-semibold">
                  Ticker
                </th>
                {columns.map((column, index) => (
                  <th key={index} className="bg-background px-4 py-3 font-semibold min-w-32">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Loading skeleton */}
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="sticky left-0 z-10 bg-background px-4 py-3 font-medium text-white">
                    <div className="animate-pulse bg-gray-600 h-4 w-12 rounded"></div>
                  </td>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="animate-pulse bg-gray-600 h-4 w-16 rounded mx-auto"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="overflow-hidden text-center">
        <div className="h-screen overflow-auto relative flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold text-red-400 mb-2">Failed to load data</h2>
            <p className="text-gray-300 mb-4">{error?.message || 'Something went wrong'}</p>
            <button 
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render with data
  return (
    <div className="overflow-hidden text-center">
      <div className="h-screen overflow-auto relative">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-white sticky top-0 z-20">
              <th className="bg-background sticky left-0 z-30 font-semibold border-b border-gray-800">
                Ticker
              </th>
              {columns.map((column, index) => (
                <th key={index} className="bg-background px-4 py-3 font-semibold min-w-32 border-b border-gray-800">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr key={row.ticker} className="border-b border-gray-800 hover:bg-gray-900/30">
                <td className="sticky left-0 z-10 bg-background px-4 py-3 font-medium text-white border-r border-gray-800">
                  {row.ticker}
                </td>
                {columns.map((column) => {
                  const { value, colorClass } = formatPercentage(row[column as keyof typeof row]);
                  return (
                    <td key={column} className={`px-4 py-3 font-medium ${colorClass}`}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}