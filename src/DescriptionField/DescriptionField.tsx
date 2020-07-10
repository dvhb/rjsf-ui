import React from 'react';

import { FieldProps } from '@rjsf/core';

const DescriptionField = ({ description }: FieldProps) => {
  if (description) {
    return <div>{description}</div>;
  }

  return null;
};

export default DescriptionField;
