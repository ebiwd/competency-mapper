import React from 'react';

const defaultProps = {
  message: 'Sorry, there was a problem when fetching the data!',
  style: {} as Record<string, string | number>
};

type Props = Partial<typeof defaultProps>;

export const ErrorLoading: React.FC<Props> = ({ message, style }) => {
  return (
    <div className="margin-top-large callout alert" style={style}>
      {message}
    </div>
  );
};

ErrorLoading.defaultProps = defaultProps;

export default ErrorLoading;
