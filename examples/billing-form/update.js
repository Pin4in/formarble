var formarble = require('../../');
var schema = require('./billing.schema.js');

var form = formarble.create(schema);
formarble.ui(form);

console.log('window.schema =', JSON.stringify(form, null, '   '));