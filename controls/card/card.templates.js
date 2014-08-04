angular.module('formarble/controls/card').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/card-number.html',
    '<div class="form-group" ng-class="{\'has-error\': $input.$dirty && $input.$invalid}"><label class="control-label col-sm-4" fm-control-label="">{{card.numberTitle}}</label><div class="col-sm-8"><input class="form-control" type="text" ng-model="number" fm-card-number-input="" required=""></div></div>');
}]);

angular.module('formarble/controls/card').run(['$templateCache', function($templateCache) {
  $templateCache.put('bs-common/card.html',
    '<div ng-form="cf"><div fm-control="card.name"></div><div fm-control="card.number"></div><div class="form-group"><label class="control-label col-sm-4">Expiration</label><div class="col-sm-4"><div class="row"><div class="col-xs-6" fm-control="card.year"></div><div class="col-xs-6" fm-control="card.month"></div></div></div><div class="col-sm-4" fm-control="card.code"></div></div></div>');
}]);
