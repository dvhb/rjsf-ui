import React from 'react';
import { JSONSchema6 } from 'json-schema';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import { FormDemo } from '../utils/forms';

export default {
  title: 'TextBirthdayField',
  decorators: [withKnobs],
};

const schema: JSONSchema6 = {
  type: 'string',
  properties: {
    birthday: { type: 'string', format: 'birthday' },
  },
  required: ['birthday'],
};

const props = {
  schema,
  uiSchema: {
    'ui:field': 'TextBirthdayField',
    'ui:title': 'title',
    'ui:minAge': 18,
    'ui:minYear': 1900,
    'ui:mask': '99.99.9999',
    'ui:placeholder': 'дд.мм.гггг',
    'ui:errorText': {
      required: 'required',
      late: 'late',
      early: 'early',
      format: 'format',
    },
    'ui:inputType': 'tel',
  },
  onChange: action('onChange'),
};

export const Default = () => <FormDemo {...props} />;
