/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

import 'mocha';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import './mocks';
/* eslint-disable import/first */
import SgTrackingCore from '@shopgate/tracking-core/core/Core';
/* eslint-enable import/first */
import Plugin from '../src/Plugin';
import { pageViewData, addToCartData, orderData } from './mockData';

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
    new Plugin({ stage: 'development', shopNumber: '1234', access: 'App' });
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
      channel: 'app',
      pushToken: undefined,
      sgUserId: undefined,
      shopNumber: '1234',
    });
  });

  it('should use webapp channel for mobile website', () => {
    /* eslint-disable no-new */
    new Plugin({ stage: 'development', shopNumber: '1234', access: 'Web' });
    /* eslint-enable no-new */

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
    SgTrackingCore.track.purchase(orderData);

    expect(sgAnalyticsSpy).to.have.been.calledWith('track', 'checkoutCompleted', {
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
    });
  });
});
