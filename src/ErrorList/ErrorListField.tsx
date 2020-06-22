import React, { FC } from 'react';
import { useComponents } from '@dvhb/ui';

export type ErrorListFieldProps = {
  hasError: boolean;
  rawErrors: string[];
  errorText?: any;
};

export const ErrorListField: FC<ErrorListFieldProps> = ({ hasError = true, rawErrors, errorText }) => {
  const { Text, Spacer } = useComponents();
  const renderedErrors: string[] = []; // To prevent duplicates

  return hasError && rawErrors.length > 0 ? (
    <>
      <Spacer margin="xs" />
      {rawErrors.map((error, i) => {
        const errorToRender = errorText?.[error] || (error !== 'required' && error);
        if (!renderedErrors.includes(errorToRender)) {
          renderedErrors.push(errorToRender);
          return (
            <Text color="errorColor" size="sm" key={i}>
              {errorToRender}
            </Text>
          );
        }
        return null;
      })}
    </>
  ) : null;
};
