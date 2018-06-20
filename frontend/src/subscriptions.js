import { userDataReceived$ } from '@shopgate/pwa-common/streams/user';
import emitter from './emitter';

/**
 * SgAnalyticsSubscriptions subscriptions.
 * @param {function} subscribe Subscribe.
 */
const sgAnalyticsSubscriptions = (subscribe) => {
  subscribe(userDataReceived$, ({ action }) => {
    if (action.user && action.user.id) {
      emitter.emit('updateUserId', action.user.id);
    }
  });
};

export default sgAnalyticsSubscriptions;
