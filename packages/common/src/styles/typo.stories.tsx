import { type Meta } from '@storybook/react';

import typos from './typos';

export const Default = () => {
  return (
    <>
      <p>HEAD</p>
      <p css={typos.HEAD}>
        IT 기기 사용에 어려움을 겪는 사람들을 위한 노인복지관 사이트
      </p>

      <p>BODY 1 REGULAR</p>
      <p css={typos.BODY_1_REGULAR}>
        IT 기기 사용에 어려움을 겪는 사람들을 위한 노인복지관 사이트
      </p>

      <p>BODY_1_SEMIBOLD</p>
      <p css={typos.BODY_1_SEMIBOLD}>
        IT 기기 사용에 어려움을 겪는 사람들을 위한 노인복지관 사이트
      </p>

      <p>BODY 1 BOLD</p>
      <p css={typos.BODY_1_BOLD}>
        IT 기기 사용에 어려움을 겪는 사람들을 위한 노인복지관 사이트
      </p>

      <p>DETAIL</p>
      <p css={typos.DETAIL}>
        IT 기기 사용에 어려움을 겪는 사람들을 위한 노인복지관 사이트
      </p>
    </>
  );
};

const meta: Meta<typeof Default> = {
  title: 'Typo',
  component: Default,
};

export default meta;
