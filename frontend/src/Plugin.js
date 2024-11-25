/* global sgAnalytics */
import SgTrackingPlugin from '@shopgate/tracking-core/plugins/Base';
import initSDK from './sdk';
import { debugEnabled } from '../config';

const SUPPORTED_OPT_IN_EVENTS = [
  'softPushOptInShown',
  'softPushOptInSelected',
  'hardPushOptInShown',
  'hardPushOptInSelected',

  'softTrackingOptInShown',
  'softTrackingOptInSelected',
  'hardTrackingOptInShown',
  'hardTrackingOptInSelected',

  'softTrackingSettingsShown',
  'softTrackingSettingsChanged',
];

/**
 * Tracking plugin to handle internal event tracking to the shopgate analytics sdk.
 */
class ShopgateAnalytics extends SgTrackingPlugin {
  /**
   * Initializes the tracking plugin.
   * @param {Object} options The options passed to the plugin.
   * @param {string} options.stage The stage / environment the plugin is running.
   * @param {string} options.shopNumber The shop number.
   * @param {string} [options.pushToken] The push token of the device.
   * @param {string} [options.access] The access type (App, Web).
   */
  constructor({
    stage,
    shopNumber,
    pushToken,
    access,
  }) {
    super('sgAnalytics', { stage });

    initSDK(stage);
    this.config = {};

    this.updateConfig({
      shopNumber,
      pushToken,
      channel: access === 'Web' ? 'webapp' : 'app',
    });

    this.registerEvents();
  }

  /**
   * Updates the config
   * @param {Object} config Config
   */
  updateConfig(config) {
    this.config = {
      ...this.config,
      ...config,
    };

    sgAnalytics('setConfig', this.config);
  }

  /**
   * Sends an event to shopgate analytics
   * @param {string} eventName Event name
   * @param {Object} eventPayload  Event payload
   */
  trackSgAnalyticsEvent = (eventName, eventPayload) => {
    if (debugEnabled) {
      console.log('%c SgAnalytics', 'color: #8e44ad', 'Event Sent', {
        name: eventName,
        payload: eventPayload,
        config: this.config,
      });
    }

    sgAnalytics('track', eventName, eventPayload);
  };

  /**
   * Formats product data to the analytics format.
   * @param {Object} product Raw product data.
   * @return {Object}
   */
  formatProductData = product => ({
    number: product.uid || product.productNumber,
    name: product.name,
    currency: product.amount.currency,
    price: product.amount.displayPrice ||
    product.amount.gross ||
    product.amount.net,
    strikePrice: product.amount.displayPriceStriked ||
      product.amount.gross ||
      product.amount.net,
    identifiers: {
      ean: product.identifiers ? product.identifiers.ean : '',
    },
  });

  /**
   * Registers all event handlers.
   */
  registerEvents() {
    this.register.pageview((data, rawData, _, state) => {
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

      if (state && state.settings && state.settings.shopSettings) {
        const { stage, merchantCode } = state.settings.shopSettings;

        sdkData = {
          ...sdkData,
          meta: {
            stage,
            merchantCode,
          },
        };
      }

      this.trackSgAnalyticsEvent('pageViewed', sdkData);
    });

    this.register.addToCart((data, rawData, _, state) => {
      let sdkData = {
        products: rawData.products.map(product => ({
          ...this.formatProductData(product),
          quantity: product.quantity,
        })),
      };

      if (state && state.settings && state.settings.shopSettings) {
        const { stage, merchantCode } = state.settings.shopSettings;

        sdkData = {
          ...sdkData,
          meta: {
            stage,
            merchantCode,
          },
        };
      }

      this.trackSgAnalyticsEvent('productAddedToCart', sdkData);
    });

    this.register.purchase((data, rawData, _, state) => {
      const coupons = rawData.order.coupons || [];

      let sdkData = {
        orderNumber: rawData.order.number,
        shipping: {
          type: rawData.order.shipping.name,
          price: rawData.order.shipping.amount.gross,
        },
        coupons: coupons.map(coupon => ({
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
        meta: { },
      };

      if (rawData.meta) {
        sdkData = {
          ...sdkData,
          meta: {
            ...sdkData.meta,
            ...rawData.meta,
          },
        };
        sdkData.meta = rawData.meta;
      }

      if (state && state.settings && state.settings.shopSettings) {
        const { stage, merchantCode } = state.settings.shopSettings;

        sdkData = {
          ...sdkData,
          meta: {
            ...sdkData.meta,
            stage,
            merchantCode,
          },
        };
      }

      this.trackSgAnalyticsEvent('checkoutCompleted', sdkData);
    });

    this.register.customEvent((data, rawData, _, state) => {
      const { eventName, ...eventData } = rawData?.additionalEventParams || {};

      // Only track known custom events
      if (!SUPPORTED_OPT_IN_EVENTS.includes(eventName)) {
        return;
      }

      let sdkData = {
        ...eventData,
      };

      if (state && state.settings && state.settings.shopSettings) {
        const { stage, merchantCode } = state.settings.shopSettings;

        sdkData = {
          ...sdkData,
          meta: {
            stage,
            merchantCode,
          },
        };
      }

      this.trackSgAnalyticsEvent(eventName, sdkData);
    });
  }
}

export default ShopgateAnalytics;

window.ShopgateAnalytics = ShopgateAnalytics;
