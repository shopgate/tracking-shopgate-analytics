/* eslint-disable extra-rules/no-single-line-objects */
import { pageViewData, addToCartData, orderData } from '../tests/mockData';
import Plugin from './Plugin';

jest.mock('@shopgate/pwa-core/classes/Event', () => { });
jest.mock('@shopgate/pwa-core/classes/DataRequest', () => class {});
jest.mock('@shopgate/pwa-core/classes/AppCommand', () => class {});
jest.mock('./sdk', () => () => {});

const registerHelperSpy = jest.fn();

/**
 * Wrapper class for the tracking plugin to enable spying on the registerHelper calls.
 */
class PluginWrapper extends Plugin {
  /**
   * The register helper spy.
   * @param {*} args Method args
   * @returns {Object}
   */
  registerHelper(...args) {
    registerHelperSpy(...args);
    return super.registerHelper(...args);
  }
}

/**
 * Determines the callback for a specific event.
 * @param {string} eventName Name of the registered event.
 * @returns {Function}
 */
const getRegisteredCallback = (eventName) => {
  const [, callback] = registerHelperSpy.mock.calls.find(entry => entry[0] === eventName);
  return callback;
};

describe('ShopgateAnalyticsPlugin', () => {
  const sgAnalyticsSpy = jest.fn();
  let instance;

  beforeAll(() => {
    global.sgAnalytics = sgAnalyticsSpy;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new PluginWrapper({ stage: 'development', shopNumber: '1234', access: 'App' });
  });

  it('should register specified events with core', () => {
    const expectedSubscriptions = [
      'pageview',
      'purchase',
      'addToCart',
    ];

    expect(registerHelperSpy).toHaveBeenCalledTimes(expectedSubscriptions.length);

    expectedSubscriptions.forEach((event) => {
      expect(registerHelperSpy).toHaveBeenCalledWith(event, expect.any(Function), undefined);
    });
  });

  it('should update the userId', () => {
    instance.setUserId(999999);

    expect(sgAnalyticsSpy).toHaveBeenCalledWith('setConfig', {
      channel: 'app',
      pushToken: undefined,
      sgUserId: '999999',
      shopNumber: '1234',
    });
  });

  it('should have initialized the sdk', () => {
    expect(sgAnalyticsSpy).toHaveBeenCalledWith('setConfig', {
      channel: 'app',
      pushToken: undefined,
      sgUserId: undefined,
      shopNumber: '1234',
    });
  });

  it('should use webapp channel for mobile website', () => {
    instance = new PluginWrapper({ stage: 'development', shopNumber: '1234', access: 'Web' });

    expect(sgAnalyticsSpy).toHaveBeenCalledWith('setConfig', {
      channel: 'webapp',
      pushToken: undefined,
      sgUserId: undefined,
      shopNumber: '1234',
    });
  });

  it('should build event data for pageViewed correctly', () => {
    getRegisteredCallback('pageview')(pageViewData, pageViewData);
    expect(sgAnalyticsSpy).toHaveBeenLastCalledWith('track', 'pageViewed', {
      url: 'item/53473132',
      type: 'productDetails',
      product: {
        number: 'SG12',
        name: 'Produkt mit 0% MwSt. - §25a',
        currency: 'EUR',
        price: '100.00',
        strikePrice: '140.00',
        identifiers: {
          ean: '123-456',
        },
      },
    });
  });

  it('should build event data for productAddedToCart correctly', () => {
    getRegisteredCallback('addToCart')(addToCartData, addToCartData);
    expect(sgAnalyticsSpy).toHaveBeenLastCalledWith('track', 'productAddedToCart', {
      products: [{
        number: 'SG12',
        name: 'Produkt mit 0% MwSt. - §25a',
        currency: 'EUR',
        price: '100.00',
        strikePrice: '140.00',
        identifiers: {
          ean: '123-456',
        },
        quantity: 1,
      }],
    });
  });

  describe('checkoutCompleted', () => {
    const trackPayload = {
      orderNumber: '1234',
      products: [{
        number: 'SG12',
        name: 'Produkt mit 0% MwSt. - §25a',
        currency: 'EUR',
        price: '100.00',
        strikePrice: '140.00',
        identifiers: {
          ean: '123-456',
        },
        quantity: 1,
      }],
      totalPrice: '708.11',
      totalStrikePrice: '805.31',
      shipping: {
        price: '3.00',
        type: 'POLISHPOST',
      },
      coupons: [{
        code: 'TEST',
        savings: '10.00',
        currency: 'EUR',
      }],
      currency: 'EUR',
      meta: {},
    };

    it('should build event data correctly', () => {
      getRegisteredCallback('purchase')(orderData, orderData);
      expect(sgAnalyticsSpy).toHaveBeenLastCalledWith('track', 'checkoutCompleted', trackPayload);
    });

    it('should build event data correctly when meta data is present', () => {
      const meta = {
        meta: {
          type: 'app_legacy',
        },
      };

      const orderDataWithMeta = {
        ...orderData,
        ...meta,
      };

      getRegisteredCallback('purchase')(orderDataWithMeta, orderDataWithMeta);

      expect(sgAnalyticsSpy).toHaveBeenLastCalledWith('track', 'checkoutCompleted', {
        ...trackPayload,
        ...meta,
      });
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
