"use strict"

angular.module('FormarbleExample', ['formarble', 'formarble/controls/simple', 'formarble/controls/card'])
    .run(function ($rootScope, $window) {
        $rootScope.schema = $window.schema;
        $rootScope.model = {};

        var DEFAULTS = {
            expirationYear: 2015,
            expirationMonth: 8
        };

        $rootScope.reset = function () {
            $rootScope.model = angular.copy(DEFAULTS);
        }

        $rootScope.reset();
    });