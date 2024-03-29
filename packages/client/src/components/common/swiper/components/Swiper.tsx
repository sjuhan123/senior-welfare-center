import React from "react";
import { SwiperProvider } from "../contexts/SwiperContext";
import SwiperBase from "./Swiper/SwiperBase";

interface Props {
  children: React.ReactNode;
}

export const Swiper = ({ children }: Props) => {
  return (
    <SwiperProvider>
      <SwiperBase>{children}</SwiperBase>
    </SwiperProvider>
  );
};
