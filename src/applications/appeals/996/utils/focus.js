import {
  focusElement,
  scrollTo,
  scrollToTop,
  defaultFocusSelector,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { LAST_ISSUE } from '../constants';

export const focusIssue = (_index, root, value) => {
  setTimeout(() => {
    const item = value || window.sessionStorage.getItem(LAST_ISSUE);
    window.sessionStorage.removeItem(LAST_ISSUE);
    const [id, type] = (item || '').toString().split(',');
    if (id < 0) {
      // focus on add new issue after removing or cancelling adding a new issue
      scrollTo('.add-new-issue');
      focusElement('.add-new-issue', null, root);
    } else if (id) {
      const card = $(`#issue-${id}`, root);
      scrollTo(card);
      if (type === 'remove-cancel') {
        const remove = $('.remove-issue', card)?.shadowRoot;
        waitForRenderThenFocus('button', remove);
      } else if (type === 'updated') {
        waitForRenderThenFocus('input', card);
      } else {
        focusElement('.edit-issue-link', null, card);
      }
    } else {
      scrollToTop();
      focusElement('h3');
    }
  });
};

export const focusRadioH3 = () => {
  scrollToTop();
  const radio = $('va-radio');
  if (radio) {
    // va-radio content doesn't immediately render
    waitForRenderThenFocus('h3', radio.shadowRoot);
  } else {
    focusElement(defaultFocusSelector);
  }
};

export const focusAlertH3 = () => {
  scrollTo('h3');
  // va-alert header is not in the shadow DOM, but still the content doesn't
  // immediately render
  waitForRenderThenFocus('h3');
};
