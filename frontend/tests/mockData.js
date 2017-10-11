/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

export const pageViewData = {
  product: {
    uid: 'SG12',
    productNumber: 'item_number_public-12',
    name: 'Produkt mit 0% MwSt. - §25a',
    stockQuantity: 0,
    identifiers: {
      ean: '123-456',
    },
    amount: {
      currency: 'EUR',
      taxRate: '0.00',
      net: '100.00',
      gross: '100.00',
      tax: '0.00',
      displayPrice: '100.00',
      displayPriceStriked: '140.00',
    },
    tags: [],
  },
  page: {
    referrer: 'http://google.de/',
    name: 'productDetails',
    link: 'http://google.de/php/shopgate/item/53473132',
    title: 'Produkt mit 0% MwSt. - §25a - Offizieller Shopgate Testshop DEV',
  },
};

export const addToCartData = {
  products: [
    {
      uid: 'SG12',
      productNumber: 'item_number_public-12',
      name: 'Produkt mit 0% MwSt. - §25a',
      stockQuantity: 0,
      identifiers: {
        ean: '123-456',
      },
      amount: {
        currency: 'EUR',
        taxRate: '0.00',
        net: '100.00',
        gross: '100.00',
        tax: '0.00',
        displayPrice: '100.00',
        displayPriceStriked: '140.00',
      },
      tags: [],
      quantity: 1,
    },
  ],
};

export const orderData = {
  order: {
    number: '1234',
    amount: {
      currency: 'EUR',
      gross: '739.61',
      net: '621.52',
      tax: '118.09',
      coupons: {
        currency: 'EUR',
        net: '0.00',
        gross: '0.00',
      },
      displayPrice: '708.11',
      displayPriceStriked: '805.31',
    },
    shipping: {
      name: 'POLISHPOST',
      amount: {
        currency: 'EUR',
        gross: '3.00',
        net: '2.52',
        tax: '0.48',
      },
    },
    payment: {
      name: 'Nachnahme (Eigene Abwicklung)',
      amount: {
        currency: 'EUR',
        gross: '0.00',
        net: '0.00',
        tax: '0.00',
      },
    },
    shippingAddress: {
      firstName: 'Rene',
      surname: 'Eichhorn',
      company: '',
      street: 'gdfgfdgdfgfdg 32',
      street2: '',
      zipcode: '11111',
      stateId: null,
      city: 'fdgdfgdfgdfgfd',
      country: 'DE',
    },
    invoiceAddress: {
      firstName: 'Rene',
      surname: 'Eichhorn',
      company: '',
      street: 'gdfgfdgdfgfdg 32',
      street2: '',
      zipcode: '11111',
      stateId: null,
      city: 'fdgdfgdfgdfgfd',
      country: 'DE',
    },
    user: {
      email: 'foo',
      gender: 'm',
      phone: '342342342',
      birthday: '1986-06-10',
      customerNumber: '1234',
      externalCustomerId: '',
      externalCustomerNumber: '',
    },
    products: [
      {
        uid: 'SG12',
        productNumber: 'item_number_public-12',
        name: 'Produkt mit 0% MwSt. - §25a',
        stockQuantity: 0,
        identifiers: {
          ean: '123-456',
        },
        amount: {
          currency: 'EUR',
          taxRate: '0.00',
          net: '100.00',
          gross: '100.00',
          tax: '0.00',
          displayPrice: '100.00',
          displayPriceStriked: '140.00',
        },
        tags: [],
        quantity: 1,
      },
    ],
    coupons: [{
      code: 'TEST',
      amount: {
        gross: '10.00',
        net: '10.00',
        currency: 'EUR',
      },
    }],
    field: {
      thingy: {
        label: 'Something I wanna know from you',
        value: '',
      },
      givmemore: {
        label: 'give more infos please',
        value: '',
      },
    },
  },
};
