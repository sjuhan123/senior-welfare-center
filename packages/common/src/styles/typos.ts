import { css } from '@emotion/react';

const HEAD = css`
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 138%;
  letter-spacing: -0.3px;
`;

const BODY = css`
  font-weight: 400;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: -0.3px;
`;

const DETAIL = css`
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 170%;
`;

const typos = {
  HEAD,
  BODY,
  DETAIL,
} as const;

export default typos;
