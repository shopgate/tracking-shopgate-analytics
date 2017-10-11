/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

/* global sgAnalytics */

import SgTrackingPlugin from '@shopgate/tracking-core/plugins/Base';
import initSDK from './sdk';

/**
 * Tracking plugin to handle internal event tracking to the shopgate analytics sdk.
 */
class ShopgateAnalytics extends SgTrackingPlugin {
  /**
   * Initializes the tracking plugin.
   * @param {Object} options The options passed to the plugin.
   * @param {string} options.stage The stage / environment the plugin is running.
   * @param {string} options.shopNumber The shop number.
   * @param {string} [options.userId] The internal user id.
   * @param {string} [options.pushToken] The push token of the device.
   * @param {string} [options.access] The access type (App, Web).
   */
  constructor({ stage, shopNumber, userId, pushToken, access }) {
    super('sgAnalytics', { stage });

    initSDK(stage);

    sgAnalytics('setConfig', {
      shopNumber,
      pushToken,
      sgUserId: userId,
      channel: access === 'Web' ? 'webapp' : 'app',
    });

    this.registerEvents();
  }

  /**
   * Formats product data to the analaytics format.
   * @param {Object} product Raw product data.
   * @return {Object}
   */
  formatProductData = product => ({
    number: product.uid || product.productNumber,
    name: product.name,
    currency: product.amount.currency,
    price: product.amount.displayPrice ||
     product.amount.grosss ||
     product.amount.net,
    strikePrice: product.amount.displayPriceStriked ||
      product.amount.gross ||
      product.amount.net,
    identifiers: {
      ean: product.identifiers.ean,
    },
  });

  /**
   * Registers all event handlers.
   *
   * Event documentation:
   * https://wiki.shopgate.guru/display/TEAMC2/Tracking+Service+Events
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
          product: this.formatProductData(rawData.product),
        };
      }

      sgAnalytics('track', 'pageViewed', sdkData);
    });

    this.register.addToCart((data, rawData) => {
      const sdkData = {
        products: rawData.products.map(product => ({
          ...this.formatProductData(product),
          quantity: product.quantity,
        })),
      };

      sgAnalytics('track', 'productAddedToCart', sdkData);
    });

    this.register.purchase((data, rawData) => {
      const sdkData = {
        orderNumber: rawData.order.number,
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
          ...this.formatProductData(product),
          quantity: product.quantity,
        })),
        totalPrice: rawData.order.amount.displayPrice ||
          rawData.order.amount.gross ||
          rawData.order.amount.net,
        totalStrikePrice: rawData.order.amount.displayPriceStriked ||
          rawData.order.amount.gross ||
          rawData.order.amount.net,
        currency: rawData.order.amount.currency,
      };

      sgAnalytics('track', 'checkoutCompleted', sdkData);
    });
  }
}

export default ShopgateAnalytics;

window.ShopgateAnalytics = ShopgateAnalytics;
