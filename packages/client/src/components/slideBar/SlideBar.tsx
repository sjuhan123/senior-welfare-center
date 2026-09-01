import { useRef, useState } from 'react';
import { CircleButton } from '@common/shared';
import { css, useTheme } from '@emotion/react';
import type { PropsWithChildren } from 'react';
import type { Theme } from '@emotion/react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface Props {
  scrollDistance?: number;
}

const DEFAULT_POSITION = 0;

const SlideBar = ({
  children,
  scrollDistance = 300,
}: PropsWithChildren<Props>) => {
  const theme = useTheme();

  const [scrollPosition, setScrollPosition] = useState(DEFAULT_POSITION);
  const listRef = useRef<HTMLDivElement>(null);

  const listWidth = listRef.current?.scrollWidth || DEFAULT_POSITION;
  const containerWidth =
    listRef.current?.parentElement?.offsetWidth || DEFAULT_POSITION;
  const maxScroll = listWidth - containerWidth;

  const isAtStart = scrollPosition === DEFAULT_POSITION;
  const isAtEnd = scrollPosition >= (maxScroll || DEFAULT_POSITION);

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setScrollPosition(prev =>
        Math.max(DEFAULT_POSITION, prev - scrollDistance),
      );
    } else {
      setScrollPosition(prev =>
        maxScroll === 0
          ? prev + scrollDistance
          : Math.min(maxScroll, prev + scrollDistance),
      );
    }
  };

  return (
    <section css={containerCss} id="container">
      <div css={slideWrapperCss}>
        {!isAtStart && (
          <CircleButton
            css={leftButtonCss}
            onClick={() => handleScroll('left')}
          >
            <FaAngleLeft />
          </CircleButton>
        )}
        <div css={slideBarCss(theme, isAtStart, isAtEnd)}>
          <div
            css={listWrapperCss(theme, scrollPosition)}
            id="list"
            ref={listRef}
          >
            {children}
          </div>
        </div>
        {(isAtStart || !isAtEnd) && (
          <CircleButton
            css={rightButtonCss}
            onClick={() => handleScroll('right')}
          >
            <FaAngleRight />
          </CircleButton>
        )}
      </div>
    </section>
  );
};

export default SlideBar;

const containerCss = css`
  padding: 0 20px;
  height: 100%;
`;

const slideWrapperCss = css`
  display: flex;
  align-items: center;
  position: relative;
`;

const slideBarCss = (theme: Theme, isAtStart: boolean, isAtEnd: boolean) => css`
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(270deg, hsla(0, 0%, 100%, 0), #fff 50%);
    z-index: ${theme.zIndex.aboveDefault};
    display: ${isAtStart ? 'none' : 'block'};
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), #fff 50%);
    z-index: ${theme.zIndex.aboveDefault};
    display: ${isAtEnd ? 'none' : 'block'};
  }
`;

const listWrapperCss = (theme: Theme, scrollPosition: number) => css`
  display: flex;
  background-color: ${theme.colors.white};
  white-space: nowrap;
  transition: transform 0.3s ease;
  transform: translateX(-${scrollPosition}px);
`;

const leftButtonCss = (theme: Theme) => css`
  position: absolute;
  left: 0;
  z-index: ${theme.zIndex.above(theme.zIndex.aboveDefault)};
`;

const rightButtonCss = (theme: Theme) => css`
  position: absolute;
  right: 0;
  z-index: ${theme.zIndex.above(theme.zIndex.aboveDefault)};
`;
