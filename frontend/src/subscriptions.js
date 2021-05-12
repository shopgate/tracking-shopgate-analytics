import { userDataReceived$ } from '@shopgate/pwa-common/streams/user';
import emitter from './emitter';
import { EVENT_UPDATE_USER } from './constants';

/**
 * SgAnalyticsSubscriptions subscriptions.
 * @param {Function} subscribe Subscribe.
 */
const sgAnalyticsSubscriptions = (subscribe) => {
  subscribe(userDataReceived$, ({ action }) => {
    if (action.user && action.user.id) {
      emitter.emit(EVENT_UPDATE_USER, action.user.id);
    }
  });
};

export default sgAnalyticsSubscriptions;
