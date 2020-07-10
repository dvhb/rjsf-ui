import React from 'react';
import { FieldProps, utils } from '@rjsf/core';
import { useComponents } from '@dvhb/ui';
const { getUiOptions } = utils;

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
