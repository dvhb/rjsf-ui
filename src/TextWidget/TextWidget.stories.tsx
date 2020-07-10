import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'TextWidget',
  decorators: [withKnobs],
};

const schema: JSONSchema7 = {
  type: 'object',
  properties: {
    text: { type: 'string', description: 'description' },
    textUpperCase: { type: 'string', description: 'description' },
    phone: { type: 'string' },
    email: { type: 'string', format: 'email-regex' },
    maxLength: { type: 'string', maxLength: 50 },
  },
  required: ['text', 'phone', 'email', 'maxLength'],
};

const uiSchema: UiSchema = {
  text: {
    'ui:placeholder': 'placeholder',
    'ui:help': 'help',
  },
  textUpperCase: {
    'ui:placeholder': 'placeholder',
    'ui:transform': ['toUpperCase'],
  },
  phone: {
    'ui:mask': '+7 (999) 999-99-99',
    'ui:maskChar': null,
    'ui:inputType': 'tel',
  },
  maxLength: {
    'ui:errorText': {
      maxLength: 'Text for shortText  error',
    },
  },
};

export const Default = () => <FormDemo schema={schema} uiSchema={uiSchema} initialValues={{ text: 'text' }} />;
