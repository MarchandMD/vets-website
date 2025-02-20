import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

import migrations from '../migrations';
import prefillTransformer from './prefill-transformer';
import { transform } from './submit-transformer';
import submitForm from './submitForm';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../content/GetFormHelp';
import AddIssue from '../components/AddIssue';
import reviewErrors from '../content/reviewErrors';

import {
  canUploadEvidence,
  wantsToUploadEvidence,
  needsHearingType,
  appStateSelector,
  showPart3,
  showExtensionReason,
} from '../utils/helpers';
import { getIssueTitle } from '../content/areaOfDisagreement';

import { CONTESTABLE_ISSUES_PATH } from '../constants';

// Pages
import veteranInfo from '../pages/veteranInfo';
import homeless from '../pages/homeless';
import contactInfo from '../pages/contactInfo';
import contestableIssues from '../pages/contestableIssues';
import addIssue from '../pages/addIssue';
import areaOfDisagreementFollowUp from '../pages/areaOfDisagreement';
import extensionRequest from '../pages/extensionRequest';
import extensionReason from '../pages/extensionReason';
import appealingVhaDenial from '../pages/appealingVhaDenial';
import filingDeadlines from '../pages/filingDeadlines';
import issueSummary from '../pages/issueSummary';
import boardReview from '../pages/boardReview';
import evidenceIntro from '../pages/evidenceIntro';
import evidenceUpload from '../pages/evidenceUpload';

import {
  customText,
  saveInProgress,
  savedFormMessages,
} from '../content/saveInProgress';

// import initialData from '../tests/schema/initialData';

import manifest from '../manifest.json';
import hearingType from '../pages/hearingType';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/notice_of_disagreements',
  trackingPrefix: '10182-board-appeal-',

  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.vaProfile,
      services.bgs,
      services.mvi,
      services.appeals,
    ],
  },

  formId: VA_FORM_IDS.FORM_10182,
  version: migrations.length - 1,
  title: 'Request a Board Appeal',
  subTitle: 'VA Form 10182 (Notice of Disagreement)',

  prefillEnabled: true,
  prefillTransformer,
  verifyRequiredPrefill: true,
  transformForSubmit: transform,
  preSubmitInfo,
  submit: submitForm,
  // showReviewErrors: true,
  reviewErrors,

  // SaveInProgress messages
  customText,
  savedFormMessages,
  saveInProgress,
  // errorText: '',
  // submissionError: '',

  introduction: IntroductionPage,
  confirmation: ConfirmationPage,

  defaultDefinitions: {},
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,

  chapters: {
    infoPages: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-details',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
          // initialData,
        },
        homeless: {
          title: 'Homelessness question',
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
        },
        ...contactInfo,
      },
    },
    conditions: {
      title: 'Issues for review',
      pages: {
        filingDeadlines: {
          title: 'Filing deadlines',
          path: 'filing-deadlines',
          uiSchema: filingDeadlines.uiSchema,
          schema: filingDeadlines.schema,
        },
        extensionRequest: {
          title: 'Request an extension',
          path: 'extension-request',
          depends: showPart3,
          uiSchema: extensionRequest.uiSchema,
          schema: extensionRequest.schema,
        },
        extensionReason: {
          title: 'Reason for extension',
          path: 'extension-reason',
          depends: showExtensionReason,
          uiSchema: extensionReason.uiSchema,
          schema: extensionReason.schema,
        },
        appealingVhaDenial: {
          title: 'Appealing denial of VA health care benefits',
          path: 'appealing-denial',
          depends: showPart3,
          uiSchema: appealingVhaDenial.uiSchema,
          schema: appealingVhaDenial.schema,
        },
        contestableIssues: {
          title: 'You’ve selected these issues for review',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
          appStateSelector,
        },
        addIssue: {
          title: 'Add issues for review',
          path: 'add-issue',
          depends: () => false, // accessed from contestableIssues page
          // showPagePerItem: true,
          // arrayPath: 'additionalIssues',
          CustomPage: AddIssue,
          uiSchema: addIssue.uiSchema,
          schema: addIssue.schema,
          returnUrl: `/${CONTESTABLE_ISSUES_PATH}`,
        },
        areaOfDisagreementFollowUp: {
          title: getIssueTitle,
          path: 'area-of-disagreement/:index',
          showPagePerItem: true,
          arrayPath: 'areaOfDisagreement',
          uiSchema: areaOfDisagreementFollowUp.uiSchema,
          schema: areaOfDisagreementFollowUp.schema,
        },
        issueSummary: {
          title: 'Issue summary',
          path: 'issue-summary',
          uiSchema: issueSummary.uiSchema,
          schema: issueSummary.schema,
        },
      },
    },
    boardReview: {
      title: 'Board review option',
      pages: {
        boardReviewOption: {
          title: 'Board review option',
          path: 'board-review-option',
          uiSchema: boardReview.uiSchema,
          schema: boardReview.schema,
        },
        evidenceIntro: {
          title: 'Evidence submission',
          path: 'evidence-submission',
          depends: canUploadEvidence,
          uiSchema: evidenceIntro.uiSchema,
          schema: evidenceIntro.schema,
        },
        evidenceUpload: {
          title: 'Evidence upload',
          path: 'evidence-submission/upload',
          depends: wantsToUploadEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
        },
        hearingType: {
          title: 'Hearing type',
          path: 'hearing-type',
          depends: needsHearingType,
          uiSchema: hearingType.uiSchema,
          schema: hearingType.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
