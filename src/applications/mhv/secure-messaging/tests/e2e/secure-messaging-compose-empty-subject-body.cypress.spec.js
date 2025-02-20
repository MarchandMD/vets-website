import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';

describe('Secure Messaging Compose with No Subject or Body', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4'); // trieageTeams with preferredTeam = true will appear in a recipients dropdown only
    composePage.getCategory('COVID').click();
    composePage.attachMessageFromFile('test_image.jpg');
  });
  it('empty message subject error', () => {
    composePage.getMessageBodyField().type('Test message body');
    composePage.clickOnSendMessageButton();
    composePage.verifySubjectErrorMessage();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it('empty message body error', () => {
    composePage.getMessageSubjectField().type('Test Subject');
    composePage.clickOnSendMessageButton();
    composePage.verifyBodyErrorMessage();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
