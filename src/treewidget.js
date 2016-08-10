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
      css: ['/treewidget/src/alt/build/css/themes/dark.css','/treewidget/src/alt/build/css/timeline.css'],
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
      controllerAs: 'options',
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
}]).controller('RevealCtrl', ['$scope', '$stateParams', 'revealjs', '$document', '$window', '$css', 'toastr','config','$compile','Collection', function ($scope, $stateParams, revealjs, $document, $window, $css, toastr, config, $compile, Collection) {
  var vm = this;
  vm.selectedtheme = 'league';
  var showheader = '<!doctype html><html ng-app="revealjs" class="html2"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>reveal.js</title><base href="/" target="_blank"></base><link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/css/reveal.css" />';



  var showheaderone = '<!-- Theme used for syntax highlighting of code --><link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/lib/css/zenburn.css"><!-- Printing and PDF exports --><link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/lib/css/print/print.css"	</head>	<body>		<div class="reveal">			<!-- Any section element inside of this container is displayed as a slide -->			<div class="slides">';
var showfooter = 	'<script src="https://lexlab.io/lexlab-starter/node_modules/reveal.js/lib/js/head.min.js"></script><script src="https://lexlab.io/lexlab-starter/node_modules/reveal.js/js/reveal.js"></script><script>			Reveal.initialize({history: true,controls: true,progress: true,slideNumber: true,overview: true,center: true,touch: true,loop: true,rtl: false,shuffle: false, fragments: true,embedded: true,help: true,showNotes: false, autoSlide: 10000,autoSlideStoppable: true,autoSlideMethod: Reveal.navigateNext,mouseWheel: true, hideAddressBar: true,previewLinks: true,transition: "slide",transitionSpeed: "slow",backgroundTransition: "convex",viewDistance: 4,parallaxBackgroundImage: "https://lexlab.io/llp_core/img/lll3.svg",parallaxBackgroundSize: "2500px 1500px",dependencies: [{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/markdown/marked.js" },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/markdown/markdown.js" },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/notes/notes.js", async: true },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/highlight/highlight.js", async: true, callback: function() { hljs.initHighlightingOnLoad(); } },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/zoom-js/zoom.js", async: true},/*{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/search/search.js", async: true},*/{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/print-pdf/print-pdf.js", async: true}]});</script></body></html>';

 vm.themes = [
    {name: 'beige'},
    {name: 'black'},
    {name: 'blood'},
    {name: 'league'},
    {name: 'moon'},
    {name: 'night'},
    {name: 'serif'},
    {name: 'simple'},
    {name: 'sky'},
    {name: 'solarized'},
    {name: 'white'}
  ];
  vm.hidethemes = false;
  var config = config || $scope.$parent.config;
  Collection(config.id).$loaded().then(function(resp){
    vm.model = resp;
  });
  vm.slides = [];
  vm.import = function(src){
        src = angular.isDefined(src) ? src : config.id;
        Collection(src).$loaded().then(function(data){
          var srcid = src.replace(/\D/,'');
          //if(angular.isUndefined(data.slide)){
          vm.slides.push('<section data-background="url(https://lexlab.io/patents/8382656/preview)"><h1 class="display-2">'+data.title+'</h1><hr><h3>'+data.description+'</h3><span class="fa fa-5x '+data.icon+'"></span></section>');
          //}else{
            //vm.slides.push(data.slide);
          //}
        angular.forEach(data.roarlist, function(rtd, key){
          recurdive(rtd);
      });
        });

  };
  var templtr = function(roarevent){
    var pups;
    var temple;
    if(roarevent.styleClass === 'Applicant'){
    var apptemplate =  '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
            temple = apptemplate;
    }else if(roarevent.styleClass === 'PTO'){
                     var ptotemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/640002/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
            temple = ptotemplate;
                }else if(roarevent.styleClass === 'NOA'){
                    var noatemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
            temple = noatemplate;
                }else if(roarevent.styleClass === 'Petition'){
                    var petitiontemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
            temple = petitiontemplate;
                }else if(roarevent.styleClass === 'Interview'){
             var interviewtemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
            temple = interviewtemplate;
                }else{
    var apptemplate =  '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
            temple = apptemplate;
    }

               return '<section class="slide" data-background="'+roarevent.media+'">'+temple+'</section>';
               //return pups;
};

var recurdive = function(src){
    Collection(src).$loaded().then(function(roarevent){


      if(angular.isUndefined(roarevent.slide)){

        vm.slides = vm.slides + templtr(roarevent)

    toastr.info(roarevent.styleClass);


        // if(data.roarlist){
          angular.forEach(roarevent.roarlist, function(itd, key){
            recurdive(itd);
          });
      //   }
       }else{
         vm.slides.push(roarevent.slide);
         angular.forEach(roarevent.roarlist, function(ittd, key){
           recurdive(ittd);
         });
       }
      //   if(data.roarlist){
      //     angular.forEach(data.roarlist, function(ittd, key){
      //       recurdive(ittd);
      //     });
      //   }
      // }
    });
  };
  vm.configure = function(){
    vm.hidethemes = !vm.hidethemes;
    vm.configureslides = !vm.configureslides;

  };
  vm.initialize = function(){
    var theme = '<link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/css/theme/' + vm.selectedtheme + '.css" id="theme">';

    var newhtml = showheader + theme + showheaderone + (angular.isArray(vm.slides) ? vm.slides.join('\n') : vm.slides) + showfooter;
    vm.model.content = newhtml;
    vm.model.$save();
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
// $scope.initialize = function(){
//   revealjs.Reveal().then(function () {
//     window.Reveal.initialize(vm.options);

//   });
// };

function buildslides (slidearray){
  angular.forEach(slidearray, function(slide, key){
    var tmpl = '<section>' + slide.content + '</section>';
    slideshow.push(tmpl);
  });
}
}]).controller('TimeLineCtrl', ['$scope', '$stateParams', '$document', '$http', 'storyjs', 'config', 'Collection', 'toastr', '$filter', function ($scope, $stateParams, $document, $http, storyjs, config, Collection, toastr, $filter) {
  var vm = this;

  var config = config || $scope.$parent.config;

  Collection(config.id).$loaded().then(function(lesource){
        if(angular.isDefined(lesource.timeline)){
          vm.data = lesource.timeline;
        }else{
            vm.data = {
    'timeline': {
      'headline': 'Prosecution History Digest',
      'type': 'default',
      'text': 'US 8,382,656',
      'asset': {
        'media': 'https://lexlab.io/patents/8382656/preview',
        'credit': 'Lion Legal Products',
        'caption': 'Master the Jungle of Legal Information'
      },
      'date': [{
        'startDate': '1899,12,31',
        'endDate': '1900,1,1',
        'headline': 'End of an Era',
        'text': '<strong>This</strong> is a <em>poodle</em>',
        'asset': {
          'media': 'https://lexlab.io/patents/8382656/preview',
          'credit': 'LLP',
          'caption': '',
          'thumbnail': 'https://lexlab.io/patents/8382656/preview',
          'type': 'image/png',
          'tag': 'test'
        }
      }]
    }
  };
        }

  });

  var iteratey = function(collection){
    return angular.forEach(collection.roarlist, function (rid, key) {
      Collection(rid).$loaded().then(function (rvent) {
        var thisobj = {
          'startDate': rvent.date ? rvent.date.replace(/-/g,',') : '2000,1,1',
          'endDate': rvent.date ? rvent.date.replace(/-/g,',') : '2000,1,1',
          'headline': rvent.title || '',
          'text': rvent.text || rvent.description || '',
          'asset': {
            'media': rvent.media || '',
            'credit': rvent.styleClass || '',
            'caption': rvent.description || '',
            'thumbnail': '/llp_core/img/lll3.svg',
            'type': 'pdf',
            'tag': rvent.styleClass || ''
        }};
        toastr.info($filter('date')(rvent.date), rvent.title);
        vm.data.timeline.date.push(thisobj);
        if(rvent.roarlist){
          iteratey(rvent);
        }
      });
    });
};
  vm.import = function(src){
    src = src || config.id;
    Collection(src).$loaded().then(function (collection) {

    vm.data = {
      'timeline': {
        'headline': 'Prosecution History Digest',
        'type': 'default',
        'text': collection.id + ' - ' +  collection.title,
        'asset': {
          'media': collection.media,
          'credit': 'Lion Legal Products',
          'caption': 'Master the Jungle of Legal Information'
        },
        'date': [{
          'startDate': collection.date ? collection.date.replace(/-/g,',') : '2000,1,1',
          'endDate': collection.date ? collection.date.replace(/-/g,',') : '2000,1,1',
          'headline': collection.title,
          'text': collection.description,
          'asset': {
            'media': collection.media,
            'credit': collection.styleClass,
            'caption': '',
            'thumbnail': 'https://lexlab.io/llp_core/img/GoldLion.svg',
            'type': 'pdf',
            'tag': collection.rid
          }
        }]
      }
    };
    iteratey(collection);
    });
  };
      vm.initialize = function(){
        storyjs.createStoryJS().then(function (createStoryJS) {
          vm.options = {
            type: 'timeline',
            width: 1000,
            height: 550,
            source: angular.fromJson(vm.data),
            embed_id: 'timeline',
            hash_bookmark: false,
            debug: true,
            theme: 'dark',
            font: 'Georgia-Helvetica'
          };
          createStoryJS(vm.options); });
      };
      vm.save = function(){
        Collection(config.id).$loaded().then(function(vmodel){
          vmodel.timeline = vm.data;
          vmodel.$save();
        });
      };

}]).directive('timelinejs',function(Collection){
  return {
    restrict: 'E',
    templateUrl: '/treewidget/src/alt/timeline.html',
      scope:{},
      css: ['/treewidget/src/alt/build/css/themes/dark.css','/treewidget/src/alt/build/css/timeline.css'],
      controller: 'TimeLineCtrl',
      controllerAs: 'time',
      link: function($scope, $element, $attr, $ctrl){
          Collection($attr.source).$loaded().then(function(sourcedata){
            $ctrl.data = sourcedata.timeline;
            $ctrl.initialize();
          });
      }
  }
});
