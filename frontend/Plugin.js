/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

/* global sgAnalytics */

import SgTrackingPlugin from '@shopgate/tracking-core/plugins/Base';

/**
 * Tracking plugin to handle internal event tracking to the shopgate analytics sdk.
 */
class ShopgateAnalytics extends SgTrackingPlugin {
  /**
   * [constructor description]
   * @param {Object} options The options passed to the plugin.
   * @param {string} options.stage The stage / environment the plugin is running.
   * @param {number} options.shopNumber The shop number.
   * @param {number} [options.userId] The internal user id.
   * @param {string} [options.pushToken] The push token of the device.
   */
  constructor({ stage, shopNumber, userId, pushToken }) {
    super('sgAnalytics', { stage });

    /* eslint-disable eslint-comments/no-unlimited-disable */
    /* eslint-disable */
    (function (src) { var s, r, t; r = false; s = document.createElement('script'); s.type = 'text/javascript'; s.src = src; t = document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(s, t); window.__shopgate_aq = window.__shopgate_aq || []; window.sgAnalytics = function () { window.__shopgate_aq.push(arguments); }})
    (`path/to/tracking-sdk.${stage}.min.js`);
    /* eslint-enable */
    /* eslint-enable eslint-comments/no-unlimited-disable */

    sgAnalytics('setConfig', {
      shopNumber,
      pushToken,
      sgUserId: userId,
      channel: 'app',
    });

    this.registerEvents();
  }

  /**
   * Registers all event handlers.
   */
  registerEvents() {
    this.register.pageview((data, rawData) => {
      let sdkData = {
        url: data.page.merchantUrl,
        type: rawData.page.name,
      };

      if (sdkData.type === 'productDetails' && rawData.product) {
        sdkData = {
          ...sdkData,
          id: rawData.product.uid,
          product: {
            number: rawData.product.uid || rawData.product.productNumber,
            name: rawData.product.name,
            currency: rawData.product.amount.currency,
            price: rawData.product.amount.displayPrice ||
             rawData.product.amount.grosss ||
             rawData.product.amount.net,
            priceStriked: rawData.product.amount.displayPriceStriked ||
              rawData.product.amount.gross ||
              rawData.product.amount.net,
            identifiers: {
              ean: rawData.product.identifiers.ean,
            },
          },
        };
      }

      sgAnalytics('track', 'pageViewed', sdkData);
      console.error('pageview', data, rawData, sdkData);
    });

    this.register.addToCart((data, rawData) => {
      console.log(rawData);
      const sdkData = {
        products: rawData.products.map(product => ({
          number: product.uid || product.productNumber,
          name: product.name,
          currency: product.amount.currency,
          price: product.amount.displayPrice ||
           product.amount.grosss ||
           product.amount.net,
          priceStriked: product.amount.displayPriceStriked ||
            product.amount.gross ||
            product.amount.net,
          identifiers: {
            ean: product.identifiers.ean,
          },
          quantity: product.quantity,
        })),
      };

      sgAnalytics('track', 'productAddedToCart', sdkData);
      console.error('addToCart', data, rawData, sdkData);
    });

    this.register.purchase((data, rawData) => {
      console.error(data, rawData);
      const sdkData = {
        orderId: rawData.order.number,
        shipping: {
          type: rawData.order.shipping.name,
          price: rawData.order.shipping.amount.gross,
        },
        coupons: rawData.order.coupons.map(coupon => ({
          code: coupon.code,
          savings: coupon.amount.gross,
          currency: coupon.amount.currency,
        })),
        products: rawData.order.products.map(product => ({
          number: product.uid || product.productNumber,
          name: product.name,
          currency: product.amount.currency,
          price: product.amount.displayPrice ||
            product.amount.gross ||
            product.amount.net,
          priceStriked: product.amount.displayPriceStriked ||
            product.amount.gross ||
            product.amount.net,
          identifiers: {
            ean: product.identifiers.ean,
          },
          quantity: product.quantity,
        })),
        totalPrice: rawData.order.amount.displayPrice ||
          rawData.order.amount.gross ||
          rawData.order.amount.net,
        totalPriceStriked: rawData.order.amount.displayPriceStriked ||
          rawData.order.amount.gross ||
          rawData.order.amount.net,
        currency: rawData.order.amount.currency,
      };

      console.error('checkoutCompleted', data, rawData, sdkData);
    });
  }
}

export default ShopgateAnalytics;

window.ShopgateAnalytics = ShopgateAnalytics;
