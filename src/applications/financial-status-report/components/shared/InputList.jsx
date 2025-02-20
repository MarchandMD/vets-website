import React from 'react';
import PropTypes from 'prop-types';

const InputList = ({
  errorList,
  inputs,
  prompt = '',
  submitted,
  title = '',
  onChange,
}) => {
  return (
    <fieldset className="vads-u-margin-y--2">
      {title && (
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">{title}</h3>
        </legend>
      )}
      {prompt && <p>{prompt}</p>}
      {inputs?.map((input, key) => (
        <div key={input.name + key}>
          <va-number-input
            error={
              submitted && errorList.includes(input.name)
                ? 'Enter valid dollar amount'
                : ''
            }
            id={input.name + key}
            inputmode="decimal"
            label={input.name}
            name={input.name}
            onInput={onChange}
            required
            value={input.amount}
            width="md"
            currency
          />
        </div>
      ))}
    </fieldset>
  );
};

InputList.propTypes = {
  errorList: PropTypes.arrayOf(PropTypes.string),
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.string,
      id: PropTypes.string,
    }),
  ),
  prompt: PropTypes.string,
  submitted: PropTypes.bool,
  title: PropTypes.string,
  onChange: PropTypes.func,
};

export default InputList;
