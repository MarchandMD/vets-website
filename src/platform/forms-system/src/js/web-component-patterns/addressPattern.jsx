/**
 * Web component version of address
 */
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import utilsOmit from 'platform/utilities/data/omit';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';
import VaSelectField from '../web-component-fields/VaSelectField';
import VaCheckboxField from '../web-component-fields/VaCheckboxField';

/**
 * PATTERNS
 * STREET_PATTERN - rejects white space only
 * US_POSTAL_CODE_PATTERN - Matches 5 digit zipcodes
 */
export const STREET_PATTERN = '^.*\\S.*';
export const US_POSTAL_CODE_PATTERN = '^\\d{5}$';

export const MILITARY_CITY_VALUES = constants.militaryCities.map(
  city => city.value,
);
export const MILITARY_CITY_NAMES = constants.militaryCities.map(
  city => city.label,
);

export const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);
export const MILITARY_STATE_NAMES = constants.militaryStates.map(
  state => state.label,
);

export const COUNTRY_VALUES = constants.countries.map(country => country.value);
export const COUNTRY_NAMES = constants.countries.map(country => country.label);

// filtered States that include US territories
export const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

export const STATE_VALUES = filteredStates.map(state => state.value);
export const STATE_NAMES = filteredStates.map(state => state.label);

export const schemaCrossXRef = {
  isMilitary: 'isMilitary',
  'view:militaryBaseDescription': 'view:militaryBaseDescription',
  country: 'country',
  street: 'street',
  street2: 'street2',
  street3: 'street3',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
};

/**
 * CONSTANTS:
 * 2. USA - references USA value and label
 * 3. MilitaryBaseInfo - React component. Wrapped in AdditionalInfo component and used as description
 */

const USA = {
  value: 'USA',
  label: 'United States',
};

const MilitaryBaseInfo = () => (
  <div className="vads-u-padding-x--2p5">
    <va-additional-info trigger="Learn more about military base addresses">
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </va-additional-info>
  </div>
);

/**
 * insertArrayIndex - Used when addresses are nested in an array and need to be accessible.
 * There's no good way to handle pathing to a schema when it lives in an array with multiple entries.
 * Example: childrenToAdd[INDEX].childAddressInfo.address. Hardcoding an index value in place of INDEX
 * would just result in the same array entry being mutated over and over, instead of the correct entry.
 */
// TODO:
// const insertArrayIndex = (key, index) => key.replace('[INDEX]', `[${index}]`);

const getOldFormDataPath = (path, index) => {
  const indexToSlice = index !== null ? path.indexOf(index) + 1 : 0;
  return path.slice(indexToSlice);
};

// Temporary storage for city & state if military base checkbox is toggled more
// than once. Not ideal, but works since this code isn't inside a React widget
const savedAddress = {
  city: '',
  stateCode: '',
};

/**
 * Update form data to remove selected military city & state and restore any
 * previously set city & state when the "I live on a U.S. military base"
 * checkbox is unchecked. See va.gov-team/issues/42216 for details
 * @param {object} oldFormData - Form data prior to interaction change
 * @param {object} formData - Form data after interaction change
 * @param {array} path - path to address in form data
 * @param {number} index - index, if form data array of addresses; also included
 *  in the path, but added here to make it easier to distinguish between
 *  addresses not in an array with addresses inside an array
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormDataAddress = (
  oldFormData,
  formData,
  path,
  index = null, // this is included in the path, but added as
  newSchemaKeys = {},
) => {
  let updatedData = formData;
  const schemaKeys = { ...schemaCrossXRef, ...newSchemaKeys };

  /*
   * formData and oldFormData are not guaranteed to have the same shape; formData
   * will always return the entire data object. See below for details on oldFormData
   *
   * In the src/platform/forms-system/src/js/containers/FormPage.jsx, if the
   * address is inside an array (has a `showPagePerItem` index), oldData is set
   * to the form data from the array index (see the this.formData() function)
   * but that may not include the address object, so we're passing in a path as
   * an array and using `getOldFormDataPath` to find the appropriate path
   */
  const oldAddress = get(getOldFormDataPath(path, index), oldFormData, {});

  const address = get(path, formData, {});
  const onMilitaryBase = address?.[schemaKeys.isMilitary];
  let city = address[schemaKeys.city];
  let stateCode = address[schemaKeys.state];

  if (oldAddress?.[schemaKeys.isMilitary] !== onMilitaryBase) {
    if (onMilitaryBase) {
      savedAddress.city = oldAddress[schemaKeys.city] || '';
      savedAddress.stateCode = oldAddress[schemaKeys.state] || '';
      city = '';
      stateCode = '';
    } else {
      city = MILITARY_CITY_VALUES.includes(oldAddress[schemaKeys.city])
        ? savedAddress.city
        : city || savedAddress.city;
      stateCode = MILITARY_STATE_VALUES.includes(oldAddress[schemaKeys.state])
        ? savedAddress.stateCode
        : stateCode || savedAddress.stateCode;
    }
    // make sure we aren't splitting up a string path
    const pathArray = Array.isArray(path) ? path : [path];
    updatedData = set([...pathArray, schemaKeys.city], city, updatedData);
    updatedData = set([...pathArray, schemaKeys.state], stateCode, updatedData);
  }
  return updatedData;
};

/**
 * @typedef {'country' | 'city' | 'isMilitary' | 'postalCode' | 'state' | 'street' | 'street2' | 'street3' } AddressSchemaKey
 */

/**
 * Web component uiSchema for address
 *
 * ```js
 * schema: {
 *   address: addressUI()
 *   simpleAddress: addressUI({ omit: ['street2', 'street3'] })
 *   futureAddress: addressUI({ militaryCheckboxLabel: 'I will live on a United States military base outside of the U.S.'; })
 *   changeRequired: addressUI({
 *     required: {
 *       country: (formData) => false,
 *       street2: (formData) => true
 *     }
 *   })
 * }
 * ```
 * @param {{
 *   militaryCheckboxLabel?: string,
 *   omit?: Array<AddressSchemaKey>,
 *   required?: Record<AddressSchemaKey, (formData:any) => boolean>
 * }} [options]
 * @returns {UISchemaOptions}
 */
export function addressUI(options) {
  let cachedPath;
  const omit = key => options?.omit?.includes(key);
  const customRequired = key => options?.required?.[key];

  /** @type {UISchemaOptions} */
  const uiSchema = {};

  if (!omit('isMilitary')) {
    uiSchema.isMilitary = {
      'ui:title':
        options?.militaryCheckboxLabel ??
        'I live on a United States military base outside of the U.S.',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        hideEmptyValueInReview: true,
      },
      'ui:required': customRequired('isMilitary') || (() => false),
    };
  }

  if (!omit('isMilitary') && !omit('view:militaryBaseDescription')) {
    uiSchema['view:militaryBaseDescription'] = {
      'ui:description': MilitaryBaseInfo,
    };
  }

  if (!omit('country')) {
    uiSchema.country = {
      'ui:required': formData => {
        if (customRequired('country')) {
          return customRequired('country')(formData);
        }
        if (cachedPath) {
          const { isMilitary } = get(cachedPath, formData) ?? {};
          return !isMilitary;
        }
        return true;
      },
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'Country is required',
      },
      'ui:options': {
        /**
         * This is needed because the country dropdown needs to be set to USA and disabled if a
         * user selects that they live on a military base outside the US.
         */
        updateSchema: (formData, schema, _uiSchema, index, path) => {
          const addressPath = [...path].shift(); // path is ['address', 'currentField']
          cachedPath = addressPath;
          const countryUI = _uiSchema;
          const addressFormData = get(addressPath, formData) ?? {};
          const { isMilitary } = addressFormData;
          // 'inert' is the preferred solution for now
          // instead of disabled via DST guidance
          if (isMilitary) {
            countryUI['ui:options'].inert = true;
            addressFormData.country = USA.value;
            return {
              enum: [USA.value],
              enumNames: [USA.label],
              default: USA.value,
            };
          }
          countryUI['ui:options'].inert = false;
          return {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          };
        },
      },
    };
  }

  if (!omit('street')) {
    uiSchema.street = {
      'ui:required': customRequired('street') || (() => true),
      'ui:title': 'Street address',
      'ui:autocomplete': 'address-line1',
      'ui:errorMessages': {
        required: 'Street address is required',
        pattern: 'Please fill in a valid street address',
      },
      'ui:webComponentField': VaTextInputField,
    };
  }

  if (!omit('street2')) {
    uiSchema.street2 = {
      'ui:title': 'Street address line 2',
      'ui:autocomplete': 'address-line2',
      'ui:required': customRequired('street2') || (() => false),
      'ui:options': {
        hideEmptyValueInReview: true,
      },
      'ui:webComponentField': VaTextInputField,
    };
  }

  if (!omit('street3')) {
    uiSchema.street3 = {
      'ui:title': 'Street address line 3',
      'ui:autocomplete': 'address-line3',
      'ui:required': customRequired('street3') || (() => false),
      'ui:options': {
        hideEmptyValueInReview: true,
      },
      'ui:webComponentField': VaTextInputField,
    };
  }

  if (!omit('city')) {
    uiSchema.city = {
      'ui:required': customRequired('city') || (() => true),
      'ui:autocomplete': 'address-level2',
      'ui:errorMessages': {
        required: 'City is required',
      },
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        /**
         * replaceSchema:
         * Necessary because military addresses require strict options.
         * If the isMilitary checkbox is selected, replace the city schema with a
         * select dropdown containing the values for military cities. Otherwise,
         * just return the regular string schema.
         */
        replaceSchema: (formData, schema, _uiSchema, index, path) => {
          const addressPath = path.shift(); // path is ['address', 'currentField']
          cachedPath = addressPath;
          const ui = _uiSchema;
          const addressFormData = get(addressPath, formData) ?? {};
          const { isMilitary } = addressFormData;
          if (isMilitary) {
            ui['ui:webComponentField'] = VaSelectField;
            return {
              type: 'string',
              title: 'APO/FPO/DPO',
              enum: MILITARY_CITY_VALUES,
              enumNames: MILITARY_CITY_NAMES,
            };
          }
          ui['ui:webComponentField'] = VaTextInputField;
          return {
            type: 'string',
            title: 'City',
            maxLength: 100,
            pattern: STREET_PATTERN,
          };
        },
      },
    };
  }

  if (!omit('state')) {
    uiSchema.state = {
      'ui:autocomplete': 'address-level1',
      'ui:required': formData => {
        if (customRequired('state')) {
          return customRequired('state')(formData);
        }
        if (cachedPath) {
          const { country } = get(cachedPath, formData) ?? {};
          return country && country === USA.value;
        }

        return false;
      },
      'ui:errorMessages': {
        required: 'Please enter a valid State, Province, or Region',
      },
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hideEmptyValueInReview: true,
        /**
         * replaceSchema:
         * Necessary because military addresses require strict options.
         * If the isMilitary checkbox is selected, replace the state schema with a
         * select dropdown containing the values for military states.
         *
         * If the country value is USA and the military base checkbox is de-selected,
         * use the States dropdown.
         *
         * If the country value is anything other than USA, change the title and default to string.
         */
        replaceSchema: (formData, _schema, _uiSchema, index, path) => {
          const addressPath = path.shift(); // path is ['address', 'currentField']
          cachedPath = addressPath;
          const data = get(addressPath, formData) ?? {};
          const { country } = data;
          const { isMilitary } = data;
          const ui = _uiSchema;
          if (isMilitary) {
            ui['ui:webComponentField'] = VaSelectField;
            return {
              type: 'string',
              title: 'State',
              enum: MILITARY_STATE_VALUES,
              enumNames: MILITARY_STATE_NAMES,
            };
          }
          if (!isMilitary && country === 'USA') {
            ui['ui:webComponentField'] = VaSelectField;
            return {
              type: 'string',
              title: 'State',
              enum: STATE_VALUES,
              enumNames: STATE_NAMES,
            };
          }
          ui['ui:webComponentField'] = VaTextInputField;
          return {
            type: 'string',
            title: 'State/Province/Region',
          };
        },
      },
    };
  }

  if (!omit('postalCode')) {
    uiSchema.postalCode = {
      'ui:required': customRequired('postalCode') || (() => true),
      'ui:title': 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:errorMessages': {
        required: 'Postal code is required',
        pattern: 'Please enter a valid 5 digit US zip code',
      },

      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        replaceSchema: (formData, _schema, _uiSchema, index, path) => {
          const addressPath = path.shift(); // path is ['address', 'currentField']
          cachedPath = addressPath;
          const data = get(addressPath, formData) ?? {};
          const { country } = data;
          const { isMilitary } = data;
          if (isMilitary || country === 'USA') {
            return {
              type: 'string',
              pattern: US_POSTAL_CODE_PATTERN,
            };
          }
          return {
            type: 'string',
          };
        },
      },
    };
  }

  return uiSchema;
}

/**
 * Web component schema for address
 *
 * ```js
 * schema: {
 *   address: addressSchema()
 *   simpleAddress: addressSchema({ omit: ['street2', 'street3'] })
 * }
 * ```
 * @param {{
 *  omit: string[]
 * }} [options]
 * @returns {SchemaOptions}
 */
export const addressSchema = options => {
  let schema = commonDefinitions.profileAddress;

  if (options?.omit) {
    schema = {
      ...schema,
      properties: {
        ...utilsOmit(options.omit, schema.properties),
      },
    };
  }

  return schema;
};
