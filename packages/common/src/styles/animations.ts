import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% {
    background-color: hsl(0, 0%, 90%);
  }
  50% {
    background-color: hsl(0, 0%, 95%);
  }
  100% {
    background-color: hsl(0, 0%, 90%);
  }
`;

const animations = {
  pulse,
};

export default animations;
