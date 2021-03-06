import React from 'react';
import { UiSchema } from 'react-jsonschema-form';
import { withKnobs } from '@storybook/addon-knobs';
import { mergeObjects } from 'react-jsonschema-form/lib/utils';
import { JSONSchema6 } from 'json-schema';

import { FormDemo } from '../utils/forms';

export default {
  title: 'CollapsibleField',
  decorators: [withKnobs],
};

const schema: JSONSchema6 = {
  type: 'object',
  properties: {
    main: {
      type: 'object',
      title: 'Main',
      properties: {
        option1: {
          title: 'option1',
          type: 'string',
        },
        option2: {
          title: 'option2',
          type: 'boolean',
        },
      },
    },
    advanced: {
      type: 'object',
      title: '',
      properties: {
        extra1: {
          title: 'extra 1',
          type: 'boolean',
          default: false,
        },
        extra2: {
          title: 'extra 2',
          type: 'boolean',
          default: true,
        },
      },
    },
  },
};

const uiSchema: UiSchema = {
  advanced: {
    'ui:field': 'CollapsibleField',
    'ui:titleCollapse': 'titleCollapse',
    collapse: { field: 'ObjectField' },
    extra1: {
      'ui:help': 'help',
      'ui:description': 'description',
    },
  },
};

export const Default = () => (
  <FormDemo
    schema={schema}
    uiSchema={uiSchema}
    initialValues={{ main: { option1: 'option1 text' }, advanced: { extra1: true } }}
  />
);

export const DisableCollapsible = () => (
  <FormDemo
    schema={schema}
    uiSchema={mergeObjects(uiSchema, {
      advanced: {
        'ui:field': 'ObjectField',
      },
    })}
    initialValues={{ main: { option1: 'option1 text' }, advanced: { extra1: true } }}
  />
);
