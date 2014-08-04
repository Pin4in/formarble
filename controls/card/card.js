"use strict";

angular.module('formarble/controls/card', ['formarble'])
    .directive('fmCard', function (fm) {
        var now = new Date();

        function uuid(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        function range(start, end, inclusive) {
            var r = [], i;
            end += inclusive ? 1 : 0;
            for (i = start; i < end; i++) {
                r.push(i);
            }
            return r;
        }

        function bind(scope, from, to) {
            scope.$watch(from, function (value) {
                fm.oset(scope, to, value)
            });
            scope.$watch(to, function (value) {
                fm.oset(scope, from, value)
            });
        }

        return {
            templateUrl: fm.urlResolver('card'),
            controllerAs: 'card',
            controller: function ($scope, $element) {
                var ctrl = this;

                var mLocalYear = 'year',
                    mLocalMonth = 'month',
                    mLocalNumber = 'number',
                    mLocalName = 'name',
                    mLocalCode = 'code';

                var thisYear = now.getFullYear(),
                    endYear = thisYear + 10,
                    thisMonth = now.getMonth() + 1,
                    monthsOfThisYear = range(thisMonth, 12, true),
                    monthsOfOtherYear = range(1, 12, true);

                this._years = range(thisYear, endYear, true);
                this._months = monthsOfOtherYear;

                $scope.$watch(mLocalYear, function (value) {
                    if (value === thisYear) {
                        ctrl._months = monthsOfThisYear;
                        if ($scope.month < thisMonth) {
                            $scope.month = thisMonth;
                        }
                    } else {
                        ctrl._months = monthsOfOtherYear;
                    }
                });

                this.name = $scope.$control.properties.name;
                this.number = angular.extend({}, $scope.$control.properties.number, {display: {name:'fm-card-number'}});
                this.year = $scope.$control.properties.year;
                this.month = $scope.$control.properties.month;
                this.code = $scope.$control.properties.code;


//                this.expirationTitle = 'Date expires';

                angular.forEach([mLocalName, mLocalNumber, mLocalYear, mLocalMonth, mLocalCode], function(model){
//                    var control = $scope.$control.properties[model];
//                    var origModel = ['$model', control._path].join('.');
//
//                    ctrl[model] = control;

//                    ctrl[model+'Title'] = control.title;
//                    ctrl[model+'Id'] = uuid();

//                    bind($scope, origModel, model);
                });
            }
        }
    })
    .directive('fmCardNumber', function (fm) {
        return {
            templateUrl: fm.urlResolver('card-number')
        };
    })
    .directive('fmCardNumberInput', function (fm, $browser) {
        function bind(scope, from, to) {
                    scope.$watch(from, function (value) {
                        fm.oset(scope, to, value)
                    });
                    scope.$watch(to, function (value) {
                        fm.oset(scope, from, value)
                    });
                }

        function luhn(a, b, c, d, e) {
            for (d = +a[b = a.length - 1], e = 0; b--;)c = +a[b], d += ++e % 2 ? 2 * c % 10 + (c > 4) : c;
            return!(d % 10)
        }

        function getCaret(el) {
            if (el.selectionStart) {
                return el.selectionStart;
            } else if (document.selection) {
                el.focus();

                var r = document.selection.createRange();
                if (r == null) {
                    return 0;
                }

                var re = el.createTextRange(),
                    rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);

                return rc.text.length;
            }
            return 0;
        }

        function setCaret(elem, position) {
            if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', position);
                range.select();
            }
            else {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(position, position);
                }
                else
                    elem.focus();
            }
        }

        function normalizeCardNumber(value) {
            return value ? value.replace(/[^\d]+/g, '') : value;
        }

        //http://www.freeformatter.com/credit-card-number-generator-validator.html#cardFormats
        function formatCardNumber(value){
            var type;

            if(!value) {
                return value;
            }

            value = normalizeCardNumber(value);
            type = getCardType(value);

            switch (type){
                case 'visa'://13-16
                case 'mastercard'://16-19, but 3 last numbers appears to be a cvv code
                default:
                    value = value.slice(0, 16)
                        .replace(/(\d{4})/g, '$1 ');
                    break;

                case 'amex':
                    value = value.slice(0, 15)//15
                        .replace(/^(\d{4})(\d{6})(\d+)/, '$1 $2 $3')
                        .replace(/^(\d{4})(\d+)/, '$1 $2');
                    break;

            }
            return value.trim();
        }

        function getCardType(value) {
            if(!value) {
                return;
            }

            if("4" === value[0]){
                return 'visa';
            }

            if(-1 !== ['34','37'].indexOf(value.slice(0, 2))){
                return 'amex';
            }

            if(-1 !== ['51', '52', '53', '54', '55'].indexOf(value.slice(0, 2))){
                return 'mastercard';
            }
        }

        function isIgnoredKeyPressed(e) {
            var key = e.keyCode;
            return 46 == key//delete
                || 8 == key//backspace
                || 91 == key || (15 < key && key < 19) || (37 <= key && key <= 40);
        }

        return {
            require: 'ngModel',
            link: function (scope, elem, attr, model) {
                function listener(){
                    var value = elem.val();

                    var formatted, left,
                        caret = getCaret(elem[0]);

                    if (!model.$isEmpty(value)) {
                        left = value.slice(0, caret);
                        caret -= left.length - formatCardNumber(left).length;
                        formatted = formatCardNumber(value);

                        if (formatted != value) {
                            elem.val(formatted);
                            setCaret(elem[0], caret);
                        }
                    }
                }

                elem.attr('id', scope.$control.$id);

                elem.bind('keyup', function(e){
                    if (isIgnoredKeyPressed(e)){ return; }

                    $browser.defer(listener);
                });
                elem.bind('change paste cut', function() {
                    $browser.defer(listener)
                });

                //format value, whenever the model value changes
                model.$formatters.push(function(value){
                    if(value){
                        return formatCardNumber(value)
                    }
                });

                //format value, whenever the control reads value from the DOM
                model.$parsers.unshift(function (value) {
                    if(value) {
                        return normalizeCardNumber(formatCardNumber(value));
                    }
                });

                //validate number
                model.$parsers.push(function (value) {
                    //don't validate with other errors
                    if (model.$error.required) {
                        model.$setValidity('creditCard', true);
                        return;
                    }

                    if (!model.$isEmpty(value) && luhn(value)) {
                        model.$setValidity('creditCard', true);

                        return value;
                    } else {
                        model.$setValidity('creditCard', false);

                        return;
                    }
                });

                scope.$input = model;

                bind(scope, 'number', ['$model', scope.$control._path].join('.'));
            }
        }
    })