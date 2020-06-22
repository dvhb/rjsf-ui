import React from 'react';
import { FieldProps } from 'react-jsonschema-form';
import { getUiOptions } from 'react-jsonschema-form/lib/utils';
import { useComponents } from '@dvhb/ui';

const TitleField = ({ title, uiSchema }: FieldProps) => {
  const { Text } = useComponents();
  const { title: { type = 'h2', ...options } = {} } = getUiOptions(uiSchema || {}) as any;
  return (
    <>
      <Text size={type} {...options}>
        {title}
      </Text>
    </>
  );
};

export default TitleField;
