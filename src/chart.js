angular.module('adf.widget.treewidget').controller('chartCtrl', ['$scope', 'bus', function($scope, bus) {
    'use strict';

    bus.on('updateData', function(data) {
        $scope.data = angular.copy(data);
    });
}]);
