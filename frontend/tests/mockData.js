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
