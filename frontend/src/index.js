import { shopNumber } from '@shopgate/pwa-common/helpers/config';
import { getUserData } from '@shopgate/pwa-common/selectors/user';
import emitter from './emitter';
import { EVENT_UPDATE_USER } from './constants';
import Plugin from './Plugin';
import config from '../config';

/**
* Read the config and create the tracking plugin.
* @param {Object} options Options for the tracking plugin.
* @return {Object}
*/
export default function init(options) {
  const { state } = options;

  const stage = config.stage === 'sandbox' ? 'development' : 'production';

  const plugin = new Plugin({
    ...options,
    stage,
    shopNumber,
    userId: getUserData(state).id || null,
    access: 'App',
  });

  emitter.on(EVENT_UPDATE_USER, (userId) => {
    plugin.setUserId(userId);
  });

  return plugin;
}
