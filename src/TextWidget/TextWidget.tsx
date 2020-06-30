import React, { useState, useMemo, useCallback } from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import { useComponents } from '@dvhb/ui';

import { ErrorListField } from '../ErrorList';

const TextWidget = ({
  id,
  label: rawLabel,
  required,
  readonly,
  disabled,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  formContext,
  rawErrors,
  options,
  schema,
  placeholder: placeholderRaw,
}: WidgetProps & Pick<FieldTemplateProps, 'rawErrors'>) => {
  const { Input, Field } = useComponents();

  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const {
    mask,
    maskChar,
    errorText: errorTextRaw,
    countryForAlt,
    inputType = 'text',
    extraFormatErrors = [],
  } = options as any;
  const inputMaskChar = maskChar === null ? null : maskChar;

  const isAltCountry =
    countryForAlt && formContext.main.countries.length === 1 && formContext.main.countries[0].value === countryForAlt;
  const title = isAltCountry ? options.titleAlt : options.title;
  const disallowedChars = isAltCountry ? options.disallowedCharsAlt : options.disallowedChars;
  const placeholder = isAltCountry ? (options.placeholderAlt as string) : placeholderRaw;
  const errorText = isAltCountry
    ? {
        ...errorTextRaw,
        required: errorTextRaw.requiredAlt,
        disallowedChars: errorTextRaw.disallowedCharsAlt,
        format: errorTextRaw.formatAlt,
      }
    : errorTextRaw;

  extraFormatErrors.forEach((extra: { pattern: string; text: string }) => {
    if (new RegExp(extra.pattern, 'i').test(value ?? '')) {
      errorText.format = extra.text;
    }
  });

  const label = title ? String(title) : rawLabel;
  const formStepIndex = options?.['__step__'];
  const isStepSubmitted = formContext.submittedSteps?.includes(formStepIndex) ?? false;
  const hasError = rawErrors?.length > 0 || localErrors.length > 0;
  const showError = isStepSubmitted || localErrors.length > 0;
  const { maxLength } = schema;

  const displayErrors = useMemo(() => (isStepSubmitted ? [...(rawErrors ?? []), ...localErrors] : localErrors), [
    rawErrors,
    localErrors,
    isStepSubmitted,
  ]);

  const _onChange = useCallback(
    ({ target: { value: rawValue } }: React.ChangeEvent<HTMLInputElement>) => {
      let value = rawValue;

      if (maxLength && value.length > maxLength) {
        return;
      }

      if (disallowedChars != null) {
        const regex = new RegExp(`${disallowedChars}+`, 'gi');
        value = value.replace(regex, '');
        if (value !== rawValue) {
          setLocalErrors(errors => (errors.includes('disallowedChars') ? errors : [...errors, 'disallowedChars']));
        } else {
          setLocalErrors(errors => errors.filter(error => error !== 'disallowedChars'));
        }
      }

      onChange(value === '' ? options.emptyValue : value);
    },
    [options, onChange, maxLength],
  );

  const _onBlur = useCallback(
    ({ target: { value: rawValue } }: React.FocusEvent<HTMLInputElement>) => {
      let value = rawValue;
      const { transform = [] } = options as { transform?: string[] };

      if (transform && transform.includes('toLowerCase')) {
        value = value.toLowerCase();
      }

      if (transform && transform.includes('toUpperCase')) {
        value = value.toUpperCase();
      }
      onChange(value === '' ? options.emptyValue : value);
      onBlur(id, value && value);
    },
    [onBlur, onChange, id, options],
  );

  const reachedMaxLength = maxLength && value && value.length === maxLength;
  const description = [
    reachedMaxLength && options.maxLengthHint && (
      <>
        {options.maxLengthHint}
        <br />
      </>
    ),
    options.description || schema.description,
  ];

  const formatChars = mask
    ? {
        a: '[a-zA-Z]',
        а: '[а-яА-ЯёЁ]',
        н: '[а-яА-ЯёЁ0-9]',
        '9': '[0-9]',
        '*': '[A-Za-z0-9а-яА-ЯёЁ]',
      }
    : undefined;

  return (
    <Field label={label} labelHint={options.help} description={description} error={hasError && showError}>
      <Input
        placeholder={placeholder}
        required={hasError && showError}
        disabled={disabled || readonly}
        value={value ? value : ''}
        mask={mask}
        maskChar={inputMaskChar}
        formatChars={formatChars}
        onChange={_onChange}
        type={inputType}
        onBlur={_onBlur}
        // onFocus={_onFocus}
      />
      <ErrorListField hasError={hasError && showError} rawErrors={displayErrors} errorText={errorText} />
    </Field>
  );
};

export default TextWidget;
