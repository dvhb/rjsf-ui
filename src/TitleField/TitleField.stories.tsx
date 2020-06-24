import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { FormDemo } from '../utils';

export default {
  title: 'TitleField',
  decorators: [withKnobs],
};

export const Default = () => (
  <FormDemo
    schema={{ type: 'object', properties: { prop1: { type: 'string' } } }}
    uiSchema={{ 'ui:title': 'h2 default' }}
  />
);

export const WithH1 = () => (
  <FormDemo
    schema={{ type: 'object', properties: { prop1: { type: 'string' } } }}
    uiSchema={{
      'ui:title': 'h1',
      'ui:options': { title: { type: 'h1' } },
    }}
  />
);
