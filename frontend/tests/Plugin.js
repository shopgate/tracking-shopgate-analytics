import 'mocha';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import './mocks';
/* eslint-disable import/first */
import SgTrackingCore from '@shopgate/tracking-core/core/Core';
/* eslint-enable import/first */
import Plugin from '../src/Plugin';
import { pageViewData, addToCartData } from './mockData';

chai.use(sinonChai);

// Create globals for all tests.
const sgAnalyticsSpy = sinon.spy();

// Expected event that are subscribed on.
const expectedSubscriptions = [
  'pageview',
  'purchase',
  'addToCart',
];

describe('ShopgateAnalyticsPlugin', () => {
  before(() => {
    global.sgAnalytics = sgAnalyticsSpy;

    expectedSubscriptions.forEach((eventName) => {
      sinon.spy(SgTrackingCore.register, eventName);
    });

    /* eslint-disable no-new */
    new Plugin({ stage: 'development', shopNumber: '1234', device: {} });
    /* eslint-enable no-new */

    SgTrackingCore.registerFinished();
  });

  it('should register specified events with core', () => {
    expectedSubscriptions.forEach((eventName) => {
      expect(SgTrackingCore.register[eventName].called).equals(true);
    });
  });

  it('should have initialized the sdk', () => {
    expect(sgAnalyticsSpy).to.have.been.calledWith('setConfig', {
      channel: 'webapp',
      pushToken: undefined,
      sgUserId: undefined,
      shopNumber: '1234',
    });
  });

  it('should build event data for pageViewed correctly', () => {
    SgTrackingCore.track.pageview(pageViewData);

    expect(sgAnalyticsSpy).to.have.been.calledWith('track', 'pageViewed', {
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
    SgTrackingCore.track.addToCart(addToCartData);

    expect(sgAnalyticsSpy).to.have.been.calledWith('track', 'productAddedToCart', {
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

  it('should build event data for checkoutCompleted correctly', () => {
    SgTrackingCore.track.purchase(addToCartData);

    expect(sgAnalyticsSpy).to.have.been.calledWith('track', 'checkoutCompleted', {
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
});
