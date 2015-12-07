angular.module('adf.widget.treewidget').controller('undoCtrl', ['$scope', 'bus', 'data', function($scope, bus, data) {

    var history = [];

    bus.on('updateData', function(data) {
        history.push(angular.copy(data));
    });

    $scope.hasHistory = function() {
        return history.length > 1;
    };

    $scope.undo = function() {
        history.pop(); // remove current state
        data.setJsonData(history.pop()); // restore previsous state
    };

}]);
