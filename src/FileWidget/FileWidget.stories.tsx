import React from 'react';
import { JSONSchema6 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'FileWidget',
};

const schema: JSONSchema6 = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'data-url',
    },
  },
};

const fileScheme = {
  'ui:title': 'Upload file',
  'ui:url': 'https://jsonplaceholder.typicode.com/albums/1/photos',
  'ui:caption': 'Caption',
};

export const Default = () => (
  <FormDemo
    schema={schema}
    uiSchema={{
      file: fileScheme,
    }}
  />
);

export const Multi = () => (
  <FormDemo
    schema={schema}
    uiSchema={{
      file: {
        ...fileScheme,
        'ui:multiple': true,
      },
    }}
  />
);

export const OnlyJpgAndPng = () => (
  <FormDemo
    schema={schema}
    uiSchema={{
      file: {
        ...fileScheme,
        'ui:caption': 'JPG, PNG',
        'ui:accept': '.jpeg,.jpg,.png',
      },
    }}
  />
);
