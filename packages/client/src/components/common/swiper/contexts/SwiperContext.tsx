//TODO: eslint-disable 처리 확인 후 삭제 필요
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createContext, useContext, useState } from 'react';

interface SwiperContextProps {
  activeIndex: number;
  slideNext: () => void;
  slidePrev: () => void;
}

const SwiperContext = createContext<SwiperContextProps | undefined>(undefined);

interface Props {
  defaultIndex?: number;
  children: React.ReactNode;
}

export const SwiperProvider = ({ defaultIndex = 0, children }: Props) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const slideNext = () => {
    setActiveIndex(prevIndex => prevIndex + 1);
  };

  const slidePrev = () => {
    setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  return (
    <SwiperContext.Provider
      value={{
        activeIndex,
        slideNext,
        slidePrev,
      }}
    >
      {children}
    </SwiperContext.Provider>
  );
};

export const useSwiperContext = () => {
  const swiper = useContext(SwiperContext);

  if (!swiper) {
    throw new Error('useSwiperContext must be used within SwiperProvider');
  }

  return swiper;
};
