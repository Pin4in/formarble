window.schema = {
   "title": "Your billing details",
   "virtual": {
      "card.name": {
         "hidden": false,
         "__virtual": true
      },
      "card.number": {
         "hidden": false,
         "__virtual": true
      },
      "card.code": {
         "hidden": false,
         "__virtual": true
      },
      "card.year": {
         "hidden": false,
         "__virtual": true
      },
      "card.month": {
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
      "card": {
         "display": {
            "name": "fm-card"
         },
         "required": [
            "name",
            "number",
            "year",
            "month"
         ],
         "_id": "card",
         "_path": "card",
         "path": "card",
         "properties": {
            "name": {
               "type": "string",
               "maxLength": 128,
               "hidden": false,
               "_id": "cardholderName",
               "_path": "cardholderName",
               "__virtual": true,
               "path": "card.name",
               "display": {
                  "name": "fm-input",
                  "type": "text",
                  "maxlength": 128,
                  "required": true
               },
               "title": "Name",
               "_order": 1002,
               "level": 2
            },
            "number": {
               "type": "string",
               "hidden": false,
               "_id": "cardNumber",
               "_path": "cardNumber",
               "__virtual": true,
               "path": "card.number",
               "display": {
                  "name": "fm-input",
                  "type": "text",
                  "required": true
               },
               "title": "Number",
               "_order": 1003,
               "level": 2
            },
            "code": {
               "type": "string",
               "hidden": false,
               "_id": "code",
               "_path": "code",
               "__virtual": true,
               "path": "card.code",
               "display": {
                  "name": "fm-input",
                  "type": "text"
               },
               "title": "Code",
               "_order": 1004,
               "level": 2
            },
            "year": {
               "type": "number",
               "hidden": false,
               "_id": "expirationYear",
               "_path": "expirationYear",
               "__virtual": true,
               "path": "card.year",
               "display": {
                  "name": "fm-input",
                  "type": "number",
                  "required": true
               },
               "title": "Year",
               "_order": 1005,
               "level": 2
            },
            "month": {
               "type": "number",
               "hidden": false,
               "_id": "expirationMonth",
               "_path": "expirationMonth",
               "__virtual": true,
               "path": "card.month",
               "display": {
                  "name": "fm-input",
                  "type": "number",
                  "required": true
               },
               "title": "Month",
               "_order": 1006,
               "level": 2
            }
         },
         "title": "Card",
         "_order": 1001,
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
         "_order": 1007,
         "level": 1
      }
   },
   "display": {
      "name": "fm-input-group"
   },
   "_order": 1000,
   "level": 0
}
