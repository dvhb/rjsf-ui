import React from 'react';
import { ButtonGroupItem, useComponents } from '@dvhb/ui';
import { FieldTemplateProps, WidgetProps } from '@rjsf/core';

import { sanitized } from '../utils/sanitize';

const ButtonGroupWidget = (props: WidgetProps & Pick<FieldTemplateProps, 'rawErrors'>) => {
  const { Field, ButtonGroup } = useComponents();
  const { value, label, onChange, options } = props;
  const { labelHtml, enumOptions, titleHidden = false } = options;

  const labelContent = labelHtml ? <div dangerouslySetInnerHTML={{ __html: sanitized(labelHtml) }} /> : label;

  return (
    <>
      <Field bottomMargin={false} label={!titleHidden ? (labelContent as string) : ''}>
        <ButtonGroup block items={enumOptions as ButtonGroupItem[]} onChange={onChange} value={value} />
      </Field>
    </>
  );
};

export default ButtonGroupWidget;
