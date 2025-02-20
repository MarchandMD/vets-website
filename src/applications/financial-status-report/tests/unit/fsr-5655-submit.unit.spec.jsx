import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import maximal from './cfsr-unit-maximal.json';

import submitForm, { buildEventData } from '../../config/submitForm';

const debtOnly = {
  'view:enhancedFinancialStatusReport': false,
  selectedDebtsAndCopays: [{ debtType: 'DEBT' }],
};
const copayOnly = {
  'view:enhancedFinancialStatusReport': false,
  selectedDebtsAndCopays: [{ debtType: 'COPAY' }],
};
const combined = {
  'view:enhancedFinancialStatusReport': false,
  selectedDebtsAndCopays: [{ debtType: 'COPAY' }, { debtType: 'DEBT' }],
};

describe('Submit event data', () => {
  it('should build submit event data', () => {
    expect(buildEventData(debtOnly)).to.deep.equal({
      'enhanced-submission': false,
      'submission-type': 'debt-submission',
    });
    expect(buildEventData(copayOnly)).to.deep.equal({
      'enhanced-submission': false,
      'submission-type': 'copay-submission',
    });
    expect(buildEventData(combined)).to.deep.equal({
      'enhanced-submission': false,
      'submission-type': 'combo-submission',
    });
  });
});

describe('submitForm', () => {
  let xhr;
  let requests;

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = createdXhr => requests.push(createdXhr);
  });

  afterEach(() => {
    global.XMLHttpRequest = window.XMLHttpRequest;
    xhr.restore();
  });

  it('should submit at endpioint', done => {
    submitForm(maximal, formConfig);
    expect(requests[0].url).to.contain('/v0/financial_status_reports');
    done();
  });
});
