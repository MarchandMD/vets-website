import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import { getSignerFullName } from './helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['authTypeNonVet', 'authTypeVet'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start your application without signing in/i, {
            selector: 'a',
          }).click();
        });
      },
      'disclosure-information-limited-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-checkbox[label="Status of pending claim or appeal"]')
            .first()
            .shadow()
            .find('label')
            .click()
            .then(() => {
              cy.findByText(/continue/i, { selector: 'button' }).click();
            });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const signerName = getSignerFullName(data);
            cy.get('#veteran-signature')
              .shadow()
              .get('#inputField')
              .type(signerName);
          });
          cy.get(`va-checkbox[name="veteran-certify"]`)
            .shadow()
            .find('input')
            .check();
          cy.findAllByText(/submit authorization/i, {
            selector: 'button',
          }).click();
        });
      },
    },

    setupPerTest: () => {
      Cypress.config({ waitForAnimations: true, defaultCommandTimeout: 8000 });
      // Log in if the form requires an authenticated session.
      // cy.login();
      cy.intercept('POST', formConfig.submitUrl, { statusCode: 200 });
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
