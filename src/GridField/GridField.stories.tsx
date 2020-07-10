import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'GridField',
  decorators: [withKnobs],
};

const schema: JSONSchema7 = {
  title: 'Todo',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    password: { type: 'string', title: 'Password' },
    lastName: { type: 'string', title: 'Last name' },
    bio: { type: 'string', title: 'Bio' },
    firstName: { type: 'string', title: 'First name' },
    age: { type: 'integer', title: 'Age' },
  },
};

const uiSchema: UiSchema = {
  'ui:field': 'GridField',
  'ui:grid': [
    { firstName: { md: 6 }, lastName: { md: 6 } },
    { bio: { md: 12 } },
    { age: { md: 6 }, password: { md: 6 } },
  ],
};

export const Default = () => <FormDemo schema={schema} uiSchema={uiSchema} />;

export const WithUiOrder = () => (
  <FormDemo
    schema={{
      type: 'object',
      properties: {
        firstName: { type: 'string', title: 'First name' },
        lastName: { type: 'string', title: 'Last name' },
      },
    }}
    uiSchema={{
      'ui:field': 'GridField',
      'ui:grid': [{ 'ui:order': ['lastName', 'firstName'], firstName: { md: 6 }, lastName: { md: 6 } }],
    }}
  />
);

export const WithConditionalFields = () => (
  <FormDemo
    schema={{
      type: 'object',
      properties: {
        requiredOption: { type: 'string', title: 'Required option', enum: ['option1', 'option2'] },
        lastname: { type: 'string', title: 'Last name' },
        firstname: { type: 'string', title: 'First name' },
        middlename: { type: 'string', title: 'Middle name' },
      },
    }}
    uiSchema={{
      'ui:field': 'GridField',
      'ui:grid': [
        { requiredOption: { md: 6 }, lastname: { md: 6, dependsOnFilled: 'requiredOption' } },
        {
          firstname: { md: 6, dependsOnFilled: 'requiredOption' },
          middlename: { md: 6, dependsOnFilled: 'requiredOption' },
        },
      ],
    }}
  />
);
