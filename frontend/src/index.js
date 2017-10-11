/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

import Plugin from './Plugin';
import config from '../config';

/**
* Read the config and create the tracking plugin.
* @param {Object} options Options for the tracking plugin.
* @return {Object}
*/
export default function init(options) {
  return new Plugin({
    ...config,
    ...options,
  });
}
