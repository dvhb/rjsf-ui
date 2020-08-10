/* tslint:disable:max-file-line-count */
/* eslint-disable */
// @ts-nocheck

import React, { Component, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FieldProps } from '@rjsf/core';
import { deepEquals, getDefaultFormState } from '@rjsf/core/lib/utils';
import { useComponents } from '@dvhb/ui';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';

class CollapseMenuAction extends Component {
  render() {
    const { action, allActions = {} } = this.props;
    if (!action) {
      return null;
    }
    if (typeof action === 'string') {
      return <div>{action}</div>;
    }
    if (typeof action === 'object') {
      const Component = allActions[action.component];
      if (!Component) {
        console.error(`Can't find ${action.component} in formContext.allActions`);
        return (
          <h2 className="warning bg-error" style={{ color: 'red' }}>
            Can't find <b>{action.component}</b> in <b>formContext</b>.<b>allActions</b>
          </h2>
        );
      }
      return <Component {...action.props} />;
    }
  }
}

function CollapseMenuBase(props) {
  const { CollapseMenu } = useComponents();
  const {
    uiSchema: {
      collapse: {
        icon: { add = 'glyphicon glyphicon-plus-sign' } = {},
        separate = false,
        addTo,
        wrapClassName = 'lead',
        actions = [],
        classNames = 'collapsibleHeading',
        collapseDivStyles: {
          background = '',
          addGlyphColor = 'white',
          padding = '',
          margin = '',
          marginLeft = '',
          marginBottom = '',
          zIndex = 0,
          divCursor = 'pointer',
          addCursor = 'copy',
        } = {},
      },
    },
    formContext = {},
    onChange,
    onAdd,
    title,
    name,
    collapsed,
  } = props;

  const handleAdd = useCallback(event => {
    event.stopPropagation();
    onAdd(event);
  }, []);

  if (!CollapseMenu) return null;

  return (
    <div className={`${wrapClassName}`}>
      <div
        className={classNames}
        onClick={onChange}
        style={{
          padding,
          margin,
          marginLeft,
          marginBottom,
          zIndex,
          background,
          cursor: divCursor,
        }}
      >
        <CollapseMenu title={title || name} collapsed={collapsed}>
          {addTo && (
            <a onClick={handleAdd} style={{ color: addGlyphColor, cursor: addCursor }}>
              <i style={{ cursor: addCursor }} className={add} />
            </a>
          )}
          {actions.map((action, i) => (
            <CollapseMenuAction key={i} action={action} allActions={formContext.allActions} />
          ))}
        </CollapseMenu>
      </div>
      {separate && <hr />}
    </div>
  );
}

class CollapseLegend extends Component {
  render() {
    const {
      uiSchema: {
        collapse: { legend },
      },
      formContext: { legends = {} } = {},
    } = this.props;
    if (!legend) {
      return null;
    }
    if (typeof legend === 'string') {
      return <div>{legend}</div>;
    }
    if (typeof legend === 'object') {
      const Component = legends[legend.component];
      if (!Component) {
        console.error(`Can't find ${legend.components} in formContext.legends`);
        return (
          <h2 className="warning bg-error" style={{ color: 'red' }}>
            Can't find <b>{legend.component}</b> in <b>formContext</b>.<b>legends</b>
          </h2>
        );
      }
      return <Component {...legend.props} />;
    }
    return <div>I'm a legend</div>;
  }
}

const detectDefaultValue = (formData: any, schema: any): boolean => {
  if (!formData) {
    return false;
  }
  if (isArray(formData)) {
    return !isEmpty(formData);
  }
  if (isObject(formData)) {
    const empty = Object.entries(formData).every(([key, value]) => {
      if (isObject(value)) {
        return isEmpty(value) || !value.value;
      }
      return !schema.properties[key].default || value === schema.properties[key].default;
    });

    return !empty;
  }

  return false;
};

class CollapsibleField extends Component<FieldProps> {
  constructor(props) {
    super(props);

    const {
      uiSchema: { collapse: { collapsed = true, collapsedIfDefaultValue = true } = {} },
    } = props;

    const hasDefaultValue = detectDefaultValue(props.formData, props.schema);

    this.state = { collapsed: hasDefaultValue ? collapsedIfDefaultValue : collapsed };
  }

  appendToArray = (formData = [], newVal) => {
    const {
      uiSchema: { collapse: { addToBottom = true } = {} },
    } = this.props;
    if (formData.some(v => deepEquals(v, newVal))) {
      return formData;
    }
    // newVal can be either array or a single element, concat flattens value
    if (addToBottom) {
      return formData.concat(newVal);
    }
    return [newVal].concat(formData);
  };

  doAdd = (field, formData, newVal) => {
    if (field === 'self') {
      this.props.onChange(this.appendToArray(formData, newVal));
    } else {
      const fieldVal = this.appendToArray(formData[field], newVal);
      const change = Object.assign({}, formData, { [field]: fieldVal });
      this.props.onChange(change);
    }
  };

  handleAdd = () => {
    this.setState({ collapsed: false });
    this.forceUpdate(() => {
      const {
        schema,
        uiSchema,
        formData,
        registry: { fields },
      } = this.props;
      const {
        collapse: { addTo, addElement },
      } = uiSchema;

      const fieldSchema =
        addTo === 'self'
          ? schema.items
          : schema.properties
          ? schema.properties[addTo]
            ? schema.properties[addTo].items
            : null
          : null;
      if (!fieldSchema) {
        return false;
      }
      const fieldUiSchema = addTo === 'self' ? uiSchema : uiSchema[addTo];

      if (addElement) {
        if (typeof addElement === 'function') {
          const onSubmit = newVal => {
            this.setState({ AddElement: undefined });
            this.doAdd(addTo, formData, newVal);
          };
          const AddElement = addElement(fieldSchema, fieldUiSchema, onSubmit);
          this.setState({ AddElement });
        } else {
          const FieldElement = fields[addElement];
          const onBlur = newVal => {
            this.setState({ AddElement: undefined });
            this.doAdd(addTo, formData, newVal);
          };
          const AddElement = () => (
            <FieldElement
              schema={fieldSchema}
              uiSchema={fieldUiSchema}
              onChange={
                // tslint:disable-next-line:jsx-no-lambda
                formData => {
                  onBlur(formData);
                }
              }
            />
          );
          this.setState({ AddElement });
        }
      } else {
        const newVal = getDefaultFormState(fieldSchema, {});
        this.doAdd(addTo, formData, newVal);
      }
    });
  };

  handleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    let {
      schema: { title },
    } = this.props;
    const {
      uiSchema,
      registry: { fields },
      idSchema: { $id } = {},
      name,
      formContext,
    } = this.props;
    const { collapsed, AddElement } = this.state;
    const {
      collapse: { field },
    } = uiSchema;

    const CollapseElement = fields[field];
    // uischema retains the value form the state
    uiSchema.collapse.collapsed = this.state.collapsed;

    title = uiSchema['ui:titleCollapse'] ? uiSchema['ui:titleCollapse'] : title ? title : name;
    const customizedId = collapsed ? $id : undefined;
    return (
      <div id={customizedId} data-cy={customizedId}>
        <CollapseMenuBase
          title={title}
          uiSchema={uiSchema}
          collapsed={collapsed}
          formContext={formContext}
          onAdd={this.handleAdd}
          onChange={this.handleCollapsed}
        />
        <div className="form-group">
          {AddElement && <AddElement />}
          {!collapsed && <CollapseLegend {...this.props} />}
          {!collapsed && <CollapseElement {...this.props} />}
        </div>
      </div>
    );
  }
}

CollapsibleField.propTypes = {
  uiSchema: PropTypes.shape({
    collapse: PropTypes.shape({
      field: PropTypes.string.isRequired,
      icon: PropTypes.shape({
        enabled: PropTypes.string,
        disabled: PropTypes.string,
        add: PropTypes.string,
      }),
      separate: PropTypes.boolean,
      addTo: PropTypes.string,
      addElement: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      legend: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          component: PropTypes.string.isRequired,
          props: PropTypes.object,
        }),
      ]),
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          component: PropTypes.string.isRequired,
          props: PropTypes.object,
        }),
      ),
      wrapClassName: PropTypes.string,
    }).isRequired,
  }).isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }).isRequired,
};

export default CollapsibleField;
