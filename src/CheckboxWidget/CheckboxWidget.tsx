import React, { useCallback } from 'react';
import { FieldTemplateProps, WidgetProps } from '@rjsf/core';
import { useComponents } from '@dvhb/ui';

import { sanitized } from '../utils/sanitize';

const CheckboxWidget = (props: WidgetProps & Pick<FieldTemplateProps, 'rawErrors'>) => {
  const { Checkbox, Aligner, Spacer, Hint, Field } = useComponents();
  const { id, value, disabled, readonly, label, onChange, options, formContext, rawErrors } = props;
  const { help, labelHtml } = options;
  const hasError = rawErrors?.length > 0;
  const formStepIndex = options?.['__step__'];
  const showError = formContext.submittedSteps?.includes(formStepIndex) ?? false;

  const handleChange = useCallback(
    checked => {
      onChange(checked);
    },
    [onChange],
  );

  const labelContent = labelHtml ? <div dangerouslySetInnerHTML={{ __html: sanitized(labelHtml) }} /> : label;

  return (
    <>
      <Field bottomMargin={false} errorText="Обязательное поле" error={hasError && showError}>
        <Aligner>
          <Checkbox
            id={id}
            checked={typeof value === 'undefined' ? false : value}
            disabled={disabled || readonly}
            onChange={handleChange}
            label={labelContent}
            type={options.type as 'slider' | undefined}
          />

          {help && (
            <>
              <Spacer marginRight="xs" />
              <Hint text={help} />{' '}
            </>
          )}
        </Aligner>
      </Field>
    </>
  );
};

export default CheckboxWidget;
