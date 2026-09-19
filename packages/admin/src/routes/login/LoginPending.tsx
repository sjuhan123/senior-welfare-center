import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const LoginPending = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!showSpinner) return null;

  return (
    <Page>
      <Spinner />
    </Page>
  );
};

export default LoginPending;

const Page = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.semantic.bgSunken,
}));

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const Spinner = styled.div(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: `3px solid ${theme.semantic.divider}`,
  borderTopColor: theme.semantic.ctaBg,
  animation: `${spin} 0.7s linear infinite`,
}));
