import React from 'react';
import { AddButtonProps } from '@rjsf/core';
import { useComponents } from '@dvhb/ui';

// TODO: Add label property on type definition
const AddButton: React.FC<AddButtonProps & { label?: string }> = props => {
  const { Button } = useComponents();
  return <Button {...props}>{props.label || 'Add Item'}</Button>;
};

export default AddButton;
