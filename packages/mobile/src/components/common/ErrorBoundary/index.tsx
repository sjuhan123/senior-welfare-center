import React, { ReactNode } from 'react';
import { ApiException } from '../../../exceptions/ApiException';
import ErrorFallback from '../ErrorFallback';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: new Error(),
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // TODO: error logging 라이브러리 사용 고려
    console.error(error);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    if (!hasError) return this.props.children;

    if (error instanceof ApiException) {
      return <ErrorFallback errorMessage={error.message} />;
    }
  }
}
