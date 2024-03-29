import { Icon } from "@chakra-ui/react";
import { useSwiperContext } from "../../contexts/SwiperContext";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { css } from "@emotion/react";

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
          <button onClick={slidePrev} css={buttonCss}>
            <Icon as={FaChevronLeft} w={8} h={8} color="black" />
          </button>
        ) : (
          <div />
        )}
        {!isAtLastSlide ? (
          <button onClick={slideNext} css={buttonCss}>
            <Icon as={FaChevronRight} w={8} h={8} color="black" />
          </button>
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
  top: 50%;
  width: 100%;
  z-index: 10;
  transform: translateY(-50%);
`;

const wrapperCss = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
`;

const buttonCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  box-shadow: 0px 0px 5px 1px rgba(201, 201, 201, 0.841);
  background-color: white;
  cursor: pointer;
  outline: none;
`;
