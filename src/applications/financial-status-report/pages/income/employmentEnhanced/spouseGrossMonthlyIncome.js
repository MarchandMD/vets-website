import React from 'react';
import SpouseGrossMonthlyIncomeInput from '../../../components/householdIncome/SpouseGrossMonthlyIncomeInput';

export const uiSchema = {
  grossMonthlyIncome: {
    'ui:title':
      'What’s your spouse’s gross <strong>monthly</strong> income at this job?',
    'ui:description': (
      <p className="formfield-subtitle">
        You’ll find this in your pay stub. It’s the amount of your pay before
        taxes and deductions.
      </p>
    ),
    'ui:widget': SpouseGrossMonthlyIncomeInput,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    grossMonthlyIncome: {
      type: 'number',
    },
  },
};
