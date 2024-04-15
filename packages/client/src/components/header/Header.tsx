import { typos } from '@common/shared';
import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../constant/route';
import { IconButton } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

interface Props {
  backIcon?: React.ReactNode;
  onBackClick?: () => void;
  title: string;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const Header = ({
  backIcon,
  onBackClick,
  title,
  rightIcon,
  onRightIconClick,
}: Props) => {
  const navigate = useNavigate();

  const onBack = () => {
    onBackClick ? onBackClick() : navigate(ROUTE_PATH.WELFARE_LIST);
  };

  return (
    <header css={containerCss}>
      <div css={wrapperCss}>
        <button type="button" onClick={onBack}>
          {backIcon ? (
            backIcon
          ) : (
            <div css={guideCss}>가까운 복지관을 찾아보세요</div>
          )}
        </button>
        {title && (
          <span css={[titleCss, typos.HEAD]}>
            {title}
            <img
              src="https://user-images.githubusercontent.com/81420856/285219033-fb2e1d24-1432-43a6-bcc3-86978058a745.png"
              alt="logo"
              width="25px"
              height="25px"
            />
          </span>
        )}
        <button type="button" onClick={onRightIconClick}>
          {rightIcon ? (
            rightIcon
          ) : (
            <IconButton
              icon={<BellIcon />}
              aria-label="bell"
              background={'white'}
              size="lg"
            />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

const containerCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  left: 0;
  position: fixed;
  width: 100%;
`;

const wrapperCss = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  max-width: ${theme.maxWidths.mobile}px;
  height: 80px;
`;

const titleCss = css`
  display: flex;
  position: absolute;
  width: fit-content;
  margin: auto;
  right: 0;
  left: 0;
  flex-direction: row;
  align-items: flex-end;
  gap: 4px;
`;

const guideCss = (theme: Theme) => css`
  margin-top: 10px;
  font-size: 12px;
  font-weight: 600;

  @media (max-width: ${theme.maxWidths.mobile}px) {
    display: none;
  }
`;
