import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { JSONSchema6 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'CheckboxWidget',
  decorators: [withKnobs],
};

const schema: JSONSchema6 = {
  type: 'object',
  properties: {
    option1: {
      title: 'Checkbox',
      type: 'boolean',
    },
    option2: {
      title: 'Checkbox with required true',
      type: 'boolean',
      enum: [true],
    },
  },
  required: ['option1', 'option2'],
};

const props = {
  initialValues: { option1: true },
};

export const Default = () => <FormDemo {...props} schema={schema} />;

export const WithHelp = () => (
  <FormDemo
    {...props}
    schema={schema}
    uiSchema={{
      option1: {
        'ui:help': 'help',
        'ui:description': 'description',
      },
    }}
  />
);

export const WithLabelHtml = () => (
  <FormDemo
    {...props}
    schema={schema}
    uiSchema={{
      option1: {
        'ui:labelHtml': 'Checkbox with <a href="https://dvhb.com" target="_blank">link</a>',
      },
    }}
  />
);
