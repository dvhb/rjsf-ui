import React, { useState, useMemo, useCallback } from 'react';
import { FieldTemplateProps, WidgetProps } from '@rjsf/core';
import { useComponents } from '@dvhb/ui';

import { ErrorListField } from '../ErrorList';

const FileWidget = ({
  label: rawLabel,
  readonly,
  disabled,
  onChange,
  formContext,
  rawErrors,
  options,
}: WidgetProps & Pick<FieldTemplateProps, 'rawErrors'>) => {
  const components = useComponents();
  const { FileUpload, Field } = components;
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const label = options.title ? String(options.title) : rawLabel;
  const { errorText } = options as any;
  const formStepIndex = options?.['__step__'];
  const isStepSubmitted = formContext.submittedSteps?.includes(formStepIndex) ?? false;
  const hasError = rawErrors?.length > 0 || localErrors.length > 0;
  const showError = isStepSubmitted || localErrors.length > 0;

  const displayErrors = useMemo(() => (isStepSubmitted ? [...(rawErrors ?? []), ...localErrors] : localErrors), [
    rawErrors,
    localErrors,
    isStepSubmitted,
  ]);

  const handleChange = useCallback(
    fileId => {
      onChange(fileId);
    },
    [onChange],
  );

  const { url } = options;

  return (
    <Field labelHint={options.help} description={options.description} error={hasError && showError}>
      <FileUpload
        disabled={disabled || readonly}
        onChange={handleChange}
        label={label}
        url={url as string}
        {...options}
      />
      <ErrorListField hasError={hasError && showError} rawErrors={displayErrors} errorText={errorText} />
    </Field>
  );
};

export default FileWidget;
