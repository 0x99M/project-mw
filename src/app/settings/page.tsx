'use client';

import { useState } from 'react';
import { useTickers } from '@/hooks/useTickers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function SettingsPage() {
  const { tickers, isLoading, addTicker } = useTickers();
  const [newSymbol, setNewSymbol] = useState('');

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="h-18" />
      <div className="flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-2xl">Tickers</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-row justify-center items-center gap-2 flex-wrap text-sm">
            {tickers?.map((ticker: Ticker) => (
              <span
                key={ticker.symbol}
                className="py-2 px-3 rounded-lg border border-blue-400"
              >
                {ticker.symbol}
              </span>
            ))}
            <Popover>
              <PopoverTrigger asChild><Button>+</Button></PopoverTrigger>
              <PopoverContent>
                <form
                  className="flex flex-col justify-center items-center gap-2"
                >
                  <Input
                    id="symbol"
                    name="symbol"
                    type="text"
                    placeholder="Symbol"
                    required
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                  />
                  <button
                    formAction={() => addTicker({ symbol: newSymbol.trim() })}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add
                  </button>
                </form>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}