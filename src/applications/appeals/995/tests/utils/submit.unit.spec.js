import { expect } from 'chai';
import {
  PRIMARY_PHONE,
  SELECTED,
  EVIDENCE_VA,
  EVIDENCE_OTHER,
  EVIDENCE_PRIVATE,
} from '../../constants';
import { getDate } from '../../utils/dates';

import {
  removeEmptyEntries,
  getTimeZone,
  createIssueName,
  getContestedIssues,
  // addIncludedIssues,
  getAddress,
  getPhone,
  hasDuplicateLocation,
  getEvidence,
  hasDuplicateFacility,
  getForm4142,
} from '../../utils/submit';

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const validDate1 = getDate({ offset: { months: -2 } });
const issue1 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'tinnitus',
      description: 'both ears',
      approxDecisionDate: validDate1,
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
      ratingIssuePercentNumber: '10',
    },
  },
  result: {
    type: 'contestableIssue',
    attributes: {
      issue: 'tinnitus - 10% - both ears',
      decisionDate: validDate1,
      decisionIssueId: 1,
      ratingIssueReferenceId: '2',
      ratingDecisionReferenceId: '3',
    },
  },
};

const validDate2 = getDate({ offset: { months: -4 } });
const issue2 = {
  raw: {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'left knee',
      approxDecisionDate: validDate2,
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
  result: {
    type: 'contestableIssue',
    attributes: {
      issue: 'left knee - 0%',
      decisionDate: validDate2,
      decisionIssueId: 4,
      ratingIssueReferenceId: '5',
    },
  },
};

describe('createIssueName', () => {
  const getName = (name, description, percent) =>
    createIssueName({
      attributes: {
        ratingIssueSubjectText: name,
        ratingIssuePercentNumber: percent,
        description,
      },
    });

  it('should combine issue details into the name', () => {
    // contestable issues only
    expect(getName('test', 'foo', '10')).to.eq('test - 10% - foo');
    expect(getName('test', 'xyz', null)).to.eq('test - 0% - xyz');
    expect(getName('test')).to.eq('test - 0%');
  });
  it('should combine issue details and truncate extra long descriptions', () => {
    // contestable issues only
    expect(getName('test', text, '20')).to.eq(
      'test - 20% - Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Uten',
    );
  });
});

describe('getContestedIssues', () => {
  it('should return all issues', () => {
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: true },
        { ...issue2.raw, [SELECTED]: true },
      ],
    };
    expect(getContestedIssues(formData)).to.deep.equal([
      issue1.result,
      issue2.result,
    ]);
  });
  it('should return second issue', () => {
    const formData = {
      contestedIssues: [
        { ...issue1.raw, [SELECTED]: false },
        { ...issue2.raw, [SELECTED]: true },
      ],
    };
    expect(getContestedIssues(formData)).to.deep.equal([issue2.result]);
  });
  it('should return empty array', () => {
    expect(getContestedIssues()).to.deep.equal([]);
  });
});

describe('removeEmptyEntries', () => {
  it('should remove empty string items', () => {
    expect(removeEmptyEntries({ a: '', b: 1, c: 'x', d: '' })).to.deep.equal({
      b: 1,
      c: 'x',
    });
  });
  it('should not remove null or undefined items', () => {
    expect(removeEmptyEntries({ a: null, b: undefined, c: 3 })).to.deep.equal({
      a: null,
      b: undefined,
      c: 3,
    });
  });
});

describe('getAddress', () => {
  const wrap = obj => ({
    veteran: { address: obj },
  });
  it('should return a cleaned up address object', () => {
    // expect(getAddress({})).to.deep.equal({});
    // expect(getAddress(wrap({}))).to.deep.equal({});
    // expect(getAddress(wrap({ temp: 'test' }))).to.deep.equal({});
    // expect(getAddress(wrap({ addressLine1: 'test' }))).to.deep.equal({
    //   addressLine1: 'test',
    // });
    // expect(getAddress(wrap({ zipCode: '10101' }))).to.deep.equal({
    //   zipCode5: '10101',
    // });
    expect(
      getAddress(
        wrap({
          addressLine1: '123 test',
          addressLine2: 'c/o foo',
          addressLine3: 'suite 99',
          city: 'Big City',
          stateCode: 'NV',
          zipCode: '10101',
          countryCodeIso2: 'US',
          internationalPostalCode: '12345',
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '00000',
      countryCodeISO2: 'US',
      internationalPostalCode: '12345',
    });
    // expect(
    //   getAddress(wrap({ internationalPostalCode: '55555' })),
    // ).to.deep.equal({
    //   zipCode5: '00000',
    //   internationalPostalCode: '55555',
    // });
  });
  it('should truncate long address lines', () => {
    expect(getAddress(wrap({ addressLine1: text }))).to.deep.equal({
      addressLine1:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed',
    });
    expect(getAddress(wrap({ addressLine2: text }))).to.deep.equal({
      addressLine2: 'Lorem ipsum dolor sit amet, co',
    });
    expect(getAddress(wrap({ addressLine3: text }))).to.deep.equal({
      addressLine3: 'Lorem ipsu',
    });
    expect(getAddress(wrap({ city: text }))).to.deep.equal({
      city: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed',
    });
    expect(getAddress(wrap({ zipCode: '123450000' }))).to.deep.equal({
      zipCode5: '12345',
    });
    expect(
      getAddress(wrap({ internationalPostalCode: '12345678901234567890' })),
    ).to.deep.equal({
      zipCode5: '00000',
      internationalPostalCode: '1234567890123456',
    });
  });
});

describe('getPhone', () => {
  const phone1 = {
    countryCode: '1',
    areaCode: '222',
    phoneNumber: '1234567',
    phoneNumberExt: '0000',
  };
  const phone2 = {
    countryCode: '1',
    areaCode: '333',
    phoneNumber: '3456789',
    phoneNumberExt: '0001',
  };
  it('should return a cleaned up phone object from the default home phone', () => {
    const wrap = obj => ({ veteran: { homePhone: obj } });
    expect(getPhone()).to.deep.equal({});
    expect(getPhone(wrap({}))).to.deep.equal({});
    expect(getPhone(wrap({ temp: 'test' }))).to.deep.equal({});
    expect(getPhone(wrap({ areaCode: '111' }))).to.deep.equal({
      areaCode: '111',
    });
    expect(
      getPhone(
        wrap({
          ...phone1,
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal(phone1);
  });
  it('should ignore selected primary phone when only home is available', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: phone1, mobilePhone: {} },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone1);
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone1);
  });
  it('should ignore selected primary phone when only mobile is available', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: {}, mobilePhone: phone2 },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone2);
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone2);
  });
  it('should return selected primary phone', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: phone1, mobilePhone: phone2 },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone1);
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone2);
  });
});

describe('getTimeZone', () => {
  it('should return a string', () => {
    // result will be a location string, not stubbing for this test
    expect(getTimeZone().length).to.be.greaterThan(1);
  });
});

describe('hasDuplicateLocation', () => {
  const getLocation = ({
    wrap = false,
    name = 'test 1',
    from = '2022-01-01',
    to = '2022-02-02',
  } = {}) => {
    const location = {
      locationAndName: name,
      issues: ['1', '2'],
      evidenceDates: wrap ? [{ startDate: from, endDate: to }] : { from, to },
    };
    return wrap ? { attributes: location } : location;
  };
  const list = [
    getLocation({ wrap: true }),
    getLocation({ name: 'test 2', wrap: true }),
  ];

  it('should not find any duplicates', () => {
    const name = getLocation({ name: 'test 3' });
    expect(hasDuplicateLocation(list, name)).to.be.false;
    const to = getLocation({ to: '2022-03-03' });
    expect(hasDuplicateLocation(list, to)).to.be.false;
    const from = getLocation({ from: '2022-03-03' });
    expect(hasDuplicateLocation(list, from)).to.be.false;
  });
  it('should report duplicate location', () => {
    const first = getLocation();
    expect(hasDuplicateLocation(list, first)).to.be.true;
    const second = getLocation({ name: 'test 2' });
    expect(hasDuplicateLocation(list, second)).to.be.true;

    // check date format without leading zeros
    const first2 = getLocation({ from: '2022-1-1', to: '2022-2-2' });
    expect(hasDuplicateLocation(list, first2)).to.be.true;
  });
});

describe('getEvidence', () => {
  const getData = ({ hasVa = true } = {}) => ({
    data: {
      [EVIDENCE_VA]: hasVa,
      form5103Acknowledged: true,
      locations: [
        {
          locationAndName: 'test 1',
          issues: ['1', '2'],
          evidenceDates: { from: '2022-01-01', to: '2022-02-02' },
        },
        {
          locationAndName: 'test 2',
          issues: ['1', '2'],
          evidenceDates: { from: '2022-03-03', to: '2022-04-04' },
        },
      ],
    },
    result: {
      form5103Acknowledged: true,
      evidenceSubmission: {
        evidenceType: ['retrieval'],
        retrieveFrom: [
          {
            type: 'retrievalEvidence',
            attributes: {
              locationAndName: 'test 1',
              evidenceDates: [
                { startDate: '2022-01-01', endDate: '2022-02-02' },
              ],
            },
          },
          {
            type: 'retrievalEvidence',
            attributes: {
              locationAndName: 'test 2',
              evidenceDates: [
                { startDate: '2022-03-03', endDate: '2022-04-04' },
              ],
            },
          },
        ],
      },
    },
  });

  it('should include evidenceType of none when no evidence submitted', () => {
    const evidence = getData({ hasVa: false });
    expect(getEvidence(evidence.data)).to.deep.equal({
      form5103Acknowledged: true,
      evidenceSubmission: {
        evidenceType: ['none'],
      },
    });
  });
  it('should process evidence when available', () => {
    const evidence = getData();
    expect(getEvidence(evidence.data)).to.deep.equal(evidence.result);
  });
  it('should add "upload" to evidence type when available', () => {
    const { data } = getData();
    const evidence = {
      ...data,
      [EVIDENCE_OTHER]: true,
      additionalDocuments: [{}],
    };
    expect(getEvidence(evidence).evidenceSubmission.evidenceType).to.deep.equal(
      ['retrieval', 'upload'],
    );
  });
  it('should only include "upload" when documents were uploaded with no VA evidence', () => {
    const { data } = getData({ hasVa: false });
    const evidence = {
      ...data,
      [EVIDENCE_OTHER]: true,
      additionalDocuments: [{}],
    };
    expect(getEvidence(evidence).evidenceSubmission.evidenceType).to.deep.equal(
      ['upload'],
    );
  });
  it('should combine duplicate VA locations & dates', () => {
    const evidence = getData();
    evidence.data.locations.push(evidence.data.locations[0]);
    evidence.data.locations.push(evidence.data.locations[1]);

    expect(evidence.data.locations.length).to.eq(4);
    expect(getEvidence(evidence.data)).to.deep.equal(evidence.result);
  });
});

describe('hasDuplicateFacility', () => {
  const getFacility = ({
    wrap = false,
    name = 'test 1',
    from = '2022-01-01',
    to = '2022-02-02',
    country = 'USA',
    street = '123 Main',
    city = 'Anywhere',
    state = 'Confusion',
    postalCode = '55555',
  } = {}) => ({
    providerFacilityName: name,
    providerFacilityAddress: { country, street, city, state, postalCode },
    issues: ['1', '2'],
    treatmentDateRange: wrap ? [{ from, to }] : { from, to },
  });
  const list = [
    getFacility({ wrap: true }),
    getFacility({ name: 'test 2', wrap: true }),
  ];
  it('should not find any duplicates', () => {
    const name = getFacility({ name: 'test 3' });
    expect(hasDuplicateFacility(list, name)).to.be.false;

    const country = getFacility({ country: 'UK' });
    expect(hasDuplicateFacility(list, country)).to.be.false;
    const street = getFacility({ street: '456 Second St' });
    expect(hasDuplicateFacility(list, street)).to.be.false;
    const city = getFacility({ city: 'Here' });
    expect(hasDuplicateFacility(list, city)).to.be.false;
    const state = getFacility({ state: 'There' });
    expect(hasDuplicateFacility(list, state)).to.be.false;
    const postalCode = getFacility({ postalCode: '90210' });
    expect(hasDuplicateFacility(list, postalCode)).to.be.false;

    const to = getFacility({ to: '2022-03-03' });
    expect(hasDuplicateFacility(list, to)).to.be.false;
    const from = getFacility({ from: '2022-03-03' });
    expect(hasDuplicateFacility(list, from)).to.be.false;
  });
  it('should report duplicate location', () => {
    const first = getFacility();
    expect(hasDuplicateFacility(list, first)).to.be.true;
    const second = getFacility({ name: 'test 2' });
    expect(hasDuplicateFacility(list, second)).to.be.true;

    // check date format without leading zeros
    const first2 = getFacility({ from: '2022-1-1', to: '2022-2-2' });
    expect(hasDuplicateFacility(list, first2)).to.be.true;
  });
});

describe('getForm4142', () => {
  const getData = wrap => ({
    privacyAgreementAccepted: true,
    limitedConsent: 'testing',
    // Move treatementDateRange entry into an array
    providerFacility: [
      {
        providerFacilityName: 'foo',
        providerFacilityAddress: 'bar',
        treatmentDateRange: wrap
          ? [{ from: '2000-01-01', to: '2000-02-02' }]
          : { from: '2000-1-1', to: '2000-2-2' },
      },
      {
        providerFacilityName: 'bar',
        providerFacilityAddress: 'foo',
        treatmentDateRange: wrap
          ? [{ from: '2001-03-03', to: '2001-04-04' }]
          : { from: '2001-3-3', to: '2001-4-4' },
      },
    ],
  });

  it('should return 4142 form data', () => {
    const data = {
      [EVIDENCE_PRIVATE]: true,
      ...getData(),
    };
    expect(getForm4142(data)).to.deep.equal(getData(true));
  });
  it('should return empty object since private evidence not selected', () => {
    const data = {
      [EVIDENCE_PRIVATE]: false,
      ...getData(),
    };
    expect(getForm4142(data)).to.deep.equal(null);
  });
  it('should combine duplicate facilities', () => {
    const data = {
      [EVIDENCE_PRIVATE]: true,
      ...getData(),
    };
    data.providerFacility.push(data.providerFacility[0]); // add duplicate
    expect(data.providerFacility.length).to.eq(3);
    expect(getForm4142(data)).to.deep.equal(getData(true));
  });
});
