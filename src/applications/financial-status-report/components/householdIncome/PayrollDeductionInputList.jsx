import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';
import { isValidCurrency } from '../../utils/validations';

const PayrollDeductionInputList = props => {
  const { goToPath, goBack, onReviewPage = false, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'veteran';

  const index = isEditing ? Number(editIndex) : 0;

  const formData = useSelector(state => state.form.data);

  const {
    personalData: {
      employmentHistory: {
        newRecord = {},
        veteran: { employmentRecords = [] },
      },
    },
  } = formData;

  const employmentRecord = isEditing ? employmentRecords[index] : newRecord;

  const { employerName, deductions } = employmentRecord;

  const [selectedDeductions, setSelectedDeductions] = useState(deductions);

  const [errors, setErrors] = useState([]);

  const mapDeductions = target => {
    return selectedDeductions.map(deduction => {
      if (deduction.name === target.name) {
        return {
          ...deduction,
          amount: target.value,
        };
      }
      return deduction;
    });
  };

  const onChange = event => {
    const { target } = event;
    const updatedDeductions = mapDeductions(target);
    setSelectedDeductions(updatedDeductions);
    if (!isValidCurrency(target.value)) {
      setErrors([...errors, target.name]);
    } else {
      setErrors(errors.filter(error => error !== target.name));
    }
  };

  const updateFormData = e => {
    e.preventDefault();

    const errorList = selectedDeductions
      .filter(item => !isValidCurrency(item.amount))
      .map(item => item.name);

    setErrors(errorList);

    if (errorList.length) return;

    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = formData.personalData.employmentHistory.veteran.employmentRecords.map(
        (item, arrayIndex) => {
          return arrayIndex === index
            ? {
                ...employmentRecord,
                deductions: selectedDeductions,
              }
            : item;
        },
      );
      // update form data
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: updatedRecords,
            },
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            newRecord: { ...BASE_EMPLOYMENT_RECORD },
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: [
                { ...employmentRecord, deductions: selectedDeductions },
                ...employmentRecords,
              ],
            },
          },
        },
      });
    }
    goToPath(`/employment-history`);
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your job at {employerName}</h3>
        </legend>
        <p>How much do you pay monthly for each of your payroll deductions?</p>
        {selectedDeductions?.map((deduction, key) => (
          <div
            key={deduction.name + key}
            className="input-size-3 vads-u-margin-y--2"
          >
            <va-number-input
              label={deduction.name}
              name={deduction.name}
              value={deduction.amount}
              id={deduction.name + key}
              inputmode="decimal"
              onInput={onChange}
              required
              currency
              error={
                errors.includes(deduction.name)
                  ? 'Enter a valid dollar amount.'
                  : null
              }
            />
          </div>
        ))}
      </fieldset>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PayrollDeductionInputList);

PayrollDeductionInputList.propTypes = {
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
};
