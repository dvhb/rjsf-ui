import moment from 'moment';
import React, { useState, useMemo, useCallback } from 'react';
import { FieldProps, FieldTemplateProps } from 'react-jsonschema-form';
import { getUiOptions } from 'react-jsonschema-form/lib/utils';
import { useComponents } from '@dvhb/ui';

import { ErrorListField } from '../ErrorList';
import { customFormats } from '../utils/customFormats';

const TextBirthdayField = ({
  label: rawLabel,
  onChange,
  formContext,
  formData,
  rawErrors,
  schema,
  uiSchema,
}: FieldProps & Pick<FieldTemplateProps, 'rawErrors'>) => {
  const { Input, Field } = useComponents();

  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [localValue, setLocalValue] = useState(formData);
  const [showOldHint, setShowOldHint] = useState(false);
  const {
    mask,
    placeholder,
    maskChar,
    title,
    description,
    help,
    errorText: errorTextRaw,
    inputType = 'text',
    minAge,
    minYear,
    maxAge,
    disabledToday,
    disabledFuture,
    disabledPast,
    oldHint,
    oldHintAge,
    ...options
  } = getUiOptions(uiSchema) as any;
  const inputMaskChar = maskChar === null ? null : maskChar;

  const errorText = errorTextRaw;

  const label = title ? String(title) : rawLabel;
  const formStepIndex = options?.['__step__'];
  const isStepSubmitted = formContext.submittedSteps?.includes(formStepIndex) ?? false;
  const hasError = rawErrors?.length > 0 || localErrors.length > 0;
  const showError = isStepSubmitted || localErrors.length > 0;
  const computeErrors = (rawErrors: string[], localErrors: string[], isStepSubmitted: boolean) => {
    if (!isStepSubmitted || localErrors.length) {
      return localErrors;
    }
    return rawErrors ? rawErrors : [];
  };

  const displayErrors = useMemo(() => computeErrors(rawErrors, localErrors, isStepSubmitted), [
    rawErrors,
    localErrors,
    isStepSubmitted,
  ]);

  const handleChange = useCallback(
    ({ target: { value: rawValue } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const valueWithoutMask = rawValue.replace(/_/g, '');
      const isBlank = !valueWithoutMask.replace(/\./g, '').trim();
      if (isBlank) {
        setLocalValue('');
        return;
      }
      setLocalValue(rawValue);
    },
    [],
  );
  const handleBlur = useCallback(
    ({ target: { value: rawValue } }: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const valueWithoutMask = rawValue.replace(/_/g, '');
      const isBlank = !valueWithoutMask.replace(/\./g, '').trim();

      if (isBlank) {
        onChange(options.emptyValue);
        return;
      }
      if (!customFormats.birthday.test(valueWithoutMask)) {
        setLocalErrors(['format']);
        onChange(options.emptyValue);
        return;
      }

      const [day, month, year] = valueWithoutMask.split('.');
      const momentDate = moment(`${year}-${month}-${day}`);
      const errors: string[] = [];
      if (!momentDate.isValid()) {
        setLocalErrors(['format']);
        onChange(options.emptyValue);
        return;
      }

      if (minAge && momentDate.isAfter(moment().subtract(minAge, 'years'), 'days')) {
        errors.push('late');
      } else if (minYear && momentDate.year() < minYear) {
        errors.push('early');
      } else if (maxAge && momentDate.isSameOrBefore(moment().subtract(maxAge, 'years'), 'days')) {
        errors.push('early');
      } else if (disabledToday && momentDate.isSameOrAfter(moment(), 'days')) {
        errors.push('late');
      } else if (disabledFuture && momentDate.isAfter(moment(), 'days')) {
        errors.push('late');
      } else if (disabledPast && momentDate.isBefore(moment(), 'days')) {
        errors.push('early');
      }
      if (oldHint && oldHintAge && momentDate.isSameOrBefore(moment().subtract(oldHintAge, 'years'))) {
        setShowOldHint(true);
      } else {
        setShowOldHint(false);
      }
      setLocalErrors(errors.length ? errors : []);
      onChange(errors.length ? options.emptyValue : valueWithoutMask);
    },
    [options, onChange, minAge, maxAge, minYear],
  );

  const resultDescription = showOldHint ? oldHint : [description || schema.description];
  return (
    <Field label={label} labelHint={help} description={resultDescription} error={hasError && showError}>
      <Input
        placeholder={placeholder}
        required={hasError && showError}
        value={localValue}
        mask={mask}
        maskChar={inputMaskChar}
        onChange={handleChange}
        type={inputType}
        onBlur={handleBlur}
      />
      <ErrorListField hasError={hasError && showError} rawErrors={displayErrors} errorText={errorText} />
    </Field>
  );
};

export default TextBirthdayField;
