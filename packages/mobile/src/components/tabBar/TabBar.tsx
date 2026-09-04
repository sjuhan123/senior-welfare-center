import { Button, typos } from '@common/shared';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAGE_LIST } from './constant';
import { css, useTheme } from '@emotion/react';
import type { Theme } from '@emotion/react';

const TabBar = () => {
  const navigate = useNavigate();
  const param = useLocation().pathname;

  const theme = useTheme();

  const isCurrentPage = (page: string) => {
    return param === page;
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div css={[tabBarCss, typos.BODY_1_REGULAR]}>
      {PAGE_LIST.map(page => (
        <Button
          key={page.ko}
          onClick={() => navigateTo(page.path)}
          css={wrapperCss(theme, isCurrentPage(page.path))}
        >
          {page.ko}
        </Button>
      ))}
    </div>
  );
};

export default TabBar;

const tabBarCss = (theme: Theme) => css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  border-top: 1px solid ${theme.colors.gray_100};
  background-color: ${theme.colors.white};
  width: 100%;
  max-width: ${theme.maxWidths.mobile}px;
  height: 100%;
`;

const wrapperCss = (theme: Theme, isSelected: boolean) => css`
  width: 100%;
  height: 100%;
  color: ${isSelected ? theme.colors.blue_200 : theme.colors.black};
  ${isSelected ? typos.BODY_1_BOLD : typos.BODY_1_REGULAR};
`;
