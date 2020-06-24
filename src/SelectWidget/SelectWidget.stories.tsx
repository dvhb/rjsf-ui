import React from 'react';
import { UiSchema } from 'react-jsonschema-form';
import { JSONSchema6 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'SelectWidget',
};

const schema: JSONSchema6 = {
  definitions: {
    Colors: {
      title: 'Color',
      type: 'string',
      enum: ['#00B8D9', '#0052CC', '#5243AA', '#FF5630', '#FF8B00'],
      // @ts-ignore
      enumNames: ['Ocean', 'Blue', 'Purple', 'Red', 'Orange'],
    },
  },
  type: 'object',
  required: ['single', 'colorMask', 'blendMode'],
  title: 'SelectWidget',
  properties: {
    single: {
      $ref: '#/definitions/Colors',
      title: 'Select single',
    },
    multi: {
      type: 'array',
      uniqueItems: true,
      items: {
        $ref: '#/definitions/Colors',
      },
      title: 'Select multi',
    },
    async: {
      type: 'string',
      title: 'Select async',
      enum: [],
    },
  },
};

const uiSchema: UiSchema = {
  async: {
    'ui:url': 'http://jsonplaceholder.typicode.com/users',
    'ui:valueProp': 'email',
    'ui:labelProp': 'username',
  },
};

export const Default = () => <FormDemo schema={schema} uiSchema={uiSchema} initialValues={{}} />;

export const WithData = () => (
  <FormDemo
    schema={schema}
    uiSchema={uiSchema}
    initialValues={{
      single: '#00B8D9',
      multi: ['#0052CC'],
    }}
  />
);
