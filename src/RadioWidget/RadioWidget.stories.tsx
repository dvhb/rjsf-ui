import React from 'react';
import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'RadioWidget',
};

const schema: JSONSchema7 = {
  definitions: {
    Gender: {
      title: 'Gender',
      type: 'string',
      enum: ['male', 'female'],
      // @ts-ignore
      enumNames: ['Male', 'Female'],
    },
  },
  $ref: '#/definitions/Gender',
};

const uiSchema: UiSchema = {
  'ui:widget': 'radio',
};

export const Default = () => <FormDemo schema={schema} uiSchema={uiSchema} />;

export const WithData = () => <FormDemo schema={schema} uiSchema={uiSchema} initialValues={'female'} />;
