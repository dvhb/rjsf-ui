import { ThemeProps } from 'react-jsonschema-form';
import { getDefaultRegistry } from 'react-jsonschema-form/lib/utils';

import ArrayFieldTemplate from '../ArrayFieldTemplate';
import Fields from '../Fields';
import FieldTemplate from '../FieldTemplate';
import ObjectFieldTemplate from '../ObjectFieldTemplate';
import Widgets from '../Widgets';
import { customFormats } from '../utils/customFormats';

const { fields, widgets } = getDefaultRegistry();

/*
 * Allows to use error text ui option with same key names to show custom error messages.
 * For example: { 'ui:errorText': { required: 'Required field' }}
 * instead of:  { 'ui:errorText': { 'is a required property': 'Required field' }}
 */
const transformErrors = (errors: any) => {
  const e: any[] = [];
  errors.map(({ name, message, ...rest }: any) => {
    if (name !== 'type' && name !== 'oneOf' && name !== 'const') {
      e.push({
        name,
        message: name,
        ...rest,
      });
    }
  });
  return e;
};

const Theme: ThemeProps = {
  ArrayFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  customFormats,
  transformErrors,
  // @ts-ignore
  fields: { ...fields, ...Fields },
  // @ts-ignore
  widgets: { ...widgets, ...Widgets },
};

export default Theme;
