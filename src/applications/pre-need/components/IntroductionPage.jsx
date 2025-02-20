import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import BurialModalContent from 'platform/forms/components/OMBInfoModalContent/BurialModalContent';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import environment from 'platform/utilities/environment';
import { getAppUrl } from 'platform/utilities/registry-helpers';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  };

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for pre-need eligibility determination" />
        <p>
          Equal to VA Form 40-10007 (Application for Pre-Need Determination of
          Eligibility for Burial in a VA National Cemetery).
        </p>
        {environment.isProduction() ? (
          <SaveInProgressIntro
            headingLevel={2}
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            pageList={this.props.route.pageList}
            startText="Start the pre-need eligibility application"
          />
        ) : (
          <SaveInProgressIntro
            headingLevel={2}
            formConfig={this.props.route.formConfig}
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            pageList={this.props.route.pageList}
            startText="Start the pre-need eligibility application"
          />
        )}
        {environment.isProduction() ? (
          <>
            <h2 className="vads-u-font-size--h3">
              Follow the steps below to apply for a pre-need eligibility
              determination
            </h2>
            <div className="process schemaform-process">
              <ol>
                <li className="process-step list-one">
                  <h3>Prepare</h3>
                  <h4>When you apply, be sure to have these on hand:</h4>
                  <ul>
                    <li>
                      The name of the VA national cemetery where you’d prefer to
                      be buried.
                      <br />
                      <a href={getAppUrl('facilities')}>
                        Find a VA national cemetery
                      </a>
                    </li>
                    <li>
                      Service history or the service history of the service
                      member or Veteran who’s sponsoring your application. This
                      includes your or your sponsor’s:
                      <ul>
                        <li>
                          Social Security number (and Military Service number if
                          it’s different than the Social Security number)
                        </li>
                        <li>VA claim number (if you know it)</li>
                        <li>Date and place of birth</li>
                        <li>
                          Date of death (if the service member or Veteran has
                          died)
                        </li>
                        <li>Military status and history</li>
                      </ul>
                    </li>
                  </ul>
                  <h4>You’ll need to upload:</h4>
                  <p>
                    A copy of your or your sponsor’s DD214 or other separation
                    documents
                  </p>
                  <h4>
                    Additional information and documents needed for certain
                    applicants:
                  </h4>
                  <ul>
                    <li className="vads-u-margin-y--2">
                      <strong>
                        If you’re applying as the legally married spouse or
                        surviving spouse or the unmarried adult child of a
                        service member or Veteran
                      </strong>
                      , you’ll need your personal information (including Social
                      Security number and date of birth).
                    </li>
                    <li>
                      <strong>
                        If you’re applying on behalf of someone else
                      </strong>
                      , you’ll need to upload supporting documents or an
                      affidavit (a written statement of facts confirmed by an
                      oath or affirmation) showing that you’re:
                      <ul>
                        <li>
                          The applicant’s court-appointed representative,{' '}
                          <strong>or</strong>
                        </li>
                        <li>
                          The applicant’s caregiver (including a spouse or other
                          relative), <strong>or</strong>
                        </li>
                        <li>
                          An attorney or agent acting on behalf of the applicant
                          under a durable power of attorney, <strong>or</strong>
                        </li>
                        <li>
                          The manager or principal officer of an institution in
                          which the applicant is being cared for
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>
                        If you're applying for an unmarried adult child
                      </strong>
                      , you’ll need to upload supporting documents showing:
                      <ul>
                        <li>Medical evidence of a disability</li>
                        <li>Start date of a disability</li>
                        <li>
                          The child's age when diagnosed with a disability
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <h4>What if I need help filling out my application?</h4>
                  <p>
                    An accredited representative, like a Veterans Service
                    Officer (VSO), can help you fill out your claim.
                    <br />
                    <a href="/disability/get-help-filing-claim/">
                      Get help filing your claim
                    </a>
                  </p>
                </li>
                <li className="process-step list-two">
                  <h3>Apply</h3>
                  <p>Complete this pre-need eligibility determination form.</p>
                  <p>
                    After submitting the form, you’ll get a confirmation
                    message. You can print this for your records.
                  </p>
                  <div style={{ marginBottom: '-25px' }}>
                    <SaveInProgressIntro
                      buttonOnly
                      prefillEnabled={
                        this.props.route.formConfig.prefillEnabled
                      }
                      messages={this.props.route.formConfig.savedFormMessages}
                      pageList={this.props.route.pageList}
                      startText="Start the pre-need eligibility application"
                    />
                  </div>
                </li>
                <li className="process-step list-three">
                  <h3>VA review</h3>
                  <p>We’ll let you know by mail if we need more information.</p>
                </li>
                <li className="process-step list-four">
                  <h3>Decision</h3>
                  <p>
                    After we process your claim, you'll get a notice in the mail
                    about the decision.
                  </p>
                </li>
              </ol>
            </div>
          </>
        ) : (
          <>
            <h2 className="vads-u-font-size--h3">
              Follow the steps below to get started
            </h2>
            <div className="process schemaform-process">
              <ol>
                <li className="process-step list-one">
                  <h3>Prepare</h3>
                  <h4>When you apply, be sure to have these on hand:</h4>
                  <ul>
                    <li>
                      Personal information (including Social Security number and
                      date of birth).
                    </li>
                    <li>
                      Military history or the military history of the service
                      member or Veteran who’s sponsoring your application.
                    </li>
                    <li>
                      The name of the VA national cemetery where you’d prefer to
                      be buried.
                      <br />
                      <a href={getAppUrl('facilities')}>
                        Find a VA national cemetery
                      </a>
                    </li>
                  </ul>
                  <h4>
                    To help us process your application faster, you can upload:
                  </h4>
                  <p>
                    A copy of your or your sponsor’s DD214 or other separation
                    files.
                  </p>
                  <h4>
                    Other information for certain applicants you can provide:
                  </h4>
                  <ul>
                    <li>
                      <strong>
                        If you’re applying as the legally married spouse or
                        surviving spouse of a service member or Veteran
                      </strong>
                      , you’ll need your personal information (including Social
                      Security number and date of birth).
                    </li>
                    <li>
                      <strong>
                        If you’re applying on behalf of someone else
                      </strong>
                      , you can upload supporting files or an affidavit showing
                      you can apply on their behalf.
                    </li>
                    <li>
                      <strong>
                        If you’re applying for an unmarried adult child of a
                        service member or Veteran
                      </strong>
                      , you can upload supporting files with information about
                      the adult child’s disability.
                    </li>
                  </ul>
                  <h4>What if I need help filling out my application?</h4>
                  <p>
                    An accredited representative, like a Veterans Service
                    Officer (VSO), can help you fill out your claim.
                    <br />
                    <a href="/disability/get-help-filing-claim/">
                      Get help filing your claim
                    </a>
                  </p>
                </li>
                <li className="process-step list-two">
                  <h3>Apply</h3>
                  <p>
                    Complete the pre-need eligibility determination form. After
                    submitting the form, you’ll get a confirmation message that
                    you can print for your records.
                  </p>
                  <div style={{ marginBottom: '-25px' }}>
                    <SaveInProgressIntro
                      buttonOnly
                      prefillEnabled={
                        this.props.route.formConfig.prefillEnabled
                      }
                      messages={this.props.route.formConfig.savedFormMessages}
                      pageList={this.props.route.pageList}
                      startText="Start the pre-need eligibility application"
                    />
                  </div>
                </li>
                <li className="process-step list-three">
                  <h3>VA review</h3>
                  <p>
                    We’ll let you know by phone or mail if we need more
                    information.
                  </p>
                </li>
                <li className="process-step list-four">
                  <h3>Decision</h3>
                  <p>
                    You’ll get a notice in the mail about the decision after we
                    process your claim.
                  </p>
                </li>
              </ol>
            </div>
          </>
        )}
        <div className="omb-info--container">
          <va-omb-info
            res-burden={20}
            omb-number="2900-0784"
            exp-date="03/31/2026"
          >
            <BurialModalContent />
          </va-omb-info>
        </div>
      </div>
    );
  }
}

export default IntroductionPage;

export { IntroductionPage };
