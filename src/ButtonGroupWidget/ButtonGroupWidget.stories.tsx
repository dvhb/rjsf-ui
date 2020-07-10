import React from 'react';
import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'ButtonGroupWidget',
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
  'ui:widget': 'ButtonGroupWidget',
};

export const Default = () => <FormDemo schema={schema} uiSchema={uiSchema} />;

export const TitleHidden = () => <FormDemo schema={schema} uiSchema={{ ...uiSchema, 'ui:titleHidden': true }} />;

export const WithData = () => <FormDemo schema={schema} uiSchema={uiSchema} initialValues={'female'} />;
