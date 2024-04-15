import { typos } from '@common/shared';
import { css } from '@emotion/react';

const Header = () => {
  return (
    <header css={containerCss}>
      <div css={[headerCss, typos.HEAD]}>
        <h2>노인복지관</h2>
        <div css={logoCss}>
          <img
            src="https://user-images.githubusercontent.com/81420856/285219033-fb2e1d24-1432-43a6-bcc3-86978058a745.png"
            alt="logo"
            width="30px"
            height="30px"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

const containerCss = css`
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
`;

const headerCss = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const logoCss = css`
  display: flex;
  align-items: end;
`;
