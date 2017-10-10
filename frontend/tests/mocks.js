/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { JSDOM } from 'jsdom';

// JsDOM
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head></head>
    <body></body>
    <script></script>
  </html>
`);
global.window = dom.window;
global.document = dom.window.document;

// Create mocks.
global.SERVICE_URL = 'foo.bar/';
global.localStorage = null;
global.window.SGEvent = {
  __call: () => {},
};
global.window.XMLHttpRequest = class {
  open = () => {}
  send = () => {}
  setRequestHeader = () => {}
};
