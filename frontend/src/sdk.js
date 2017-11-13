/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

/**
 * Initializes the shopgate analytics sdk.
 * @param  {string} stage The environment stage.
 */
export default (stage) => {
    /* eslint-disable eslint-comments/no-unlimited-disable */
    /* eslint-disable */
    (function (src) { var s, r, t; r = false; s = document.createElement('script'); s.type = 'text/javascript'; s.src = src; t = document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(s, t); window.__shopgate_aq = window.__shopgate_aq || []; window.sgAnalytics = function () { window.__shopgate_aq.push(arguments); }})
    (`https://data.shopgate.com/tracking/shopgate-analytics-sdk.${stage}.min.js`);
    /* eslint-enable */
    /* eslint-enable eslint-comments/no-unlimited-disable */
};
