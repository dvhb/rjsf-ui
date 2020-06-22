// tslint:disable
// @ts-nocheck
import React from 'react';
import ObjectField from 'react-jsonschema-form/lib/components/fields/ObjectField';
import { orderProperties, retrieveSchema } from 'react-jsonschema-form/lib/utils';
import { FieldProps } from 'react-jsonschema-form';
import { ComponentsContext } from '@dvhb/ui';

import { GridRowDescription } from '../GridRowDescription';

/**
 * based on https://github.com/audibene-labs/react-jsonschema-form-layout
 * demo https://audibene-labs.github.io/react-jsonschema-form-layout/demo/dist/index.html
 */
export default class GridField extends ObjectField<FieldProps> {
  static contextType = ComponentsContext;
  constructor(props) {
    super(props);
    injectPrevPropsToRender(this);
  }

  render(prevProps: FieldProps) {
    const { Row, Col } = this.context;
    const {
      uiSchema,
      errorSchema,
      idSchema,
      required,
      disabled: disabledRaw,
      readonly,
      onBlur,
      formData,
      name,
    } = this.props;
    const { formData: prevFormData } = prevProps;
    const { definitions, fields, formContext } = this.props.registry;
    const { formContext: prevFormContext } = prevProps.registry;
    const { SchemaField, TitleField, DescriptionField } = fields;
    const schema = retrieveSchema(this.props.schema, definitions);
    const titleHidden = uiSchema?.['ui:titleHidden'] ?? false;
    const title = !titleHidden ? uiSchema['ui:title'] || schema.title : '';
    const grid = uiSchema['ui:grid'];

    return (
      <>
        {title && schema.properties ? (
          <TitleField id={`${idSchema.$id}__title`} title={title} required={required} uiSchema={uiSchema} />
        ) : null}
        {schema.description ? (
          <DescriptionField
            id={`${idSchema.$id}__description`}
            description={schema.description}
            formContext={formContext}
          />
        ) : null}
        {grid.map((row: any, index: number) => {
          const properties = Object.keys(row).filter(p => !p.startsWith('ui:'));
          const orderedProperties = orderProperties(properties, row['ui:order']);
          const data = formContext[name] || formData;
          const prevData = prevFormContext[name] || prevFormData;

          return (
            <Row key={index}>
              {orderedProperties.map((name, index) => {
                const {
                  doShow,
                  dependsOnFilled,
                  dependsOnNotFilled,
                  dependsOnEmpty,
                  dependsOnSelected,
                  dependsOnSelectedValue,
                  disabledIfFilled,
                  disabledIfNotFilled,
                  disabledIfEmptySelected,
                  prefilledValueProp,
                  rerenderOnChanges,
                  rerenderDependencies,
                  rerenderProps,
                  ...rowProps
                } = row[name];

                let style = {};
                if (doShow && !doShow({ formData })) {
                  return null;
                }
                if (dependsOnFilled && (!data[dependsOnFilled] || data[dependsOnFilled].length === 0)) {
                  return null;
                }
                if (dependsOnNotFilled && data[dependsOnNotFilled]) {
                  return null;
                }
                if (dependsOnEmpty && data[dependsOnEmpty] !== 'empty') {
                  return null;
                }
                if (dependsOnSelected && dependsOnSelectedValue && data[dependsOnSelected] !== dependsOnSelectedValue) {
                  return null;
                }

                let disabled = disabledRaw;
                if (disabledIfEmptySelected && data[disabledIfEmptySelected] !== 'empty') {
                  disabled = true;
                }
                if (disabledIfFilled && data[disabledIfFilled]) {
                  disabled = true;
                }
                if (disabledIfNotFilled && (!data[disabledIfNotFilled] || data[disabledIfNotFilled].length === 0)) {
                  disabled = true;
                }

                if (!schema.properties) {
                  return null;
                }

                let rerenderKey = undefined;
                let clearData = false;
                if (rerenderOnChanges && rerenderDependencies) {
                  rerenderKey = rerenderDependencies
                    .map((rerenderDependency, index) => {
                      if (!data[rerenderDependency] || !prevData[rerenderDependency]) {
                        return '';
                      }
                      const rerenderProp = rerenderProps?.[index];

                      if (
                        rerenderProp &&
                        data[rerenderDependency][rerenderProp] !== prevData[rerenderDependency][rerenderProp]
                      ) {
                        return setTimeout(() => {
                          this.onPropertyChange(name)(undefined);
                          clearData = true;
                          return data[rerenderDependency][rerenderProp];
                        }, 0);
                      }
                      if (!rerenderProp && data[rerenderDependency] !== prevData[rerenderDependency]) {
                        return setTimeout(() => {
                          this.onPropertyChange(name)(undefined);
                          clearData = true;
                          return data[rerenderDependency];
                        }, 0);
                      }
                    })
                    .join('*');
                }

                const newFormData = clearData
                  ? undefined
                  : disabled && prefilledValueProp
                  ? data[disabledIfEmptySelected][prefilledValueProp]?.toString()
                  : formData[name];

                if (schema.properties[name]) {
                  return (
                    <Col {...rowProps} key={index} style={style}>
                      <SchemaField
                        key={`${name}-${rerenderKey}`}
                        name={name}
                        required={this.isRequired(name)}
                        schema={schema.properties[name]}
                        uiSchema={uiSchema[name]}
                        errorSchema={errorSchema[name]}
                        idSchema={idSchema[name]}
                        formData={newFormData}
                        onChange={this.onPropertyChange(name)}
                        onBlur={onBlur}
                        registry={this.props.registry}
                        disabled={disabled}
                        readonly={readonly}
                      />
                    </Col>
                  );
                } else {
                  const { render, ...rowProps } = row[name];
                  let UIComponent = () => null;

                  if (render) {
                    UIComponent = render;
                  }

                  return (
                    <Col {...rowProps} key={index} style={style}>
                      <UIComponent
                        name={name}
                        formData={formData}
                        errorSchema={errorSchema}
                        uiSchema={uiSchema}
                        schema={schema}
                        registry={this.props.registry}
                      />
                    </Col>
                  );
                }
              })}
              {row['ui:description'] && schema.properties && (
                <Col sm={12}>
                  <GridRowDescription content={row['ui:description']} />
                </Col>
              )}
            </Row>
          );
        })}
      </>
    );
  }
}

const injectPrevPropsToRender = inst => {
  const render = inst.render;
  let prevProps = inst.props;

  inst.componentWillUpdate = () => (prevProps = inst.props);
  inst.render = () => render.call(inst, prevProps);
};
