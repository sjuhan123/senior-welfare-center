import { EmailIcon } from '@chakra-ui/icons';
import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';

const Footer = ({ children }: PropsWithChildren) => {
  return (
    <footer css={containerCss}>
      <EmailIcon boxSize={4} />
      {children}
    </footer>
  );
};

export default Footer;

const containerCss = (theme: Theme) => css`
  display: flex;
  position: static;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 80px;

  @media (max-width: ${theme.size.maxWidth}) {
    position: fixed;
    bottom: 0;
    left: 0;
  }
`;
