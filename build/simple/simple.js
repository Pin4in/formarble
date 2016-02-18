"use strict";

//simple controls
angular.module('formarble/controls/simple', ['formarble'])
    .directive('fmInput', function (fm) {
        return {
            restrict: 'A',
            templateUrl: fm.urlResolver('input')
        }
    })
    .directive('fmTextarea', function (fm) {
        return {
            restrict: 'A',
            templateUrl: fm.urlResolver('textarea')
        }
    })
    .directive('fmCheckbox', function (fm) {
        return {
            restrict: 'A',
            templateUrl: fm.urlResolver('checkbox')
        }
    })
    .directive('fmInputRange', function (fm) {
        return {
            restrict: 'A',
            templateUrl: fm.urlResolver('input-range')
        }
    })
    .directive('fmRadioList', function (fm) {
        return {
            restrict: 'A',
            templateUrl: fm.urlResolver('radiolist')
        }
    })
    .directive('fmSelect', function (fm) {
        return {
            restrict: 'A',
            templateUrl: fm.urlResolver('select')
        }
    });

//group controls
angular.module('formarble/controls/simple')
    .directive('fmInputGroup', function (fm, $interpolate) {
        return {
            restrict: 'A',
            templateUrl: function (tElem, tAttrs) {
                var $control = tElem.data('$control');

                if ($control.items) {
                    return fm.urlResolver('group-items')(tElem)
                }

                return fm.urlResolver('group')(tElem);
            },

            controllerAs: '$group',
            controller: function ($element, $scope) {
                var $control = $element.data('$control');
                var controlIndex = 0;
                var labelFn;

                if ($control.items) {
                    labelFn = $interpolate(fm.oget($control, 'display.fmInputGroup.label'));

                    this.$items = [];

                    var modelValue = fm.oget($scope.$model, $control._path);
                    // init control model as array
                    if (angular.isUndefined(modelValue)) {
                        modelValue = [];
                        fm.oset($scope.$model, $control._path, modelValue);
                    } else
                    /**
                     * wrap control model in array
                     * todo: make this behavior more explicit, this may be wrong in some cases
                     */
                    if (!angular.isArray(modelValue)) {
                        modelValue = [modelValue];
                        fm.oset($scope.$model, $control._path, modelValue);
                    }

                    this.select = function (item) {
                        if (this.selected) {
                            this.selected.$selected = false;
                        }

                        this.selected = item;

                        if (this.selected) {
                            this.selected.$selected = true;
                        }
                    }

                    this.addItem = function () {
                        var itemControl = angular.copy($control.items);
                        delete itemControl.items;//omit this

                        var base = $control._path + '.' + controlIndex;//array like path
                        itemControl._path = base;//rewrite control base

                        //rewrite children base
                        fm.walkProps(itemControl, function (prop) {
                            prop._path = base + '.' + prop._path;
                        })

                        this.$items.push(itemControl);
                        this.select(itemControl);

                        controlIndex++;
                    }

                    this.removeItem = function (item) {
                        if (!item) {
                            return
                        }

                        var index = this.$items.indexOf(item),
                            len,
                            selectIndex;

                        if (index > -1) {
                            /**
                             * remove model
                             * don't really remove but set to null in order to keep synced model index with its control._path index
                             *
                             * case:
                             *
                             * modelsArray = [model0, model1];
                             *
                             * model0: index => 0, control = {_path: 0};
                             * model1: index => 1, control = {_path: 1};
                             *
                             * remove(modelsArray, model0);
                             *
                             * modelsArray => [model1]
                             *
                             * model1: index => 0
                             * model1: control._path => 1
                             *
                             * error - not synced
                             */
                            fm.oset($scope.$model, item._path, null);
                            //remove control
                            this.$items.splice(index, 1);

                            //select same controlIndex or last item;
                            len = this.$items.length;
                            selectIndex = index < len ? index : len - 1;
                        } else {
                            //first item
                            selectIndex = 0;
                        }

                        this.select(this.$items[selectIndex]);
                    }

                    this.getLabel = function (item) {
                        var labelScope = {
                            index: this.$items.indexOf(item) + 1,
                            control: item,
                            model: fm.oget($scope.$model, item._path)
                        };
                        return labelFn(labelScope);
                    }

                    //add controls for initialized models
                    angular.forEach(modelValue, function () {
                        this.addItem();
                    }, this)
                }
            }
        };
    })
angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/checkbox.html',
    '<div class="form-group"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><div class="checkbox"><label><input type="checkbox" fm-control-input=""> {{$control.description}}</label><p class="help-block pull-right"><a href="" ng-click="$setEmpty()">use default</a></p></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/control-empty.html',
    '<p class="form-control-static text-muted"><a href="" title="Click to change" ng-click="$setRecommended()">{{$control.defaultHint || \'System default\'}}</a></p>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/control-label.html',
    '{{$control.title}} <a class="control-help" ng-if="$control.display.hint" title="{{$control.display.hint}}"><i class="glyphicon glyphicon-info-sign"></i></a>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/group-items.html',
    '<p class="text-muted">{{$control.title}}</p><ul class="nav nav-tabs"><li><a href="" ng-click="$group.addItem()"><i class="glyphicon glyphicon-plus"></i></a></li><li ng-class="{active: c.$selected}" ng-repeat="c in $group.$items"><a href="" ng-click="$group.select(c)">{{$group.getLabel(c)}}</a></li><li class="pull-right"><a href="" ng-click="$group.removeItem($group.selected)"><i class="glyphicon glyphicon-minus"></i></a></li></ul><div ng-if="!$group.selected"><h3 class="text-center text-muted">Create or select an item first</h3></div><div fm-control="$group.selected"></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/group.html',
    '<div><p class="text-muted">{{$control.title}}</p><div ng-repeat="c in $subControls" fm-control="c"></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/input-range.html',
    '<div class="form-group" ng-class="{\'has-danger\': $input.$invalid}"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><div class="input-group"><input class="form-control" type="range" fm-control-input=""> <span class="input-group-addon" style="min-width: 60px">{{$empty ? \'Auto\' : $value}}</span></div><p class="help-block pull-right"><a href="" ng-click="$setEmpty()">use default</a></p><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/input.html',
    '<div class="form-group" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><input class="form-control" fm-control-input=""><p class="help-block pull-right"><a href="" ng-click="$setEmpty()">use default</a></p><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/radiolist.html',
    '<div class="form-group"><label class="control-label col-sm-4" fm-control-label="" for=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><p class="help-block pull-right"><a href="" ng-click="$setEmpty()">use default</a></p><div class="radio" ng-repeat="li in $control.display.options"><label><input type="radio" fm-control-input="" ng-value="li.id"> {{li.title}}</label></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/select.html',
    '<div class="form-group"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><select class="form-control" fm-control-input=""></select><p class="help-block pull-right"><a href="" ng-click="$setEmpty()">use default</a></p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs/textarea.html',
    '<div class="form-group" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><textarea class="form-control" fm-control-input=""></textarea><p class="help-block pull-right"><a href="" ng-click="$setEmpty()">use default</a></p><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/checkbox.html',
    '<div class="form-group"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><div class="checkbox"><label><input type="checkbox" fm-control-input=""> {{$control.description}}</label></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/control-label.html',
    '{{$control.title}} <a class="control-help" ng-if="$control.display.hint" title="{{$control.display.hint}}"><i class="glyphicon glyphicon-info-sign"></i></a>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/group.html',
    '<div><div ng-repeat="c in $subControls" fm-control="c"></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/input-range.html',
    '<div class="form-group" ng-class="{\'has-danger\': $input.$invalid}"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><div class="input-group"><input class="form-control" type="range" fm-control-input=""> <span class="input-group-addon" style="min-width: 60px">{{$empty ? \'Auto\' : $value}}</span></div><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/input.html',
    '<div class="form-group" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><input class="form-control" fm-control-input=""><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/radiolist.html',
    '<div class="form-group"><label class="control-label col-sm-4" fm-control-label="" for=""></label><div class="col-sm-8"><div class="radio" ng-repeat="li in $control.display.options"><label><input type="radio" fm-control-input="" ng-value="li.id"> {{li.title}}</label></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/select.html',
    '<div class="form-group"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><select class="form-control" fm-control-input=""></select></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/textarea.html',
    '<div class="form-group" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><textarea class="form-control" fm-control-input=""></textarea><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/checkbox.html',
    '<div class="form-group row"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><div class="checkbox"><label><input type="checkbox" fm-control-input=""> {{$control.description}}</label><p class="help-block"><a href="" ng-click="$setEmpty()">Reset to default</a></p></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/control-empty.html',
    '<p class="form-control-static text-muted"><a href="" title="Click to change" ng-click="$setRecommended()">{{$control.defaultHint || \'System default\'}}</a></p>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/control-label.html',
    '{{$control.title}} <a class="control-help" ng-if="$control.display.hint" title="{{$control.display.hint}}"><i class="glyphicon glyphicon-info-sign"></i></a>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/group-items.html',
    '<p class="text-muted">{{$control.title}}</p><ul class="nav nav-tabs"><li><a href="" ng-click="$group.addItem()"><i class="glyphicon glyphicon-plus"></i></a></li><li ng-class="{active: c.$selected}" ng-repeat="c in $group.$items"><a href="" ng-click="$group.select(c)">{{$group.getLabel(c)}}</a></li><li class="pull-xs-right"><a href="" ng-click="$group.removeItem($group.selected)"><i class="glyphicon glyphicon-minus"></i></a></li></ul><div ng-if="!$group.selected"><h3 class="text-xs-center text-muted">Create or select an item first</h3></div><div fm-control="$group.selected"></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/group.html',
    '<div><p class="text-muted">{{$control.title}}</p><div ng-repeat="c in $subControls" fm-control="c"></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/input-range.html',
    '<div class="form-group row" ng-class="{\'has-danger\': $input.$invalid}"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><div class="input-group"><input class="form-control" type="range" fm-control-input=""> <span class="input-group-addon" style="min-width: 60px">{{$empty ? \'Auto\' : $value}}</span></div><p class="help-block"><a href="" ng-click="$setEmpty()">Reset to default</a></p><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/input.html',
    '<div class="form-group row" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><input class="form-control" fm-control-input=""><p class="help-block"><a href="" ng-click="$setEmpty()">Reset to default</a></p><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/radiolist.html',
    '<div class="form-group row"><label class="form-control-label col-sm-4" fm-control-label="" for=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><div class="radio" ng-repeat="li in $control.display.options"><label><input type="radio" fm-control-input="" ng-value="li.id"> {{li.title}}</label></div><div class="radio"><a href="" ng-click="$setEmpty()">Reset to default</a></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/select.html',
    '<div class="form-group row"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><select class="form-control" fm-control-input=""></select><p class="help-block"><a href="" ng-click="$setEmpty()">Reset to default</a></p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4/textarea.html',
    '<div class="form-group row" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8" ng-if="$useDefault" fm-control-empty=""></div><div class="col-sm-8" ng-hide="$useDefault"><textarea class="form-control" fm-control-input=""></textarea><p class="help-block"><a href="" ng-click="$setEmpty()">Reset to default</a></p><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/checkbox.html',
    '<div class="form-group row"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><div class="checkbox"><label><input type="checkbox" fm-control-input=""> {{$control.description}}</label></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/control-label.html',
    '{{$control.title}} <a class="control-help" ng-if="$control.display.hint" title="{{$control.display.hint}}"><i class="glyphicon glyphicon-info-sign"></i></a>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/group.html',
    '<div><div ng-repeat="c in $subControls" fm-control="c"></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/input-range.html',
    '<div class="form-group row" ng-class="{\'has-danger\': $input.$invalid}"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><div class="input-group"><input class="form-control" type="range" fm-control-input=""> <span class="input-group-addon" style="min-width: 60px">{{$empty ? \'Auto\' : $value}}</span></div><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/input.html',
    '<div class="form-group row" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><input class="form-control" fm-control-input=""><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/radiolist.html',
    '<div class="form-group row"><label class="form-control-label col-sm-4" fm-control-label="" for=""></label><div class="col-sm-8"><div class="radio" ng-repeat="li in $control.display.options"><label><input type="radio" fm-control-input="" ng-value="li.id"> {{li.title}}</label></div></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/select.html',
    '<div class="form-group row"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><select class="form-control" fm-control-input=""></select></div></div>');
}]);

angular.module('formarble/controls/simple').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs4-common/textarea.html',
    '<div class="form-group row" ng-class="{\'has-danger\': $input.$dirty && $input.$invalid}"><label class="form-control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><textarea class="form-control" fm-control-input=""></textarea><p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);
