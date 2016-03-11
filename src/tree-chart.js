angular.module('adf.widget.treewidget').directive('treeChartWidget', ['bus','d3Service', function(bus, d3Service) {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: '<div id="graph"></div>',
        scope: {
            data: '='
        },
        link: function(scope, element) {
             d3Service.d3().then(function(d3) {
            var chart = d3.chart.architectureTree();

            scope.$watch("data", function(data) {
                if (typeof(data) === 'undefined') {
                    return;
                }

                chart.diameter(960)
                    .data(scope.data);

                d3.select(element[0])
                    .call(chart);
            });

            bus.on('nameFilterChange', function(nameFilter) {
                chart.nameFilter(nameFilter);
            });

            bus.on('technosFilterChange', function(technosFilter) {
                chart.technosFilter(technosFilter);
            });

            bus.on('hostsFilterChange', function(hostsFilter) {
                chart.hostsFilter(hostsFilter);
            });

            bus.on('select', function(name) {
                chart.select(name);
            });

            bus.on('unselect', function() {
                chart.unselect();
            });

        });
       }
    };
}]);
