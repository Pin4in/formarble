window.schema = {
   "title": "How can we help?",
   "virtual": {
      "expiry.year": {
         "hidden": false,
         "__virtual": true
      },
      "expiry.month": {
         "hidden": false,
         "__virtual": true
      }
   },
   "required": [
      "cardholderName",
      "cardNumber",
      "expirationYear",
      "expirationMonth"
   ],
   "focus": "cardholderName",
   "mapping": {},
   "properties": {
      "cardholderName": {
         "type": "string",
         "maxLength": 128,
         "_id": "cardholderName",
         "_path": "cardholderName",
         "path": "cardholderName",
         "display": {
            "name": "fm-input",
            "type": "text",
            "maxlength": 128,
            "required": true,
            "autofocus": true
         },
         "title": "Cardholder name",
         "_order": 1001,
         "level": 1
      },
      "cardNumber": {
         "type": "string",
         "display": {
            "name": "fm-card-number",
            "type": "text",
            "required": true
         },
         "_id": "cardNumber",
         "_path": "cardNumber",
         "path": "cardNumber",
         "title": "Card number",
         "_order": 1002,
         "level": 1
      },
      "expiry": {
         "display": {
            "name": "fm-card-expiry"
         },
         "_id": "expiry",
         "_path": "expiry",
         "path": "expiry",
         "properties": {
            "year": {
               "type": "number",
               "minimum": 2014,
               "maximum": 2024,
               "hidden": false,
               "_id": "expirationYear",
               "_path": "expirationYear",
               "__virtual": true,
               "path": "expiry.year",
               "display": {
                  "name": "fm-input",
                  "type": "number",
                  "max": 2024,
                  "min": 2014
               },
               "title": "Year",
               "_order": 1004,
               "level": 2
            },
            "month": {
               "type": "number",
               "minimum": 1,
               "maximum": 12,
               "hidden": false,
               "_id": "expirationMonth",
               "_path": "expirationMonth",
               "__virtual": true,
               "path": "expiry.month",
               "display": {
                  "name": "fm-input",
                  "type": "number",
                  "max": 12,
                  "min": 1
               },
               "title": "Month",
               "_order": 1005,
               "level": 2
            }
         },
         "title": "Expiry",
         "_order": 1003,
         "level": 1
      },
      "country": {
         "type": "string",
         "enum": [
            "United Kingdom",
            "Ukraine",
            "United states of America",
            "Germany",
            "France",
            "Brazil"
         ],
         "_id": "country",
         "_path": "country",
         "path": "country",
         "display": {
            "name": "fm-select",
            "options": [
               {
                  "id": "United Kingdom",
                  "title": "United Kingdom"
               },
               {
                  "id": "Ukraine",
                  "title": "Ukraine"
               },
               {
                  "id": "United states of America",
                  "title": "United states of America"
               },
               {
                  "id": "Germany",
                  "title": "Germany"
               },
               {
                  "id": "France",
                  "title": "France"
               },
               {
                  "id": "Brazil",
                  "title": "Brazil"
               }
            ]
         },
         "title": "Country",
         "_order": 1006,
         "level": 1
      }
   },
   "display": {
      "name": "fm-input-group"
   },
   "_order": 1000,
   "level": 0
}
