import React from 'react';

import { ArrayFieldTemplateProps, IdSchema } from '@rjsf/core';
// @ts-ignore
import { getUiOptions, isMultiSelect } from '@rjsf/core/lib/utils';
import { useComponents } from '@dvhb/ui';
import AddButton from '../AddButton/AddButton';

import IconButton from '../IconButton/IconButton';

const { getDefaultRegistry } = require('@rjsf/core/lib/utils');

const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { schema, registry = getDefaultRegistry() } = props;

  return isMultiSelect(schema, registry.definitions) ? (
    <DefaultFixedArrayFieldTemplate {...props} />
  ) : (
    <DefaultNormalArrayFieldTemplate {...props} />
  );
};

type ArrayFieldTitleProps = {
  TitleField: any;
  idSchema: IdSchema;
  title: string;
  required: boolean;
};

const ArrayFieldTitle = ({ TitleField, idSchema, title, required }: ArrayFieldTitleProps) => {
  if (!title) {
    return <div />;
  }

  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title} required={required} />;
};

type ArrayFieldDescriptionProps = {
  DescriptionField: any;
  idSchema: IdSchema;
  description: string;
};

const ArrayFieldDescription = ({ DescriptionField, idSchema, description }: ArrayFieldDescriptionProps) => {
  if (!description) {
    return <div />;
  }

  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
};

// Used in the two templates
const DefaultArrayItem = (props: any, itemsCount: number) => {
  const { Spacer, Aligner, Text, Button, Icon } = useComponents();
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
  };
  const itemOptions = props.children.props.uiSchema;

  const showLabel = itemOptions.countLabel && (!itemOptions.firstItemLabelDisabled || props.index > 0);
  return (
    <div key={props.index}>
      <Spacer>
        <Aligner>
          {showLabel && (
            <Text size="lg" weight="700">
              {itemOptions.countLabel.replace(`{${'index'}}`, props.index + 1)}
            </Text>
          )}
          {props.hasRemove && itemsCount > 1 && itemOptions.removeByCross && (
            <>
              <Spacer marginRight="xxs" />
              <Button
                type="asLink"
                onClick={props.onDropIndexClick(props.index)}
                disabled={props.disabled || props.readonly}
              >
                <Icon name="Cross" />
              </Button>
            </>
          )}
          {props.hasToolbar && (
            <Aligner.Right>
              {(props.hasMoveUp || props.hasMoveDown) && (
                <IconButton
                  icon="arrow-up"
                  className="array-item-move-up"
                  tabIndex={-1}
                  style={btnStyle as any}
                  disabled={props.disabled || props.readonly || !props.hasMoveUp}
                  onClick={props.onReorderClick(props.index, props.index - 1)}
                />
              )}

              {(props.hasMoveUp || props.hasMoveDown) && (
                <IconButton
                  icon="arrow-down"
                  tabIndex={-1}
                  style={btnStyle as any}
                  disabled={props.disabled || props.readonly || !props.hasMoveDown}
                  onClick={props.onReorderClick(props.index, props.index + 1)}
                />
              )}
              {props.hasRemove && itemsCount > 1 && !itemOptions.removeByCross && (
                <Button
                  type="asLink"
                  onClick={props.onDropIndexClick(props.index)}
                  disabled={props.disabled || props.readonly}
                >
                  <Spacer margin="none" marginRight="xs">
                    <Icon name="Minus" />
                  </Spacer>
                  {itemOptions.removeButtonLabel || 'Удалить'}
                </Button>
              )}
            </Aligner.Right>
          )}
        </Aligner>
      </Spacer>

      {props.children}
    </div>
  );
};

const DefaultFixedArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const titleHidden = props.uiSchema?.['ui:titleHidden'] ?? false;

  return (
    <fieldset className={props.className}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={!titleHidden ? props.uiSchema['ui:title'] || props.title : ''}
        required={props.required}
      />

      {(props.uiSchema['ui:description'] || props.schema.description) && (
        <div className="field-description" key={`field-description-${props.idSchema.$id}`}>
          {props.uiSchema['ui:description'] || props.schema.description}
        </div>
      )}

      <div className="row array-item-list" key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map(p => DefaultArrayItem(p, props.items.length))}
      </div>

      {props.canAdd && (
        <AddButton
          className="array-item-add"
          onClick={props.onAddClick}
          disabled={props.disabled || props.readonly}
          label={props.uiSchema.buttonLabel}
          data-cy={`${props.idSchema.$id}-add`}
        />
      )}
    </fieldset>
  );
};

const DefaultNormalArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { Field, Aligner, Spacer, Button, Icon, Hint, Text } = useComponents();

  const { errorText, title, description, addButtonLabel = 'Add', addButtonHelp, titleHidden = false } = getUiOptions(
    props.uiSchema,
  ) as any;

  return (
    <div>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={!titleHidden ? title || props.title : ''}
        required={props.required}
      />

      {(description || props.schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${props.idSchema.$id}`}
          DescriptionField={props.DescriptionField}
          idSchema={props.idSchema}
          description={description || props.schema.description}
        />
      )}

      <div key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map(p => DefaultArrayItem(p, props.items.length))}

        {props.canAdd ? (
          <Field>
            <Aligner>
              <Spacer margin="none" marginRight="xs">
                <Button
                  type="asLink"
                  onClick={props.onAddClick}
                  disabled={props.disabled || props.readonly}
                  data-cy={`${props.idSchema.$id}-add`}
                >
                  <Spacer margin="none" marginRight="xs">
                    <Icon name="Plus" />
                  </Spacer>
                  {addButtonLabel}
                </Button>
              </Spacer>
              {addButtonHelp && <Hint text={addButtonHelp} />}
            </Aligner>
          </Field>
        ) : (
          errorText?.maxItems && (
            <Text color="errorColor" size="sm">
              {errorText.maxItems}
            </Text>
          )
        )}
      </div>
    </div>
  );
};

export default ArrayFieldTemplate;
