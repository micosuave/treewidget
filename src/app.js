angular.module('adf.widget.treewidget')
    .run(['data', function(data) {
        data.fetchJsonData().then(function(response) {
            console.log('data loaded');
        }, console.error);
    }]);
