import { shopNumber } from '@shopgate/pwa-common/helpers/config';
import Plugin from './Plugin';
import config from '../config';

/**
* Read the config and create the tracking plugin.
* @param {Object} options Options for the tracking plugin.
* @return {Object}
*/
export default function init(options) {
  let stage = config.stage === 'sandbox' ? 'development' : 'production';
  if (config.overrideStage) {
    stage = config.overrideStage;
  }

  const plugin = new Plugin({
    ...options,
    stage,
    shopNumber: config.overrideShopNumber || shopNumber,
    access: 'App',
  });

  return plugin;
}
