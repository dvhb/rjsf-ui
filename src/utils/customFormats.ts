// @link: https://github.com/rjsf-team/react-jsonschema-form/blob/v1.8.1/docs/validation.md#custom-string-formats
export const customFormats = {
  'email-regex': /^((([a-z]|\d|[#\$%&‘\+\-=\^_`{\|}~])+(\.([a-z]|\d|[#\$%&‘\+\-=\^_`{\|}~])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d)|(([a-z]|\d)([a-z]|\d|-|\.|_|~)*([a-z]|\d)))\.)+(([a-z])|(([a-z])([a-z]|\d|-|\.|_|~)*([a-z])))$/i,
  phone: /^\+[1-9]{1}\s[1-9]{1}\d{2}\s\d{3}-\d{2}-\d{2}$/, // matches ui:mask "+7 999 999-99-99"
  passport: /^\d{4}\s\d{6}$/, // matches ui:mask "9999 999999"
  birthday: /^\d{2}\.\d{2}\.\d{4}$/, // matches ui:mask "99.99.9999"
};
