angular.module('formarble/controls/card').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/card-expiry.html',
    '<div class="form-group"><label class="control-label col-sm-4" fm-control-label="" for=""></label><div class="col-sm-4"><div class="row"><div class="col-xs-6"><select class="form-control" ng-model="year" ng-options="y for y in _years"></select></div><div class="col-xs-6"><select class="form-control" ng-model="month" ng-options="m for m in _months"></select></div></div><p class="help-block" ng-if="$control.description">{{$control.description}}</p></div></div>');
}]);

angular.module('formarble/controls/card').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/card-number.html',
    '<div class="form-group" ng-class="{\'has-error\': $input.$dirty && $input.$invalid}"><label class="control-label col-sm-4" fm-control-label=""></label><div class="col-sm-8"><input class="form-control" type="text" fm-control-input="" fm-card-number-input=""><input class="form-control" type="text" fm-control-input="">{{$caret}}<p ng-if="$control.description" class="help-block">{{$control.description}}</p></div></div>');
}]);
