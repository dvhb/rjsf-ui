import React from 'react';
import { ObjectFieldTemplateProps as DefaultObjectFieldTemplateProps, UiSchema } from '@rjsf/core';

type ObjectFieldTemplateProps = {
  TitleField: React.StatelessComponent<{ id: string; title: string; required: boolean; uiSchema: UiSchema }>;
} & DefaultObjectFieldTemplateProps;

const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
}: ObjectFieldTemplateProps) => {
  return (
    <>
      {(uiSchema['ui:title'] || title) && (
        <TitleField id={`${idSchema.$id}-title`} title={title} required={required} uiSchema={uiSchema} />
      )}
      {description && <DescriptionField id={`${idSchema.$id}-description`} description={description} />}
      {properties.map((element: any, index: number) => (
        <div key={index}>{element.content}</div>
      ))}
    </>
  );
};

export default ObjectFieldTemplate;
