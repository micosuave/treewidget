'use strict';

angular.module('adf.widget.treewidget', ['adf.provider'])
    .config(function(dashboardProvider) {
        dashboardProvider
            .widget('treewidget', {
                title: 'Tree Builder',
                description: 'build a D3 Tree Visualization',
                templateUrl: '{widgetsPath}/treewidget/src/view.html',
                reload: true,
                frameless: false,
                styleClass: 'NOA',
                controller: 'TreeWidgetCtrl',
                edit: {
                    templateUrl: '{widgetsPath}/treewidget/src/edit.html',
                    reload: true,
                    controller: 'TreeWidgetConfigCtrl'

                }
            });
    })
    .controller('TreeWidgetConfigCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce) {
            if (!config.url) {
                config.url = '/llp_core/data.json';
            } else {
                //var draft = PROJECTDRAFT(config.draftid);
                //$scope.draft = draft;
            }
            $scope.config = config;

            $scope.configured = function() {
                return $scope.config.content !== '';
            };

            $scope.notConfigured = function() {
                return $scope.config.content === '';
            };

            $scope.loadData = function(config) {
                var req = $http.get(config.url).then(function(resp) {
                    config.data = resp.data;
                });
            };
            if (config.url) {
                this.url = $sce.trustAsResourceUrl(config.url);
            }
        }
    ]).controller('TreeWidgetCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce) {
            if (!config.url) {
                config.url = '';
            } else {
                //var draft = PROJECTDRAFT(config.draftid);
                //$scope.draft = draft;
            }
            $scope.config = config;

            $scope.loadTemplate = function(config) {
                var req = $http.get(config.url).then(function(resp) {
                    config.data = resp.data;
                });
            };
            if (config.url) {
                this.url = $sce.trustAsResourceUrl(config.url);
            }
            if (config.data) {
                this.data = config.data;
            }

        }
    ]).factory('config', function() {
        return function() {
            var config = {
                url: '/llp_core/data.json',

                diameter: '500'
            };
            return config;
        }
    });
