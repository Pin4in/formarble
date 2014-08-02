"use strict";

module.exports = {
    title: 'Your billing details',

    virtual: {
        'card.name': { extend: 'cardholderName', hidden: false },
        'card.number': { extend: 'cardNumber', hidden: false },
        'card.code': { extend: 'code', hidden: false },
        'card.year': { extend: 'expirationYear', hidden: false },
        'card.month': { extend: 'expirationMonth', hidden: false }
    },

    properties: {
        card: {
            display: {
                name: 'fm-card'
            }
        },

        cardholderName: {
            type: 'string',
            maxLength: 128,
            hidden: true
        },

        cardNumber: {
            type: 'string',
            hidden: true
        },

        code: {
            type: 'string',
            hidden: true
        },

        expirationYear: {
            type: 'number',
            hidden: true
        },

        expirationMonth: {
            type: 'number',
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