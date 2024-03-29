import { css } from "@emotion/react";
import React from "react";

interface SlideProps {
  children: React.ReactNode;
}

const Slide = ({ children }: SlideProps) => {
  return <div css={containerCss}>{children}</div>;
};

export default Slide;

const containerCss = css`
  width: 300px;
  height: 100%;
  flex: 0 0 100%;
  border-radius: 10px;
`;
