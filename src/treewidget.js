'use strict'

angular.module('adf.widget.treewidget', ['adf.provider'])
  .config(function (dashboardProvider) {
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
      controllerAs: 'time',
      edit: {
        templateUrl: '{widgetsPath}/treewidget/src/alt/timeedit.html',
        reload: true,
        controller: 'TimeLineCtrl',
        controllerAs: 'time'

      }
    }).widget('histogram', {
      title: '3D Histogram',
      description: 'build an interactive 3D Histogram Visualization',
      templateUrl: '{widgetsPath}/treewidget/src/alt/histogram.html',
      reload: true,
      frameless: false,
      styleClass: 'dark-bg',
      controller: 'HistogramCtrl',
      controllerAs: 'histogram',
      edit: {
        templateUrl: '{widgetsPath}/treewidget/src/alt/hist_edit.html',
        reload: true,
        controller: 'HistogramCtrl'

      }
    }).widget('revealjs', {
      title: 'RevealJS Slideshow',
      description: 'build a presentaion using reveal.js',
      templateUrl: '{widgetsPath}/treewidget/src/alt/reveal_index.html',
      reload: true,
      frameless: false,
      styleClass: 'NOA',
      controller: 'RevealCtrl',
      controllerAs: 'reveal',
      edit: {
        templateUrl: '{widgetsPath}/treewidget/src/alt/slide_edit.html',
        reload: true,
        controller: 'RevealCtrl',
        controllerAs: 'reveal'

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
  })
  .controller('TreeWidgetConfigCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce',
    function ($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce) {
      if (!config.url) {
        config.url = '/llp_core/data.json'
      } else {
        // var draft = PROJECTDRAFT(config.draftid)
        // $scope.draft = draft
      }
      $scope.config = config

      $scope.configured = function () {
        return $scope.config.content !== ''
      }

      $scope.notConfigured = function () {
        return $scope.config.content === ''
      }

      $scope.loadData = function (config) {
        var req = $http.get(config.url).then(function (resp) {
          config.data = resp.data
        })
      }
      if (config.url) {
        this.url = $sce.trustAsResourceUrl(config.url)
      }
    }
  ]).controller('TreeWidgetCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce',
  function ($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce) {
    if (!config.url) {
      config.url = ''
    } else {
      // var draft = PROJECTDRAFT(config.draftid)
      // $scope.draft = draft
    }
    $scope.config = config

    $scope.loadTemplate = function (config) {
      var req = $http.get(config.url).then(function (resp) {
        config.data = resp.data
      })
    }
    if (config.url) {
      this.url = $sce.trustAsResourceUrl(config.url)
    }
    if (config.data) {
      this.data = config.data
    }
  }
]).factory('config', function () {
  return function () {
    var config = {
      url: '/llp_core/data.json',

      diameter: '500'
    }
    return config;
  }
}).controller('HistogramCtrl', ['$scope', '$stateParams', '$templateCache', 'Collection', 'config', function ($scope, $stateParams, $templateCache, Collection, config) {
  var vm = this;
  config = config || $scope.$parent.config;
  vm.col = config.id;
  Collection(vm.col).$loaded().then(function (collection) {
    var tpl = $templateCache.get('bartpl');

    $('.histogram-3d td').each(function () {
      var val = this.innerHTML;
      $(this)
        .html(tpl)
        .css('font-size', val + 'px')
    });
    var dragStart = {}, dragging = false, curpos = {x: 100, y: -75}
    var touch = Modernizr.touch, $vp = $('.viewport:first');
    $vp.on(touch ? 'touchstart' : 'mousedown', function (e) {
      var evt = touch ? e.originalEvent.touches[0] : e;
      dragStart = {
        x: evt.screenX + curpos.x,
        y: evt.screenY + curpos.y
      };

      dragging = true;
      $('body').addClass('noselect');
    });

    $(document).on(touch ? 'touchend' : 'mouseup', function () {
      dragging = false;
      $('body').removeClass('noselect');
    });

    $(document).on(touch ? 'touchmove' : 'mousemove', function (e) {
      if (!dragging) return;

      e.preventDefault();

      var evt = touch ? e.originalEvent.touches[0] : e,
        x = dragStart.x - evt.screenX,
        y = dragStart.y - evt.screenY,
        amp = 0.2;


      curpos.x = x;
      curpos.y = y;

      $vp.find('.world').css(
        Modernizr.prefixed('transform'),
        ['rotateX(', y * amp, 'deg) rotateY(', -x * amp, 'deg)'].join('')
      );
    });
  });
}]).controller('RevealCtrl', ['$scope', '$stateParams', 'revealjs', '$document', '$window', '$css', 'toastr','config', function ($scope, $stateParams, revealjs, $document, $window, $css, toastr, config) {
  var vm = this;
  vm.csssources = ['https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', '/lexlab-starter/node_modules/reveal.js/css/reveal.css', '/lexlab-starter/node_modules/reveal.js/css/theme/black.css', '/lexlab-starter/node_modules/reveal.js/lib/css/zenburn.css']
  config = config || $scope.$parent.config;


  $scope.onSubmit = function(){
    vm.updateConfig(vm.options);
  };
  vm.updateConfig = function(newconfig){
    return Reveal.configure(newconfig);
  };
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
    parallaxBackgroundHorizontal: null,
    parallaxBackgroundVertical: null,
    	// Exposes the reveal.js API through window.postMessage
	postMessage: true,

	// Dispatches all reveal.js events to the parent window through postMessage
	postMessageEvents: true,
    dependencies: [
      { src: '/lexlab-starter/node_modules/reveal.js/plugin/markdown/marked.js' },
      { src: '/lexlab-starter/node_modules/reveal.js/plugin/markdown/markdown.js' },
      { src: '/lexlab-starter/node_modules/reveal.js/plugin/notes/notes.js', async: true },
      { src: '/lexlab-starter/node_modules/reveal.js/plugin/highlight/highlight.js', async: true, callback: function () { hljs.initHighlightingOnLoad(); } },
      { src: '/lexlab-starter/node_modules/reveal.js/plugin/zoom-js/zoom.js', async: true }
    /*{ src: '/lexlab-starter/node_modules/reveal.js/plugin/search/search.js', async: true},
    { src: '/lexlab-starter/node_modules/reveal.js/plugin/print-pdf/print-pdf.js', async: true }*/
    ]
  }

  revealjs.Reveal().then(function () {
    window.Reveal.initialize(vm.options);

  });
}]).controller('TimeLineCtrl', ['$scope', '$stateParams', '$document', '$http', 'storyjs', 'config', 'Collection', 'toastr', '$filter', function ($scope, $stateParams, $document, $http, storyjs, config, Collection, toastr, $filter) {
  var vm = this

  config = config || $scope.$parent.config
  vm.data = {
    'timeline': {
      'headline': 'Prosecution History Digest',
      'type': 'default',
      'text': 'US 8,382,656',
      'asset': {
        'media': '/patents/8382656/preview',
        'credit': 'Lion Legal Products',
        'caption': 'Master the Jungle of Legal Information'
      },
      'date': [{
        'startDate': '2000-01-01',
        'endDate': '2000-01-01',
        'headline': 'Initial Entry',
        'text': 'This is a poodle',
        'asset': {
          'media': '/llp_core/img/lll3.svg',
          'credit': 'LLP',
          'caption': '',
          'thumbnail': '/files/public/uspto/patents/8382656.png',
          'type': 'image/png',
          'tag': 'test'
        }
      }]
    }
  }
  Collection(config.id).$loaded().then(function (collection) {

    // vm.data = {
    //   'timeline': {
    //     'headline': 'Prosecution History Digest',
    //     'type': 'default',
    //     'text': collection.id + ' - ' +  collection.title,
    //     'asset': {
    //       'media': '/patents/'+collection.id+'/preview',
    //       'credit': 'Lion Legal Products',
    //       'caption': 'Master the Jungle of Legal Information'
    //     },
    //     'date': [{
    //       'startDate': collection.date,
    //       'endDate': collection.date,
    //       'headline': collection.title,
    //       'text': collection.description,
    //       'asset': {
    //         'media': collection.media,
    //         'credit': collection.styleClass,
    //         'caption': '',
    //         'thumbnail': collection.thumbnail || collection.media,
    //         'type': collection.styleClass,
    //         'tag': collection.rid
    //       }
    //     }]
    //   }
    // }

    angular.forEach(collection.roarlist, function (rid, key) {
      Collection(rid).$loaded().then(function (rvent) {
        var thisobj = {
          'startDate': rvent.date,
          'endDate': rvent.date,
          'headline': rvent.title,
          'text': rvent.description,
          'asset': {
            'media': rvent.media,
            'credit': rvent.styleClass,
            'caption': '',
            'thumbnail': rvent.thumbnail || rvent.media,
            'type': rvent.styleClass,
            'tag': rvent.rid
        }}
        toastr.info($filter('date')(rvent.date), rvent.title)
        vm.data.timeline.date.push(thisobj)

        storyjs.createStoryJS().then(function (createStoryJS) {
          vm.options = {
            type: 'timeline',
            width: 800,
            height: 600,
            source: angular.toJson(vm.data),
            embed_id: 'timelinejs',
            hash_bookmark: false,
            debug: true,
            font: 'PTSerif-PTSans'
          }; createStoryJS(vm.options); });
      });
    });
  });
}]);
