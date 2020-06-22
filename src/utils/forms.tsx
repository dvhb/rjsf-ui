import React, { ReactNode, useCallback, useState } from 'react';
import { withTheme, FormProps } from 'react-jsonschema-form';

import Theme from '../Theme';

export const onSubmit = (values: object) => {
  window.alert(preJson(values));
};

// @ts-ignore
export const preJson = (values?: object) => JSON.stringify(values || {}, 0, 2);

const Form = withTheme(Theme);

type FormDemoProps = {
  initialValues?: any;
  children?: ReactNode;
} & FormProps<any>;

export const FormDemo = ({
  schema,
  uiSchema,
  initialValues,
  formContext,
  children,
  onChange,
  ...props
}: FormDemoProps) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = useCallback(
    (e: any, es?: any) => {
      setFormData(e.formData);
      onChange?.(e, es);
    },
    [onChange],
  );
  const handleSubmit = useCallback((e: any) => {
    setFormData(e.formData);
    onSubmit?.(e.formData);
  }, []);
  const handleReset = useCallback(() => setFormData(initialValues), [setFormData, initialValues]);

  return (
    <Form
      onSubmit={handleSubmit}
      onChange={handleChange}
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      formContext={formContext}
      showErrorList
      liveValidate={false}
      {...props}
    >
      {children}
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
      <pre>schema={preJson(schema)}</pre>
      <pre>uiSchema={preJson(uiSchema)}</pre>
      <pre>formData={preJson(formData)}</pre>
      <pre>formContext={preJson(formContext)}</pre>
    </Form>
  );
};
