import React from 'react';
import { FieldTemplateProps } from 'react-jsonschema-form';

const FieldTemplate = ({ id, children, rawErrors = [] }: FieldTemplateProps) => {
  return (
    <>
      {children}
      {rawErrors.length > 0 && false && (
        <ul>
          {rawErrors.map((error, i: number) => {
            return (
              <li key={i}>
                <span id={id}>- {error}</span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default FieldTemplate;
