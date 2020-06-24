import React from 'react';
import { UiSchema } from 'react-jsonschema-form';
import { JSONSchema6 } from 'json-schema';

import { FormDemo } from '../utils';

export default {
  title: 'DateWidget',
};

const schema: JSONSchema6 = {
  type: 'object',
  required: ['date2', 'date3'],
  properties: {
    date1: {
      type: 'string',
      format: 'date',
      title: 'Date default',
    },
    date2: {
      type: 'string',
      format: 'date',
      title: 'Date birthday',
    },
    date3: {
      type: 'string',
      format: 'date',
      title: 'Date birthday min age',
    },
    date4: {
      type: 'string',
      format: 'date',
      title: 'Date (disabled past))',
    },
    date5: {
      type: 'string',
      format: 'date',
      title: 'Date (disabled future))',
    },
    date6: {
      type: 'string',
      format: 'date',
      title: 'Date (disabled today))',
    },
  },
};

const uiSchema: UiSchema = {
  date2: {
    'ui:variant': 'birthday',
    'ui:help': 'help',
    'ui:errorText': {
      required: 'errorText',
    },
    'ui:disabledToday': true,
  },
  date3: {
    'ui:variant': 'birthday',
    'ui:help': 'help',
    'ui:minAge': 18,
    'ui:minYear': 1900,
    'ui:oldHint': 'oldHint',
    'ui:errorText': {
      required: 'required',
      early: 'early',
      late: 'late',
    },
  },
  date4: {
    'ui:disabledPast': true,
  },
  date5: {
    'ui:disabledFuture': true,
  },
  date6: {
    'ui:disabledToday': true,
  },
};

export const Default = () => <FormDemo schema={schema} uiSchema={uiSchema} initialValues={{}} />;

export const WithData = () => (
  <FormDemo
    schema={schema}
    uiSchema={uiSchema}
    initialValues={{ date1: '2020-02-20', date2: '1988-08-13', date3: '2000-02-02' }}
  />
);
