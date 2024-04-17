import { useSwiperContext } from '../../contexts/SwiperContext';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { css } from '@emotion/react';
import { CircleButton } from '@common/shared';

interface Props {
  total: number;
}

const Navigation = ({ total }: Props) => {
  const { activeIndex, slideNext, slidePrev } = useSwiperContext();

  const isAtFirstSlide = activeIndex === 0;
  const isAtLastSlide = activeIndex === total - 1;

  return (
    <div css={containerCss}>
      <div css={wrapperCss}>
        {!isAtFirstSlide ? (
          <CircleButton css={buttonCss} onClick={slidePrev}>
            <FaAngleLeft />
          </CircleButton>
        ) : (
          <div />
        )}
        {!isAtLastSlide ? (
          <CircleButton css={buttonCss} onClick={slideNext}>
            <FaAngleRight />
          </CircleButton>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Navigation;

const containerCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 53%;
  width: 100%;
  z-index: 10;
  transform: translateY(-50%);
`;

const wrapperCss = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
`;

const buttonCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  box-shadow: 0px 0px 5px 1px rgba(201, 201, 201, 0.841);
  background-color: white;
  cursor: pointer;
  outline: none;
`;
