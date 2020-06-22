import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { FormDemo } from '../utils/forms';

export default {
  title: 'ArrayFieldTemplate',
  decorators: [withKnobs],
};

const formProps = {};

export const Default = () => (
  <FormDemo
    {...formProps}
    schema={{
      type: 'object',
      properties: {
        fixedItemsList: {
          type: 'array',
          title: 'A list of fixed items',
          items: [
            { title: 'A string value', type: 'string', default: 'lorem ipsum' },
            { title: 'a boolean value', type: 'boolean' },
          ],
          additionalItems: { title: 'Relations', type: 'string', default: '' },
        },
      },
    }}
    uiSchema={{
      fixedItemsList: {
        items: [{ 'ui:widget': 'textarea' }, { 'ui:widget': 'select' }],
      },
    }}
  />
);

export const ArrayList = () => (
  <FormDemo
    schema={{
      type: 'array',
      title: 'ArrayList',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'object',
        required: ['firstName', 'lastName'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
        },
      },
    }}
    uiSchema={{
      'ui:options': {
        orderable: false,
        addButtonLabel: 'addButtonLabel',
        addButtonHelp: 'addButtonHelp',
      },
      'ui:errorText': {
        maxItems: 'Maximum count error',
      },
      items: {
        countLabel: 'Item count #{index}',
        removeButtonLabel: 'removeButtonLabel',
      },
    }}
  />
);
