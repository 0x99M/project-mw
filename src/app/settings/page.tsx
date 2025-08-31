'use client';

import { useState } from 'react';
import { useTickers } from '@/hooks/useTickers';
import { Button } from '@/components/ui/button';
import { useBybit } from '@/hooks/useBybit';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { signout } from '@/utils/auth';

export default function SettingsPage() {
  const [open, setOpen] = useState(false);
  const [tickerInput, setTickerInput] = useState('');
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const { data: bybitTickers, isLoading: isLoadingBybit } = useBybit();
  const { data: savedTickers, isLoading: isLoadingTickers, addTicker, isLoadingAdd } = useTickers();

  const handleAddTicker = () => {
    if (selectedTicker) {
      const isAlreadySaved = savedTickers?.some(ticker => ticker.symbol === selectedTicker);

      if (!isAlreadySaved) {
        addTicker({ symbol: selectedTicker });
        setSelectedTicker('');
        setTickerInput('');
      } else {
        // Optional: Show toast notification that ticker already exists
        console.warn('Ticker already exists');
      }
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      <div className="h-12" />
      <div className="flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-2xl">Tickers</h1>
        {isLoadingTickers || isLoadingBybit ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4" >
            <div className="flex flex-row justify-center items-center gap-2" >
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {selectedTicker
                      ? bybitTickers?.find((ticker) => ticker.symbol === selectedTicker)?.symbol
                      : "Select ticker..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      value={tickerInput}
                      onValueChange={setTickerInput}
                      placeholder="Search ticker..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>
                        {tickerInput.length < 1 ? 'Write something' : 'No ticker found!'}
                      </CommandEmpty>
                      {tickerInput.length > 0 && <CommandGroup>
                        {bybitTickers?.map((ticker: Ticker) => (
                          <CommandItem
                            key={'select - ' + ticker.symbol}
                            value={ticker.symbol}
                            onSelect={(currentValue) => {
                              setSelectedTicker(currentValue === selectedTicker ? '' : currentValue)
                              setOpen(false)
                            }}
                          >
                            {ticker.symbol}
                          </CommandItem>
                        ))}
                      </CommandGroup>}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button onClick={handleAddTicker} disabled={isLoadingAdd} >+</Button>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 flex-wrap text-sm">
              {savedTickers?.map((ticker: Ticker) => (
                <span
                  key={ticker.symbol}
                  className="py-2 px-3 rounded-lg border border-blue-400"
                >
                  {ticker.symbol}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button onClick={() => signout()} className="w-32" variant={'outline'}>
        Signout
      </Button>
    </div>
  );
}