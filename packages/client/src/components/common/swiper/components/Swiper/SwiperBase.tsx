import React, { cloneElement, useRef } from "react";
import { useSwiperContext } from "../../contexts/SwiperContext";
import Pagination from "./Pagination";
import Navigation from "./Navigation";
import { css } from "@emotion/react";

interface Props {
  children: React.ReactNode;
}

const SwiperBase = ({ children }: Props) => {
  const totalSlide = React.Children.count(children);
  const { activeIndex } = useSwiperContext();

  const containerRef = useRef<HTMLDivElement>(null);

  const renderChildren = () => {
    return React.Children.map(children, (child) =>
      cloneElement(child as React.ReactElement)
    );
  };

  return (
    <div ref={containerRef} css={containerCss}>
      <div css={wrapperCss(activeIndex)}>{renderChildren()}</div>
      <Navigation total={totalSlide} />
      <Pagination total={totalSlide} />
    </div>
  );
};

export default SwiperBase;

const containerCss = css`
  overflow: hidden;
  position: relative;
  height: 190px;
  width: 180px;
  border-radius: 10px;

  button {
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    button {
      opacity: 1;
    }
  }
`;

const wrapperCss = (activeIndex: number) => css`
  display: flex;
  height: 100%;
  width: 100%;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${activeIndex * 100}%);
`;
