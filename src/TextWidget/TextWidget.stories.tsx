import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { UiSchema } from 'react-jsonschema-form';
import { JSONSchema6 } from 'json-schema';

import { FormDemo } from '../utils/forms';

export default {
  title: 'TextWidget',
  decorators: [withKnobs],
};

const schema: JSONSchema6 = {
  type: 'object',
  properties: {
    text: { type: 'string', description: 'description' },
    phone: { type: 'string' },
    fioEn: { type: 'string', format: 'fio-en' },
    email: { type: 'string', format: 'email-regex' },
    maxLength: { type: 'string', maxLength: 50 },
  },
  required: ['text', 'phone', 'fioEn', 'email', 'maxLength'],
};

const uiSchema: UiSchema = {
  text: { 'ui:placeholder': 'placeholder', 'ui:help': 'help' },
  phone: { 'ui:mask': '+7 (999) 999-99-99' },
  fioEn: {
    'ui:errorText': {
      required: 'Text for required error',
      format: 'Text for format "fio-en" error',
    },
  },
  maxLength: {
    'ui:errorText': {
      maxLength: 'Text for shortText  error',
    },
  },
};

export const Default = () => (
  <FormDemo schema={schema} uiSchema={uiSchema} initialValues={{ text: 'text', phone: '79081234567' }} />
);
