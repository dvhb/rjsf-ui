import React, { useCallback } from 'react';
import { FieldProps } from '@rjsf/core';
import { useComponents } from '@dvhb/ui';

const DatePeriodField = (props: FieldProps) => {
  const { Field, DatepickerPeriod } = useComponents();
  const { onChange, schema, formData, uiSchema } = props;
  const help = uiSchema['ui:help'];

  const handleChange = useCallback(
    (value?: string) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <Field label={schema.title} labelHint={help} description={schema.description}>
      <DatepickerPeriod value={formData} onChange={handleChange} />
    </Field>
  );
};

export default DatePeriodField;
