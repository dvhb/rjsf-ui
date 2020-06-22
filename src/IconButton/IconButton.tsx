import React from 'react';
import { ButtonProps, useComponents } from '@dvhb/ui';

type IconButtonProps = {
  icon: 'remove' | 'plus' | 'arrow-up' | 'arrow-down';
} & ButtonProps;

const IconButton = (props: IconButtonProps) => {
  const { Icon, Button } = useComponents();
  const { icon, ...otherProps } = props;
  return (
    <Button {...otherProps}>
      <Icon name={icon} />
    </Button>
  );
};

export default IconButton;
