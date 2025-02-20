import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { UnconnectedHealthCareContentV2 } from '../../../components/health-care-v2/HealthCareContentV2';
import { createVaosAppointment } from '../../../mocks/appointments/vaos-v2';

describe('<UnconnectedHealthCareContentV2 />', () => {
  it('should render', () => {
    const tree = render(<UnconnectedHealthCareContentV2 />);

    tree.getByTestId('no-healthcare-text-v2');
    expect(tree.container.querySelector('va-loading-indicator')).to.not.exist;
    expect(tree.queryByTestId('cerner-widget')).to.be.null;
  });

  it('should render the loading indicator', () => {
    const tree = render(
      <UnconnectedHealthCareContentV2 shouldShowLoadingIndicator />,
    );

    expect(tree.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render the Cerner widget', () => {
    const tree = render(
      <UnconnectedHealthCareContentV2 facilityNames={['do', 're', 'mi']} />,
    );

    tree.getByTestId('cerner-widget');
  });

  it('should render the unread message alert', () => {
    const tree = render(
      <UnconnectedHealthCareContentV2
        shouldFetchUnreadMessages
        unreadMessagesCount={2}
      />,
    );

    tree.getByTestId('unread-messages-alert-v2');
    tree.getByText('You have 2 unread messages.');
    tree.getByText('Review your messages');
  });

  it('should render the HealthcareError', () => {
    const tree = render(
      <UnconnectedHealthCareContentV2 hasAppointmentsError />,
    );

    tree.getByTestId('outstanding-debts-error-v2');
  });

  it('should render the HealthcareError', () => {
    const appointments = [createVaosAppointment()];
    const tree = render(
      <UnconnectedHealthCareContentV2 appointments={appointments} />,
    );

    tree.getByTestId('health-care-appointments-card-v2');
  });

  it('should render the no upcoming appointments text', () => {
    const tree = render(
      <UnconnectedHealthCareContentV2 dataLoadingDisabled isVAPatient />,
    );

    tree.getByTestId('no-upcoming-appointments-text-v2');
  });

  context('should render the HealthCareCTA', () => {
    it('when a non-patient has an appointment error and unread messages', () => {
      const tree = render(
        <UnconnectedHealthCareContentV2
          dataLoadingDisabled
          hasAppointmentsError
          shouldFetchUnreadMessages
          unreadMessagesCount={2}
        />,
      );

      tree.getByText('Popular actions for Health Care');
    });

    it("when a patient has appointments and doesn't have an appointment error", () => {
      const appointments = [createVaosAppointment()];
      const tree = render(
        <UnconnectedHealthCareContentV2
          appointments={appointments}
          dataLoadingDisabled
          isVAPatient
          shouldFetchUnreadMessages
          unreadMessagesCount={2}
        />,
      );

      tree.getByText('Popular actions for Health Care');
    });
  });
});
