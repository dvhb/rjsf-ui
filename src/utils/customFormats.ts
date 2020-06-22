// @link: https://github.com/rjsf-team/react-jsonschema-form/blob/v1.8.1/docs/validation.md#custom-string-formats
export const customFormats = {
  'fio-ru': /^\s*[а-я-]+\s+[а-я-]+\s+[а-я-].+$/i,
  'fio-en': /^\s*[a-z-]+\s+[a-z-]+\s*$/i,
  lastName: /^\s*[а-яё\s-']+\s*$/i,
  firstName: /^\s*[а-яё\s-']+\s*$/i,
  middleName: /^\s*[а-яё\s-']+\s*$/i,
  'email-regex': /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
  phone: /^\+[1-9]{1}\s[1-9]{1}\d{2}\s\d{3}-\d{2}-\d{2}$/, // matches ui:mask "+7 999 999-99-99"
  passport: /^\d{4}\s\d{6}$/, // matches ui:mask "9999 999999"
  birthday: /^\d{2}\.\d{2}\.\d{4}$/, // matches ui:mask "99.99.9999"
};
