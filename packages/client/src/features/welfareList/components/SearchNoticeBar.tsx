import { css, type Theme } from '@emotion/react';
import type { Location } from '../../../types/location';
import { typos } from '@common/shared';

interface Props {
  isSearching: boolean;
  searchLocation: Location;
}

const SearchNoticeBar = ({ isSearching, searchLocation }: Props) => {
  return (
    <div css={containerCss}>
      <div css={wrapperCss}>
        {isSearching ? (
          <span css={noticeCss}>
            <h2>{searchLocation.address}</h2>
            <p>인근 복지관을 검색 중입니다. 잠시만 기다려주세요.</p>
          </span>
        ) : (
          <span css={noticeCss}>
            <h2>{searchLocation.address}</h2>
            <p>인근 복지관 목록입니다.</p>
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchNoticeBar;

const containerCss = (theme: Theme) => css`
  position: relative;
  width: 100%;
  padding: 10px 20px 0 20px;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0px;
    width: 100%;
    height: 2px;
    border-bottom: 1px solid ${theme.colors.gray_200};
    box-shadow: 0 2px 4px ${theme.colors.gray_100};
  }
`;

const wrapperCss = css`
  padding: 10px 0;
`;

const noticeCss = (theme: Theme) => css`
  display: flex;
  gap: 5px;

  background-color: ${theme.colors.white};

  h2 {
    ${typos.DETAIL_1_BOLD};
  }

  p {
    ${typos.DETAIL_1_REGULAR};
  }
`;
