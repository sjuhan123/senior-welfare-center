import { css } from '@emotion/react';
import { useSwiperContext } from '../../contexts/SwiperContext';

interface Props {
  total: number;

  /**
   * 화면에 보여질 dots 고정 개수
   *
   * @default 5
   */
  fixedDots?: number;

  /**
   * 화면에 보여질 dots 중심 index
   *
   * @default 2
   */
  midIndex?: number;
}

const Pagination = ({ total, fixedDots = 5, midIndex = 2 }: Props) => {
  const { activeIndex } = useSwiperContext();
  const targetIndex =
    activeIndex >= midIndex && activeIndex < total - midIndex
      ? midIndex
      : activeIndex % fixedDots;

  const renderDots = () => {
    const totalDots = total < fixedDots ? total : fixedDots;

    return Array.from({ length: totalDots }, (_, index) => (
      <div key={index} css={dotCss(index === targetIndex)} />
    ));
  };

  return (
    <div css={containerCss}>
      <div css={wrapperCss}>{renderDots()}</div>
    </div>
  );
};

export default Pagination;

const containerCss = css`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  transform: translateY(-50%);
  bottom: 10px;
`;

const wrapperCss = css`
  display: flex;
  transition: transform 0.5s ease-in-out;
`;

const dotCss = (isActive: boolean) => css`
  width: 4px;
  height: 4px;
  margin: 0 3px;
  border-radius: 50%;
  background-color: ${isActive ? 'white' : 'rgba(255, 255, 255, 0.5)'};
`;
