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
  constructor({
    stage,
    shopNumber,
    userId,
    pushToken,
    access,
  }) {
    super('sgAnalytics', { stage });

    initSDK(stage);
    this.config = {};

    this.updateConfig({
      shopNumber,
      pushToken,
      sgUserId: userId ? `${userId}` : userId,
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
   * Updates the the userId in the config
   * @param {number|string} userId Id of the current logged in user
   */
  setUserId(userId) {
    this.updateConfig({ sgUserId: `${userId}` });
  }

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

      sgAnalytics('track', 'pageViewed', sdkData);
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

      sgAnalytics('track', 'productAddedToCart', sdkData);
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

      sgAnalytics('track', 'checkoutCompleted', sdkData);
    });
  }
}

export default ShopgateAnalytics;

window.ShopgateAnalytics = ShopgateAnalytics;
