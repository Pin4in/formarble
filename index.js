"use strict";

var util = require('util');
var _ = require('lodash');

function toPath(path){
    if(_.isUndefined(path)){
        throw "Path must be defined";
    }
    if(_.isArray(path)){
        return _.flatten(path).join('.');
    }
    return path;
}

function objSet(obj, path, value) {
    var segments = toPath(path).split('.'),
        cursor = obj,
        segment,
        len = segments.length - 1,
        i;

    for (i = 0; i < len; i++) {
        segment = segments[i];
        cursor = cursor[segment] || (cursor[segment] = {});
    }

    return cursor[segments[i]] = value;
}

function objGet(obj, path) {
    var segments = toPath(path).split('.'),
        cursor = obj,
        len = segments.length,
        i;

    for (i = 0; i < len; i++) {
        cursor = cursor[segments[i]];

        if (undefined === cursor) {
            return;
        }
    }

    return cursor;
}

function objGetInherited(obj, path) {
    var segments = toPath(path).split('.'),
        value = segments.pop(),
        len = segments.length,
        i = len,
        result;

    for(i; i >= 0; i--){
        result = objGet(obj,  i ? [segments.slice(0, i), value] : value);
        if(undefined !== result) {
            return result;
        }
    }
}

function schemaSet(obj, path, value) {
    var path = 'properties.' + toPath(path).split('.').join('.properties.');
    return objSet(obj, path, value);
}

function schemaGet(obj, path) {
    var path = 'properties.' + toPath(path).split('.').join('.properties.');
    return objGet(obj, path);
}

function schemaGetInherited(obj, path) {
    var path = 'properties.' + toPath(path).split('.').join('.properties.');
    return objGetInherited(obj, path);
}


function isDefined(value) {
    return undefined !== value;
}

function isObjectNotArray(value) {
    return _.isObject(value) && !_.isArray(value);
}

function ucFirst(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function startsWith(string, find) {
    return string.slice(0, find.length) === find;
}

function replacePrefix(string, find, replace) {
    if (startsWith(string, find)) {
        return replace + string.slice(find.length)
    }
    return string;
}

function humanize(value) {
    if (value.match(/[a-z]/i)) {
        value = value.replace(/([a-z])[\W]+/g, '$1 ');
        value = value.replace(/([a-z])([A-Z]+|\d+)/g, function (matched, low, high) {
            return low + ' ' + (1 === high.length ? high.toLowerCase() : high);
        });
        return ucFirst(value);
    }

    return value;
}

function getInputName(value) {
    if (value) {
        return _.isString(value) ? value : value.name;
    }
}

function mapNormalize(map) {
    var remapsTotalMax = 1000,
        remapsTotal;

    do {
        remapsTotal = 0;

        _.each(map, function (to, from) {
            var remaps = 0;
            while (true) {
                remapsTotal += remaps;
                remaps = 0;
                _.each(map, function (ito, ifrom) {
                    if (to === ito) {
                        return;
                    }

                    if (to === ifrom || startsWith(to, ifrom + '.')) {
                        to = replacePrefix(to, ifrom, ito);
                        remaps++;
                    }
                });

                if (remapsTotal > remapsTotalMax) {
                    throw new Error('Possible remap cycle');
                }
                if (remaps) {
                    map[from] = to;
                    continue;
                }
                break;
            }
        })

    } while (remapsTotal)
}

function mapString(map, target) {
    if (_.isString(target)) {
        _.each(map, function (to, from) {
            target = replacePrefix(target, from, to);
        })
    }
    return target;
}

function mapCollection(map, target) {
    if (_.isObject(target)) {
        _.each(target, function (value, key) {
            target[key] = mapString(map, value);
        })
    }
    return target;
}

function resolveDisplay(schema) {
    var input,
        inputDefaultValue;

    switch (schema.type) {
        case 'time':
        case 'date':
        case 'datetime':
        case 'datetime-local':
        case 'month':
        case 'week':
            input = { name: 'fm-input', type: schema.type };
            break;

        case 'boolean':
            input = { name: 'fm-checkbox'};
            inputDefaultValue = false;
            break;

        case 'number':
            input = { name: 'fm-input', type: 'number'};

            if(isDefined(schema.minimum) && isDefined(schema.maximum)) {
                inputDefaultValue = Math.round(schema.minimum/2 + schema.maximum/2)
            } else {
                inputDefaultValue = schema.minimum || schema.maximum || 0;
            }

            break;

        case 'string':
            if (schema.enum) {
                if (schema.enum.length > 3) {
                    input = { name: 'fm-select' };
                } else {
                    input = { name: 'fm-radio-list' };
                }

                inputDefaultValue = schema.enum[0];

            } else {
                input = { name: 'fm-input', type: 'text'};

                inputDefaultValue = '';
            }
            break;

        default:
            if (isObjectNotArray(schema.properties)) {
                input = { name: 'fm-input-group' };
            }
    }

    if (input) {
        resolveInputOptions(input, schema);
    }

//    if (isDefined(inputDefaultValue) && !isDefined(schema.recommended)) {
//        schema.recommended = inputDefaultValue;
//    }

    return input;
}

function resolveDisplayFallback(input, schema) {
//    switch (getInputName(input)) {
//        case 'input/range':
//            input.fallback = {name: 'input', type: 'range'};
//            break;
//
//        case 'input/number':
//            input.fallback = {name: 'input', type: 'number'};
//            break;
//
//        case 'input/color':
//            input.fallback = {name: 'input', type: 'color'};
//            break;
//
//        case 'textarea':
//            input.fallback = {name: 'input', type: 'text'};
//            break;
//
//        case 'radio-list':
//            input.fallback = {name: 'select'};
//            break;
//
//        case 'fieldset':
//            input.fallback = {name: 'group'};
//            break;
//
//    }
//    return schema;
}

function resolveInputOptions(input, schema) {
    if (isDefined(schema.maximum)) {
        input.max = schema.maximum;
    }
    if (isDefined(schema.minimum)) {
        input.min = schema.minimum;
    }
    if (isDefined(schema.exclusiveMaximum)) {
        input.max = schema.exclusiveMaximum - 1;
    }
    if (isDefined(schema.exclusiveMinimum)) {
        input.min = schema.exclusiveMinimum + 1;
    }
    if (isDefined(schema.multipleOf)) {
        input.step = schema.multipleOf;
    }
    if (isDefined(schema.maxLength)) {
        input.maxlength = schema.maxLength;
    }
    if (isDefined(schema.minLength)) {
        input.minlength = schema.minLength;
    }
    if (isDefined(schema.pattern)) {
        input.pattern = schema.pattern.toString();
    }
    if (isDefined(schema.enum)) {
        input.options = schema.enum.map(function (value) {
            var title = (schema.display && schema.display.labels && schema.display.labels[value]) || humanize(value);
            return {id: value, title: title};
        })
    }
    return input;
}

function walkSchema(schema, transformFn, childrenFirst) {

    function _walkSchema(obj, id, path, parent) {
        if (!childrenFirst) {
            transformFn(obj, id, path, parent);
        }

        if (isObjectNotArray(obj.properties)) {
            _.each(obj.properties, function (prop, propId) {
                var propPath = path ? path + '.' + propId : propId;

                _walkSchema(prop, propId, propPath, obj);
            })
        }

        if (childrenFirst) {
            transformFn(obj, id, path, parent);
        }
    }

    _walkSchema(schema, '', '');
}


/**
 * Create form schema based on {schema}
 * 1. Resolve base options
 * 2. Apply properties grouping
 *
 * @param schema
 * @returns {*}
 */
exports.create = function (schema) {
    var root;
    var nodes = {};
    var map = {};
    var virtual = {};

    //walk through schema and collect nodes with original path
    walkSchema(schema, function (src, id, path, parent) {
        //clone source node without children
        var prop = _(src).omit('properties').cloneDeep();

        if (path) {
            //collect mapping
            if (prop.mapping) {
                _.each(prop.mapping, function (to, from) {
                    map[path + '.' + from] = path + '.' + to;
                })
                delete prop.mapping;
            }
            //collect virtual props
            if (prop.virtual) {
                _.each(prop.virtual, function (from, to) {
                    virtual[path + '.' + to] = path + '.' + from;
                })
                delete prop.virtual;
            }

            //store original id and path
            prop._id = id;
            prop._path = path;
            //collect node in flat hash
            nodes[path] = prop;
        } else {
            //root node
            root = prop;
        }
    });

    root.mapping = _.extend(map, root.mapping);
    root.virtual = _.extend(virtual, root.virtual);

    mapNormalize(root.mapping);

    //create virtual nodes
    _.each(root.virtual, function (srcId, targetId) {
        var extend, src;

        if (_.isPlainObject(srcId)) {
            src = nodes[srcId.extend];
            extend = srcId;

            delete srcId.extend;
        } else if (_.isString(srcId)) {
            src = nodes[srcId];
            extend = {}
        }

        extend.__virtual = true;
        nodes[targetId] = _.merge(_.cloneDeep(src), extend);
    });


    _(nodes).keys()
        .sortBy(function (key) {
            var m = mapString(root.mapping, key).match(/\./g);
            return m ? m.length : 0;
        })
        .each(function (path) {
            var node = nodes[path];

            if(node.hidden) {
                return;
            }

            node.path = mapString(root.mapping, path);

            if (node.items) {
                node.items = exports.create(node.items);
            }

            schemaSet(root, node.path, node);
        });

    //resolve id and path for newly created nodes
//    walkSchema(root, function (src, id, path, parent) {
//        src._id = src._id || id;
//        src._path = src._path || path;
//    })

    return root;
}

exports.merge = function (dest, src) {
    return _.merge(_.cloneDeep(dest), src);
}

exports.ui = function (schema) {
    var orderIndexStart = 1000;

    walkSchema(schema, function (prop, id, path, parent) {
        var auto = resolveDisplay(prop);

        //resolve display options
        if (auto) {
            if (prop.display) {
                prop.display = _.merge(auto, prop.display);
            } else {
                prop.display = auto;
            }
        }

        if (prop.hidden) {
            prop.display = false
        }

        if (!prop.display) {
            return;
        }

        if (prop.oneOf) {
            delete prop.oneOf;
        }

        resolveDisplayFallback(prop.display, prop);

        //add title
        if (!isDefined(prop.title)) {
            prop.title = humanize(id);
        }

        //resolve display order
        if (!isDefined(prop._order)) {
            prop._order = orderIndexStart++;
        }

        if (parent) {
            //resolve required
            if (parent.required && parent.required.indexOf(id) > -1) {
                prop.display.required = true;
            }

            //resolve autofocus
            if (parent.focus == id) {
                prop.display.autofocus = true;
            }

            //resolve display level
            prop.level = parent.level + 1;
        } else {
            //resolve display level
            prop.level = 0;
        }

        if (prop.items) {
            exports.ui(prop.items);
        }
    })
}

/**
 * @description
 * Create deep copy of source object and merge all extensions into it
 *
 * @param {Object} src Source object
 * @param {...Object} ext Extensions
 *
 * @returns {Object} Deep copy of extended `src`
 */
exports.import = function (src, ext) {
    var child;

    if (src.schema && src.form) {
        child = exports.merge(src.schema, src.form);
    } else {
        child = _.cloneDeep(src);
    }

    _.rest(arguments).forEach(function(ext){
        _.merge(child, ext);
    });

    return child;
}

