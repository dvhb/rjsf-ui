import React from 'react';
import { UiSchema } from 'react-jsonschema-form';
import { JSONSchema6 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'DatePeriodField',
};

const schema: JSONSchema6 = {
  type: 'object',
  properties: {
    datePeriod: {
      type: 'string',
      title: 'Date period',
    },
  },
};

const uiSchema: UiSchema = {
  datePeriod: {
    'ui:field': 'DatePeriodField',
    'ui:help': 'Help',
  },
};

export const Default = () => <FormDemo schema={schema} uiSchema={uiSchema} />;

export const WithData = () => (
  <FormDemo schema={schema} uiSchema={uiSchema} initialValues={{ datePeriod: '2020-03-20/2020-03-29' }} />
);
