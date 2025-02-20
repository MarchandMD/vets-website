/*
 * Email uiSchema
 *
 * @param {string} title - The field label, defaults to "Email address"
 */
export default function uiSchema(title = 'Email address') {
  return {
    'ui:title': title,
    'ui:errorMessages': {
      pattern:
        'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
      required: 'Please enter an email address',
    },
    'ui:autocomplete': 'email',
    'ui:options': {
      inputType: 'email',
    },
  };
}
