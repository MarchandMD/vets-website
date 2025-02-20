import React from 'react';
import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleSchema,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:arrayTitle': titleUI('Array Field Title', 'Array Description'),
    exampleArrayOne: {
      'ui:options': {
        itemName: 'Facility',
        viewField: ({ formData }) => (
          <div className="vads-u-padding--2">
            <strong>{formData.facilityName}</strong>
            <p>
              Duration: {formData.from} &mdash; {formData.from}
            </p>
          </div>
        ),
        customTitle: ' ',
        useDlWrap: true,
        keepInPageOnReview: true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        facilityName: {
          'ui:title': 'Name of facility',
          'ui:webComponentField': VaTextInputField,
        },
        from: currentOrPastDateUI('Start date'),
        to: currentOrPastDateUI('End date'),
      },
    },
    exampleArrayTwo: {
      'ui:options': {
        itemName: 'Record',
        viewField: ({ formData }) => (
          <div className="vads-u-padding--2">
            <strong>{formData.name}</strong>
          </div>
        ),
        customTitle: ' ',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'This is a custom are you sure you want to remove this item?',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        name: {
          'ui:title': 'Text input',
          'ui:webComponentField': VaTextInputField,
        },
        proof: yesNoUI('Do you have proof?'),
        checkbox: {
          'ui:title': 'This is a checkbox',
          'ui:description': 'This is a checkbox with a description',
          'ui:webComponentField': VaCheckboxField,
          'ui:errorMessages': {
            enum: 'Please select a checkbox',
            required: 'Checkbox required error',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:arrayTitle': titleSchema,
      exampleArrayOne: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            facilityName: {
              type: 'string',
              maxLength: 100,
            },
            from: currentOrPastDateSchema,
            to: currentOrPastDateSchema,
          },
          required: ['facilityName', 'from'],
        },
      },
      exampleArrayTwo: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 100,
            },
            proof: yesNoSchema,
            checkbox: {
              type: 'boolean',
              enum: [true],
            },
          },
          required: ['name', 'proof'],
        },
      },
    },
  },
};
