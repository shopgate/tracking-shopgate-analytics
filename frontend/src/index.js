import { shopNumber } from '@shopgate/pwa-common/helpers/config';
import { getUserData } from '@shopgate/pwa-common/selectors/user';
import { userDataReceived$ } from '@shopgate/pwa-common/streams/user';
import Plugin from './Plugin';
import config from '../config';

/**
* Read the config and create the tracking plugin.
* @param {Object} options Options for the tracking plugin.
* @return {Object}
*/
export default function init(options) {
  const { state, subscribe } = options;

  const userId = getUserData(state).id || null;
  const stage = config.stage === 'sandbox' ? 'development' : 'production';

  const plugin = new Plugin({
    ...options,
    stage,
    shopNumber,
    userId,
    access: 'App',
  });

  subscribe(userDataReceived$, ({ action }) => {
    if (action.user && action.user.id) {
      plugin.setUserId(action.user.id);
    }
  });

  return plugin;
}
