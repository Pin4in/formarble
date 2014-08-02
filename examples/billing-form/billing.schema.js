"use strict";

module.exports = {
    title: 'How can we help?',

    virtual: {
        'expiry.year': { extend: 'expirationYear', hidden: false },
        'expiry.month': { extend: 'expirationMonth', hidden: false }
    },

    properties: {
        cardholderName: {
            type: 'string',
            maxLength: 128
        },

        cardNumber: {
            type: 'string',

            display: {
                name: 'fm-card-number'
            }
        },

        expiry: {
            display: {
                name: 'fm-card-expiry'
            }
        },

        expirationYear: {
            type: 'number',
            minimum: 2014,
            maximum: 2024,

            hidden: true
        },

        expirationMonth: {
            type: 'number',
            minimum: 1,
            maximum: 12,

            hidden: true
        },

        country: {
            type: 'string',
            enum: ['United Kingdom', 'Ukraine', 'United states of America', 'Germany', 'France', 'Brazil']
        }
    },
    required: ['cardholderName', 'cardNumber', 'expirationYear', 'expirationMonth'],
    focus: 'cardholderName'
};