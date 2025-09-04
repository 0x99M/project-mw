'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/mousewheel';
import TradingViewChart from './TradingViewChart';
import { useTickers } from '@/hooks/useTickers';

export default function ChartSwiper() {
  const { data: tickers } = useTickers();

  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      mousewheel
      modules={[Mousewheel]}
      style={{ height: "100vh", background: "#000" }}
    >
      {tickers?.map((ticker) => (
        <SwiperSlide key={ticker.symbol} className="flex items-center justify-center">
          <TradingViewChart symbol={ticker.symbol} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}