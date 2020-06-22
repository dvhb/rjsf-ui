import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
import { Modifier } from 'react-day-picker/types/Modifiers';
import { DayPickerProps } from 'react-day-picker/types';
import moment from 'moment';
import { useComponents, DatepickerInputError } from '@dvhb/ui';

import { ErrorListField } from '../ErrorList';

const oldAge = moment()
  .subtract(65, 'years')
  .toDate();

type DateWidgetProps = {} & WidgetProps & Pick<FieldTemplateProps, 'rawErrors'>;

const DateWidget = ({ label: rawLabel, value, onChange, formContext, rawErrors, options }: DateWidgetProps) => {
  const { Field, Datepicker, DatepickerBirthday } = useComponents();
  const {
    errorText,
    title,
    variant,
    minAge,
    maxAge,
    minYear,
    disabledToday,
    disabledFuture,
    disabledPast,
    daysFromNowMin,
    monthsFromNowMax,
    oldHint,
  } = options;

  const [localValue, setLocalValue] = useState<string | undefined>(value);
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const label = title ? String(title) : rawLabel;
  const formStepIndex = options?.['__step__'];
  const isStepSubmitted = formContext.submittedSteps?.includes(formStepIndex) ?? false;
  const hasError = rawErrors?.length > 0 || localErrors.length > 0;
  const showError = isStepSubmitted || localErrors.length > 0;

  // set default date if it has daysFromNowMin
  useEffect(() => {
    if (daysFromNowMin) {
      const date = moment()
        .add(daysFromNowMin as number, 'days')
        .format('YYYY-MM-DD');
      if (!localValue || date === localValue) {
        onChange(date);
        setLocalValue(date);
      }
    }
  }, [onChange, setLocalValue, daysFromNowMin]);

  const displayErrors = useMemo(() => {
    let filteredRawErrors = rawErrors || [];
    if (localErrors.length > 0) {
      filteredRawErrors = filteredRawErrors.filter(error => error !== 'required');
    }
    return isStepSubmitted ? [...(filteredRawErrors ?? []), ...localErrors] : localErrors;
  }, [rawErrors, localErrors, isStepSubmitted]);

  const handleChange = useCallback(
    (value?: string, error?: DatepickerInputError) => {
      if (error) {
        setLocalErrors([error]);
      } else {
        setLocalErrors([]);
      }

      setLocalValue(value);
      onChange(value === '' || error ? options.emptyValue : value);
    },
    [onChange, options.emptyValue, setLocalValue],
  );

  const dayPickerProps: DayPickerProps = {};
  const disabledDays: Modifier[] = [];

  if (disabledToday) {
    disabledDays.push(new Date());
    disabledDays.push({ after: new Date() });
  }
  if (disabledFuture) {
    const date = new Date();

    disabledDays.push({ after: date });
    dayPickerProps.toMonth = date;
  }
  if (disabledPast) {
    const date = new Date();

    disabledDays.push({ before: date });
    dayPickerProps.fromMonth = date;
  }
  if (minAge) {
    const date = moment()
      .add(-1, 'days')
      .subtract(minAge as number, 'years')
      .toDate();

    disabledDays.push({ after: date });
    dayPickerProps.toMonth = date;
  }
  if (maxAge) {
    const date = moment()
      .subtract(maxAge as number, 'years')
      .add(1, 'days')
      .toDate();

    disabledDays.push({ before: date });
    dayPickerProps.fromMonth = date;
  }
  if (minYear) {
    const date = new Date(minYear as number, 0);

    disabledDays.push({ before: date });
    dayPickerProps.fromMonth = date;
  }
  if (daysFromNowMin) {
    const date = moment()
      .add(daysFromNowMin as number, 'days')
      .toDate();
    disabledDays.push({ before: date });
    dayPickerProps.fromMonth = date;
  }
  if (monthsFromNowMax) {
    const date = moment()
      .add(monthsFromNowMax as number, 'months')
      .toDate();
    disabledDays.push({ after: date });
    dayPickerProps.toMonth = date;
  }
  dayPickerProps.disabledDays = disabledDays;

  const description = oldHint && new Date(value) < oldAge ? oldHint : undefined;

  const DatePickerComponent = variant === 'birthday' ? DatepickerBirthday : Datepicker;

  return (
    <Field label={label} labelHint={options.help} description={description} error={hasError && showError}>
      <DatePickerComponent
        value={localValue}
        onChange={handleChange}
        required={hasError && showError}
        dayPickerProps={dayPickerProps}
        mask={options.mask as string}
      />
      <ErrorListField hasError={hasError && showError} rawErrors={displayErrors} errorText={errorText} />
    </Field>
  );
};

export default DateWidget;
