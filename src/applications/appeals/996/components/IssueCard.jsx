import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router';

import { SELECTED, FORMAT_YMD, FORMAT_READABLE } from '../constants';
import { replaceDescriptionContent } from '../utils/replace';

/** HLR v2 card */
/**
 * IssueCardContent
 * @param {String} description - contestable issue description
 * @param {String} ratingIssuePercentNumber - rating %, number with no %
 * @param {String} approxDecisionDate - contestable issue date formatted as
 *   "YYYY-MM-DD"
 * @param {String} decisionDate - additional issue date formatted as
 *   "YYYY-MM-DD"
 * @return {React Component}
 */
export const IssueCardContent = ({
  id,
  description,
  ratingIssuePercentNumber,
  approxDecisionDate,
  decisionDate,
}) => {
  // May need to throw an error to Sentry if any of these don't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showPercentNumber = (ratingIssuePercentNumber || '') !== '';
  const date = approxDecisionDate || decisionDate;

  return (
    <div id={id} className="widget-content-wrap">
      {description && (
        <p className="vads-u-margin-bottom--0">
          {replaceDescriptionContent(description)}
        </p>
      )}
      {showPercentNumber && (
        <p className="vads-u-margin-bottom--0">
          Current rating: <strong>{`${ratingIssuePercentNumber}%`}</strong>
        </p>
      )}
      {date && (
        <p>
          Decision date:{' '}
          <strong>{moment(date, FORMAT_YMD).format(FORMAT_READABLE)}</strong>
        </p>
      )}
    </div>
  );
};

IssueCardContent.propTypes = {
  approxDecisionDate: PropTypes.string,
  decisionDate: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  ratingIssuePercentNumber: PropTypes.string,
};

/**
 * ContestableIssue
 * @typedef {Object}
 * @property {String} ratingIssueSubjectText - contestable issue title
 * @property {String} description - contestable issue description
 * @property {String} ratingIssuePercentNumber - rating %, number with no %
 * @property {String} approxDecisionDate - date formatted as "YYYY-MM-DD"
 */
/**
 * AdditionalIssue
 * @type {Object}
 * @property {String} issue - user entered issue name
 * @property {String} decisionDate - user entered decision date
 */
/**
 * IssueCard
 * @typedef {Object}
 * @property {String} id - ID base for form elements
 * @property {Number} index - index of item in list
 * @property {ContestableIssue|AdditionalIssue} item - issue values
 * @property {Object} options - ui:options
 * @property {func} onChange - onChange callback
 * @property {func} onRemove - remove issue callback
 * @property {Boolean} showCheckbox - don't show checkbox on review & submit
 *  page when not in edit mode
 */
export const IssueCard = ({
  id,
  index,
  item = {},
  options = {},
  onChange,
  showCheckbox,
  onRemove,
  onReviewPage,
}) => {
  // On the review & submit page, there may be more than one
  // of these components in edit mode with the same content, e.g. 526
  // ratedDisabilities & unemployabilityDisabilities causing
  // duplicate input ids/names... an `appendId` value is added to the
  // ui:options
  const appendId = options.appendId ? `_${options.appendId}` : '';
  const elementId = `${id}_${index}${appendId}`;

  const itemIsSelected = item[SELECTED];
  const isEditable = !!item.issue;
  const issueName = item.issue || item.ratingIssueSubjectText;

  const wrapperClass = [
    'widget-wrapper',
    isEditable ? 'additional-issue' : '',
    showCheckbox ? '' : 'checkbox-hidden',
    showCheckbox ? 'vads-u-padding-top--3' : '',
    'vads-u-padding-right--3',
    'vads-u-margin-bottom--0',
    'vads-u-border-bottom--1px',
    'vads-u-border-color--gray-light',
  ].join(' ');

  const titleClass = [
    'widget-title',
    'dd-privacy-hidden',
    'vads-u-font-size--h4',
    'vads-u-margin--0',
    'capitalize',
  ].join(' ');

  const removeButtonClass = [
    'remove-issue',
    'vads-u-width--auto',
    'vads-u-margin-left--2',
    'vads-u-margin-top--0',
  ].join(' ');

  const handlers = {
    onRemove: event => {
      event.preventDefault();
      onRemove(index);
    },
    onChange: event => onChange(index, event),
  };

  const editControls =
    showCheckbox && isEditable ? (
      <div>
        <Link
          to={{
            pathname: '/add-issue',
            search: `?index=${index}`,
          }}
          className="edit-issue-link"
          aria-label={`Edit ${issueName}`}
        >
          Edit
        </Link>
        <va-button
          secondary
          class={removeButtonClass}
          label={`remove ${issueName}`}
          onClick={handlers.onRemove}
          text="Remove"
        />
      </div>
    ) : null;

  // Issues h4 disappears in edit mode, so we need to match the page header
  // level
  const Header = onReviewPage ? 'h5' : 'h4';

  return (
    <li id={`issue-${index}`} key={index}>
      <div className={wrapperClass}>
        {showCheckbox ? (
          <div className="widget-checkbox-wrap">
            {/* Using va-checkbox here causes alignment issues */}
            <input
              type="checkbox"
              id={elementId}
              name={elementId}
              checked={itemIsSelected}
              onChange={handlers.onChange}
              aria-describedby={`issue-${index}-description`}
              aria-labelledby={`issue-${index}-title`}
            />
            <label className="schemaform-label" htmlFor={elementId}>
              {' '}
            </label>
          </div>
        ) : null}
        <div
          className={`widget-content ${
            editControls ? 'widget-editable vads-u-padding-bottom--2' : ''
          }`}
          data-index={index}
        >
          <Header id={`issue-${index}-title`} className={titleClass}>
            {issueName}
          </Header>
          <IssueCardContent id={`issue-${index}-description`} {...item} />
          {editControls}
        </div>
      </div>
    </li>
  );
};

IssueCard.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  item: PropTypes.shape({
    issue: PropTypes.string,
    decisionDate: PropTypes.string,
    ratingIssueSubjectText: PropTypes.string,
    description: PropTypes.string,
    ratingIssuePercentNumber: PropTypes.string,
    approxDecisionDate: PropTypes.string,
    [SELECTED]: PropTypes.bool,
  }),
  options: PropTypes.shape({
    appendId: PropTypes.string,
  }),
  showCheckbox: PropTypes.bool,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
