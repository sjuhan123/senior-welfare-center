import { css, useTheme } from '@emotion/react';
import type { WelfareData } from '../../types/welfare';
import { Swiper } from '../swiper/swiper';
import type { Theme } from '@emotion/react';
import { Button, typos } from '@common/shared';
import { MdBookmarkAdded } from 'react-icons/md';
import { useState } from 'react';

interface Prop {
  welfareInfo: WelfareData;
  onCardClick?: () => void;
  onBookmarkClick?: () => void;
}

const MOCK_IMAGES = [
  '/송정동-정보검색대.jpeg',
  '/송정동-2층복도쉼터.jpeg',
  '/송정동-강당.jpeg',
  '/송정동-건강관리실스마트.jpeg',
  '/송정동-배움터.jpeg',
  '/송정동-휴게실.jpeg',
  '/송정동-안내데스크.png',
  '/송정동-건강관리실.jpeg',
];

const WelfareCard = ({ welfareInfo, onCardClick, onBookmarkClick }: Prop) => {
  const theme = useTheme();

  const [isBookmarked, setisBookmarked] = useState(false);
  const { name, address, distance, phone, remarks, images } = welfareInfo;

  const WELFARE_IMAGES =
    images ?? MOCK_IMAGES.map(image => `${import.meta.env.BASE_URL}${image}`);

  const handleBookmarkClick = () => {
    setisBookmarked(prev => !prev);
    onBookmarkClick ? onBookmarkClick() : null;
  };

  return (
    <div css={containerCss} onClick={onCardClick}>
      <Swiper>
        {WELFARE_IMAGES.map(info => (
          <img key={info} src={info} alt="welfareImage" />
        ))}
      </Swiper>
      <div css={bodyCss}>
        <div css={infoCss}>
          <h2>{name}</h2>
          <p>주소 {address}</p>
          {distance && <p>거리 {distance.toFixed(2)}km</p>}
          <p>번호 {phone}</p>
          {!distance && <p>비고 {remarks ? remarks : '-'}</p>}
        </div>
        <div css={buttonCss(theme, isBookmarked)} onClick={handleBookmarkClick}>
          <Button css={typos.DETAIL_1_SEMIBOLD}>저장</Button>
          {<MdBookmarkAdded size={20} />}
        </div>
      </div>
    </div>
  );
};

export default WelfareCard;

const containerCss = css`
  cursor: pointer;

  display: flex;
  flex-direction: column;
`;

const bodyCss = css`
  display: flex;
  position: relative;
  flex-direction: row;
  padding: 12px 0 0 0;
  width: 100%;
`;

const infoCss = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  width: 100%;

  h2 {
    ${typos.DETAIL_1_BOLD};
    color: ${theme.colors.black};
  }

  p {
    ${typos.DETAIL_1_REGULAR};
    color: ${theme.colors.black};
  }
`;

const buttonCss = (theme: Theme, isBookmarked: boolean) => css`
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 3px;
  position: absolute;
  right: 0;

  ${typos.DETAIL_1_BOLD}
  color: ${isBookmarked ? theme.colors.blue_200 : theme.colors.black};

  &:hover {
    color: ${theme.colors.blue_200};
  }
`;
