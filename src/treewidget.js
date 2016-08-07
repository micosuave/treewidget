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
            }).widget('timelinewidget', {
              title: 'Time Line',
              description: 'build a Timeline',
              templateUrl: '{widgetsPath}/treewidget/src/alt/timeline.html',
              reload: true,
              frameless: false,
              styleClass: 'NOA',
              controller: 'TimeLineCtrl',
              edit: {
                templateUrl: '{widgetsPath}/treewidget/src/alt/timeedit.html',
                reload: true,
                controller: 'TimeLineConfigCtrl'

              }
            }).widget('histogram', {
              title: '3D Histogram',
              description: 'build an interactive 3D Histogram Visualization',
              templateUrl: '{widgetsPath}/treewidget/src/alt/histogram.html',
              reload: true,
              frameless: false,
              styleClass: 'NOA',
              controller: 'HistogramCtrl',
              edit: {
                templateUrl: '{widgetsPath}/treewidget/src/alt/histogramedit.html',
                reload: true,
                controller: 'HistogramConfigCtrl'

              }
            }).widget('revealjs', {
              title: 'RevealJS Slideshow',
              description: 'build a presentaion using reveal.js',
              templateUrl: '{widgetsPath}/treewidget/src/alt/reveal_index.html',
              reload: true,
              frameless: false,
              styleClass: 'NOA',
              controller: 'RevealCtrl',
              edit: {
                templateUrl: '{widgetsPath}/treewidget/src/alt/slide_edit.html',
                reload: true,
                controller: 'TreeWidgetConfigCtrl'

              }
            }).widget('threejs', {
              title: 'Three.JS 3D World',
              description: 'build an interactive 3D envirobnent',
              templateUrl: '{widgetsPath}/treewidget/src/alt/three.html',
              reload: true,
              frameless: false,
              styleClass: 'NOA',
              controller: 'ThreeWorldCtrl',
              edit: {
                templateUrl: '{widgetsPath}/treewidget/src/alt/three_edit.html',
                reload: true,
                controller: 'ThreeWorldConfigCtrl'

              }
            })
            ;
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
    }).controller('HistogramCtrl', ["$scope","$stateParams",function($scope,$stateParams){
        var vm = this;
        vm.col = $stateParams.pid;

    }]).controller('RevealCtrl', ["$scope", "$stateParams","revealjs","$document","$window", function ($scope, $stateParams, revealjs,$document,$window) {
      var vm = this;
      vm.options = {
        history: true,
        controls: true,
        progress: true,
        slideNumber: false,
        overview: true,
        center: true,
        touch: true,
        loop: true,
        rtl: false,
        shuffle: false,
        fragments: true,
        embedded: true,
        help: true,
        showNotes: false,
        autoSlide: 10000,
        autoSlideStoppable: true,
        autoSlideMethod: Reveal.navigateNext,
        mouseWheel: true,
        hideAddressBar: true,
        previewLinks: true,
        transition: 'concave',
        transitionSpeed: 'slow',
        backgroundTransition: 'convex',
        viewDistance: 4,
        parallaxBackgroundImage: 'https://lexlab.io/llp_core/img/lll3.svg',
        parallaxBackgroundSize: '1500px 1500px',
        parallaxBackgroundHorizontal: $window.innerWidth*1.5,
        parallaxBackgroundVertical:$window.innerHeight*2,
        dependencies: [
          { src: '/lexlab-starter/node_modules/reveal.js/plugin/markdown/marked.js' },
          { src: '/lexlab-starter/node_modules/reveal.js/plugin/markdown/markdown.js' },
          { src: '/lexlab-starter/node_modules/reveal.js/plugin/notes/notes.js', async: true },
          { src: '/lexlab-starter/node_modules/reveal.js/plugin/highlight/highlight.js', async: true, callback: function () { hljs.initHighlightingOnLoad(); } },
          { src: '/lexlab-starter/node_modules/reveal.js/plugin/zoom-js/zoom.js', async: true },
          { src: '/lexlab-starter/node_modules/reveal.js/plugin/search/search.js', async: true},
          { src: '/lexlab-starter/node_modules/reveal.js/plugin/print-pdf/print-pdf.js', async: true }
        ]
      };
$document.$on('ready', function($evt){
revealjs().then(function(Reveal){


      Reveal.initialize(vm.options);
  });
});
    }]).controller('TimeLineCtrl', ["$scope", "$stateParams","$document","$http","storyjs", function ($scope, $stateParams,$document,$http, storyjs) {
      var vm = this;
      $http.get('/treewidget/src/alt/timeline.json').then(function(resp){
        vm.timelinedata = resp.data;
      });

      vm.options = {
        type: 'timeline',
        width: 800,
        height: 400,
        source: vm.timelinedata,
        embed_id: 'timelinejs',
        hash_bookmark: true,
        debug: true,
        font: 'PTSerif-PTSans'
      };
      $document.ready(function(){
        storyjs().then(function(createStoryJS){
          createStoryJS(vm.options);
      });
      });
    }]);
