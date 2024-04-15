import { css } from '@emotion/react';

const HEAD = css`
  font-weight: 700;
  font-size: 23px;
  line-height: 138%;
  letter-spacing: -0.3px;
`;

const BODY_1_REGULAR = css`
  font-weight: 400;
  font-size: 21px;
  line-height: 150%;
  letter-spacing: -0.3px;
`;

const BODY_1_SEMIBOLD = css`
  font-weight: 500;
  font-size: 21px;
  line-height: 150%;
  letter-spacing: -0.3px;
`;

const BODY_1_BOLD = css`
  font-weight: 600;
  font-size: 21px;
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
  BODY_1_REGULAR,
  BODY_1_SEMIBOLD,
  BODY_1_BOLD,
  DETAIL,
} as const;

export default typos;
