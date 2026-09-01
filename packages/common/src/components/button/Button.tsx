import { type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

const Button = ({ children, ...props }: Props) => {
  return <button {...props}>{children}</button>;
};

export default Button;
