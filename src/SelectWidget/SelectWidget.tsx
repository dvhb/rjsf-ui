/* eslint-disable */
import React, { useMemo, useState } from 'react';
import get from 'lodash/get';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import { asNumber, guessType } from 'react-jsonschema-form/lib/utils';
import { useComponents } from '@dvhb/ui';

import { ErrorListField } from '../ErrorList';

const nums = new Set(['number', 'integer']);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: any, value: any) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === '') {
    return undefined;
  }
  if (type === 'array' && items && nums.has(items.type)) {
    return value.map(asNumber);
  }
  if (type === 'boolean') {
    // prettier-ignore
    return value === 'true';
  }
  if (type === 'number') {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === 'number')) {
      return asNumber(value);
    }
    if (schema.enum.every((x: any) => guessType(x) === 'boolean')) {
      return value === 'true';
    }
  }

  return value;
};

const getDefaultValue = (enumOptions: any, value: any, isMulti: boolean, options: any) => {
  if (options.url && value) {
    if (value === 'empty') {
      return { label: options.emptyOption, value: 'empty' };
    }

    return {
      label: value[options.labelProp] || value[options.valueProp] || '',
      value: options.valueProp ? value[options.valueProp] : value,
    };
  }

  if (!enumOptions) {
    return null;
  }

  if (!isMulti) {
    return enumOptions.find((enumOption: any) => enumOption.value === value);
  }

  return enumOptions.filter((enumOption: any) => value?.includes(enumOption.value));
};

const SelectWidget = ({
  schema,
  id,
  label: rawLabel,
  options,
  required,
  disabled,
  readonly,
  multiple,
  value,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  rawErrors,
  formContext,
}: WidgetProps & Pick<FieldTemplateProps, 'rawErrors'> & { multiple: boolean }) => {
  const { Field, Select } = useComponents();
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const {
    enumOptions,
    enumDisabled,
    url,
    requestBodyParams,
    requestBodyValues,
    responseBodyParam,
    valueProp,
    labelProp,
    emptyOption,
    errorText,
    searchable = true,
  } = options;
  if (!formContext) {
    return null;
  }

  const formStepIndex = options?.['__step__'];
  const isStepSubmitted = formContext.submittedSteps?.includes(formStepIndex) ?? false;
  const hasError = rawErrors?.length > 0 || localErrors.length > 0;
  const showError = isStepSubmitted || localErrors.length > 0;
  const label = options.title ? String(options.title) : rawLabel;

  const displayErrors = useMemo(() => (isStepSubmitted ? [...(rawErrors ?? []), ...localErrors] : localErrors), [
    rawErrors,
    localErrors,
    isStepSubmitted,
  ]);

  const handleChange = (option: any) => onChange(processValue(schema, option?.value));
  const handleOptionDisabled = (option: any) => {
    if (enumDisabled) {
      return (enumDisabled as string[]).some(enumDisabledItem => enumDisabledItem === option.value);
    }
    return false;
  };

  let loadOptions = undefined;
  if (url && requestBodyParams) {
    loadOptions = async (inputValue: string) => {
      const body: any = {};
      (requestBodyParams as string[]).map((requestBodyParam, index) => {
        body[requestBodyParam] =
          requestBodyValues && (requestBodyValues as string[])[index]
            ? get(formContext, (requestBodyValues as string[])[index])
            : inputValue;
      });
      const response = await fetch(url as string, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      const list = responseBodyParam ? result[responseBodyParam as string] : result;
      const options = list
        .map((item: any) => {
          return {
            value: valueProp ? item[valueProp as string] : item,
            label: item[(labelProp || valueProp) as string],
          };
        })
        .filter((item: any) => item.label.toLowerCase().includes(inputValue.toLowerCase()));

      if (emptyOption) {
        options.push({ label: emptyOption, value: 'empty' });
      }
      schema.enum = options.map((option: any) => option.value);
      return options;
    };
  }

  const loadingMessage = () => 'Загрузка...';

  return (
    <Field
      label={label}
      labelHint={options.help}
      description={options.description || schema.description}
      error={hasError && showError}
    >
      <Select
        error={hasError && showError}
        placeholder={null}
        loadingMessage={loadingMessage}
        defaultValue={getDefaultValue(enumOptions, value, multiple, options)}
        required={required}
        isMulti={multiple}
        isDisabled={disabled || readonly}
        isOptionDisabled={handleOptionDisabled}
        isSearchable={searchable as boolean}
        autoFocus={autofocus}
        loadOptions={loadOptions}
        defaultOptions
        onChange={handleChange}
        options={enumOptions as any}
      />
      <ErrorListField hasError={hasError && showError} rawErrors={displayErrors} errorText={errorText} />
    </Field>
  );
};

export default SelectWidget;
