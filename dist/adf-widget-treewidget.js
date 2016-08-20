(function(window, undefined) {'use strict';

angular.module('adf.widget.treewidget', ['adf.provider'])
  .config(["dashboardProvider", function (dashboardProvider) {
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
  }])
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
}])
.controller('RevealCtrl', ['$scope', '$stateParams', 'revealjs', '$document', '$window', '$css', 'toastr','config','$compile','Collection','$filter', function ($scope, $stateParams, revealjs, $document, $window, $css, toastr, config, $compile, Collection,$filter){
  var vm = this;
  vm.selectedtheme = 'league';
  var showheader = '<!doctype html><html class="html2"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>reveal.js</title><base href="/" target="_blank"></base><link  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet"/><link rel="stylesheet" href="https://lexlab.io/llp_core/bower_components/bootstrap/dist/css/bootstrap.min.css"/><link rel="stylesheet" href="https://lexlab.io/llp_core/dist/app.full.min.css"/><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet"/><link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/css/reveal.css" />';



  var showheaderone = '<!-- Theme used for syntax highlighting of code --><link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/lib/css/zenburn.css"><!-- Printing and PDF exports --><link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/css/print/print.css"	</head>	<body>		<div class="reveal">			<!-- Any section element inside of this container is displayed as a slide -->			<div class="slides">';

  var showfooter = 	   '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2014-11-29/FileSaver.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/tether-select/1.1.1/js/select.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script><script src="https://apis.google.com/js/client.js"></script><script src="https://apis.google.com/js/api.js"></script><script src="https://www.gstatic.com/firebasejs/3.2.1/firebase.js"></script><script src="https://lexlab.io/lexlab-starter/node_modules/reveal.js/lib/js/head.min.js"></script><script src="https://lexlab.io/lexlab-starter/node_modules/reveal.js/js/reveal.js"></script><script>			Reveal.initialize({history: true,controls: true,progress: true,slideNumber: true,overview: true,center: true,touch: true,loop: true,rtl: false,shuffle: false, fragments: true,embedded: true,postMessage: true,postMessageEvents: true,help: true,showNotes: false, autoSlide:15000,autoSlideStoppable: true,autoSlideMethod: Reveal.navigateNext,mouseWheel: true, hideAddressBar: true,previewLinks: true,transition: "convex",transitionSpeed: "slow",backgroundTransition: "convex",viewDistance: 3,parallaxBackgroundImage: "https://lexlab.io/files/public/uspto/patents/7904579.png",parallaxBackgroundSize: "800px 800px",dependencies: [{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/markdown/marked.js" },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/markdown/markdown.js" },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/notes/notes.js", async: true },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/highlight/highlight.js", async: true, callback: function() { hljs.initHighlightingOnLoad(); } },{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/zoom-js/zoom.js", async: true},{ src: "https://lexlab.io/lexlab-starter/node_modules/reveal.js/plugin/print-pdf/print-pdf.js", async: true}],width: 960,height: 700,margin: 0.1,minScale: 0.2,maxScale: 1.5});</script><script src="/llp_core/ckeditor2/plugins/chart/widget2chart.js"></script> <script src="/lexlab-starter/node_modules/reveal.js/lib/js/head.min.js"></script><script src="/lexlab-starter/node_modules/reveal.js/js/reveal.js"></script>  <script src="/llp_core/dist/app.bower.js"></script>   <script data-require="jszip@2.4.0" data-semver="2.4.0" src="https://cdn.rawgit.com/Stuk/jszip/v2.4.0/dist/jszip.js" data-build="exclude"></script>   <script src="https://rawgit.com/alexk111/ngImgCrop/master/compile/unminified/ng-img-crop.js"></script>   <script src="/newwidget/dist/adf-widget-testwidget.js"></script>   <script src="/getphdwidget/dist/adf-widget-getphd.js"></script>   <script src="/pagebuilderwidget/dist/adf-widget-pagebuilder.js"></script>   <script src="/collectionwidget/dist/adf-widget-collectionwidget.js"></script>   <script src="/treewidget/dist/adf-widget-treewidget.js"></script>   <script src="/llp_core/dist/app.mini.js"></script>   <script src="/llp_core/dist/minicache.js"></script><script>angular.module("mini").config(function($locationProvider) {$locationProvider.html5Mode(false);});angular.element(document).ready(function(){angular.bootstrap(document, ["mini"])});</script>';

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
    vm.slides = resp.slideshow ? resp.slideshow : [];
  });

  vm.import = function(src){
        vm.slides = [];
        src = angular.isDefined(src) ? src : config.id;
        Collection(src).$loaded().then(function(data){
          var srcid = src.replace(/\D/g,'');
          //if(angular.isUndefined(data.slide)){
          var slider = '<section data-background="url(\'https://lexlab.io/patents/'+srcid+'/preview\')"><h1 class="display-2">'+data.title+'</h1><hr><h3>'+data.description+'</h3><span class="fa fa-5x '+data.icon+'"></span></section>';
          data.slide = slider;
          vm.slides.push(data);
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
    var apptemplate =  '<section class="slide phd" data-background-image="url(\'https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'\')"><div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-6"><div class="text-primary"><h4>'+ roarevent.title+'</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite><p class="text-muted">'+ roarevent.text ? $filter('plainText')(roarevent.text) : roarevent.description + '</p></div></div>' +
            '<div class="col-xs-6"><iframe src="' + roarevent.media + '" class="card card-block slide-left" style="width:100%;min-height:400px;"></iframe><img src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div></section>';
            temple = apptemplate;
    }else if(roarevent.styleClass === 'PTO'){
                     var ptotemplate = '<section class="slide phd" data-background-image="url(\'https://placehold.it/350x480/640002/fff/&text='+roarevent.rid+'\')"><div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-6"><div class="text-danger"><h4>'+ roarevent.title+'</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite><p class="text-muted">'+ roarevent.text ? $filter('plainText')(roarevent.text) : roarevent.description + '</p></div></div>' +
            '<div class="col-xs-6"><iframe src="' + roarevent.media + '" class="card card-block slide-left" style="width:100%;min-height:400px;"></iframe><img src="https://placehold.it/350x480/640002/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div></div></section>'
            /*'<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p>
            <img src="https://placehold.it/250x208/640002/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';*/
            temple = ptotemplate;
                }else if(roarevent.styleClass === 'NOA'){
                     var noatemplate = '<section class="slide phd" data-background-image="url(\'https://placehold.it/350x480/7c994f/fff/&text='+roarevent.rid+'\')"><div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-6"><div class="text-success"><h4>'+ roarevent.title+'</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite><p class="text-muted">'+ roarevent.text ? $filter('plainText')(roarevent.text): roarevent.description + '</p></div></div>' +
            '<div class="col-xs-6"><iframe src="' + roarevent.media + '" class="card card-block slide-left" style="width:100%;min-height:400px;"></iframe><img src="https://placehold.it/350x480/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div></section>';
            //         var noatemplate = '<div class="container-fluid two-col-left">' +
            // '<div class="row">' +
            // '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            // '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            // '</div>' +
            // '</div><p>&nbsp;</p>';
            temple = noatemplate;
                }else if(roarevent.styleClass === 'Petition'){
                    var petitiontemplate = '<section class="slide phd" data-background-image="url('+roarevent.media.indexOf('img') > -1 ? roarevent.media : roarevent.styleClass === 'Applicant' ? '"https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'"' : '"https://placehold.it/350x480/640002/fff/&text='+roarevent.rid+')"><div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p></section>';
            temple = petitiontemplate;
                }else if(roarevent.styleClass === 'Interview'){
             var interviewtemplate = '<section class="slide phd" data-background-image="url('+roarevent.media.indexOf('img') > -1 ? roarevent.media : roarevent.styleClass === 'Applicant' ? '"https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'"' : '"https://placehold.it/350x480/640002/fff/&text='+roarevent.rid+')"><div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p></section>';
            temple = interviewtemplate;
                }else{
    var apptemplate =  '<section><div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p></section>';
            temple = apptemplate;
    }
// var ert ='<section class="slide phd" data-background-image="url('+roarevent.media+')"><div id="docheader" class="container-fluid two-col-right" >' +
//            '<div class="row">' +
//            '<div class="col-xs-7"><div class="bs-callout bs-callout-'+roarevent.styleClass+'><h4>'+ roarevent.title+'</h4><p>Dated '+roarevent.date+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe">'+
//            '<i class="fa fa-external-link"></i></a></cite></div><iframe src="' + roarevent.media + '" class="card card-block" style="width:100%;min-height:400px;"></iframe></div>'+
//           '<div class="col-xs-5 slide  card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text">' +roarevent.text+
//           '</div>' +
//            '</div>' +
//           '</div></section>';
              //return '<section class="slide phd" data-background="'+roarevent.media+'">'+temple+'</section>';
               return temple;
};

var recurdive = function(src){
    Collection(src).$loaded().then(function(roarevent){

var  slide = templtr(roarevent);
        roarevent.slide= slide;

      if(angular.isUndefined(roarevent.slide)){
        var  slide = templtr(roarevent);
        roarevent.slide= slide;
vm.slides.push(roarevent);
//        vm.slides = vm.slides +roarevent.slide;
      //   if(roarevent.roarlist){
      //   angular.forEach(roarevent.roarlist, function(ittd, key){
      //       recurdive(ittd);
      //     });
      //   }
      toastr.info(roarevent.styleClass, roarevent.title);


        // if(data.roarlist){
          // angular.forEach(roarevent.roarlist, function(itd, key){
            // recurdive(itd);
          // });
      //   }
       }else{
         //vm.slides = vm.slides;

         vm.slides.push(roarevent);
         angular.forEach(roarevent.roarlist, function(ittd, key){
           recurdive(ittd);
         });
       }
        // if(data.roarlist){
        //   angular.forEach(data.roarlist, function(ittd, key){
        //     recurdive(ittd);
        //   });
       // }
      //}
    });
  };
  vm.configure = function(){
    vm.hidethemes = !vm.hidethemes;
    vm.configureslides = !vm.configureslides;

  };
  // var apptemplate = showheader + theme + showheaderone +
  //         + showfooter;
  vm.initialize = function(){
    var theme = '<link rel="stylesheet" href="https://lexlab.io/lexlab-starter/node_modules/reveal.js/css/theme/' + vm.selectedtheme + '.css" id="theme">';
    var serialtree = function(){
      var thishtml='';
      angular.forEach(vm.slides, function(slide, key){
        if(slide.roarlist && slide.roarlist.length > 0){
          thishtml = thishtml + angular.element(slide.slide).wrap('<section>').toString();
        }
        else{
          var tol= slide.slide || '<!--CUTSLIDEHEAD-->';
          var colly = slide.content || '<!--CUTSLIDEHEAD-->';
          thishtml = thishtml + '  <section>  ' +colly.slice(colly.indexOf('<body>')-1, colly.indexOf('<script>')) + '  </section>  ';
      //thishtml = thishtml + tol;
      }
      })
      return thishtml;
    };
    var newhtml = showheader + theme + showheaderone + serialtree() + showfooter;
    vm.model.slideshow = newhtml;
    vm.model.content = showheader + theme + showheaderone + serialtree() + showfooter;
    vm.model.slide = newhtml;
    vm.model.$save();
  };
window.addEventListener( 'message', function( event ) {
    var data = JSON.parse( event.data );
    if( data.namespace === 'reveal' && data.eventName ==='slidechanged' ) {
        alertify.success('slide changed')// Slide changed, see data.state for slide number
    }
} );
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
    ],
    width: 960,
    height: 700,
    margin: 0.1,
    minScale: 0.2,
    maxScale: 1.5
  }
// $scope.initialize = function(){
//   revealjs.Reveal().then(function () {
//     window.Reveal.initialize(vm.options);


 }

]).service('timeline', function(){
  return {timeline: timeline,
        timeevent: timeevent,
      timeera: timeera };
      var dataModel = {
    "timeline":
    {
        "headline":"The Main Timeline Headline Goes here",
        "type":"default",
        "text":"<p>Intro body text goes here, some HTML is ok</p>",
        "asset": {
            "media":"http://yourdomain_or_socialmedialink_goes_here.jpg",
            "credit":"Credit Name Goes Here",
            "caption":"Caption text goes here"
        },
        "date": [
            {
                "startDate":"2011,12,10,07,02,10",
                "endDate":"2011,12,11,08,11",
                "headline":"Headline Goes Here",
                "text":"<p>Body text goes here, some HTML is OK</p>",
                "tag":"This is Optional",
                "classname":"optionaluniqueclassnamecanbeaddedhere",
                "asset": {
                    "media":"http://twitter.com/ArjunaSoriano/status/164181156147900416",
                    "thumbnail":"optional-32x32px.jpg",
                    "credit":"Credit Name Goes Here",
                    "caption":"Caption text goes here"
                }
            }
        ],
        "era": [
            {
                "startDate":"2011,12,10",
                "endDate":"2011,12,11",
                "headline":"Headline Goes Here",
                "text":"<p>Body text goes here, some HTML is OK</p>",
                "tag":"This is Optional"
            }

        ]
    }
}
})
.controller('TimeLineCtrl', ['$scope', '$stateParams', '$document', '$http', 'storyjs', 'config', 'Collection', 'toastr', '$filter','ckdefault','ckstarter','ckender',
 function ($scope, $stateParams, $document, $http, storyjs, config, Collection, toastr, $filter, ckdefault, ckstarter,ckender) {
  var vm = this;

  var config = config || $scope.$parent.config;
  $scope.ckdefault  = ckdefault;
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
          'caption': ' ',
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
          'headline': rvent.title || '&nbsp;',
          'text': rvent.text || rvent.description || '&nbsp;',
          'classname': rvent.styleClass || 'btn-dark',
          'asset': {
            'media': rvent.media || '&nbsp;',
            'credit': rvent.styleClass || '&nbsp;',
            'caption': rvent.description || '&nbsp;',
            'thumbnail': rvent.thumnail || '/llp_core/apple-touch-icon.png',
            'type': 'defaultt',
            'tag': rvent.styleClass || '&nbsp;'
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
        'type': 'document',
        'text': collection.rid + ' - ' +  collection.title,
        'asset': {
          'media': collection.media ||'https://lexlab.io/files/public/uspto/patents/'+ collection.$id.replace(/\D/g,'')+'/'+collection.$id.replace(/\D/g,'')+'.png' ||'https://lexlab.io/llp_core/img/GoldLion.svg',
          'credit': 'Lion Legal Products',
          'caption': 'Master the Jungle of Legal Information'
        },
        'date': [{
          'startDate': collection.date ? collection.date.replace(/-/g,',') : '2000,1,1',
          'endDate': collection.date ? collection.date.replace(/-/g,',') : '2000,1,1',
          'headline': collection.title || '&nbsp;',
          'text': collection.description || '&nbsp;',
          'asset': {
            'media': collection.media || 'https://lexlab.io/llp_core/img/GoldLion.svg',
            'credit': collection.styleClass || '&nbsp;',
            'caption': ' ',
            'thumbnail': 'https://lexlab.io/llp_core/img/GoldLion.svg',
            'type': 'default',
            'tag': collection.rid || '&nbsp;'
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
            width: 950,
            height: 650,
            source: 'https://lexlab.io/files/public/timelines/'+config.id,
            embed_id: 'timeline',
            hash_bookmark: true,
            debug: true,
            theme: 'dark',
            font: 'Georgia-Helvetica'
          };
          createStoryJS(vm.options); });
      };
      vm.save = function(){
        $http.post('/timeline/'+config.id,{data: angular.toJson(vm.data)});
      };
      vm.export = function(){
        var roo = '';
        angular.forEach(vm.data.timeline.dates, function(date, key){
          var htmlsnip = '<div class="card card-block"><h4>'+ date.headline+'<small class="pull-right">'+date.startDate+'</small></h4><hr>'+ date.text+'</div>';
          roo = roo + htmlsnip;
       });
        data.content = ckstarter + roo + ckender;
        data.$save();
      }
      vm.eventtypes = [
      {value: 'plaintext', label: 'Plain Text'},
      {value: 'quote', label: 'quote'},
      {value: 'document', label: 'document'},
      {value: 'photo', label: 'Photo'},
      {value: 'twitter', label: 'Twitter'},
      {value: 'vimeo', label: 'Vimeo'},
      {value: 'vine', label: 'Vine'},
      {value: 'youtube', label: 'Youtube'},
      {value: 'video', label: 'Video'},
      {value: 'audio', label: 'Audio'},
      {value: 'map', label: 'Map'},
      {value: 'website', label: 'Website'},
      {value: 'link', label: 'Link'},
      {value: 'wikipedia', label: 'Wikipedia'},
      {value: 'storify', label: 'Storify'},
      {value: 'googleplus', label: 'Google+'},
      {value: 'instagram', label: 'Instagram'}
];

}]).directive('timelinejs',["Collection", function(Collection){
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
}]);

angular.module("adf.widget.treewidget").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/treewidget/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=url class=form-control id=sample ng-model=config.url placeholder=\"Enter sample\"> <input type=number class=form-control id=num ng-model=config.diameter></div></form>");
$templateCache.put("{widgetsPath}/treewidget/src/view.html","<div class=container-fluid><div><h1 class=text-center>Architecture Tree</h1><div ng-controller=filterCtrl><ng-include src=\"\'filter.html\'\"></ng-include></div><div ng-controller=chartCtrl><tree-chart-widget data={{tree}} diameter=\"{{config.diameter || \'500\'}}\"></tree-chart-widget><d3pendingtree id=7654321 patent=7654321 pattern tree=tree></d3pendingtree></div><div ng-controller=panelCtrl><div id=panel><div ng-if=detail><ng-include src=\"\'panel-detail.html\'\"></ng-include></div><div ng-if=edit><ng-include src=\"\'panel-edit.html\'\"></ng-include></div></div></div><div ng-controller=undoCtrl><div ng-if=hasHistory() class=\"alert alert-success json-update-label bg-success\">Updated JSON <a ng-click=undo()>(undo)</a></div></div><div ng-controller=jsonDataCtrl><textarea id=json-data class=\"form-control card card-dark well\" style=margin-top:50%; ng-model=data ng-blur=updateData()></textarea></div></div></div><script src=/treewidget/src/d3.architectureTree.js></script><script src=/treewidget/src/app.js></script><script src=/treewidget/src/chart.js></script><script src=/treewidget/src/filter.js></script><script src=/treewidget/src/json-data.js></script><script src=/treewidget/src/panel.js></script><script src=/treewidget/src/undo.js></script><script src=/treewidget/src/tree-chart.js></script><script src=/treewidget/src/init-focus.js></script><script src=/treewidget/src/data.js></script><script src=/treewidget/src/bus.js></script><script src=/treewidget/src/data.json></script><script type=text/ng-template id=filter.html><div class=\"filters panel panel-default\"> <div class=\"panel-heading\">Search</div> <div class=\"panel-body\"> <form id=\"filter_form\"> <input name=\"name\" type=\"text\" class=\"form-control\" placeholder=\"Filter by name\" ng-model=\"$parent.nameFilter\" /> <div id=\"technos\"> <h5>Technos</h5> <a ng-repeat=\"techno in technos\" class=\"btn btn-default btn-xs\" ng-click=\"toggleTechnoFilter(techno)\" ng-class=\"{\'btn-primary\': isTechnoInFilter(techno) }\">{{ techno }}</a> </div> <div id=\"host\"> <h5>Host</h5> <a ng-repeat=\"host in hosts\" class=\"btn btn-default btn-xs\" ng-click=\"toggleHostFilter(host)\" ng-class=\"{\'btn-primary\': isHostInFilter(host) }\">{{ host }}</a> </div> </form> </div> </div></script><script type=text/ng-template id=panel-detail.html><div class=\"details panel panel-info\"> <div class=\"panel-heading\">{{ node.name }}</div> <div class=\"panel-body\"> <div class=\"url\" ng-if=\"node.url\"> <a href=\"{{ node.url }}\">{{ node.url }}</a> </div> <div class=\"comments panel panel-default\" ng-if=\"node.comments\"> <div class=\"panel-heading\">{{ node.comments }}</div> </div> <div class=\"properties\" ng-if=\"node.details.Dependencies\"> <h5>Depends on</h5> <ul> <li ng-repeat=\"dependency in node.details.Dependencies\"> {{ dependency }} </li> </ul> </div> <div class=\"properties\" ng-if=\"node.details.Dependents\"> <h5>Dependendents</h5> <ul> <li ng-repeat=\"dependent in node.details.Dependents\"> {{ dependent }} </li> </ul> </div> <div class=\"properties\" ng-if=\"node.details.Technos\"> <h5>Technos</h5> <ul> <li ng-repeat=\"techno in node.details.Technos\"> {{ techno }} </li> </ul> </div> <div class=\"properties\" ng-if=\"node.details.Host\"> <h5>Hosts</h5> <ul> <li ng-repeat=\"(hostName, servers) in node.host\"> {{ hostName }} <ul ng-if=\"servers\"> <li ng-repeat=\"server in servers\">{{ server }}</li> </ul> <span ng-if=\"detail.via\">({{ detail.via }})</span> </li> </ul> </div> </div> </div></script><script type=text/ng-template id=panel-edit.html><form name=\"editForm\" ng-submit=\"editNode(editForm, $event)\"> <div class=\"details panel panel-info\"> <div class=\"panel-heading\"> <input type=\"text\" ng-model=\"node.name\" class=\"form-control\" /> </div> <div class=\"panel-body\"> <div class=\"url\"> <h5>Url</h5> <input type=\"text\" ng-model=\"node.url\" class=\"form-control\" init-focus /> </div> <div class=\"comments\"> <h5>Comments</h5> <textarea ng-model=\"node.comments\" class=\"form-control\" init-focus></textarea> </div> <div class=\"properties edit\"> <h5>Depends on <span class=\"glyphicon glyphicon-plus\" ng-click=\"addDependency()\"></span></h5> <ul> <li ng-repeat=\"dependencies in node.dependsOn track by $index\"> <input type=\"text\" ng-model=\"node.dependsOn[$index]\" init-focus /> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteDependency($index)\"></span> </li> </ul> <h5>Technos <span class=\"glyphicon glyphicon-plus\" ng-click=\"addTechno()\"></span></h5> <ul> <li ng-repeat=\"techno in node.technos track by $index\"> <input type=\"text\" ng-model=\"node.technos[$index]\" init-focus /> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteTechno($index)\"></span> </li> </ul> <h5>Hosts <span class=\"glyphicon glyphicon-plus\" ng-click=\"addHostCategory()\"></span></h5> <ul> <li ng-repeat=\"(key, host) in node.host track by $index\"> <input type=\"text\" ng-model=\"hostKeys[key]\" init-focus /><span class=\"glyphicon glyphicon-plus\" ng-click=\"addHost(key)\"></span> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteHostCategory(key)\"></span> <ul> <li ng-repeat=\"test in node.host[key] track by $index\"> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteHost(key, $index)\"></span> <input type=\"text\" ng-model=\"node.host[key][$index]\" init-focus /> </li> </ul> </li> </ul> </div> </div> <div class=\"panel-footer\"> <button type=\"button\" ng-click=\"addNode()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\"></span> Add</button> <button type=\"button\" ng-click=\"moveNode()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-share-alt\"></span> Move</button> <button type=\"button\" ng-click=\"deleteNode()\" class=\"btn btn-warning\"><span class=\"glyphicon glyphicon-trash\"></span> Delete</button> </div> <div class=\"panel-footer\"> <button type=\"submit\" class=\"btn btn-primary\"><span class=\"glyphicon glyphicon-ok\"></span> Save</button> <button type=\"button\" ng-click=\"leaveEdit()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-remove\"></span> Cancel</button> </div> </div> </form></script>");
$templateCache.put("{widgetsPath}/treewidget/src/alt/hist_edit.html","<fieldset class=material><input type=text ng-model=config.id placeholder=\"Enter patent id number\"><hr><label class=\"label label-NOA\">Enter ID #</label></fieldset>");
$templateCache.put("{widgetsPath}/treewidget/src/alt/histogram.html","<style>\n.viewport {\n    position: relative;\n    width: 100%;\n    padding-bottom: 100%;\n    cursor: move;\ncontain:strict;\n    -webkit-perspective: 6000px;\n    -webkit-perspective-origin: 50% -100%;\n}\n.viewport .world {\n    position: absolute;\n    top:0;\n    left:0;\n    right:0;\n    bottom:0;\n\n    -webkit-transform: rotateX(-15deg) rotateY(-20deg);\n}\n\n.viewport .world,\n.viewport .world * {\n    -webkit-transform-style: preserve-3d;\n}\n.viewport .ground {\n    position: absolute;\n    z-index: 1;\n    top: 50%;\n    left: 50%;\n    width: 90%;\n    height: 90%;\n    margin-left: -50%;\n    margin-top: -50%;\n    background: #444444;\n\n    -webkit-transform: rotateX(90deg);\n}\n.viewport .histogram-3d {\n    width: 80%;\n    height: 80%;\n    margin: 10% auto;\n    border-collapse: collapse;\n    border-style: solid;\n\n    /* make sure grid is raised above ground */\n    -webkit-transform: translateZ(1px);\n}\n\n.viewport .histogram-3d td {\n    position: relative;\n    width: 30%;\n    height: 30%;\n    padding: 10px;\n    border: 2px solid #555;\n    z-index: 0;\n}\n.viewport .bar {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n}\n\n.viewport .bar .face {\n    background: hsl(0, 100%, 50%);\n    position: absolute;\n    width: 100%;\n\n    overflow: hidden;\n    z-index: 1;\n}\n\n.viewport .bar .face.front {\n    background: hsl(0, 100%, 20%);\n    bottom: 0;\n    height: 1em;\n\n    -webkit-transform-origin: bottom center;\n    -webkit-transform: rotateX(-90deg);\n}\n\n.viewport .bar .face.right {\n    top: 0;\n    right: 0;\n    width: 1em;\n    height: 100%;\n\n    -webkit-transform-origin: center right;\n    -webkit-transform: rotateY(90deg);\n}\n\n.viewport .bar .face.left {\n    background: hsl(0, 100%, 45%);\n    top: 0;\n    left: 0;\n    width: 1em;\n    height: 100%;\n\n    -webkit-transform-origin: center left;\n    -webkit-transform: rotateY(-90deg);\n}\n\n.viewport .bar .face.back {\n    top: 0;\n    height: 1em;\n\n    -webkit-transform-origin: top center;\n    -webkit-transform: rotateX(90deg);\n}\n\n.viewport .bar .face.top {\n    background: hsl(0, 100%, 40%);\n    height: 100%;\n    width: 100%;\n    top: 0;\n\n    -webkit-transform: translateZ(1em);\n}\n</style><script type=text/javascript src=http://code.jquery.com/jquery.js></script><script type=text/javascript src=modernizr.2.5.3.min.js></script><script type=text/javascript src=jquery.fly_sidemenu.js></script><link rel=stylesheet href=fly_sidemenu.css><body><div class=viewport><div class=\"world orbit\"><div class=ground><table class=\"histogram-3d spinY\"><tr><td>30</td><td>20</td><td>60</td></tr><tr><td>80</td><td>100</td><td>40</td></tr><tr><td>20</td><td>50</td><td>300</td></tr></table></div></div></div><script id=bartpl type=text/template><div class=\"bar\"> <div class=\"face top\"> <img width=\"100%\" height=\"100%\" src=\"/llp_core/img/lll3.svg\"> </div> <div class=\"face front\"></div> <div class=\"face back\"></div> <div class=\"face left\"><img width=\"100%\" height=\"100%\" src=\"/llp_core/img/NYC1.jpg\"></div> <div class=\"face right\"><img width=\"100%\" height=\"100%\" src=\"/llp_core/img/NYC1.jpg\"></div> </div></script><script type=text/javascript>\n// get the template\nvar tpl = $(\'#bartpl\').html();\n\n// insert template markup into each td\n// and set the font size to be the value of the td\n$(\'.histogram-3d td\').each(function(){\n    var val = this.innerHTML;\n    $(this)\n        .html(tpl)\n        .css(\'font-size\', val+\'px\')\n        ;\n});</script><script type=text/javascript>\nvar dragStart = {}\n    ,dragging = false\n    ,curpos = {x:100,y:-75}\n    ;\n\nvar touch = Modernizr.touch\n    ,$vp = $(\'.viewport:first\')\n    ;\n\n$vp.on(touch?\'touchstart\':\'mousedown\', function(e){\n\n    var evt = touch? e.originalEvent.touches[0] : e;\n    dragStart = {\n        x: evt.screenX + curpos.x,\n        y: evt.screenY + curpos.y\n    };\n\n    dragging = true;\n    $(\'body\').addClass(\'noselect\');\n});\n\n$(document).on(touch?\'touchend\':\'mouseup\', function(){\n    dragging = false;\n    $(\'body\').removeClass(\'noselect\');\n});\n\n$(document).on(touch?\'touchmove\':\'mousemove\', function(e){\n\n    if (!dragging) return;\n\n    e.preventDefault();\n\n    var evt = touch? e.originalEvent.touches[0] : e\n        ,x = dragStart.x - evt.screenX\n        ,y = dragStart.y - evt.screenY\n        ,amp = 0.2\n        ;\n\n    curpos.x = x;\n    curpos.y = y;\n\n    $vp.find(\'.world\').css(\n        Modernizr.prefixed(\'transform\'),\n        [\'rotateX(\',y*amp,\'deg) rotateY(\',-x*amp,\'deg)\'].join(\'\')\n    );\n\n});</script><style>\n.viewport {\n    position: relative;\n    width: 100%;\n    padding-bottom: 100%;\n    cursor: move;\n    contain: strict;\n    -webkit-perspective: 6000px;\n    -webkit-perspective-origin: 50% -100%;\n}\n.viewport .world {\n    position: absolute;\n    top:0;\n    left:0;\n    right:0;\n    bottom:0;\n\n    -webkit-transform: rotateX(-15deg) rotateY(-20deg);\n\n}\n\n.viewport .world,\n.viewport .world * {\n    -webkit-transform-style: preserve-3d;\n}\n.viewport .ground {\n    position: absolute;\n    z-index: 1;\n    top: 50%;\n    left: 50%;\n    width: 90%;\n    height: 90%;\n    margin-left: -50%;\n    margin-top: -50%;\n    background: rgba(44,24,24,0.84);\n\n    -webkit-transform: rotateX(90deg);\n}\n.viewport .histogram-3d {\n    width: 80%;\n    height: 80%;\n    margin: 10% auto;\n    border-collapse: collapse;\n    border-style: groove;\n\n    /* make sure grid is raised above ground */\n    -webkit-transform: translateZ(1px);\n}\n\n.viewport .histogram-3d td {\n    position: relative;\n    width: 30%;\n    height: 30%;\n    padding: 10px;\n    border: 2px solid #555;\n    z-index: 0;\n}\n.viewport .bar {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n}\n\n.viewport .bar .face {\n    background: hsl(0, 100%, 50%);\n    position: absolute;\n    width: 100%;\n    opacity:0.8;\n    overflow: hidden;\n    z-index: 1;\n}\n\n.viewport .bar .face.front {\n    background: hsl(0, 100%, 20%);\n    bottom: 0;\n    height: 1em;\n\n    -webkit-transform-origin: bottom center;\n    -webkit-transform: rotateX(-90deg);\n}\n\n.viewport .bar .face.right {\n    top: 0;\n    right: 0;\n    width: 1em;\n    height: 100%;\n\n    -webkit-transform-origin: center right;\n    -webkit-transform: rotateY(90deg);\n}\n\n.viewport .bar .face.left {\n    background: hsl(0, 100%, 45%);\n    top: 0;\n    left: 0;\n    width: 1em;\n    height: 100%;\n\n    -webkit-transform-origin: center left;\n    -webkit-transform: rotateY(-90deg);\n}\n\n.viewport .bar .face.back {\n    top: 0;\n    height: 1em;\n\n    -webkit-transform-origin: top center;\n    -webkit-transform: rotateX(90deg);\n}\n\n.viewport .bar .face.top {\n    background: hsl(0, 100%, 40%);\n    height: 100%;\n    width: 100%;\n    top: 0;\n\n    -webkit-transform: translateZ(5em);\n}\n</style><div id=html2 colorkey style=width:140%;min-height:400px; fullscreen=fillerup class=html3><div style=position:absolute;z-index:10000;><fieldset class=material><label>Perspective {{config.perspective}}</label> <input type=range id=persective ng-model=config.perspective min=500 max=5000 ng-dblclick=\"fillerup = !fillerup\"></fieldset><br><fieldset><label>Rotation - X{{config.xrotate}} , Y{{config.yrotate}} , Z{{config.zrotate}}</label> <input type=range id=xrotate ng-model=config.xrotate min=-360 max=360 ng-dblclick=\"fillerup = !fillerup\"><br><input type=range id=yrotate ng-model=config.yrotate min=-360 max=360 ng-dblclick=\"fillerup = !fillerup\"><br><input type=range id=zrotate ng-model=config.zrotate min=-360 max=360 ng-dblclick=\"fillerup = !fillerup\"></fieldset></div><div class=viewport style=\"perspective: {{config.perspective}}px, position:absolute;top:0;right:0;left:0;bottom:0;\"><div class=\"htmlz world\" rotate3d style=rotate3d({{config.xrotate}},{{config.yrotate}},{{config.zrotate}},1deg);><div class=\"ground card-dark\"><table class=histogram-3d ffbase={{histogram.col}}><tr ng-repeat=\"tab in item.roarlist\" ffbase={{tab}}><td class=td-{{item.styleClass}}>{{item.rid}} - {{item.title}}<br>{{item.description}}</td><td ng-repeat=\"thing in item.roarlist\" ffbase={{thing}} ng-include=\"\'bartpl\'\" ng-init=\"it = thing;\">{{item.rid}}</td><td histo=30>30</td><td histo=20>20</td><td histo=30>60</td></tr><tr><cubed one=\"<td histo=\'80\'>80</td>\" four=\"<td>40</td>\" draggable><td><img src=https://lexlab.io/llp_core/img/lll3.svg></td></cubed></tr><tr><td histo=50>50</td><td histo=30>30</td></tr></table></div></div></div><script id=bartpl type=text/ng-template><div class=\"bar\" ffbase=\"{{it}}\" > <div class=\"face top\" id=\"digest\"> <d3pendingtree patent=\"{{item.id.slice(0,7)}}\" tree=\"trees[$index]\" pattern=\"{{config.pattern}}\"></d3pendingtree> </div> <div class=\"face front\" id=\"merits\"> <img width=\"100%\" height=\"100%\" ng-src=\"/patents/{{item.$id.slice(0,7)}}/preview\"/> </div> <div class=\"face back\" id=\"all\">BB</div> <div class=\"face left\" id=\"claims\">L</div> <div class=\"face right\" id=\"art\">R</div> </div></script></div></body>");
$templateCache.put("{widgetsPath}/treewidget/src/alt/reveal_index.html","<header class=\"bar bar-dark\"><label ng-bind=options.selectedtheme></label> <input ng-model=options.source placeholder=SourceID type=text> <button class=\"fa fa-download btn btn-primary\" ng-click=options.import(options.source)></button> <button class=\"fa fa-gear btn btn-default\" ng-click=options.configure()></button> <button class=\"fa fa-play btn btn-warning\" ng-click=options.initialize()></button></header><div class=\"card card-block {{options.selectedtheme || \'card-fancy\'}}\" id=viewframe ng-if=options.hidethemes style=\"width:100%;min-height:400px;margin:5px;border:5px ridge inherit;\"><iframe style=width:100%;height:100%; ng-attr-srcdoc=\"{{options.slideshowcontent | trustAsHTML}}\" seamless allowfullscreen><playlist></playlist></iframe></div><div class=\"card {{options.selectedtheme || \'card-fancy\'}}\" id={{options.selectedtheme}} colorkey={{options.selectedtheme}} ng-hide=options.hidethemes><json-formatter json=options.slides style=position:relative;></json-formatter><dir-pagination-controls pagination-id=timeline template-url=/llp_core/bower_components/angular-utils-pagination/dirPagination.tpl.html></dir-pagination-controls><div dir-paginate=\"slide in options.slides | itemsPerPage: 5\" pagination-id=timeline class=card><h5><label class=\"label badge\">{{$index}}</label><span ng-bind=slide.title></span><a class=pull-right ng-click=options.remove(slide)><i class=\"fa fa-close text-muted\"></i></a></h5><div class=card-block ng-bind-html=\"slide.slide | trustAsHTML\"></div><div class=card-footer><a class=card-link ng-click=options.slideoptions(slide)>options</a> <a class=card-link ng-click=options.editslide(slide)>edit</a></div></div></div><article class=\"window clearfix\" ng-hide=options.hidethemes style=position:absolute;right:10px;><h6 class=card-title>Themes</h6><nav class=\"nav nav-dark\"><li ng-repeat=\"theme in options.themes\" id={{theme.name}} class=\"btn-glass btn-info\" colorkey={{theme.name}}><label class=label>{{theme.name}} <input type=radio id=themename name=themename ng-model=options.selectedtheme ng-value=theme.name></label></li></nav><div class=tabbable><nav class=\"nav nav-tabs\"><ul class=right-tabs style=height:79vh;max-height:79vh;><li class=\"row {{item.styleClass}}\" ng-repeat=\"ts in options.model.roarlist\" ffbase={{ts}} ng-cloak ng-click=\"$parent.options.source = key\"><div uib-dropdown uib-keyboard-nav dropdown-append-to-body><a uib-dropdown-toggle class=\"vcenter pull-left\"><label class=\"label label-pill badge label-{{item.styleClass}}\" style=cursor:pointer;>{{tab.rid || item.rid || \' - \'}}</label></a><ul class=uib-dropdown-menu><li class={{menuitem.styleClass}} ng-repeat=\"menuitem in rightmenu.items\"><a ng-click=\"menuitem.onClick(item.$id, key)\" class=\"fa fa-fw {{menuitem.icon}} {{menuitem.styleClass}}\">&nbsp;&nbsp;&nbsp;&nbsp;{{menuitem.label}}</a></li></ul></div>&nbsp&nbsp{{item.title || item.name}}&nbsp&nbsp <a class=\"fa fa-3x btn btn-default btn-xs\" ng-class=\"{\'fa-check\':($parent.options.source === item.$id )}\" ng-click=\"$parent.options.source = item.$id\"></a></li></ul></nav></div></article>");
$templateCache.put("{widgetsPath}/treewidget/src/alt/slide_edit.html","<input ng-model=config.id><hr><label class=\"label material\" ng-repeat=\"(option, key) in reveal.options\">{{key}}<switch ng-model=option text={{key}} icon=\"fa fa-{{key}}\"><input ng-model=option> <textarea ng-model=option>\n</textarea></switch></label><hr>");
$templateCache.put("{widgetsPath}/treewidget/src/alt/timeedit.html","<fieldset class=material><input type=text ng-model=config.id placeholder=\"Enter patent id number\"><hr><label class=\"label label-NOA\">Enter ID #</label></fieldset>");
$templateCache.put("{widgetsPath}/treewidget/src/alt/timeline.html","<header class=\"bar bar-dark\" style=display:flex;justify-content:space-around;><label ng-bind=time.selectedtheme></label> <input ng-model=time.source placeholder=SourceID type=text> <button class=\"fa fa-download btn btn-primary\" ng-click=time.import(time.source)></button> <button class=\"fa fa-external-link btn btn-info\" ng-click=time.export()></button> <button class=\"fa fa-save btn btn-success\" ng-click=time.save()></button> <button class=\"fa fa-play btn btn-warning\" ng-click=time.initialize()></button></header><section id=timeline></section><json-formatter json=time.data></json-formatter><div class=\"card card-fancy card-block\"><dir-pagination-controls pagination-id=timeline template-url=/llp_core/bower_components/angular-utils-pagination/dirPagination.tpl.html></dir-pagination-controls><div class=\"card card-fancy img-hover img-shadow bs-callout bs-callout-Applicant\" dir-paginate=\"rvent in time.data.timeline.date | itemsPerPage: 10\" pagination-id=timeline><h4 class=card-title><img ng-src={{rvent.asset.thumbnail}} style=max-height:100px; onaftersave=time.save() editable-text=rvent.asset.thumbnail class=\"img img-thumbnail img-hover pull-left\"> <span editable-text=rvent.headline onaftersave=time.save()>{{rvent.headline}}</span><select ng-model=rvent.asset.type><option ng-repeat=\"type in time.eventtypes\" value={{type.value}} label={{type.label}}></option></select><small class=text-muted onaftersave=time.save() editable-date=rvent.startdate>{{rvent.startdate | date}}</small> <a class=pull-right ng-click=time.remove(slide)><i class=\"fa fa-close text-muted\"></i></a></h4><p ng-bind-html=\"rvent.text | trustAsHTML\" editable-textarea=rvent.text onaftersave=time.save() e-ckeditor=ckdefault></p></div></div><script type=text/javascript src={widgetsPath}/treewidget/src/alt/build/js/storyjs-embed.js></script>");
$templateCache.put("{widgetsPath}/treewidget/src/alt/build/embed/index.html","<!DOCTYPE html><html lang=en><head><title>TimelineJS Embed</title><meta charset=utf-8><meta name=description content=\"TimelineJS Embed\"><meta name=apple-mobile-web-app-capable content=yes><meta name=apple-touch-fullscreen content=yes><meta name=viewport content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0\"><style>\n      html, body {\n      height:100%;\n      padding: 0px;\n      margin: 0px;\n      }\n\n      #timeline-embed { height: 100%; }\n    </style></head></html><body><div id=timeline-embed></div><script type=text/javascript>\n    var trim_point = window.location.href.indexOf(\'embed/index.html\');\n    if (trim_point > 0) {\n      var embed_path = window.location.href.substring(0,trim_point); // supports https access via https://s3.amazonaws.com/cdn.knightlab.com/libs/timeline/latest/embed/index.html \n    } else {\n      var embed_path = \"http://cdn.knightlab.com/libs/timeline/latest/\";\n    }\n  </script><script type=text/javascript src=../js/storyjs-embed-cdn.js?v214></script></body>");}]);
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Taiwanese LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"zh-tw",api:{wikipedia:"zh"},date:{month:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],month_abbr:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],day:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],day_abbr:["週日","週一","週二","週三","週四","週五","週六"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'um' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"載入時間線... ",return_to_title:"回到開頭",expand_timeline:"展開時間",contract_timeline:"縮短時間",wikipedia:"擷取自維基百科, 自由之百科全書",loading_content:"載入內容",loading:"載入中"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Chinese LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"zh-cn",api:{wikipedia:"zh"},date:{month:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],month_abbr:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],day:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],day_abbr:["周日","周一","周二","周三","周四","周五","周六"]},dateformats:{year:"yyyy年",month_short:"mmm",month:"yyyy年 mmmm",full_short:"mmm d",full:"yyyy年mmmm d日",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'yyyy年mmmm d日'</small>'",full_long:"dddd',' yyyy年 mmm d日'um' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' yyyy年 mmm d日'</small>'"},messages:{loading_timeline:"加载时间线... ",return_to_title:"回到开头",expand_timeline:"伸展时间",contract_timeline:"缩短时间",wikipedia:"来自维基百科，自由的百科全书",loading_content:"正在加载内容",loading:"加载中"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/*
    TimelineJS - ver. 2.30.0 - 2014-02-20
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*//* Ukrainian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"uk",api:{wikipedia:"uk"},date:{month:["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"],month_abbr:["січ.","лют.","берез.","квіт.","трав.","черв.","лип.","серп.","вер.","жовт.","листоп.","груд."],day:["неділя","понеділок","вівторок","середа","четвер","п'ятниця‎","субота"],day_abbr:["нд.","пн.","вт.","ср.","чт.","пт.","сб."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm',' yyyy",time_short:"H:MM:ss",time_no_seconds_short:"H:MM",time_no_seconds_small_date:"H:MM'<br/><small>'d mmmm',' yyyy'</small>'",full_long:"d mmm yyyy 'у' H:MM",full_long_small_date:"H:MM'<br/><small>d mmm',' yyyy'</small>'"},messages:{loading_timeline:"Завантаження...",return_to_title:"Повернутися до початку",expand_timeline:"Збільшити",contract_timeline:"Зменьшити",wikipedia:"З Wikipedia, вільної енциклопедії",loading_content:"Завантаження вмісту",loading:"Завантаження"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Turkish LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"tr",api:{wikipedia:"tr"},date:{month:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],month_abbr:["Oca.","Şub.","Mar.","Nis.","May.","Haz.","Tem.","Ağu.","Eyl.","Eki.","Kas.","Ara."],day:["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],day_abbr:["Paz.","Pzt.","Sal.","Çar.","Per.","Cum.","Cts."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm',' yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"H:MM",time_no_seconds_small_date:"H:MM'<br/><small>'d mmmm',' yyyy'</small>'",full_long:"d mmm',' yyyy 'at' H:MM",full_long_small_date:"H:MM '<br/><small>d mmm',' yyyy'</small>'"},messages:{loading_timeline:"Zaman Çizelgesi Yükleniyor... ",return_to_title:"Başlığa Dön",expand_timeline:"Zaman Çizelgesini Genişlet",contract_timeline:"Zaman Çizelgesini Daralt",wikipedia:"Wikipedia'dan, özgür ansiklopedi",loading_content:"İçerik Yükleniyor",loading:"Yükleniyor"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Tagalog LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"tl",api:{wikipedia:"tl"},date:{month:["Enemo","Pebrero","Marso","Abril","Mayo","Hunyo","Hulyo","Agosto","Setyembre","Oktubre","Nobyembre","Disyembre"],month_abbr:["Ene.","Peb.","Mar.","Abr.","Mayo","Hun.","Hul.","Ago.","Set.","Okt.","Nob.","Dis."],day:["Linggo","Lunes","Martes","Miyerkules","Huwebes","Biyernes","Sabado"],day_abbr:["Li.","L.","M.","Mi.","H.","B.","S."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Loading Timeline... ",return_to_title:"Return to Title",expand_timeline:"Expand Timeline",contract_timeline:"Contract Timeline",wikipedia:"Mula sa Wikipedia, ang malayang ensiklopedya",loading_content:"Loading Content",loading:"Loading"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Thai LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"th",api:{wikipedia:"th"},date:{month:["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],month_abbr:["ม.ค.","ก.พ","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],day:["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"],day_abbr:["อา.","จ.","อ.","พ.","พฤ.","ศ.","ส."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Loading Timeline... ",return_to_title:"Return to Title",expand_timeline:"Expand Timeline",contract_timeline:"Contract Timeline",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Loading Content",loading:"Loading"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Telugu LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"te",api:{wikipedia:"te"},date:{month:["జనవరి","ఫిబ్రవరి","మార్చి","ఏప్రిల్","మే","జూన్","జూలై","ఆగస్ట్","సెప్టెంబర్","అక్టోబర్","నవంబర్","డిసెంబర్"],month_abbr:["జన.","ఫిబ్ర.","మార్చి","ఏప్రి.","మే","జూన్","జూలై","ఆగ.","సెప్టెం.","అక్టో.","నవం.","డిసెం."],day:["ఆదివారం","సోమవారం","మంగళవారం","బుధవారం","గురువారం","శుక్రవారం","శనివారం"],day_abbr:["ఆది.","సోమ.","మంగళ.","బుధ.","గురు.","శుక్ర.","శని."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"టైమ్‌లైన్ లోడవుతూంది... ",return_to_title:"తిరిగి మొదటి స్లైడుకి",expand_timeline:"టైమ్‌లైన్‌ను విస్తరించండి",contract_timeline:"టైమ్‌లైన్‌ను కుదించండి",wikipedia:"స్వేచ్ఛా విజ్ఞాన సర్వస్వమైన వికీపీడియా నుండి",loading_content:"విషయం లోడవుతూంది",loading:"లోడవుతూంది"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Tamil LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ta",api:{wikipedia:"ta"},date:{month:["ஜனவரி","பெப்ரவரி","மார்ச்","ஏப்ரல்","மே","ஜுன்","ஜுலை","ஆகஸ்ட்","செப்டம்பர்","ஒக்டோபர்","நவம்பர்","டிசம்பர்"],month_abbr:["ஜன.","பெப்.","மார்ச்","ஏப்ரல்","மே","ஜுன்","ஜுலை","ஆகஸ்ட்","செப்ட்.","ஒக்டோ.","நவம்பர்","டிசம்பர்"],day:["ஞாயிறு","திங்கள்","செவ்வாய்","புதன்","வியாழன்","வெள்ளி","சனி"],day_abbr:["ஞா","தி","செ","பு","வி","வெ","சனி"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"நேரக்கோடு தரவேறுகிறது.... ",return_to_title:"தலைப்பிற்குச் செல்ல",expand_timeline:"நேரக்கோட்டை விரிக்க",contract_timeline:"நேரக்கோட்டை சுருக்க",wikipedia:"கட்டற்ற கலைக்களஞ்சியம், விக்கிப்பீடியாவிலிருந்து",loading_content:"உள்ளடக்கம் தரவேறுகிறது...",loading:"தரவேறுகிறது"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Swedish LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"sv",api:{wikipedia:"sv"},date:{month:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],month_abbr:["jan","febr","mars","april","maj","juni","juli","aug","sept","okt","nov","dec"],day:["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],day_abbr:["sön","mån","tis","ons","tors","fre","lör"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm',' yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"H:MM",time_no_seconds_small_date:"H:MM'<br/><small>'d mmmm',' yyyy'</small>'",full_long:"d mmm',' yyyy 'vid' H:MM",full_long_small_date:"H:MM'<br/><small>d mmm',' yyyy'</small>'"},messages:{loading_timeline:"Laddar tidslinje... ",return_to_title:"Tillbaka till start",expand_timeline:"Förstora tidslinje",contract_timeline:"Förminska tidslinje",wikipedia:"Från Wikipedia, den fria encyklopedin",loading_content:"Laddar innehåll",loading:"Laddar"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Serbian (Latin) LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"sr",api:{wikipedia:"sr"},date:{month:["januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"],month_abbr:["Jan.","Feb.","Mart","Apr.","Maj","Jun","Jul","Avg.","Sep.","Okt.","Nov.","Dec."],day:["Nedelja","Ponedeljak","Utorak","Sreda","Četvratk","Petak","Subota"],day_abbr:["Ned.","Pon.","Uto.","Sre.","Čet.","Pet.","Sub."]},dateformats:{year:"yyyy.",month_short:"mmm",month:"mmmm yyyy.",full_short:"d. mmm",full:"d. mmmm yyyy.",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d. mmmm yyyy.'</small>'",full_long:"d. mmm yyyy. 'u' HH:MM",full_long_small_date:"HH:MM'<br/><small>d. mmm yyyy.'</small>'"},messages:{loading_timeline:"Učitavanje... ",return_to_title:"Početak",expand_timeline:"Uvećaj",contract_timeline:"Umanji",wikipedia:"Iz Vikipedije, slobodne enciklopedije",loading_content:"Sadržaj se učitava",loading:"Učitava se"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Serbian (Cyrillic) LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"рп",api:{wikipedia:"рп"},date:{month:["Јануар","Фебруар","Март","Април","Мај","Јун","Јул","Август","Септембар","Октобар","Новембар","Децембар"],month_abbr:["Јан.","Феб.","Март","Апр.","Мај","Јун","Јул","Авг.","Сеп.","Окт.","Нов.","Дец."],day:["Недеља","Понедељак","Уторак","Среда","Четвртак","Петак","Субота"],day_abbr:["Нед.","Пон.","Уто.","Сре.","Чет.","Пет.","Суб."]},dateformats:{year:"yyyy.",month_short:"mmm",month:"mmmm yyyy.",full_short:"d. mmm",full:"d. mmmm yyyy.",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d. mmmm yyyy.'</small>'",full_long:"d. mmm yyyy. 'u' HH:MM",full_long_small_date:"HH:MM'<br/><small>d. mmm yyyy.'</small>'"},messages:{loading_timeline:"Учитавање... ",return_to_title:"Почетак",expand_timeline:"Увећај",contract_timeline:"Умањи",wikipedia:"Из Википедије, слободне енциклопедије",loading_content:"Садржај се учитава",loading:"Учитава се"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Slovenian LANGUAGE SLOVENIAN
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"sl",api:{wikipedia:"sl"},date:{month:["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december"],month_abbr:["jan.","feb.","marec","april","maj","junij","july","avg.","sept.","okt.","nov.","dec."],day:["nedelja","ponedeljek","torek","sreda","čertek","petek","sobota"],day_abbr:["ned.","pon.","tor.","sre.","čet.","pet.","sob."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM",time_no_seconds_small_date:"h:MM' 'd mmmm' 'yyyy",full_long:"d mmm yyyy 'ob' hh:MM",full_long_small_date:"hh:MM' d mmm yyyy"},messages:{loading_timeline:"Nalagam časovni trak... ",return_to_title:"Nazaj na naslov",expand_timeline:"Razširi časovni trak",contract_timeline:"Pokrči časovni trak",wikipedia:"Vir Wikipedija",loading_content:"Nalaganje vsebine",loading:"Nalaganje"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Slovak LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"sk",api:{wikipedia:"sk"},date:{month:["Janu&#225;r","Febru&#225;r","Marec","Apr&#237;l","M&#225;j","J&#250;n","J&#250;l","August","September","Okt&#243;ber","November","December"],month_abbr:["Jan.","Feb.","Marec","Apr&#237;l","M&#225;j","J&#250;n","J&#250;l","Aug.","Sept.","Okt.","Nov.","Dec."],day:["Nede&#318;a","Pondelok","Utorok","Streda","&#352;tvrtok","Piatok","Sobota"],day_abbr:["Ned.","Pon.","Uto.","Str.","&#352;tv.","Pia.","Sob."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"d. mmmm',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Na&#269;&#237;tam &#269;asov&#250; os... ",return_to_title:"Sp&#228;&#357; na &#250;vod",expand_timeline:"Zv&#228;&#269;&#353;i&#357; &#269;asov&#250; os",contract_timeline:"Zmen&#353;i&#357; &#269;asov&#250; os",wikipedia:"Z Wikipedie, encyklop&#233;die zadarmo",loading_content:"Na&#269;&#237;tam obsah",loading:"Na&#269;&#237;tanie"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Sinhalese LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"si",api:{wikipedia:"si"},date:{month:["ජනවාරි","පෙබරවාරි","මාර්තු","අප්‍රේල්","මැයි","ජූනි","ජූලි","අගෝස්තු","සැප්තැම්බර්","ඔක්තෝම්බර්","නොවැම්බර්","දෙසැම්බර්"],month_abbr:["ජන.","පෙබ.","මාර්තු","අප්‍රේල්","මැයි","ජුනි","ජුලි","අගෝ.","සැප්.","ඔක්.","නොවැ.","දෙසැ."],day:["ඉරිදා","සදුදා","අගහරුවදා","බදාදා","බ්‍රහස්පතින්දා","සිකුරාදා","සෙනසුරාදා"],day_abbr:["ඉරි.","සදු.","අග.","බදා.","බ්‍රහස්.","සිකු.","සෙන."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"කාල රේඛාව ලෝඩ් වෙමින්... ",return_to_title:"නැවත මාතෘකාවට",expand_timeline:"කාල රේඛාව විහිදන්න",contract_timeline:"කාල රේඛාව අකුලන්න",wikipedia:"විකිපීඩියා, නිදහස් විශ්වකෝෂය වෙතින්",loading_content:"අන්තර්ගතය ලෝඩ් වෙමින්",loading:"ලෝඩ් වෙමින්"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/*
    TimelineJS - ver. 2.30.0 - 2014-02-20
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*//* Russian LANGUAGE 
 ================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ru",api:{wikipedia:"ru"},date:{month:["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],month_abbr:["янв.","фев.","март","апр.","май","июнь","июль","авг.","сент.","окт.","нояб.","дек."],day:["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],day_abbr:["вск.","пн.","вт.","ср.","чт.","пт.","сб."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm',' yyyy",time_short:"H:MM:ss",time_no_seconds_short:"H:MM",time_no_seconds_small_date:"H:MM'<br/><small>'d mmmm',' yyyy'</small>'",full_long:"d mmm',' yyyy 'в' HH:MM",full_long_small_date:"HH:MM'<br/><small>d mmm',' yyyy'</small>'"},messages:{loading_timeline:"Загрузка... ",return_to_title:"Вернуться к заголовку",expand_timeline:"Увеличить",contract_timeline:"Уменьшить",wikipedia:"Из Wikipedia",loading_content:"Загрузка контента",loading:"Загрузка"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Romanian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ro",api:{wikipedia:"ro"},date:{month:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],month_abbr:["Ian.","Feb.","Mar.","Apr.","Mai","Iun.","Iul.","Aug.","Sep.","Oct.","Noi.","Dec."],day:["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"],day_abbr:["Dum.","Luni","Mar.","Mie.","Joi","Vin.","Sâm."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'d mmmm',' yyyy'</small>'",full_long:"d mmm',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>d mmm',' yyyy'</small>'"},messages:{loading_timeline:"Se încarcă cronologia... ",return_to_title:"Înapoi la titlu",expand_timeline:"Extinde cronologia",contract_timeline:"Restrânge cronologia",wikipedia:"De pe Wikipedia, enciclopedia gratuită",loading_content:"Se încarcă conținutul",loading:"Se încarcă"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Romansh / Rumantsch LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"rm",api:{wikipedia:"rm"},date:{month:["Schaner","Favrer","Mars","Avrigl","Matg","Zercladur","Fanadur","Avust","Settember","October","November","December"],month_abbr:["Schan.","Favr.","Mars","Avr.","Matg","Zercl.","Fan.","Avust","Sett.","Oct.","Nov.","Dec."],day:["Dumengia","Glindesdi","Mardi","Mesemna","Gievgia","Venderdi","Sonda"],day_abbr:["Du","Gli","Ma","Me","Gie","Ve","So"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d 'da' mmm",full:"d 'da' mmmm yyyy",time_short:"HH:M:s",time_no_seconds_short:"HH:M",time_no_seconds_small_date:"HH:M'<br/><small>'d 'da' mmmm yyyy'</small>'",full_long:"d 'da' mmm yyyy', las' HH:M",full_long_small_date:"HH:M'<br/><small>d 'da' mmm yyyy'</small>'"},messages:{loading_timeline:"Chargiar la cronologia... ",return_to_title:"Turnar al titel",expand_timeline:"Expander la cronologia",contract_timeline:"Contract Timeline",wikipedia:"Da Vichipedia, l'enciclopedia libra",loading_content:"Chargiar il cuntegn",loading:"Chargiar"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Portuguese LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"pt",api:{wikipedia:"pt"},date:{month:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],month_abbr:["Jan","Fev","Mar","Abr","Maio","Jun","Jul","Ago","Set","Out","Nov","Dez"],day:["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sabado"],day_abbr:["Dom","Seg","Ter","Qua","Qui","Sex","Sab"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"A carregar a timeline... ",return_to_title:"Voltar ao Título",expand_timeline:"Expandir Timeline",contract_timeline:"Colapsar Timeline",wikipedia:"Wikipedia, A enciclopedia Livre.",loading_content:"A carregar o conteúdo",loading:"A carregar"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Brazilian Portuguese LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"pt-br",api:{wikipedia:"pt"},date:{month:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],month_abbr:["Jan.","Fev.","Mar.","Abr.","Mai.","Jun.","Jul.","Ago.","Set.","Out.","Nov.","Dez."],day:["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],day_abbr:["Dom.","Seg.","Ter.","Qua.","Qui.","Sex.","Sáb."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm 'de' yyyy",full_short:"d 'de' mmm",full:"d 'de' mmmm',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"hh:MM TT",time_no_seconds_small_date:"hh:MM TT'<br/><small>'d 'de' mmmm',' yyyy'</small>'",full_long:"dddd',' d 'de' mmm',' yyyy 'às' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>'dddd',' d 'de' mmm',' yyyy'</small>'"},messages:{loading_timeline:"Carregando Timeline... ",return_to_title:"Voltar para o título",expand_timeline:"Expandir Timeline",contract_timeline:"Contrair Timeline",wikipedia:"Wikipedia, A enciclopédia livre",loading_content:"Carregando Conteúdo",loading:"Carregando"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Polish LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"pl",api:{wikipedia:"pl"},date:{month:["Stycznia","Lutego","Marca","Kwietnia","Maja","Czerwca","Lipca","Sierpnia","Września","Października","Listopada","Grudnia"],month_abbr:["Sty.","Lut.","Mar.","Kwi.","Maj.","Cze.","Lip.","Sie.","Wrz.","Paź.","Lis.","Gru."],day:["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"],day_abbr:["Nie.","Pon.","Wto.","Śro.","Czw.","Pią.","Sob."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'um' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"Ładowanie Timeline... ",return_to_title:"Wróć do tytułu",expand_timeline:"Powiększ Timeline",contract_timeline:"Zmniejsz Timeline",wikipedia:"Z Wikipedii, wolnej encyklopedii",loading_content:"Ładowanie zawartości",loading:"Ładowanie"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Norwegian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"no",api:{wikipedia:"no"},date:{month:["Januar","Februar","Mars","April","Mai","Juni","Juli","August","September","Oktober","November","Desember"],month_abbr:["Jan.","Feb.","Mars","Apr.","Mai","Juni","Juli","Aug.","Sep.","Okt.","Nov.","Des."],day:["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"],day_abbr:["Søn.","Man.","Tir.","Ons.","Tor.","Fre.","Lør."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d. mmm",full:"d. mmmm',' yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d. mmmm',' yyyy'</small>'",full_long:"dddd',' d. mmm',' yyyy 'kl.' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d. mmm',' yyyy'</small>'"},messages:{loading_timeline:"Laster tidslinje... ",return_to_title:"Tilbake til tittel",expand_timeline:"Utvid tidslinje",contract_timeline:"Krymp tidslinje",wikipedia:"Fra Wikipedia, den frie encyklopedi",loading_content:"Laster innhold",loading:"Laster"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Dutch LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"nl",api:{wikipedia:"nl"},date:{month:["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],month_abbr:["jan","febr","maa","apr","mei","juni","juli","aug","sept","okt","nov","dec"],day:["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],day_abbr:["zo","ma","di","wo","do","vr","za"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'om' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"Tijdlijn laden ... ",return_to_title:"Terug naar het begin",expand_timeline:"Tijdlijn uitzoomen",contract_timeline:"Tijdlijn inzoomen",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Inhoud laden",loading:"Laden"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Nepali LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ne",api:{wikipedia:"ne"},date:{month:["जनवरी","फेब्रुवरी","मार्च","अप्रिल","मे","जून","जुलाई","अगस्ट","सेप्टेम्बर","अक्टोबर","नोभेम्बर","डिसेम्बर"],month_abbr:["जनवरी","फेब्रुवरी","मार्च","अप्रिल","मे","जून","जुलाई","अगस्ट","सेप्टेम्बर","अक्टोबर","नोभेम्बर","डिसेम्बर"],day:["आइतबार","सोमबार","मंगलबार","बुधबार","बिहिबार","शुक्रबार","शनिबार"],day_abbr:["आइतबार","सोमबार","मंगलबार","बुधबार","बिहिबार","शुक्रबार","शनिबार"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"टाइमलाइन लोड हुदैछ... ",return_to_title:"शीर्षकमा फर्कनुहोस्",expand_timeline:"टाइमलाइन लामो बनाउनुहोस्",contract_timeline:"टाइमलाइन छोटो बनाउनुहोस्",wikipedia:"विकिपिडियाबाट",loading_content:"सामग्री लोड हुदैछ",loading:"लोड हुदैछ"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Malay LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ms",api:{wikipedia:"ms"},date:{month:["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"],month_abbr:["Jan.","Feb.","Mac","Apr","Mei","Jun","Jul","Ogos.","Sept.","Okt.","Nov.","Dis."],day:["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"],day_abbr:["Ahd.","Isn.","Sel.","Rab.","Kha.","Jum.","Sab."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'d mmmm yyyy'</small>'",full_long:"d mmm yyyy 'jam' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>d mmm yyyy'</small>'"},messages:{loading_timeline:"Memuat Garis Masa... ",return_to_title:"Kembali ke Tajuk",expand_timeline:"Besarkan Garis Masa",contract_timeline:"Kecilkan Garis Masa",wikipedia:"Daripada Wikipedia, ensiklopedia bebas.",loading_content:"Memuat Kandungan",loading:"Memuat"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Latvian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"lv",api:{wikipedia:"lv"},date:{month:["Janvāris","Februāris","Marts","Aprīlis","Maijs","Jūnijs","Jūlijs","Augusts","Septembris","Oktobris","Novembris","Decembris"],month_abbr:["Jan.","Feb.","Mar.","Apr.","Mai.","Jūn.","Jūl.","Aug.","Sep.","Okt.","Nov.","Dec."],day:["Svētdiena","Pirmdiena","Otrdiena","Trešdiena","Ceturtdiena","Piektdiena","Sestdiena"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"d. mmmm',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"HH:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Ielādējas grafiks... ",return_to_title:"Atgriezties uz sākumu",expand_timeline:"Izvērst grafiku",contract_timeline:"Sašaurināt grafiku",wikipedia:"No Wikipedia, brīvās enciklopēdijas",loading_content:"Ielādējas saturs",loading:"Ielādējas"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Lithuanian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"lt",api:{wikipedia:"lt"},date:{month:["Sausio","Vasario","Kovo","Balandžio","Gegužės","Birželio","Liepos","Rugpjūčio","Rugsėjo","Spalio","Lapkričio","Gruodžio"],month_abbr:["Saus.","Vas.","Kov.","Bal.","Geg.","Birž.","Liep.","Rugpj.","Rug.","Spal.","Lapkr.","Gruod."],day:["Sekmadienis","Pirmadienis","Antradienis","Trečiadienis","Ketvirtadienis","Penktadienis","Šeštadienis"],day_abbr:["Sek.","Pirm.","Antr.","Treč.","Ketv.","Penkt.","Šešt."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Kraunama laiko juosta... ",return_to_title:"Grįžti į titulinį",expand_timeline:"Išplėsti laiko juostą",contract_timeline:"Sutraukti laiko juostą",wikipedia:"Iš Vikipedijos, laisvosios enciklopedijos",loading_content:"Kraunamas turinys... ",loading:"Kraunama"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Luxembourgish LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"lb",api:{wikipedia:"lb"},date:{month:["Januar","Februar","Mäerz","Abrëll","Mee","Juni","Juli","August","September","Oktober","November","Dezember"],month_abbr:["Jan.","Feb.","Mäe.","Abr.","Mee","Jun.","Jul","Aug.","Sept.","Okt.","Nov.","Dez."],day:["Sonndeg","Méindeg","Dënschdeg","Mëttwoch","Donneschden","Freiden","Samschden"],day_abbr:["Son.","Méi.","Dë.","Më.","Do.","Fr.","Sa."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"d'.' mmmm yyyy",time_short:"hh:MM:ss",time_no_seconds_short:"hh:MM",time_no_seconds_small_date:"h:MM TT'<br/><small>'d'.' mmmm yyyy'</small>'",full_long:"d'.' mmm yyyy 'um' hh:MM TT",full_long_small_date:"hh:MM'<br/><small>d'.' mmm yyyy'</small>'"},messages:{loading_timeline:"Timeline gëtt gelueden... ",return_to_title:"Zeréck zum Titel",expand_timeline:"Timeline vergréisseren",contract_timeline:"Timeline verklengeren",wikipedia:"Vu Wikipedia, der fräier Enzyklopedie",loading_content:"Inhalt lued",loading:"Lued"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Korean LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ko",api:{wikipedia:"ko"},date:{month:["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],month_abbr:["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],day:["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],day_abbr:["일","월","화","수","목","금","토"]},dateformats:{year:"yyyy",month_short:"mmm",month:"yyyy mmm",full_short:"mmm d",full:"yyyy mmm d ",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'yyyy mmm d'</small>'",full_long:"dddd',' d mmm yyyy 'um' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd','yyyy mmm d'</small>'"},messages:{loading_timeline:"타임라인을 불러오고 있습니다.... ",return_to_title:"첫화면으로",expand_timeline:"타임라인 확대",contract_timeline:"타임라인 축소",wikipedia:"출처: 위키피디아, 우리 모두의 백과사전",loading_content:"내용을 불러오고 있습니다.",loading:"불러오는중"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Georgian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ka",api:{wikipedia:"ka"},date:{month:["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი","ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"],month_abbr:["იან.","თებ.","მარტი","აპრ","მაი.","ივნ.","ივლ.","აგვ.","სექ.","ოქტ.","ნოე.","დეკ."],day:["კვირა","ორშაბათი","სამშაბათი","ოთხშაბათი","ხუთშაბათი","პარასკევი","შაბათი"],day_abbr:["კვ.","ორ.","სამ.","ოთხ.","ხუთ.","პარ.","შაბ."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"იტვირთება თაიმლაინი... ",return_to_title:"დაბრუნდი თავში",expand_timeline:"გაშალე თაიმლაინი",contract_timeline:"Contract Timeline",wikipedia:"თავისუფალი ენციკლოპედია Wikipedia-დან",loading_content:"შინაარსის ჩამოტვირთვა",loading:"ჩამოტვირთვა"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Japanese LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ja",api:{wikipedia:"ja"},date:{month:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],month_abbr:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],day:["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],day_abbr:["日","月","火","水","木","金","土"]},dateformats:{year:"yyyy年",month_short:"mmm",month:"yyyy年 m月d日 (ddd)",full_short:"yyyy年m月d日",full:"yyyy年 m月d日 (ddd)",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'yyyy年m月d日'</small>'",full_long:"yyyy年m月d日 H時M分s秒",full_long_small_date:"HH:MM:ss'<br/><small>'yyyy年m月d日'</small>'"},messages:{loading_timeline:"タイムラインをロードしています…",return_to_title:"タイトルへ戻ります",expand_timeline:"タイムラインを展開します",contract_timeline:"タイムラインを縮めます",wikipedia:"出典：フリー百科事典『ウィキペディア（Wikipedia）』",loading_content:"コンテンツをロードしています",loading:"ローディング"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Hebrew (beta) LANGUAGE 
================================================== */trace("Language code 'iw' for Hebrew is deprecated. Use 'he' instead.");typeof VMM!="undefined"&&(VMM.Language={lang:"iw",right_to_left:!0,api:{wikipedia:"he"},date:{month:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],month_abbr:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],day:["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"],day_abbr:["יום א'","יום ב'","יום ג'","יום ד'","יום ה'","יום ו'","שבת"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm,' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"d' mmm,' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"טוען את ציר הזמן... ",return_to_title:"חזור לכותרת",expand_timeline:"הרחב את ציר הזמן",contract_timeline:"צמצם את ציר הזמן",wikipedia:"מויקיפדיה, האינציקלופדיה החופשית",loading_content:"התוכן בטעינה...",loading:"טוען..."}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Italian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"it",api:{wikipedia:"it"},date:{month:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],month_abbr:["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],day:["Domenica","Lunedí","Martedí","Mercoledí","Giovedí","Venerdí","Sabato"],day_abbr:["Dom.","Lun.","Mar.","Mer.","Gio.","Ven.","Sab."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'alle' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"Caricamento Timeline... ",return_to_title:"Ritorna all'inizio",expand_timeline:"Espandi la Timeline",contract_timeline:"Contrai la Timeline",wikipedia:"Wikipedia, L’enciclopedia libera",loading_content:"Caricamento contenuti",loading:"Caricamento"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Icelandic LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"is",api:{wikipedia:"is"},date:{month:["janúar","febrúar","mars","apríl","maí","júní","júlí","ágúst","september","október","nóvember","desember"],month_abbr:["jan.","feb.","mars","apríl","maí","júní","júlí","ágúst","sept.","okt.","nóv.","des."],day:["sunnudagur","mánudagur","þriðjudagur","miðvikudagur","fimmtudagur","föstudagur","laugardagur"],day_abbr:["sun.","mán.","þri.","mið.","fim.","fös.","lau."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:SS TT",time_no_seconds_short:"hh:MM TT",time_no_seconds_small_date:"hh:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"dddd',' mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Raða upp tímalínu... ",return_to_title:"Til baka á forsíðu",expand_timeline:"Stækka tímalínu",contract_timeline:"Minnka tímalínu",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Raða",loading:"Raða"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Indonesian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"id",api:{wikipedia:"id"},date:{month:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],month_abbr:["Jan.","Feb.","Maret","April","Mei","Juni","July","Agus.","Sept.","Okt.","Nov.","Des."],day:["Ahad","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],day_abbr:["Ahad","Sen.","Sel.","Rabu","Kamis","Jum.","Sab."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'pukul' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"Memuat Timeline... ",return_to_title:"Kembali ke Judul",expand_timeline:"Kembangkan Timeline",contract_timeline:"Ciutkan Timeline",wikipedia:"dari Wikipedia, ensiklopedia bebas",loading_content:"Memuat Isi",loading:"Memuat"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Armenian LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"hy",api:{wikipedia:"hy"},date:{month:["Հունվար","Փետրվար","Մարտ","Ապրիլ","Մայիս","Հունիս","Հուլիս","Օգոստոս","Սեպտեմբեր","Հոկտեմբեր","Նոյեմբեր","Դեկտեմբեր"],month_abbr:["Հնվ.","Փետ.","Մար","Ապր","Մայ","Հուն","Հուլ","Օգս.","Սեպ.","Հոկ.","Նոյ.","Դեկ."],day:["Կիրակի","Երկուշաբթի","Երեքշաբթի","Չորեքշաբթի","Հինգշաբթի","Ուրբաթ","Շաբաթ"],day_abbr:["Կի.","Եկ.","Եք.","Չո.","Հի.","Ու.","Շա."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm',' yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"H:MM",time_no_seconds_small_date:"H:MM'<br/><small>'d mmmm',' yyyy'</small>'",full_long:"d mmm',' yyyy 'at' H:MM",full_long_small_date:"H:MM '<br/><small>d mmm',' yyyy'</small>'"},messages:{loading_timeline:"Ժամանակագրությունը բեռնվում է... ",return_to_title:"Վերադառնալ վերնագրին",expand_timeline:"Լայնացնել ժամանակագրությունը",contract_timeline:"Նեղացնել ժամանակագրությունը",wikipedia:"Ըստ Վիքիպեդիա ազատ հանրագիտարանի",loading_content:"Բովանդակությունը բեռնվում է",loading:"Բեռնում"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Hungarian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"hu",api:{wikipedia:"hu"},date:{month:["január","február","március","április","május","június","július","augusztus","szeptember","október","november","december"],month_abbr:["jan.","febr.","márc.","ápr.","máj.","jún.","júl.","aug.","szept.","okt.","nov.","dec."],day:["vasárnap","hétfő","kedd","szerda","csütörtök","péntek","szombat"],day_abbr:["vas.","hétfő","kedd","szer.","csüt.","pén.","szom."]},dateformats:{year:"yyyy",month_short:"mmm",month:"yyyy. mmmm",full_short:"mmm d.",full:"yyyy. mmmm d.",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM '<br/><small>'yyyy. mmmm d.'</small>'",full_long:"yyyy. mmm d.',' HH:MM",full_long_small_date:"HH:MM '<br/><small>yyyy. mmm d.'</small>'"},messages:{loading_timeline:"Az idővonal betöltése... ",return_to_title:"Vissza a címhez",expand_timeline:"Nagyítás",contract_timeline:"Kicsinyítés",wikipedia:"A Wikipédiából, a szabad enciklopédiából",loading_content:"Tartalom betöltése",loading:"Betöltés"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Croatian (Latin) LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"hr",api:{wikipedia:"hr"},date:{month:["siječnja","veljače","ožujka","travnja","svibnja","lipnja","srpnja","kolovoza","rujna","listopada","studenog","prosinca"],month_abbr:["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"],day:["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],day_abbr:["ned","pon","uto","sri","čet","pet","sub"]},dateformats:{year:"yyyy.",month_short:"mmm",month:"mmmm yyyy.",full_short:"dd. mmm",full:"dd. mmmm yyyy.",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'dd. mmmm yyyy.'</small>'",full_long:"dd. mmmm yyyy. 'u' HH:MM",full_long_small_date:"HH:MM'<br/><small>dd. mmm yyyy.'</small>'"},messages:{loading_timeline:"Učitavanje... ",return_to_title:"Početak",expand_timeline:"Povećaj",contract_timeline:"Smanji",wikipedia:"Iz Vikipedije, slobodne enciklopedije",loading_content:"Sadržaj se učitava",loading:"Učitava se"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Hebrew (beta) LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"he",right_to_left:!0,api:{wikipedia:"he"},date:{month:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],month_abbr:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],day:["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"],day_abbr:["יום א'","יום ב'","יום ג'","יום ד'","יום ה'","יום ו'","שבת"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm,' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"d' mmm,' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"טוען את ציר הזמן... ",return_to_title:"חזור לכותרת",expand_timeline:"הרחב את ציר הזמן",contract_timeline:"צמצם את ציר הזמן",wikipedia:"מויקיפדיה, האינציקלופדיה החופשית",loading_content:"התוכן בטעינה...",loading:"טוען..."}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Galician LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"gl",api:{wikipedia:"gl"},date:{month:["Xaneiro","Febreiro","Marzo","Abril","Maio","Xuño","Xullo","Agosto","Setembro","Outubro","Novembro","Decembro"],month_abbr:["Xan.","Feb.","Mar.","Abr.","Mai.","Xuñ.","Xul.","Ago.","Set.","Out.","Nov.","Dec."],day:["Domingo","Luns","Martes","Mércores","Xoves","Venres","Sábado"],day_abbr:["Dom.","Lun.","Mar.","Mér.","Xov.","Ven.","Sáb."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'um' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"Cronoloxía esta cargando",return_to_title:"Volver ao título",expand_timeline:"Alongar a cronoloxía",contract_timeline:"Acurtar a cronoloxía",wikipedia:"Dende Wikipedia, a enciclopedia libre",loading_content:"cargando",loading:"cargando"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* French LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"fr",api:{wikipedia:"fr"},date:{month:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],month_abbr:["janv.","févr.","mars","avril","mai","juin","juil.","août","sept.","oct.","nov.","dec."],day:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],day_abbr:["Dim.","Lu.","Ma.","Me.","Jeu.","Vend.","Sam."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'à' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"Chargement de la frise en cours... ",return_to_title:"Retour à la page d'accueil",expand_timeline:"Elargir la frise",contract_timeline:"Réduire la frise",wikipedia:"Extrait de Wikipedia, l'encyclopédie libre",loading_content:"Chargement",loading:"Chargement"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Faroese LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"fo",api:{wikipedia:"fo"},date:{month:["januar","februar","mars","aprÌl","mai","juni","juli","august","september","oktober","november","desember"],month_abbr:["jan.","febr.","mars","aprÌl","mai","juni","juli","aug.","sept.","okt.","nov.","des."],day:["sunnudagur","m·nadagur","t˝sdagur","mikudagur","hÛsdagur","frÌggjadagur","leygardagur"],day_abbr:["sun.","m·n.","t˝s.","mik.","hÛs.","frÌ.","ley."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d'.' mmm",full:"d'.' mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d'.' mmmm yyyy'</small>'",full_long:"d'.' mmmm yyyy 'klokkan' HH:MM",full_long_small_date:"HH:MM'<br/><small>'d'.' mmm yyyy'</small>'"},messages:{loading_timeline:"Lesur inn t&iacute;&eth;arr&aacute;s...",return_to_title:"V&iacute;&eth;ka t&iacute;&eth;arr&aacute;s...",expand_timeline:"Minka t&iacute;&eth;arr&aacute;s...",contract_timeline:"Minka t&iacute;&eth;arr&aacute;s",wikipedia:"Fr· Wikipedia",loading_content:"Lesur inn tilfar",loading:"Lesur inn"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Finnish LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"fi",api:{wikipedia:"fi"},date:{month:["tammikuuta","helmikuuta","maaliskuuta","huhtikuuta","toukokuuta","kesäkuuta","heinäkuuta","elokuuta","syyskuuta","lokakuuta","marraskuuta","joulukuuta"],month_abbr:["tammi","helmi","maalis","huhti","touko","kesä","heinä","elo","syys","loka","marras","joulu"],day:["sunnuntai","maanantai","tiistai","keskiviikko","torstai","perjantai","lauauntai"],day_abbr:["su","ma","ti","ke","to","pe","la"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d. mmm",full:"d. mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d. mmmm yyyy'</small>'",full_long:"mmm d yyyy 'klo' HH:MM",full_long_small_date:"HH:MM'<br/><small>d. mmm yyyy'</small>'"},messages:{loading_timeline:"Ladataan aikajanaa… ",return_to_title:"Takaisin etusivulle",expand_timeline:"Laajenna aikajanaa",contract_timeline:"Tiivistä aikajanaa",wikipedia:"Wikipediasta",loading_content:"Ladataan sisältöä",loading:"Ladataan"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
typeof VMM!="undefined"&&(VMM.Language={lang:"fa",right_to_left:!0,api:{wikipedia:"fa"},date:{month:["فروردین","اردیبهشت","خورداد","تیر","امرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],month_abbr:["فروردین","اردیبهشت","خورداد","تیر","امرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],day:["یکشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],day_abbr:["یکشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_short:"h:MM TT",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"بارگذاری، شکیبا باشید...",return_to_title:"ابتدای زمانبندی",expand_timeline:"بزرگنمایی",contract_timeline:"کوچکنمایی",wikipedia:"از ویکی پدیا، دانشنامه آزاد",loading_content:"بارگذاری",loading:"بارگذاری"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Basque/ Euskara LANGUAGE
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"eu",api:{wikipedia:"eu"},date:{month:["Urtarrila","Otsaila","Martxoa","Apirila","Maiatza","Ekaina","Uztaila","Abuztua","Iraila","Urria","Azaroa","Abendua"],month_abbr:["Urt.","Ots.","Mar.","Api.","Mai.","Eka.","Uzt.","Abu.","Ira.","Urr.","Aza.","Abe."],day:["Igandea","Astelehena","Asteartea","Asteazkena","Osteguna","Ostirala","Larunbata"],day_abbr:["Iga.","Asl.","Asr.","Asz.","Osg.","Osr.","Lar."]},dateformats:{year:"yyyy",month_short:"mmm",month:"yyyy'(e)ko' mmmm",full_short:"mmm'-'d",full:"yyyy'(e)ko' mmmm'k' d",time_short:"h:MM:SS TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br /><small>'yyyy'-'mmm'-'d'</small>",full_long:"yyyy'(e)ko' mmmm'ren' d'(e)an,' hh:MM TT'(r)etan'",full_long_small_date:"hh:MM TT'<br /><small>'yyyy'-'mmm'-'d'</small>"},messages:{loading_timeline:"Kronologia kargatzen...",return_to_title:"Titulura itzuli",expand_timeline:"Handiago ikusi",contract_timeline:"Txikiago ikusi",wikipedia:"Wikipedia entziklopedia libretik",loading_content:"Edukia kargatzen",loading:"Kargatzen"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Estonian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"et",api:{wikipedia:"et"},date:{month:["jaanuar","veebruar","märts","aprill","mai","juuni","juuli","august","september","oktoober","november","detsember"],month_abbr:["jaan.","veebr.","märts","apr.","mai","juuni","juuli","aug.","sept.","okt.","nov.","dets."],day:["pühapäev","esmaspäev","teisipäev","kolmapäev","neljapäev","reede","laupäev"],day_abbr:["P","E","T","K","N","R","L"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Laadib ajajoont… ",return_to_title:"Tagasi algusse",expand_timeline:"Vaata lähemalt",contract_timeline:"Vaata kaugemalt",wikipedia:"Wikipedia, vaba entsüklopeedia",loading_content:"Laadib sisu",loading:"Laadib"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Spanish LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"es",api:{wikipedia:"es"},date:{month:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],month_abbr:["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic."],day:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],day_abbr:["Dom.","Lun.","Mar.","Mié.","Jue.","Vie.","Sáb."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"'<small>'d mmmm yyyy'</small>' HH:MM",full_long:"dddd',' d mmm yyyy HH:MM",full_long_small_date:"HH:MM'<br/><small>d mmm yyyy'</small>'"},messages:{loading_timeline:"La cronología esta cargando",return_to_title:"Volver al título",expand_timeline:"Expandir la cronología",contract_timeline:"Reducir la cronología",wikipedia:"Desde Wikipedia, la enciclopedia libre",loading_content:"cargando",loading:"cargando"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Esperanto LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"eo",api:{wikipedia:"eo"},date:{month:["januaro","februaro","marto","aprilo","majo","junio","julio","aŭgusto","septembro","oktobro","novembro","decembro"],month_abbr:["jan.","feb.","mar.","apr.","maj.","jun.","jul.","aŭg.","sep.","okt.","nov.","dec."],day:["dimanĉo","lundo","mardo","merkredo","ĵaŭdo","vendredo","sabato"],day_abbr:["dim.","lun.","mar.","mer.","ĵaŭ.","ven.","sab."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"dddd',' d mmm yyyy 'ĉe' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d mmm yyyy'</small>'"},messages:{loading_timeline:"Ŝarĝante Kronologio... ",return_to_title:"Reveno al Titolo",expand_timeline:"Pliampleksigu Kronologio",contract_timeline:"Malpliampleksigu Kronologio",wikipedia:"El Vikipedio, la libera enciklopedio",loading_content:"Ŝarĝante enhavo",loading:"Ŝarĝante"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* English LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"en",api:{wikipedia:"en"},date:{month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Loading Timeline... ",return_to_title:"Return to Title",expand_timeline:"Expand Timeline",contract_timeline:"Contract Timeline",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Loading Content",loading:"Loading"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* English LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"en",api:{wikipedia:"en"},date:{month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM TT",time_no_seconds_small_date:"HH:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' HH:MM TT",full_long_small_date:"HH:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Loading Timeline... ",return_to_title:"Return to Title",expand_timeline:"Expand Timeline",contract_timeline:"Contract Timeline",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Loading Content",loading:"Loading"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Greek LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"en",api:{wikipedia:"en"},date:{month:["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"],month_abbr:["Ιαν.","Φεβ.","Μαρ.","Απρ.","Μαη","Ιουν.","Ιουλ.","Αύγ.","Σεπτ.","Οκτ.","Νοεμ.","Δεκ."],day:["Κυριακή","Δευτέρα","Τρίτη","Τετάρτη","Πέμπτη","Παρασκευή","Σάββατο"],day_abbr:["Κυρ.","Δευ.","Τρίτη.","Τετ.","Πεμπ.","Παρ.","Σαβ."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:SS TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Φόρτωση Timeline... ",return_to_title:"Επιστροφή στον Τίτλο",expand_timeline:"Μεγέθυνση",contract_timeline:"Contract Timeline",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Φόρτωση Περιεχομένου",loading:"Γίνεται Φόρτωση"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* German / Deutsch LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"de",api:{wikipedia:"de"},date:{month:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],month_abbr:["Jan.","Feb.","März","Apr.","Mai","Juni","Juli","Aug.","Sept.","Okt.","Nov.","Dez."],day:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],day_abbr:["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d. mmm",full:"d. mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d. mmmm yyyy'</small>'",full_long:"dddd',' d. mmm yyyy 'um' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d. mmm yyyy'</small>'"},messages:{loading_timeline:"Chronologie wird geladen...",return_to_title:"Zurück zum Anfang",expand_timeline:"Chronologie vergrößern",contract_timeline:"Chronologie verkleinern",wikipedia:"Wikipedia, Die freie Enzyklopädie",loading_content:"Loading",loading:"Loading"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Danish LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"da",api:{wikipedia:"da"},date:{month:["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"],month_abbr:["jan.","feb.","mar.","apr.","maj.","jun.","jul.","aug.","sep.","okt.","nov.","dec."],day:["søndag","mandag","tirsdag","onsdag","torsdag","fredag","lørdag"],day_abbr:["sø.","ma.","ti.","on.","to.","fr.","lø."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d. mmm",full:"d. mmmm',' yyyy",time_short:"HH:MM:ss",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d. mmmm',' yyyy'</small>'",full_long:"dddd',' d. mmm',' yyyy 'um' HH:MM",full_long_small_date:"HH:MM'<br/><small>'dddd',' d. mmm yyyy'</small>'"},messages:{loading_timeline:"Henter tidslinie...",return_to_title:"Tilbage til titel",expand_timeline:"Udvid tidslinien",contract_timeline:"Træk tidslinien sammen",wikipedia:"Fra Wikipedia",loading_content:"Henter indhold",loading:"Henter"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Czech LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"cz",api:{wikipedia:"cs"},date:{month:["ledna","února","března","dubna","května","června","července","srpna","září","října","listopadu","prosince"],month_abbr:["Led","Úno","Bře","Dub","Kvě","Čen","Čec","Srp","Zář","Říj","Lis","Pro"],day:["neděle","pondělí","úterý","středa","čtvrtek","pátek","sobota"],day_abbr:["Ne","Po","Út","St","Čt","Pá","So"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d. mmm ",full:"d. mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d. mmmm yyyy'</small>'",full_long:"dddd d. mmm yyyy 'v' HH:MM",full_long_small_date:"HH:MM'<br/><small>dddd d. mmm yyyy'</small>'"},messages:{loading_timeline:"Načítám časovou osu... ",return_to_title:"Zpět na začátek",expand_timeline:"Rozbalit časovou osu",contract_timeline:"Sbalit časovou osu",wikipedia:"Zdroj: otevřená encyklopedie Wikipedia",loading_content:"Nahrávám obsah",loading:"Nahrávám"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Catalan LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ca",api:{wikipedia:"ca"},date:{month:["Gener","Febrer","Març","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"],month_abbr:["Gen","Feb","Mar","Abr","Mai","Jun","Jul","Ago","Set","Oct","Nov","Des"],day:["Diumenge","Dilluns","Dimarts","Dimecres","Dijous","Divendres","Dissabte"],day_abbr:["Dg.","Dl.","Dt.","Dc.","Dj.","Dv.","Ds."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"'<small>'d mmmm yyyy'</small>' HH:MM",full_long:"dddd',' d mmm yyyy HH:MM",full_long_small_date:"HH:MM'<br/><small>d mmm yyyy'</small>'"},messages:{loading_timeline:"Carregant cronologia...",return_to_title:"Tornar al títol",expand_timeline:"Ampliar la cronologia",contract_timeline:"Reduir la cronologia",wikipedia:"Des de Wikipedia, l'enciclopèdia lliure",loading_content:"Carregant contingut",loading:"Carregant"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Bulgarian LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"bg",api:{wikipedia:"bg"},date:{month:["Януари","Февруари","Март","Април","Май","Юни","Юли","Август","Септември","Октомври","Ноември","Декември"],month_abbr:["Ян.","Фев.","Март","Апр.","Май","Юни","Юли","Авг.","Септ.","Окт.","Ноем.","Дек."],day:["Неделя","Понеделник","Вторник","Сряда","Четвъртък","Петък","Събота"],day_abbr:["Нед.","Пон.","Вт.","Ср.","Четв.","Пет.","Съб."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"h:MM:SS TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'d mmmm yyyy'</small>'",full_long:"d mmm yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>d mmm yyyy'</small>'"},messages:{loading_timeline:"Зареждане... ",return_to_title:"В началото",expand_timeline:"Разширяване",contract_timeline:"Свиване",wikipedia:"От Уикипедия, свободната енциклопедия",loading_content:"Съдържанието се зарежда",loading:"Зарежда се"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Arabic LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"ar",right_to_left:!0,api:{wikipedia:"ar"},date:{month:["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"],month_abbr:["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"],day:["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],day_abbr:["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:SS TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"جاري التحميل... ",return_to_title:"العودة",expand_timeline:"تكبير العرض",contract_timeline:"الاتفاقية",wikipedia:"من ويكيبيديا, الموسوعة الحرة",loading_content:"تحميل المحتوى",loading:"تحميل"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* Afrikaans LANGUAGE 
================================================== */typeof VMM!="undefined"&&(VMM.Language={lang:"af",api:{wikipedia:"af"},date:{month:["Januarie","Februarie","Maart","April","Mei","Junie","Julie","Augustus","September","Oktober","November","Desember"],month_abbr:["Jan.","Feb.","Maart","April","Mei","Junei","Julie","Aug.","Sept.","Okt.","Nov.","Des."],day:["Sondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrydag","Saterdag"],day_abbr:["Son.","Maan.","Dins.","Woen.","Don.","Vry.","Sat."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"d mmm",full:"d mmmm yyyy",time_short:"HH:MM:SS",time_no_seconds_short:"HH:MM",time_no_seconds_small_date:"HH:MM'<br/><small>'d mmmm yyyy'</small>'",full_long:"d mmm',' yyyy 'om' HH:MM",full_long_small_date:"HH:MM'<br/><small>d mmm yyyy'</small>'"},messages:{loading_timeline:"Die tydlyn laai... ",return_to_title:"Begin voor",expand_timeline:"Rek die tydlyn",contract_timeline:"Krimp die tydlyn",wikipedia:"Van Wikipedia, die gratis ensiklopedie",loading_content:"Die inhoud laai",loading:"Aan't laai"}});
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/* **********************************************
     Begin VMM.js
********************************************** */

/**
	* VéritéCo JS Core
	* Designed and built by Zach Wise at VéritéCo zach@verite.co

	* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/.

*/  


/*	Simple JavaScript Inheritance
	By John Resig http://ejohn.org/
	MIT Licensed.
================================================== */
(function() {
	var initializing = false,
	fnTest = /xyz/.test(function() {
		xyz;
		}) ? /\b_super\b/: /.*/;
		// The base Class implementation (does nothing)
	this.Class = function() {};

    // Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

        // Copy the properties over onto the new prototype
		for (var name in prop) {
            // Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) :
			prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
			this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
    };
})();

/*	Access to the Global Object
	access the global object without hard-coding the identifier window
================================================== */
var global = (function () {
   return this || (1,eval)('this');
}());

/* VMM
================================================== */
if (typeof VMM == 'undefined') {
	
	/* Main Scope Container
	================================================== */
	//var VMM = {};
	var VMM = Class.extend({});
	
	/* Debug
	================================================== */
	VMM.debug = true;
	
	/* Master Config
	================================================== */
	
	VMM.master_config = ({
		
		init: function() {
			return this;
		},
		
		sizes: {
			api: {
				width:			0,
				height:			0
			}
		},
		
		vp:				"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",
		
		api_keys_master: {
			flickr:		"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",
			//google:		"jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",
			google:		"uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U=",
			twitter:	""
		},
		
		timers: {
			api:			7000
		},
		
		api:	{
			pushques:		[]
			
		},
		
		twitter: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		flickr: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		youtube: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		vimeo: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		vine: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		webthumb: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		googlemaps: {
			active:			false,
			map_active:		false,
			places_active:	false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		googledocs: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		googleplus: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		},
		
		wikipedia: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[],
			tries:			0
		},
		
		soundcloud: {
			active:			false,
			array:			[],
			api_loaded:		false,
			que:			[]
		}
		
	}).init();
	
	//VMM.createElement(tag, value, cName, attrs, styles);
	VMM.createElement = function(tag, value, cName, attrs, styles) {
		
		var ce = "";
		
		if (tag != null && tag != "") {
			
			// TAG
			ce += "<" + tag;
			if (cName != null && cName != "") {
				ce += " class='" + cName + "'";
			};
			
			if (attrs != null && attrs != "") {
				ce += " " + attrs;
			};
			
			if (styles != null && styles != "") {
				ce += " style='" + styles + "'";
			};
			
			ce += ">";
			
			if (value != null && value != "") {
				ce += value;
			}
			
			// CLOSE TAG
			ce = ce + "</" + tag + ">";
		}
		
		return ce;
		
    };

	VMM.createMediaElement = function(media, caption, credit) {
		
		var ce = "";
		
		var _valid = false;
		
		ce += "<div class='media'>";
		
		if (media != null && media != "") {
			
			valid = true;
			
			ce += "<img src='" + media + "'>";
			
			// CREDIT
			if (credit != null && credit != "") {
				ce += VMM.createElement("div", credit, "credit");
			}
			
			// CAPTION
			if (caption != null && caption != "") {
				ce += VMM.createElement("div", caption, "caption");
			}

		}
		
		ce += "</div>";
		
		return ce;
		
    };

	// Hide URL Bar for iOS and Android by Scott Jehl
	// https://gist.github.com/1183357

	VMM.hideUrlBar = function () {
		var win = window,
			doc = win.document;

		// If there's a hash, or addEventListener is undefined, stop here
		if( !location.hash || !win.addEventListener ){

			//scroll to 1
			window.scrollTo( 0, 1 );
			var scrollTop = 1,

			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );

			win.addEventListener( "load", function(){
				setTimeout(function(){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}, 0);
			}, false );
		}
	};
	

}

/* Trace (console.log)
================================================== */
function trace( msg ) {
	if (VMM.debug) {
		if (window.console) {
			console.log(msg);
		} else if ( typeof( jsTrace ) != 'undefined' ) {
			jsTrace.send( msg );
		} else {
			//alert(msg);
		}
	}
}

/* Extending Date to include Week
================================================== */
Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

/* Extending Date to include Day of Year
================================================== */
Date.prototype.getDayOfYear = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan) / 86400000);
}

/* A MORE SPECIFIC TYPEOF();
//	http://rolandog.com/archives/2007/01/18/typeof-a-more-specific-typeof/
================================================== */
// type.of()
var is={
	Null:function(a){return a===null;},
	Undefined:function(a){return a===undefined;},
	nt:function(a){return(a===null||a===undefined);},
	Function:function(a){return(typeof(a)==="function")?a.constructor.toString().match(/Function/)!==null:false;},
	String:function(a){return(typeof(a)==="string")?true:(typeof(a)==="object")?a.constructor.toString().match(/string/i)!==null:false;},
	Array:function(a){return(typeof(a)==="object")?a.constructor.toString().match(/array/i)!==null||a.length!==undefined:false;},
	Boolean:function(a){return(typeof(a)==="boolean")?true:(typeof(a)==="object")?a.constructor.toString().match(/boolean/i)!==null:false;},
	Date:function(a){return(typeof(a)==="date")?true:(typeof(a)==="object")?a.constructor.toString().match(/date/i)!==null:false;},
	HTML:function(a){return(typeof(a)==="object")?a.constructor.toString().match(/html/i)!==null:false;},
	Number:function(a){return(typeof(a)==="number")?true:(typeof(a)==="object")?a.constructor.toString().match(/Number/)!==null:false;},
	Object:function(a){return(typeof(a)==="object")?a.constructor.toString().match(/object/i)!==null:false;},
	RegExp:function(a){return(typeof(a)==="function")?a.constructor.toString().match(/regexp/i)!==null:false;}
};
var type={
	of:function(a){
		for(var i in is){
			if(is[i](a)){
				return i.toLowerCase();
			}
		}
	}
};





/* **********************************************
     Begin VMM.Library.js
********************************************** */

/*	* LIBRARY ABSTRACTION
================================================== */
if(typeof VMM != 'undefined') {
	
	VMM.smoothScrollTo = function(elem, duration, ease) {
		if( typeof( jQuery ) != 'undefined' ){
			var _ease		= "easein",
				_duration	= 1000;
		
			if (duration != null) {
				if (duration < 1) {
					_duration = 1;
				} else {
					_duration = Math.round(duration);
				}
				
			}
			
			if (ease != null && ease != "") {
				_ease = ease;
			}
			
			if (jQuery(window).scrollTop() != VMM.Lib.offset(elem).top) {
				VMM.Lib.animate('html,body', _duration, _ease, {scrollTop: VMM.Lib.offset(elem).top})
			}
			
		}
		
	};
	
	VMM.attachElement = function(element, content) {
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).html(content);
		}
		
	};
	
	VMM.appendElement = function(element, content) {
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).append(content);
		}
		
	};
	
	VMM.getHTML = function(element) {
		var e;
		if( typeof( jQuery ) != 'undefined' ){
			e = jQuery(element).html();
			return e;
		}
		
	};
	
	VMM.getElement = function(element, p) {
		var e;
		if( typeof( jQuery ) != 'undefined' ){
			if (p) {
				e = jQuery(element).parent().get(0);
				
			} else {
				e = jQuery(element).get(0);
			}
			return e;
		}
		
	};
	
	VMM.bindEvent = function(element, the_handler, the_event_type, event_data) {
		var e;
		var _event_type = "click";
		var _event_data = {};
		
		if (the_event_type != null && the_event_type != "") {
			_event_type = the_event_type;
		}
		
		if (_event_data != null && _event_data != "") {
			_event_data = event_data;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).bind(_event_type, _event_data, the_handler);
			
			//return e;
		}
		
	};
	
	VMM.unbindEvent = function(element, the_handler, the_event_type) {
		var e;
		var _event_type = "click";
		var _event_data = {};
		
		if (the_event_type != null && the_event_type != "") {
			_event_type = the_event_type;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).unbind(_event_type, the_handler);
			
			//return e;
		}
		
	};
	
	VMM.fireEvent = function(element, the_event_type, the_data) {
		var e;
		var _event_type = "click";
		var _data = [];
		
		if (the_event_type != null && the_event_type != "") {
			_event_type = the_event_type;
		}
		if (the_data != null && the_data != "") {
			_data = the_data;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			jQuery(element).trigger(_event_type, _data);
			
			//return e;
		}
		
	};
	
	VMM.getJSON = function(url, data, callback) {
		if( typeof( jQuery ) != 'undefined' ){
			jQuery.ajaxSetup({
			     timeout: 3000
			});
			/* CHECK FOR IE
			================================================== */
			if ( VMM.Browser.browser == "Explorer" && parseInt(VMM.Browser.version, 10) >= 7 && window.XDomainRequest) {
				trace("IE JSON");
				var ie_url = url;
				if (ie_url.match('^http://')){
					return jQuery.getJSON(ie_url, data, callback);
				} else if (ie_url.match('^https://')) {
					ie_url = ie_url.replace("https://","http://");
					return jQuery.getJSON(ie_url, data, callback);
				} else {
					return jQuery.getJSON(url, data, callback);
				}
				
			} else {
				return jQuery.getJSON(url, data, callback);

			}
		}
	}
	
	VMM.parseJSON = function(the_json) {
		if( typeof( jQuery ) != 'undefined' ){
			return jQuery.parseJSON(the_json);
		}
	}
	
	// ADD ELEMENT AND RETURN IT
	VMM.appendAndGetElement = function(append_to_element, tag, cName, content) {
		var e,
			_tag		= "<div>",
			_class		= "",
			_content	= "",
			_id			= "";
		
		if (tag != null && tag != "") {
			_tag = tag;
		}
		
		if (cName != null && cName != "") {
			_class = cName;
		}
		
		if (content != null && content != "") {
			_content = content;
		}
		
		if( typeof( jQuery ) != 'undefined' ){
			
			e = jQuery(tag);
			
			e.addClass(_class);
			e.html(_content);
			
			jQuery(append_to_element).append(e);
			
		}
		
		return e;
		
	};
	
	VMM.Lib = {
		
		init: function() {
			return this;
		},
		
		hide: function(element, duration) {
			if (duration != null && duration != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).hide(duration);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).hide();
				}
			}
			
		},
		
		remove: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).remove();
			}
		},
		
		detach: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).detach();
			}
		},
		
		append: function(element, value) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).append(value);
			}
		},
		
		prepend: function(element, value) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).prepend(value);
			}
		},
		
		show: function(element, duration) {
			if (duration != null && duration != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).show(duration);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).show();
				}
			}
			
		},
		
		load: function(element, callback_function, event_data) {
			var _event_data = {elem:element}; // return element by default
			if (_event_data != null && _event_data != "") {
				_event_data = event_data;
			}
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).load(_event_data, callback_function);
			}
		},
		
		addClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).addClass(cName);
			}
		},
		
		removeClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).removeClass(cName);
			}
		},
		
		attr: function(element, aName, value) {
			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).attr(aName, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).attr(aName);
				}
			}
		},
		
		prop: function(element, aName, value) {
			if (typeof jQuery == 'undefined' || !/[1-9]\.[3-9].[1-9]/.test(jQuery.fn.jquery)) {
			    VMM.Lib.attribute(element, aName, value);
			} else {
				jQuery(element).prop(aName, value);
			}
		},
		
		attribute: function(element, aName, value) {
			
			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).attr(aName, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).attr(aName);
				}
			}
		},
		
		visible: function(element, show) {
			if (show != null) {
				if( typeof( jQuery ) != 'undefined' ){
					if (show) {
						jQuery(element).show(0);
					} else {
						jQuery(element).hide(0);
					}
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					if ( jQuery(element).is(':visible')){
						return true;
					} else {
						return false;
					}
				}
			}
		},
		
		css: function(element, prop, value) {

			if (value != null && value != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).css(prop, value);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).css(prop);
				}
			}
		},
		
		cssmultiple: function(element, propval) {

			if( typeof( jQuery ) != 'undefined' ){
				return jQuery(element).css(propval);
			}
		},
		
		offset: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = jQuery(element).offset();
			}
			return p;
		},
		
		position: function(element) {
			var p;
			if( typeof( jQuery ) != 'undefined' ){
				p = jQuery(element).position();
			}
			return p;
		},
		
		width: function(element, s) {
			if (s != null && s != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).width(s);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).width();
				}
			}
		},
		
		height: function(element, s) {
			if (s != null && s != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).height(s);
				}
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					return jQuery(element).height();
				}
			}
		},
		
		toggleClass: function(element, cName) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).toggleClass(cName);
			}
		},
		
		each:function(element, return_function) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).each(return_function);
			}
			
		},
		
		html: function(element, str) {
			var e;
			if( typeof( jQuery ) != 'undefined' ){
				e = jQuery(element).html();
				return e;
			}
			
			if (str != null && str != "") {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).html(str);
				}
			} else {
				var e;
				if( typeof( jQuery ) != 'undefined' ){
					e = jQuery(element).html();
					return e;
				}
			}

		},
		
		find: function(element, selec) {
			if( typeof( jQuery ) != 'undefined' ){
				return jQuery(element).find(selec);
			}
		},
		
		stop: function(element) {
			if( typeof( jQuery ) != 'undefined' ){
				jQuery(element).stop();
			}
		},
		
		delay_animate: function(delay, element, duration, ease, att, callback_function) {
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				var _tdd		= Math.round((duration/1500)*10)/10,
					__duration	= _tdd + 's';
					
				VMM.Lib.css(element, '-webkit-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, '-moz-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, '-o-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, '-ms-transition', 'all '+ __duration + ' ease');
				VMM.Lib.css(element, 'transition', 'all '+ __duration + ' ease');
				VMM.Lib.cssmultiple(element, _att);
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					jQuery(element).delay(delay).animate(att, {duration:duration, easing:ease} );
				}
			}
			
		},
		
		animate: function(element, duration, ease, att, que, callback_function) {
			
			var _ease		= "easein",
				_que		= false,
				_duration	= 1000,
				_att		= {};
			
			if (duration != null) {
				if (duration < 1) {
					_duration = 1;
				} else {
					_duration = Math.round(duration);
				}
				
			}
			
			if (ease != null && ease != "") {
				_ease = ease;
			}
			
			if (que != null && que != "") {
				_que = que;
			}
			
			
			if (att != null) {
				_att = att
			} else {
				_att = {opacity: 0}
			}
			
			
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				
				var _tdd		= Math.round((_duration/1500)*10)/10,
					__duration	= _tdd + 's';
					
				_ease = " cubic-bezier(0.33, 0.66, 0.66, 1)";
				//_ease = " ease-in-out";
				for (x in _att) {
					if (Object.prototype.hasOwnProperty.call(_att, x)) {
						trace(x + " to " + _att[x]);
						VMM.Lib.css(element, '-webkit-transition',  x + ' ' + __duration + _ease);
						VMM.Lib.css(element, '-moz-transition', x + ' ' + __duration + _ease);
						VMM.Lib.css(element, '-o-transition', x + ' ' + __duration + _ease);
						VMM.Lib.css(element, '-ms-transition', x + ' ' + __duration + _ease);
						VMM.Lib.css(element, 'transition', x + ' ' + __duration + _ease);
					}
				}
				
				VMM.Lib.cssmultiple(element, _att);
				
			} else {
				if( typeof( jQuery ) != 'undefined' ){
					if (callback_function != null && callback_function != "") {
						jQuery(element).animate(_att, {queue:_que, duration:_duration, easing:_ease, complete:callback_function} );
					} else {
						jQuery(element).animate(_att, {queue:_que, duration:_duration, easing:_ease} );
					}
				}
			}
			
		}
		
	}
}

if( typeof( jQuery ) != 'undefined' ){
	
	/*	XDR AJAX EXTENTION FOR jQuery
		https://github.com/jaubourg/ajaxHooks/blob/master/src/ajax/xdr.js
	================================================== */
	(function( jQuery ) {
		if ( window.XDomainRequest ) {
			jQuery.ajaxTransport(function( s ) {
				if ( s.crossDomain && s.async ) {
					if ( s.timeout ) {
						s.xdrTimeout = s.timeout;
						delete s.timeout;
					}
					var xdr;
					return {
						send: function( _, complete ) {
							function callback( status, statusText, responses, responseHeaders ) {
								xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
								xdr = undefined;
								complete( status, statusText, responses, responseHeaders );
							}
							xdr = new XDomainRequest();
							xdr.open( s.type, s.url );
							xdr.onload = function() {
								callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
							};
							xdr.onerror = function() {
								callback( 404, "Not Found" );
							};
							if ( s.xdrTimeout ) {
								xdr.ontimeout = function() {
									callback( 0, "timeout" );
								};
								xdr.timeout = s.xdrTimeout;
							}
							xdr.send( ( s.hasContent && s.data ) || null );
						},
						abort: function() {
							if ( xdr ) {
								xdr.onerror = jQuery.noop();
								xdr.abort();
							}
						}
					};
				}
			});
		}
	})( jQuery );
	
	/*	jQuery Easing v1.3
		http://gsgd.co.uk/sandbox/jquery/easing/
	================================================== */
	jQuery.easing['jswing'] = jQuery.easing['swing'];

	jQuery.extend( jQuery.easing, {
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeInExpo: function (x, t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInQuad: function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	});
}


/* **********************************************
     Begin VMM.Browser.js
********************************************** */

/*	* DEVICE AND BROWSER DETECTION
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Browser == 'undefined') {
	
	VMM.Browser = {
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
			this.device = this.searchDevice(navigator.userAgent);
			this.orientation = this.searchOrientation(window.orientation);
		},
		searchOrientation: function(orientation) {
			var orient = "";
			if ( orientation == 0  || orientation == 180) {  
				orient = "portrait";
			} else if ( orientation == 90 || orientation == -90) {  
				orient = "landscape";
			} else {
				orient = "normal";
			}
			return orient;
		},
		searchDevice: function(d) {
			var device = "";
			if (d.match(/Android/i) || d.match(/iPhone|iPod/i)) {
				device = "mobile";
			} else if (d.match(/iPad/i)) {
				device = "tablet";
			} else if (d.match(/BlackBerry/i) || d.match(/IEMobile/i)) {
				device = "other mobile";
			} else {
				device = "desktop";
			}
			return device;
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString	= data[i].string,
					dataProp	= data[i].prop;
					
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1) {
						return data[i].identity;
					}
				} else if (dataProp) {
					return data[i].identity;
				}
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{ 	string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				string: navigator.userAgent,
				subString: "iPhone",
				identity: "iPhone/iPod"
		    },
			{
				string: navigator.userAgent,
				subString: "iPad",
				identity: "iPad"
		    },
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]

	}
	VMM.Browser.init();
}

/* **********************************************
     Begin VMM.FileExtention.js
********************************************** */

/*	* File Extention
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.FileExtention == 'undefined') {
	VMM.FileExtention = {
		googleDocType: function(url) {
			var fileName			= url.replace(/\s\s*$/, ''),
				fileExtension		= "",
				validFileExtensions = ["DOC","DOCX","XLS","XLSX","PPT","PPTX","PDF","PAGES","AI","PSD","TIFF","DXF","SVG","EPS","PS","TTF","XPS","ZIP","RAR"],
				flag				= false;
				
			fileExtension = fileName.substr(fileName.length - 5, 5);
			
			for (var i = 0; i < validFileExtensions.length; i++) {
				if (fileExtension.toLowerCase().match(validFileExtensions[i].toString().toLowerCase()) || fileName.match("docs.google.com") ) {
					flag = true;
				}
			}
			return flag;
		}
	}
}

/* **********************************************
     Begin VMM.Date.js
********************************************** */

/*	* Utilities and Useful Functions
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Date == 'undefined') {
	
	VMM.Date = ({
		
		init: function() {
			return this;
		},
		
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "mmm d",
			full: "mmmm d',' yyyy",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM TT",
			time_no_seconds_small_date: "h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
			full_long: "mmm d',' yyyy 'at' hh:MM TT",
			full_long_small_date: "hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"
		},
			
		month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
		day: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		day_abbr: ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."],
		hour: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		hour_suffix: ["am"],
			
		//B.C.
		bc_format: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "mmm d",
			full: "mmmm d',' yyyy",
			time_no_seconds_short: "h:MM TT",
			time_no_seconds_small_date: "dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
			full_long: "dddd',' mmm d',' yyyy 'at' hh:MM TT",
			full_long_small_date: "hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'"
		},
			
		setLanguage: function(lang) {
			trace("SET DATE LANGUAGE");
			VMM.Date.dateformats		=	lang.dateformats;	
			VMM.Date.month				=	lang.date.month;
			VMM.Date.month_abbr			=	lang.date.month_abbr;
			VMM.Date.day				=	lang.date.day;
			VMM.Date.day_abbr			=	lang.date.day_abbr;
			dateFormat.i18n.dayNames	=	lang.date.day_abbr.concat(lang.date.day);
			dateFormat.i18n.monthNames	=	lang.date.month_abbr.concat(lang.date.month);
		},
			
		parse: function(d, precision) {
			"use strict";
			var date,
				date_array,
				time_array,
				time_parse,
				p = {
					year: 			false,
					month: 			false,
					day: 			false,
					hour: 			false,
					minute: 		false,
					second: 		false,
					millisecond: 	false
				};
				
			if (type.of(d) == "date") {
				trace("DEBUG THIS, ITs A DATE");
				date = d;
			} else {
				date = new Date(0, 0, 1, 0, 0, 0, 0);
				
				if ( d.match(/,/gi) ) {
					date_array = d.split(",");
					for(var i = 0; i < date_array.length; i++) {
						date_array[i] = parseInt(date_array[i], 10);
					}
					if (date_array[0]) {	
						date.setFullYear(date_array[0]);
						p.year = true;
					}
					if (date_array[1]) {
						date.setMonth(date_array[1] - 1);
						p.month = true;
					}
					if (date_array[2]) {
						date.setDate(date_array[2]);
						p.day = true;
					}
					if (date_array[3]) {
						date.setHours(date_array[3]);
						p.hour = true;
					}
					if (date_array[4]) {
						date.setMinutes(date_array[4]);
						p.minute = true;
					}
					if (date_array[5]) {
						date.setSeconds(date_array[5]);
						if (date_array[5] >= 1) {
							p.second = true;
						}
					}
					if (date_array[6]) {
						date.setMilliseconds(date_array[6]);
						if (date_array[6] >= 1) {
							p.millisecond = true;
						}
					}
				} else if (d.match("/")) {
					if (d.match(" ")) {
						
						time_parse = d.split(" ");
						if (d.match(":")) {
							time_array = time_parse[1].split(":");
							if (time_array[0] >= 0 ) {
								date.setHours(time_array[0]);
								p.hour = true;
							}
							if (time_array[1] >= 0) {
								date.setMinutes(time_array[1]);
								p.minute = true;
							}
							if (time_array[2] >= 0) {
								date.setSeconds(time_array[2]);
								p.second = true;
							}
							if (time_array[3] >= 0) {
								date.setMilliseconds(time_array[3]);
								p.millisecond = true;
							}
						}
						date_array = time_parse[0].split("/");
					} else {
						date_array = d.split("/");
					}
					if (date_array[2]) {
						date.setFullYear(date_array[2]);
						p.year = true;
					}
					if (date_array[0] >= 0) {
						date.setMonth(date_array[0] - 1);
						p.month = true;
					}
					if (date_array[1] >= 0) {
						if (date_array[1].length > 2) {
							date.setFullYear(date_array[1]);
							p.year = true;
						} else {
							date.setDate(date_array[1]);
							p.day = true;
						}
					}
				} else if (d.match("now")) {
					var now = new Date();	
									
					date.setFullYear(now.getFullYear());
					p.year = true;
					
					date.setMonth(now.getMonth());
					p.month = true;
					
					date.setDate(now.getDate());
					p.day = true;
					
					if (d.match("hours")) {
						date.setHours(now.getHours());
						p.hour = true;
					}
					if (d.match("minutes")) {
						date.setHours(now.getHours());
						date.setMinutes(now.getMinutes());
						p.hour = true;
						p.minute = true;
					}
					if (d.match("seconds")) {
						date.setHours(now.getHours());
						date.setMinutes(now.getMinutes());
						date.setSeconds(now.getSeconds());
						p.hour = true;
						p.minute = true;
						p.second = true;
					}
					if (d.match("milliseconds")) {
						date.setHours(now.getHours());
						date.setMinutes(now.getMinutes());
						date.setSeconds(now.getSeconds());
						date.setMilliseconds(now.getMilliseconds());
						p.hour = true;
						p.minute = true;
						p.second = true;
						p.millisecond = true;
					}
				} else if (d.length <= 8) {
					p.year = true;
					date.setFullYear(parseInt(d, 10));
					date.setMonth(0);
					date.setDate(1);
					date.setHours(0);
					date.setMinutes(0);
					date.setSeconds(0);
					date.setMilliseconds(0);
				} else if (d.match("T")) {
					if (navigator.userAgent.match(/MSIE\s(?!9.0)/)) {
					    // IE 8 < Won't accept dates with a "-" in them.
						time_parse = d.split("T");
						if (d.match(":")) {
							time_array = time_parse[1].split(":");
							if (time_array[0] >= 1) {
								date.setHours(time_array[0]);
								p.hour = true;
							}
							if (time_array[1] >= 1) {
								date.setMinutes(time_array[1]);
								p.minute = true;
							}
							if (time_array[2] >= 1) {
								date.setSeconds(time_array[2]);
								if (time_array[2] >= 1) {
									p.second = true;
								}
							}
							if (time_array[3] >= 1) {
								date.setMilliseconds(time_array[3]);
								if (time_array[3] >= 1) {
									p.millisecond = true;
								}
							}
						}
						date_array = time_parse[0].split("-");
						if (date_array[0]) {
							date.setFullYear(date_array[0]);
							p.year = true;
						}
						if (date_array[1] >= 0) {
							date.setMonth(date_array[1] - 1);
							p.month = true;
						}
						if (date_array[2] >= 0) {
							date.setDate(date_array[2]);
							p.day = true;
						}
						
					} else {
						date = new Date(Date.parse(d));
						p.year = true;
						p.month = true;
						p.day = true;
						p.hour = true;
						p.minute = true;
						if (date.getSeconds() >= 1) {
							p.second = true;
						}
						if (date.getMilliseconds() >= 1) {
							p.millisecond = true;
						}
					}
				} else {
					date = new Date(
						parseInt(d.slice(0,4), 10), 
						parseInt(d.slice(4,6), 10) - 1, 
						parseInt(d.slice(6,8), 10), 
						parseInt(d.slice(8,10), 10), 
						parseInt(d.slice(10,12), 10)
					);
					p.year = true;
					p.month = true;
					p.day = true;
					p.hour = true;
					p.minute = true;
					if (date.getSeconds() >= 1) {
						p.second = true;
					}
					if (date.getMilliseconds() >= 1) {
						p.millisecond = true;
					}
					
				}
				
			}
			
			if (precision != null && precision != "") {
				return {
					date: 		date,
					precision: 	p
				};
			} else {
				return date;
			}
		},
		
		
			
		prettyDate: function(d, is_abbr, p, d2) {
			var _date,
				_date2,
				format,
				bc_check,
				is_pair = false,
				bc_original,
				bc_number,
				bc_string;
				
			if (d2 != null && d2 != "" && typeof d2 != 'undefined') {
				is_pair = true;
				trace("D2 " + d2);
			}
			
			
			if (type.of(d) == "date") {
				
				if (type.of(p) == "object") {
					if (p.millisecond || p.second && d.getSeconds() >= 1) {
						// YEAR MONTH DAY HOUR MINUTE
						if (is_abbr){
							format = VMM.Date.dateformats.time_short; 
						} else {
							format = VMM.Date.dateformats.time_short;
						}
					} else if (p.minute) {
						// YEAR MONTH DAY HOUR MINUTE
						if (is_abbr){
							format = VMM.Date.dateformats.time_no_seconds_short; 
						} else {
							format = VMM.Date.dateformats.time_no_seconds_small_date;
						}
					} else if (p.hour) {
						// YEAR MONTH DAY HOUR
						if (is_abbr) {
							format = VMM.Date.dateformats.time_no_seconds_short;
						} else {
							format = VMM.Date.dateformats.time_no_seconds_small_date;
						}
					} else if (p.day) {
						// YEAR MONTH DAY
						if (is_abbr) {
							format = VMM.Date.dateformats.full_short;
						} else {
							format = VMM.Date.dateformats.full;
						}
					} else if (p.month) {
						// YEAR MONTH
						if (is_abbr) {
							format = VMM.Date.dateformats.month_short;
						} else {
							format = VMM.Date.dateformats.month;
						}
					} else if (p.year) {
						format = VMM.Date.dateformats.year;
					} else {
						format = VMM.Date.dateformats.year;
					}
					
				} else {
					
					if (d.getMonth() === 0 && d.getDate() == 1 && d.getHours() === 0 && d.getMinutes() === 0 ) {
						// YEAR ONLY
						format = VMM.Date.dateformats.year;
					} else if (d.getDate() <= 1 && d.getHours() === 0 && d.getMinutes() === 0) {
						// YEAR MONTH
						if (is_abbr) {
							format = VMM.Date.dateformats.month_short;
						} else {
							format = VMM.Date.dateformats.month;
						}
					} else if (d.getHours() === 0 && d.getMinutes() === 0) {
						// YEAR MONTH DAY
						if (is_abbr) {
							format = VMM.Date.dateformats.full_short;
						} else {
							format = VMM.Date.dateformats.full;
						}
					} else  if (d.getMinutes() === 0) {
						// YEAR MONTH DAY HOUR
						if (is_abbr) {
							format = VMM.Date.dateformats.time_no_seconds_short;
						} else {
							format = VMM.Date.dateformats.time_no_seconds_small_date;
						}
					} else {
						// YEAR MONTH DAY HOUR MINUTE
						if (is_abbr){
							format = VMM.Date.dateformats.time_no_seconds_short; 
						} else {
							format = VMM.Date.dateformats.full_long; 
						}
					}
				}
				
				_date = dateFormat(d, format, false);
				//_date = "Jan"
				bc_check = _date.split(" ");
					
				// BC TIME SUPPORT
				for(var i = 0; i < bc_check.length; i++) {
					if ( parseInt(bc_check[i], 10) < 0 ) {
						trace("YEAR IS BC");
						bc_original	= bc_check[i];
						bc_number	= Math.abs( parseInt(bc_check[i], 10) );
						bc_string	= bc_number.toString() + " B.C.";
						_date		= _date.replace(bc_original, bc_string);
					}
				}
					
					
				if (is_pair) {
					_date2 = dateFormat(d2, format, false);
					bc_check = _date2.split(" ");
					// BC TIME SUPPORT
					for(var j = 0; j < bc_check.length; j++) {
						if ( parseInt(bc_check[j], 10) < 0 ) {
							trace("YEAR IS BC");
							bc_original	= bc_check[j];
							bc_number	= Math.abs( parseInt(bc_check[j], 10) );
							bc_string	= bc_number.toString() + " B.C.";
							_date2			= _date2.replace(bc_original, bc_string);
						}
					}
						
				}
			} else {
				trace("NOT A VALID DATE?");
				trace(d);
			}
				
			if (is_pair) {
				return _date + " &mdash; " + _date2;
			} else {
				return _date;
			}
		}
		
	}).init();
	
	/*
	 * Date Format 1.2.3
	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	 * MIT license
	 *
	 * Includes enhancements by Scott Trenda <scott.trenda.net>
	 * and Kris Kowal <cixar.com/~kris.kowal/>
	 *
	 * Accepts a date, a mask, or a date and a mask.
	 * Returns a formatted version of the given date.
	 * The date defaults to the current date/time.
	 * The mask defaults to dateFormat.masks.default.
	 */

	var dateFormat = function () {
		var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};

		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;

			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}

			// Passing date through Date applies Date.parse, if necessary
			// Caused problems in IE
			// date = date ? new Date(date) : new Date;
			if (isNaN(date)) {
				trace("invalid date " + date);
				//return "";
			} 

			mask = String(dF.masks[mask] || mask || dF.masks["default"]);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m:    m + 1,
					mm:   pad(m + 1),
					mmm:  dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					h:    H % 12 || 12,
					hh:   pad(H % 12 || 12),
					H:    H,
					HH:   pad(H),
					M:    M,
					MM:   pad(M),
					s:    s,
					ss:   pad(s),
					l:    pad(L, 3),
					L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? "a"  : "p",
					tt:   H < 12 ? "am" : "pm",
					T:    H < 12 ? "A"  : "P",
					TT:   H < 12 ? "AM" : "PM",
					Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();

	// Some common format strings
	dateFormat.masks = {
		"default":      "ddd mmm dd yyyy HH:MM:ss",
		shortDate:      "m/d/yy",
		mediumDate:     "mmm d, yyyy",
		longDate:       "mmmm d, yyyy",
		fullDate:       "dddd, mmmm d, yyyy",
		shortTime:      "h:MM TT",
		mediumTime:     "h:MM:ss TT",
		longTime:       "h:MM:ss TT Z",
		isoDate:        "yyyy-mm-dd",
		isoTime:        "HH:MM:ss",
		isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};

	// Internationalization strings
	dateFormat.i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		]
	};

	// For convenience...
	Date.prototype.format = function (mask, utc) {
		return dateFormat(this, mask, utc);
	};
	
}

/* **********************************************
     Begin VMM.Util.js
********************************************** */

/*	* Utilities and Useful Functions
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Util == 'undefined') {
	
	VMM.Util = ({
		
		init: function() {
			return this;
		},
		
		removeRange: function(array, from, to) { // rather than change Array.prototype; Thanks Jeff McWhirter for nudge
  			var rest = array.slice((to || from) + 1 || array.length);
  			array.length = from < 0 ? array.length + from : from;
  			return array.push.apply(array, rest);
		},

		/*	* CORRECT PROTOCOL (DOES NOT WORK)
		================================================== */
		correctProtocol: function(url) {
			var loc = (window.parent.location.protocol).toString(),
				prefix = "",
				the_url = url.split("://", 2);
			
			if (loc.match("http")) {
				prefix = loc;
			} else {
				prefix = "https";
			}
			
			return prefix + "://" + the_url[1];
			
		},
		
		/*	* MERGE CONFIG
		================================================== */
		mergeConfig: function(config_main, config_to_merge) {
			var x;
			for (x in config_to_merge) {
				if (Object.prototype.hasOwnProperty.call(config_to_merge, x)) {
					config_main[x] = config_to_merge[x];
				}
			}
			return config_main;
		},
		
		/*	* GET OBJECT ATTRIBUTE BY INDEX
		================================================== */
		getObjectAttributeByIndex: function(obj, index) {
			if(typeof obj != 'undefined') {
				var i = 0;
				for (var attr in obj){
					if (index === i){
						return obj[attr];
					}
					i++;
				}
				return "";
			} else {
				return "";
			}
			
		},
		
		/*	* ORDINAL
		================================================== */
		ordinal: function(n) {
		    return ["th","st","nd","rd"][(!( ((n%10) >3) || (Math.floor(n%100/10)==1)) ) * (n%10)]; 
		},
		
		/*	* RANDOM BETWEEN
		================================================== */
		//VMM.Util.randomBetween(1, 3)
		randomBetween: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		
		/*	* AVERAGE
			* http://jsfromhell.com/array/average
			* var x = VMM.Util.average([2, 3, 4]);
			* VMM.Util.average([2, 3, 4]).mean
		================================================== */
		average: function(a) {
		    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
		    for(var m, s = 0, l = t; l--; s += a[l]);
		    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
		    return r.deviation = Math.sqrt(r.variance = s / t), r;
		},
		
		/*	* CUSTOM SORT
		================================================== */
		customSort: function(a, b) {
			var a1= a, b1= b;
			if(a1== b1) return 0;
			return a1> b1? 1: -1;
		},
		
		/*	* Remove Duplicates from Array
		================================================== */
		deDupeArray: function(arr) {
			var i,
				len=arr.length,
				out=[],
				obj={};

			for (i=0;i<len;i++) {
				obj[arr[i]]=0;
			}
			for (i in obj) {
				out.push(i);
			}
			return out;
		},
		
		/*	* Given an int or decimal, turn that into string in $xxx,xxx.xx format.
		================================================== */
		number2money: function(n, symbol, padding) {
			var symbol = (symbol !== null) ? symbol : true; // add $
			var padding = (padding !== null) ? padding : false; //pad with .00
			var number = VMM.Math2.floatPrecision(n,2); // rounded correctly to two digits, if decimals passed
			var formatted = this.niceNumber(number);
			// no decimal and padding is enabled
			if (!formatted.split(/\./g)[1] && padding) formatted = formatted + ".00";
			// add money sign
			if (symbol) formatted = "$"+formatted;
			return formatted;
		},
		
		/*	* Returns a word count number
		================================================== */
		wordCount: function(s) {
			var fullStr = s + " ";
			var initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/gi;
			var left_trimmedStr = fullStr.replace(initial_whitespace_rExp, "");
			var non_alphanumerics_rExp = /[^A-Za-z0-9\'\-]+/gi;
			var cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ");
			var splitString = cleanedStr.split(" ");
			var word_count = splitString.length -1;
			if (fullStr.length <2) {
				word_count = 0;
			}
			return word_count;
		},
		
		ratio: {
			fit: function(w, h, ratio_w, ratio_h) {
				//VMM.Util.ratio.fit(w, h, ratio_w, ratio_h).width;
				var _fit = {width:0,height:0};
				// TRY WIDTH FIRST
				_fit.width = w;
				//_fit.height = Math.round((h / ratio_h) * ratio_w);
				_fit.height = Math.round((w / ratio_w) * ratio_h);
				if (_fit.height > h) {
					_fit.height = h;
					//_fit.width = Math.round((w / ratio_w) * ratio_h);
					_fit.width = Math.round((h / ratio_h) * ratio_w);
					
					if (_fit.width > w) {
						trace("FIT: DIDN'T FIT!!! ")
					}
				}
				
				return _fit;
				
			},
			r16_9: function(w,h) {
				//VMM.Util.ratio.r16_9(w, h) // Returns corresponding number
				if (w !== null && w !== "") {
					return Math.round((h / 16) * 9);
				} else if (h !== null && h !== "") {
					return Math.round((w / 9) * 16);
				}
			},
			r4_3: function(w,h) {
				if (w !== null && w !== "") {
					return Math.round((h / 4) * 3);
				} else if (h !== null && h !== "") {
					return Math.round((w / 3) * 4);
				}
			}
		},
		
		doubledigit: function(n) {
			return (n < 10 ? '0' : '') + n;
		},
		
		/*	* Returns a truncated segement of a long string of between min and max words. If possible, ends on a period (otherwise goes to max).
		================================================== */
		truncateWords: function(s, min, max) {
			
			if (!min) min = 30;
			if (!max) max = min;
			
			var initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/gi;
			var left_trimmedStr = s.replace(initial_whitespace_rExp, "");
			var words = left_trimmedStr.split(" ");
			
			var result = [];
			
			min = Math.min(words.length, min);
			max = Math.min(words.length, max);
			
			for (var i = 0; i<min; i++) {
				result.push(words[i]);
			}		
			
			for (var j = min; i<max; i++) {
				var word = words[i];
				
				result.push(word);
				
				if (word.charAt(word.length-1) == '.') {
					break;
				}
			}		
			
			return (result.join(' '));
		},
		
		/*	* Turns plain text links into real links
		================================================== */
		linkify: function(text,targets,is_touch) {
			
			// http://, https://, ftp://
			var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

			// www. sans http:// or https://
			var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

			// Email addresses
			var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
			

			return text
				.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>")
				.replace(pseudoUrlPattern, "$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>")
				.replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>");
		},
		
		linkify_with_twitter: function(text,targets,is_touch) {
			
			// http://, https://, ftp://
			var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
			var url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img;
			var url_replace = '$1$4$7$10$13<a href="$2$5$8$11$14" target="_blank" class="hyphenate">$2$5$8$11$14</a>$3$6$9$12';
			
			// www. sans http:// or https://
			var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
			function replaceURLWithHTMLLinks(text) {
			    var exp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
			    return text.replace(exp, "<a href='$1' target='_blank'>$3</a>");
			}
			// Email addresses
			var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
			
			//var twitterHandlePattern = /(@([\w]+))/g;
			var twitterHandlePattern = /\B@([\w-]+)/gm;
			var twitterSearchPattern = /(#([\w]+))/g;

			return text
				//.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>")
				.replace(url_pattern, url_replace)
				.replace(pseudoUrlPattern, "$1<a target='_blank' class='hyphenate' onclick='void(0)' href='http://$2'>$2</a>")
				.replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>")
				.replace(twitterHandlePattern, "<a href='http://twitter.com/$1' target='_blank' onclick='void(0)'>@$1</a>");
				
				// TURN THIS BACK ON TO AUTOMAGICALLY LINK HASHTAGS TO TWITTER SEARCH
				//.replace(twitterSearchPattern, "<a href='http://twitter.com/search?q=%23$2' target='_blank' 'void(0)'>$1</a>");
		},
		
		linkify_wikipedia: function(text) {
			
			var urlPattern = /<i[^>]*>(.*?)<\/i>/gim;
			return text
				.replace(urlPattern, "<a target='_blank' href='http://en.wikipedia.org/wiki/$&' onclick='void(0)'>$&</a>")
				.replace(/<i\b[^>]*>/gim, "")
				.replace(/<\/i>/gim, "")
				.replace(/<b\b[^>]*>/gim, "")
				.replace(/<\/b>/gim, "");
		},
		
		/*	* Turns plain text links into real links
		================================================== */
		// VMM.Util.unlinkify();
		unlinkify: function(text) {
			if(!text) return text;
			text = text.replace(/<a\b[^>]*>/i,"");
			text = text.replace(/<\/a>/i, "");
			return text;
		},
		
		untagify: function(text) {
			if (!text) {
				return text;
			}
			text = text.replace(/<\s*\w.*?>/g,"");
			return text;
		},
		
		/*	* TK
		================================================== */
		nl2br: function(text) {
			return text.replace(/(\r\n|[\r\n]|\\n|\\r)/g,"<br/>");
		},
		
		/*	* Generate a Unique ID
		================================================== */
		// VMM.Util.unique_ID(size);
		unique_ID: function(size) {
			
			var getRandomNumber = function(range) {
				return Math.floor(Math.random() * range);
			};

			var getRandomChar = function() {
				var chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
				return chars.substr( getRandomNumber(62), 1 );
			};

			var randomID = function(size) {
				var str = "";
				for(var i = 0; i < size; i++) {
					str += getRandomChar();
				}
				return str;
			};
			
			return randomID(size);
		},
		/*	* Tells you if a number is even or not
		================================================== */
		// VMM.Util.isEven(n)
		isEven: function(n){
			return (n%2 === 0) ? true : false;
		},
		/*	* Get URL Variables
		================================================== */
		//	var somestring = VMM.Util.getUrlVars(str_url)["varname"];
		getUrlVars: function(string) {
			
			var str = string.toString();
			
			if (str.match('&#038;')) { 
				str = str.replace("&#038;", "&");
			} else if (str.match('&#38;')) {
				str = str.replace("&#38;", "&");
			} else if (str.match('&amp;')) {
				str = str.replace("&amp;", "&");
			}
			
			var vars = [], hash;
			var hashes = str.slice(str.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			
			
			return vars;
		},

		/*	* Cleans up strings to become real HTML
		================================================== */
		toHTML: function(text) {
			
			text = this.nl2br(text);
			text = this.linkify(text);
			
			return text.replace(/\s\s/g,"&nbsp;&nbsp;");
		},
		
		/*	* Returns text strings as CamelCase
		================================================== */
		toCamelCase: function(s,forceLowerCase) {
			
			if(forceLowerCase !== false) forceLowerCase = true;
			
			var sps = ((forceLowerCase) ? s.toLowerCase() : s).split(" ");
			
			for(var i=0; i<sps.length; i++) {
				
				sps[i] = sps[i].substr(0,1).toUpperCase() + sps[i].substr(1);
			}
			
			return sps.join(" ");
		},
		
		/*	* Replaces dumb quote marks with smart ones
		================================================== */
		properQuotes: function(str) {
			return str.replace(/\"([^\"]*)\"/gi,"&#8220;$1&#8221;");
		},
		/*	* Add Commas to numbers
		================================================== */
		niceNumber: function(nStr){
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		},
		/*	* Transform text to Title Case
		================================================== */
		toTitleCase: function(t){
			if ( VMM.Browser.browser == "Explorer" && parseInt(VMM.Browser.version, 10) >= 7) {
				return t.replace("_", "%20");
			} else {
				var __TitleCase = {
					__smallWords: ['a', 'an', 'and', 'as', 'at', 'but','by', 'en', 'for', 'if', 'in', 'of', 'on', 'or','the', 'to', 'v[.]?', 'via', 'vs[.]?'],

					init: function() {
						this.__smallRE = this.__smallWords.join('|');
						this.__lowerCaseWordsRE = new RegExp('\\b(' + this.__smallRE + ')\\b', 'gi');
						this.__firstWordRE = new RegExp('^([^a-zA-Z0-9 \\r\\n\\t]*)(' + this.__smallRE + ')\\b', 'gi');
						this.__lastWordRE = new RegExp('\\b(' + this.__smallRE + ')([^a-zA-Z0-9 \\r\\n\\t]*)$', 'gi');
					},

					toTitleCase: function(string) {
						var line = '';

						var split = string.split(/([:.;?!][ ]|(?:[ ]|^)["“])/);

						for (var i = 0; i < split.length; ++i) {
							var s = split[i];

							s = s.replace(/\b([a-zA-Z][a-z.'’]*)\b/g,this.__titleCaseDottedWordReplacer);

			 				// lowercase the list of small words
							s = s.replace(this.__lowerCaseWordsRE, this.__lowerReplacer);

							// if the first word in the title is a small word then capitalize it
							s = s.replace(this.__firstWordRE, this.__firstToUpperCase);

							// if the last word in the title is a small word, then capitalize it
							s = s.replace(this.__lastWordRE, this.__firstToUpperCase);

							line += s;
						}

						// special cases
						line = line.replace(/ V(s?)\. /g, ' v$1. ');
						line = line.replace(/(['’])S\b/g, '$1s');
						line = line.replace(/\b(AT&T|Q&A)\b/ig, this.__upperReplacer);

						return line;
					},

					__titleCaseDottedWordReplacer: function (w) {
						return (w.match(/[a-zA-Z][.][a-zA-Z]/)) ? w : __TitleCase.__firstToUpperCase(w);
					},

					__lowerReplacer: function (w) { return w.toLowerCase() },

					__upperReplacer: function (w) { return w.toUpperCase() },

					__firstToUpperCase: function (w) {
						var split = w.split(/(^[^a-zA-Z0-9]*[a-zA-Z0-9])(.*)$/);
						if (split[1]) {
							split[1] = split[1].toUpperCase();
						}
					
						return split.join('');
					
					
					}
				};

				__TitleCase.init();
			
				t = t.replace(/_/g," ");
				t = __TitleCase.toTitleCase(t);
			
				return t;
				
			}
			
		}
		
	}).init();
}

/* **********************************************
     Begin LazyLoad.js
********************************************** */

/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false */

/*
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/

LazyLoad = (function (doc) {
  // -- Private Variables ------------------------------------------------------

  // User agent and feature test information.
  var env,

  // Reference to the <head> element (populated lazily).
  head,

  // Requests currently in progress, if any.
  pending = {},

  // Number of times we've polled to check whether a pending stylesheet has
  // finished loading. If this gets too high, we're probably stalled.
  pollCount = 0,

  // Queued requests.
  queue = {css: [], js: []},

  // Reference to the browser's list of stylesheets.
  styleSheets = doc.styleSheets;

  // -- Private Methods --------------------------------------------------------

  /**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  /**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */
  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      // If this is the last of the pending URLs, execute the callback and
      // start the next request in the queue (if any).
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }

  /**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */
  function getEnv() {
    var ua = navigator.userAgent;

    env = {
      // True if this browser supports disabling async mode on dynamically
      // created script nodes. See
      // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  /**
  Loads the specified resources, or the next resource of the specified type
  in the queue if no resources are specified. If a resource of the specified
  type is already being loaded, the new request will be queued until the
  first request has been finished.

  When an array of resource URLs is specified, those URLs will be loaded in
  parallel if it is possible to do so while preserving execution order. All
  browsers support parallel loading of CSS, but only Firefox and Opera
  support parallel loading of scripts. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method load
  @param {String} type resource type ('css' or 'js')
  @param {String|Array} urls (optional) URL or array of URLs to load
  @param {Function} callback (optional) callback function to execute when the
    resource is loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function will
    be executed in this object's context
  @private
  */
  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        nodes   = [],
        i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {
      // If urls is a string, wrap it in an array. Otherwise assume it's an
      // array and create a copy of it so modifications won't be made to the
      // original.
      urls = typeof urls === 'string' ? [urls] : urls.concat();

      // Create a request object for each URL. If multiple URLs are specified,
      // the callback will only be executed after all URLs have been loaded.
      //
      // Sadly, Firefox and Opera are the only browsers capable of loading
      // scripts in parallel while preserving execution order. In all other
      // browsers, scripts must be loaded sequentially.
      //
      // All browsers respect CSS specificity based on the order of the link
      // elements in the DOM, regardless of the order in which the stylesheets
      // are actually downloaded.
      if (isCSS || env.async || env.gecko || env.opera) {
        // Load in parallel.
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        // Load sequentially.
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    // If a previous load request of this type is currently in progress, we'll
    // wait our turn. Otherwise, grab the next item in the queue.
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls;

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
          node = env.gecko ? createNode('style') : createNode('link', {
            href: url,
            rel : 'stylesheet'
          });
      } else {
        node = createNode('script', {src: url});
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          // In Gecko, we can import the requested URL into a <style> node and
          // poll for the existence of node.sheet.cssRules. Props to Zach
          // Leatherman for calling my attention to this technique.
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      nodes.push(node);
    }

    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  /**
  Begins polling to determine when the specified stylesheet has finished loading
  in Gecko. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  Thanks to Zach Leatherman for calling my attention to the @import-based
  cross-domain technique used here, and to Oleg Slobodskoi for an earlier
  same-domain implementation. See Zach's blog for more details:
  http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

  @method pollGecko
  @param {HTMLElement} node Style node to poll.
  @private
  */
  function pollGecko(node) {
    var hasRules;

    try {
      // We don't really need to store this value or ever refer to it again, but
      // if we don't store it, Closure Compiler assumes the code is useless and
      // removes it.
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      // An exception means the stylesheet is still loading.
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened. Stop
        // polling and finish the pending requests to avoid blocking further
        // requests.
        hasRules && finish('css');
      }

      return;
    }

    // If we get here, the stylesheet has loaded.
    finish('css');
  }

  /**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */
  function pollWebKit() {
    var css = pending.css, i;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          // We've been polling for 10 seconds and nothing's happened, which may
          // indicate that the stylesheet has been removed from the document
          // before it had a chance to load. Stop polling and finish the pending
          // request to prevent blocking further requests.
          finish('css');
        }
      }
    }
  }

  return {

    /**
    Requests the specified CSS URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified, the stylesheets will be loaded in parallel and the callback
    will be executed after all stylesheets have finished loading.

    @method css
    @param {String|Array} urls CSS URL or array of CSS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified stylesheets are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    /**
    Requests the specified JavaScript URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified and the browser supports it, the scripts will be loaded in
    parallel and the callback will be executed after all scripts have
    finished loading.

    Currently, only Firefox and Opera support parallel loading of scripts while
    preserving execution order. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.

    @method js
    @param {String|Array} urls JS URL or array of JS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified scripts are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this.document);


/* **********************************************
     Begin VMM.LoadLib.js
********************************************** */

/*
	LoadLib
	Designed and built by Zach Wise digitalartwork.net
*/

/*	* CodeKit Import
	* http://incident57.com/codekit/
================================================== */
// @codekit-prepend "../Library/LazyLoad.js";

LoadLib = (function (doc) {
	var loaded	= [];
	
	function isLoaded(url) {
		
		var i			= 0,
			has_loaded	= false;
		
		for (i = 0; i < loaded.length; i++) {
			if (loaded[i] == url) {
				has_loaded = true;
			}
		}
		
		if (has_loaded) {
			return true;
		} else {
			loaded.push(url);
			return false;
		}
		
	}
	
	return {
		
		css: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				LazyLoad.css(urls, callback, obj, context);
			}
		},

		js: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				LazyLoad.js(urls, callback, obj, context);
			}
		}
    };
	
})(this.document);


/* **********************************************
     Begin VMM.Language.js
********************************************** */

/* DEFAULT LANGUAGE 
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.Language == 'undefined') {
	VMM.Language = {
		lang: "en",
		api: {
			wikipedia: "en"
		},
		date: {
			month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
			day: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			day_abbr: ["Sun.","Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."]
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "mmm d",
			full: "mmmm d',' yyyy",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM TT",
			time_no_seconds_small_date: "h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
			full_long: "mmm d',' yyyy 'at' h:MM TT",
			full_long_small_date: "h:MM TT'<br/><small>mmm d',' yyyy'</small>'"
		},
		messages: {
			loading_timeline: "Loading Timeline... ",
			return_to_title: "Return to Title",
			expand_timeline: "Expand Timeline",
			contract_timeline: "Contract Timeline",
			wikipedia: "From Wikipedia, the free encyclopedia",
			loading_content: "Loading Content",
			loading: "Loading"
		}
	}
};

/* **********************************************
     Begin VMM.Core.js
********************************************** */

/* VeriteCo Core
================================================== */

/*	* CodeKit Import
	* http://incident57.com/codekit/
================================================== */
// @codekit-prepend "VMM.js";
// @codekit-prepend "VMM.Library.js";
// @codekit-prepend "VMM.Browser.js";
// @codekit-prepend "VMM.FileExtention.js";
// @codekit-prepend "VMM.Date.js";
// @codekit-prepend "VMM.Util.js";
// @codekit-prepend "VMM.LoadLib.js";
// @codekit-prepend "VMM.Language.js";



/* **********************************************
     Begin VMM.ExternalAPI.js
********************************************** */

/* External API
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.ExternalAPI == 'undefined') {
	
	VMM.ExternalAPI = ({
		
		keys: {
			google:				"",
			flickr:				"",
			twitter:			""
		},
		
		keys_master: {
			vp:			"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",
			flickr:		"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",
			google:		"jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",
			twitter:	""
		},
		
		init: function() {
			return this;
		},
		
		setKeys: function(d) {
			VMM.ExternalAPI.keys	= d;
		},
		
		pushQues: function() {
			
			if (VMM.master_config.googlemaps.active) {
				VMM.ExternalAPI.googlemaps.pushQue();
			}
			if (VMM.master_config.youtube.active) {
				VMM.ExternalAPI.youtube.pushQue();
			}
			if (VMM.master_config.soundcloud.active) {
				VMM.ExternalAPI.soundcloud.pushQue();
			}
			if (VMM.master_config.googledocs.active) {
				VMM.ExternalAPI.googledocs.pushQue();
			}
			if (VMM.master_config.googleplus.active) {
				VMM.ExternalAPI.googleplus.pushQue();
			}
			if (VMM.master_config.wikipedia.active) {
				VMM.ExternalAPI.wikipedia.pushQue();
			}
			if (VMM.master_config.vimeo.active) {
				VMM.ExternalAPI.vimeo.pushQue();
			}
			if (VMM.master_config.vine.active) {
				VMM.ExternalAPI.vine.pushQue();
			}
			if (VMM.master_config.twitter.active) {
				VMM.ExternalAPI.twitter.pushQue();
			}
			if (VMM.master_config.flickr.active) {
				VMM.ExternalAPI.flickr.pushQue();
			}
			if (VMM.master_config.webthumb.active) {
				VMM.ExternalAPI.webthumb.pushQue();
			}
		},
		
		twitter: {
			tweetArray: [],
			
			get: function(m) {
				var tweet = {mid: m.id, id: m.uid};
				VMM.master_config.twitter.que.push(tweet);
				VMM.master_config.twitter.active = true;
				//VMM.master_config.api.pushques.push(VMM.ExternalAPI.twitter.pushQue);
				
			},
			
			create: function(tweet, callback) {
				
				var id				= tweet.mid.toString(),
					error_obj		= { twitterid: tweet.mid },
					the_url			= "//api.twitter.com/1/statuses/show.json?id=" + tweet.mid + "&include_entities=true&callback=?";
					//twitter_timeout	= setTimeout(VMM.ExternalAPI.twitter.errorTimeOut, VMM.master_config.timers.api, tweet),
					//callback_timeout= setTimeout(callback, VMM.master_config.timers.api, tweet);
				
				VMM.ExternalAPI.twitter.getOEmbed(tweet, callback);
				
				/*
				// Disabled thanks to twitter's new api
				
				VMM.getJSON(the_url, function(d) {
					var id		= d.id_str,
						twit	= "<blockquote><p>",
						td		= VMM.Util.linkify_with_twitter(d.text, "_blank");
					
					//	TWEET CONTENT	
					twit += td;
					twit += "</p></blockquote>";
					
					//	TWEET MEDIA
					if (typeof d.entities.media != 'undefined') {
						if (d.entities.media[0].type == "photo") {
							//twit += "<img src=' " + d.entities.media[0].media_url + "'  alt=''>"
						}
					}
					
					//	TWEET AUTHOR
					twit += "<div class='vcard author'>";
					twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>";
					twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'  alt=''></span>";
					twit += "<span class='fn'>" + d.user.name + "</span>";
					twit += "<span class='nickname'>@" + d.user.screen_name + "<span class='thumbnail-inline'></span></span>";
					twit += "</a>";
					twit += "</div>";
				
					
				
					VMM.attachElement("#"+tweet.id.toString(), twit );
					VMM.attachElement("#text_thumb_"+tweet.id.toString(), d.text );
					VMM.attachElement("#marker_content_" + tweet.id.toString(), d.text );
					
				})
				.error(function(jqXHR, textStatus, errorThrown) {
					trace("TWITTER error");
					trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
					VMM.attachElement("#"+tweet.id, VMM.MediaElement.loadingmessage("ERROR LOADING TWEET " + tweet.mid) );
				})
				.success(function(d) {
					clearTimeout(twitter_timeout);
					clearTimeout(callback_timeout);
					callback();
				});
				
				*/
			},
			
			errorTimeOut: function(tweet) {
				trace("TWITTER JSON ERROR TIMEOUT " + tweet.mid);
				VMM.attachElement("#"+tweet.id.toString(), VMM.MediaElement.loadingmessage("Still waiting on Twitter: " + tweet.mid) );
				// CHECK RATE STATUS
				VMM.getJSON("//api.twitter.com/1/account/rate_limit_status.json", function(d) {
					trace("REMAINING TWITTER API CALLS " + d.remaining_hits);
					trace("TWITTER RATE LIMIT WILL RESET AT " + d.reset_time);
					var mes = "";
					if (d.remaining_hits == 0) {
						mes		= 	"<p>You've reached the maximum number of tweets you can load in an hour.</p>";
						mes 	+=	"<p>You can view tweets again starting at: <br/>" + d.reset_time + "</p>";
					} else {
						mes		=	"<p>Still waiting on Twitter. " + tweet.mid + "</p>";
						//mes 	= 	"<p>Tweet " + id + " was not found.</p>";
					}
					VMM.attachElement("#"+tweet.id.toString(), VMM.MediaElement.loadingmessage(mes) );
				});
				
			},
			
			errorTimeOutOembed: function(tweet) {
				trace("TWITTER JSON ERROR TIMEOUT " + tweet.mid);
				VMM.attachElement("#"+tweet.id.toString(), VMM.MediaElement.loadingmessage("Still waiting on Twitter: " + tweet.mid) );
			},
			
			pushQue: function() {
				if (VMM.master_config.twitter.que.length > 0) {
					VMM.ExternalAPI.twitter.create(VMM.master_config.twitter.que[0], VMM.ExternalAPI.twitter.pushQue);
					VMM.Util.removeRange(VMM.master_config.twitter.que,0);
				}
			},
						
			getOEmbed: function(tweet, callback) {
				
				var the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + tweet.mid + "&omit_script=true&include_entities=true&callback=?",
					twitter_timeout	= setTimeout(VMM.ExternalAPI.twitter.errorTimeOutOembed, VMM.master_config.timers.api, tweet);
					//callback_timeout= setTimeout(callback, VMM.master_config.timers.api, tweet);
				
				VMM.getJSON(the_url, function(d) {
					var twit	= "",
						tuser	= "";
					
					
					//	TWEET CONTENT
					twit += d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
					tuser = d.author_url.split("twitter.com\/")[1];
					
					
					//	TWEET AUTHOR
					twit += "<div class='vcard author'>";
					twit += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
					twit += "<span class='avatar'></span>";
					twit += "<span class='fn'>" + d.author_name + "</span>";
					twit += "<span class='nickname'>@" + tuser + "<span class='thumbnail-inline'></span></span>";
					twit += "</a>";
					twit += "</div>";
					
					VMM.attachElement("#"+tweet.id.toString(), twit );
					VMM.attachElement("#text_thumb_"+tweet.id.toString(), d.html );
					VMM.attachElement("#marker_content_" + tweet.id.toString(), d.html );
				})
				.error(function(jqXHR, textStatus, errorThrown) {
					trace("TWITTER error");
					trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
					clearTimeout(twitter_timeout);
					//clearTimeout(callback_timeout);
					VMM.attachElement("#"+tweet.id, VMM.MediaElement.loadingmessage("ERROR LOADING TWEET " + tweet.mid) );
				})
				.success(function(d) {
					clearTimeout(twitter_timeout);
					// clearTimeout(callback_timeout);
					callback();
				});
				
			},
			
			getHTML: function(id) {
				//var the_url = document.location.protocol + "//api.twitter.com/1/statuses/oembed.json?id=" + id+ "&callback=?";
				var the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + id+ "&omit_script=true&include_entities=true&callback=?";
				VMM.getJSON(the_url, VMM.ExternalAPI.twitter.onJSONLoaded);
			},
			
			onJSONLoaded: function(d) {
				trace("TWITTER JSON LOADED");
				var id = d.id;
				VMM.attachElement("#"+id, VMM.Util.linkify_with_twitter(d.html) );
			},
			
			parseTwitterDate: function(d) {
				var date = new Date(Date.parse(d));
				/*
				var t = d.replace(/(\d{1,2}[:]\d{2}[:]\d{2}) (.*)/, '$2 $1');
				t = t.replace(/(\+\S+) (.*)/, '$2 $1');
				var date = new Date(Date.parse(t)).toLocaleDateString();
				var time = new Date(Date.parse(t)).toLocaleTimeString();
				*/
				return date;
			},
			
			prettyParseTwitterDate: function(d) {
				var date = new Date(Date.parse(d));
				return VMM.Date.prettyDate(date, true);
			},
			
			getTweets: function(tweets) {
				var tweetArray = [];
				var number_of_tweets = tweets.length;
				
				for(var i = 0; i < tweets.length; i++) {
					
					var twitter_id = "";
					
					
					/* FIND THE TWITTER ID
					================================================== */
					if (tweets[i].tweet.match("status\/")) {
						twitter_id = tweets[i].tweet.split("status\/")[1];
					} else if (tweets[i].tweet.match("statuses\/")) {
						twitter_id = tweets[i].tweet.split("statuses\/")[1];
					} else {
						twitter_id = "";
					}
					
					/* FETCH THE DATA
					================================================== */
					var the_url = "//api.twitter.com/1/statuses/show.json?id=" + twitter_id + "&include_entities=true&callback=?";
					VMM.getJSON(the_url, function(d) {
						
						var tweet = {}
						/* FORMAT RESPONSE
						================================================== */
						var twit = "<div class='twitter'><blockquote><p>";
						var td = VMM.Util.linkify_with_twitter(d.text, "_blank");
						twit += td;
						twit += "</p>";
						
						twit += "— " + d.user.name + " (<a href='https://twitter.com/" + d.user.screen_name + "'>@" + d.user.screen_name + "</a>) <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.created_at) + " </a></blockquote></div>";
						
						tweet.content = twit;
						tweet.raw = d;
						
						tweetArray.push(tweet);
						
						
						/* CHECK IF THATS ALL OF THEM
						================================================== */
						if (tweetArray.length == number_of_tweets) {
							var the_tweets = {tweetdata: tweetArray}
							VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
						}
					})
					.success(function() { trace("second success"); })
					.error(function() { trace("error"); })
					.complete(function() { trace("complete"); });
					
				}
					
				
			},
			
			getTweetSearch: function(tweets, number_of_tweets) {
				var _number_of_tweets = 40;
				if (number_of_tweets != null && number_of_tweets != "") {
					_number_of_tweets = number_of_tweets;
				}
				
				var the_url = "//search.twitter.com/search.json?q=" + tweets + "&rpp=" + _number_of_tweets + "&include_entities=true&result_type=mixed";
				var tweetArray = [];
				VMM.getJSON(the_url, function(d) {
					
					/* FORMAT RESPONSE
					================================================== */
					for(var i = 0; i < d.results.length; i++) {
						var tweet = {}
						var twit = "<div class='twitter'><blockquote><p>";
						var td = VMM.Util.linkify_with_twitter(d.results[i].text, "_blank");
						twit += td;
						twit += "</p>";
						twit += "— " + d.results[i].from_user_name + " (<a href='https://twitter.com/" + d.results[i].from_user + "'>@" + d.results[i].from_user + "</a>) <a href='https://twitter.com/" + d.results[i].from_user + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.results[i].created_at) + " </a></blockquote></div>";
						tweet.content = twit;
						tweet.raw = d.results[i];
						tweetArray.push(tweet);
					}
					var the_tweets = {tweetdata: tweetArray}
					VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
				});
				
			},
			
			prettyHTML: function(id, secondary) {
				var id = id.toString();
				var error_obj = {
					twitterid: id
				};
				var the_url = "//api.twitter.com/1/statuses/show.json?id=" + id + "&include_entities=true&callback=?";
				var twitter_timeout = setTimeout(VMM.ExternalAPI.twitter.errorTimeOut, VMM.master_config.timers.api, id);
				
				VMM.getJSON(the_url, VMM.ExternalAPI.twitter.formatJSON)
					.error(function(jqXHR, textStatus, errorThrown) {
						trace("TWITTER error");
						trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
						VMM.attachElement("#twitter_"+id, "<p>ERROR LOADING TWEET " + id + "</p>" );
					})
					.success(function(d) {
						clearTimeout(twitter_timeout);
						if (secondary) {
							VMM.ExternalAPI.twitter.secondaryMedia(d);
						}
					});
			},
			
			
			
			formatJSON: function(d) {
				var id = d.id_str;
				
				var twit = "<blockquote><p>";
				var td = VMM.Util.linkify_with_twitter(d.text, "_blank");
				//td = td.replace(/(@([\w]+))/g,"<a href='http://twitter.com/$2' target='_blank'>$1</a>");
				//td = td.replace(/(#([\w]+))/g,"<a href='http://twitter.com/#search?q=%23$2' target='_blank'>$1</a>");
				twit += td;
				twit += "</p></blockquote>";
				//twit += " <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id_str + "' target='_blank' alt='link to original tweet' title='link to original tweet'>" + "<span class='created-at'></span>" + " </a>";
				
				twit += "<div class='vcard author'>";
				twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>";
				twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'  alt=''></span>";
				twit += "<span class='fn'>" + d.user.name + "</span>";
				twit += "<span class='nickname'>@" + d.user.screen_name + "<span class='thumbnail-inline'></span></span>";
				twit += "</a>";
				twit += "</div>";
				
				if (typeof d.entities.media != 'undefined') {
					if (d.entities.media[0].type == "photo") {
						twit += "<img src=' " + d.entities.media[0].media_url + "'  alt=''>"
					}
				}
				
				VMM.attachElement("#twitter_"+id.toString(), twit );
				VMM.attachElement("#text_thumb_"+id.toString(), d.text );
				
			}
			
			
		},
		
		googlemaps: {
			
			maptype: "TERRAIN", // see also below for default if this is a google type
			
			setMapType: function(d) {
				if (d != "") {
					VMM.ExternalAPI.googlemaps.maptype = d;
				}
			},
			
			get: function(m) {
				var timer, 
					api_key,
					map_url;
				
				m.vars = VMM.Util.getUrlVars(m.id);
				
				if (VMM.ExternalAPI.keys.google != "") {
					api_key = VMM.ExternalAPI.keys.google;
				} else {
					api_key = Aes.Ctr.decrypt(VMM.ExternalAPI.keys_master.google, VMM.ExternalAPI.keys_master.vp, 256);
				}
				
				
				/*
					Investigating a google map api change on the latest release that causes custom map types to stop working
					http://stackoverflow.com/questions/13486271/google-map-markermanager-cannot-call-method-substr-of-undefined
					soulution is to use api ver 3.9
				*/
				map_url = "//maps.googleapis.com/maps/api/js?key=" + api_key + "&v=3.9&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";
				
				if (VMM.master_config.googlemaps.active) {
					VMM.master_config.googlemaps.que.push(m);
				} else {
					VMM.master_config.googlemaps.que.push(m);
					
					if (VMM.master_config.googlemaps.api_loaded) {
						
					} else {
						LoadLib.js(map_url, function() {
							trace("Google Maps API Library Loaded");
						});
					}
				}
			},
			
			create: function(m) {
				VMM.ExternalAPI.googlemaps.createAPIMap(m);
			},
			
			createiFrameMap: function(m) {
				var embed_url		= m.id + "&output=embed",
					mc				= "",
					unique_map_id	= m.uid.toString() + "_gmap";
					
				mc				+= "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'>";
				mc				+= "<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='" + embed_url + "'></iframe>";
				mc				+= "</div>";
				
				VMM.attachElement("#" + m.uid, mc);
				
			},
			
			createAPIMap: function(m) {
				var map_attribution	= "",
					layer,
					map,
					map_options,
					unique_map_id			= m.uid.toString() + "_gmap",
					map_attribution_html	= "",
					location				= new google.maps.LatLng(41.875696,-87.624207),
					latlong,
					zoom					= 11,
					has_location			= false,
					has_zoom				= false,
					api_limit				= false,
					map_bounds;
					
				
				function mapProvider(name) {
					if (name in VMM.ExternalAPI.googlemaps.map_providers) {
						map_attribution = VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[name].attribution];
						return VMM.ExternalAPI.googlemaps.map_providers[name];
					} else {
						if (VMM.ExternalAPI.googlemaps.defaultType(name)) {
							trace("GOOGLE MAP DEFAULT TYPE");
							return google.maps.MapTypeId[name.toUpperCase()];
						} else {
							trace("Not a maptype: " + name );
						}
					}
				}
				
				google.maps.VeriteMapType = function(name) {
					if (VMM.ExternalAPI.googlemaps.defaultType(name)) {
						return google.maps.MapTypeId[name.toUpperCase()];
					} else {
						var provider = 			mapProvider(name);
						return google.maps.ImageMapType.call(this, {
							"getTileUrl": function(coord, zoom) {
								var index = 	(zoom + coord.x + coord.y) % VMM.ExternalAPI.googlemaps.map_subdomains.length;
								var retURL =  provider.url
										.replace("{S}", VMM.ExternalAPI.googlemaps.map_subdomains[index])
										.replace("{Z}", zoom)
										.replace("{X}", coord.x)
										.replace("{Y}", coord.y)
										.replace("{z}", zoom)
										.replace("{x}", coord.x)
										.replace("{y}", coord.y);

								// trace(retURL);
								return retURL;
							},
							"tileSize": 		new google.maps.Size(256, 256),
							"name":				name,
							"minZoom":			provider.minZoom,
							"maxZoom":			provider.maxZoom
						});
					}
				};
				
				google.maps.VeriteMapType.prototype = new google.maps.ImageMapType("_");
				
				/* Make the Map
				================================================== */
				
				if (VMM.ExternalAPI.googlemaps.maptype != "") {
					if (VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)) {
						layer				=	google.maps.MapTypeId[VMM.ExternalAPI.googlemaps.maptype.toUpperCase()];
					} else {
						layer				=	VMM.ExternalAPI.googlemaps.maptype;
					}
				} else {
					layer				=	google.maps.MapTypeId['TERRAIN'];
				}
				
				
				if (type.of(VMM.Util.getUrlVars(m.id)["ll"]) == "string") {
					has_location			= true;
					latlong					= VMM.Util.getUrlVars(m.id)["ll"].split(",");
					location				= new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
					
				} else if (type.of(VMM.Util.getUrlVars(m.id)["sll"]) == "string") {
					latlong					= VMM.Util.getUrlVars(m.id)["sll"].split(",");
					location				= new google.maps.LatLng(parseFloat(latlong[0]),parseFloat(latlong[1]));
				} 
				
				if (type.of(VMM.Util.getUrlVars(m.id)["z"]) == "string") {
					has_zoom				=	true;
					zoom					=	parseFloat(VMM.Util.getUrlVars(m.id)["z"]);
				}
				
				map_options = {
					zoom:						zoom,
					draggable: 					false, 
					disableDefaultUI:			true,
					mapTypeControl:				false,
					zoomControl:				true,
					zoomControlOptions: {
						style:					google.maps.ZoomControlStyle.SMALL,
						position:				google.maps.ControlPosition.TOP_RIGHT
					},
					center: 					location,
					mapTypeId:					layer,
					mapTypeControlOptions: {
				        mapTypeIds:				[layer]
				    }
				}
				
				VMM.attachElement("#" + m.uid, "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'></div>");
				
				map		= new google.maps.Map(document.getElementById(unique_map_id), map_options);
				
				if (VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)) {
					
				} else {
					map.mapTypes.set(layer, new google.maps.VeriteMapType(layer));
					// ATTRIBUTION
					map_attribution_html =	"<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>";
					VMM.appendElement("#"+unique_map_id, map_attribution_html);
				}
				
				// DETERMINE IF KML IS POSSIBLE 
				if (type.of(VMM.Util.getUrlVars(m.id)["msid"]) == "string") {
					loadKML();
				} else {
					//loadPlaces();
					if (type.of(VMM.Util.getUrlVars(m.id)["q"]) == "string") {
						geocodePlace();
					} 
				}
				
				// GEOCODE
				function geocodePlace() {


					
					var geocoder	= new google.maps.Geocoder(),
						address		= VMM.Util.getUrlVars(m.id)["q"],
						marker;
						
					if (address.match("loc:")) {
						var address_latlon = address.split(":")[1].split("+");
						location = new google.maps.LatLng(parseFloat(address_latlon[0]),parseFloat(address_latlon[1]));
						has_location = true;
					}
						
					geocoder.geocode( { 'address': address}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							
							marker = new google.maps.Marker({
								map: map,
								position: results[0].geometry.location
							});
							
							// POSITION MAP
							//map.setCenter(results[0].geometry.location);
							//map.panTo(location);
							if (typeof results[0].geometry.viewport != 'undefined') {
								map.fitBounds(results[0].geometry.viewport);
							} else if (typeof results[0].geometry.bounds != 'undefined') {
								map.fitBounds(results[0].geometry.bounds);
							} else {
								map.setCenter(results[0].geometry.location);
							}
							
							if (has_location) {
								map.panTo(location);
							}
							if (has_zoom) {
								map.setZoom(zoom);
							}
							
						} else {
							trace("Geocode for " + address + " was not successful for the following reason: " + status);
							trace("TRYING PLACES SEARCH");
							
							if (has_location) {
								map.panTo(location);
							}
							if (has_zoom) {
								map.setZoom(zoom);
							}
							
							loadPlaces();
						}
					});
				}
				
				// PLACES
				function loadPlaces() {
					var place,
						search_request,
						infowindow,
						search_bounds,
						bounds_sw,
						bounds_ne;
					
					place_search	= new google.maps.places.PlacesService(map);
					infowindow		= new google.maps.InfoWindow();
					
					search_request = {
						query:		"",
						types:		['country', 'neighborhood', 'political', 'locality', 'geocode']
					};
					
					if (type.of(VMM.Util.getUrlVars(m.id)["q"]) == "string") {
						search_request.query	= VMM.Util.getUrlVars(m.id)["q"];
					}
					
					if (has_location) {
						search_request.location	= location;
						search_request.radius	= "15000";
					} else {
						bounds_sw = new google.maps.LatLng(-89.999999,-179.999999);
						bounds_ne = new google.maps.LatLng(89.999999,179.999999);
						search_bounds = new google.maps.LatLngBounds(bounds_sw,bounds_ne);
						
						//search_request.location	= search_bounds;
					}
					
					place_search.textSearch(search_request, placeResults);
					
					function placeResults(results, status) {
						
						if (status == google.maps.places.PlacesServiceStatus.OK) {
							
							for (var i = 0; i < results.length; i++) {
								//createMarker(results[i]);
							}
							
							if (has_location) {
								map.panTo(location);
							} else {
								if (results.length >= 1) {
									map.panTo(results[0].geometry.location);
									if (has_zoom) {
										map.setZoom(zoom);
									}
								} 
							}
							
							
						} else {
							trace("Place search for " + search_request.query + " was not successful for the following reason: " + status);
							// IF There's a problem loading the map, load a simple iFrame version instead
							trace("YOU MAY NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");
							trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");
							
							
							if (has_location) {
								map.panTo(location);
								if (has_zoom) {
									map.setZoom(zoom);
								}
							} else {
								trace("USING SIMPLE IFRAME MAP EMBED");
								if (m.id[0].match("https")) { 
									m.id = m.url[0].replace("https", "http");
								}
								VMM.ExternalAPI.googlemaps.createiFrameMap(m);
							}
							
						}
						
					}
					
					function createMarker(place) {
						var marker, placeLoc;
						
						placeLoc = place.geometry.location;
						marker = new google.maps.Marker({
							map: map,
							position: place.geometry.location
						});

						google.maps.event.addListener(marker, 'click', function() {
							infowindow.setContent(place.name);
							infowindow.open(map, this);
						});
					}
					
				}
				
				function loadPlacesAlt() {
					var api_key,
						places_url,
						has_key		= false;
						
					trace("LOADING PLACES API FOR GOOGLE MAPS");
						
					if (VMM.ExternalAPI.keys.google != "") {
						api_key	= VMM.ExternalAPI.keys.google;
						has_key	= true;
					} else {
						trace("YOU NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");
						trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");
					}
					
					places_url		= "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + api_key + "&sensor=false&language=" + m.lang + "&";
					
					if (type.of(VMM.Util.getUrlVars(m.id)["q"]) == "string") {
						places_url	+= "query=" + VMM.Util.getUrlVars(m.id)["q"];
					}
					
					if (has_location) {
						places_url	+= "&location=" + location;
					} 
					
					if (has_key) {
						VMM.getJSON(places_url, function(d) {
							trace("PLACES JSON");
						
							var places_location 	= "",
								places_bounds		= "",
								places_bounds_ne	= "",
								places_bounds_sw	= "";
						
							trace(d);
						
							if (d.status == "OVER_QUERY_LIMIT") {
								trace("OVER_QUERY_LIMIT");
								if (has_location) {
									map.panTo(location);
									if (has_zoom) {
										map.setZoom(zoom);
									}
								} else {
									trace("DOING TRADITIONAL MAP IFRAME EMBED UNTIL QUERY LIMIT RESTORED");
									api_limit = true;
									VMM.ExternalAPI.googlemaps.createiFrameMap(m);
								}
							
							} else {
								if (d.results.length >= 1) {
									//location = new google.maps.LatLng(parseFloat(d.results[0].geometry.location.lat),parseFloat(d.results[0].geometry.location.lng));
									//map.panTo(location);
							
									places_bounds_ne	= new google.maps.LatLng(parseFloat(d.results[0].geometry.viewport.northeast.lat),parseFloat(d.results[0].geometry.viewport.northeast.lng));
									places_bounds_sw	= new google.maps.LatLng(parseFloat(d.results[0].geometry.viewport.southwest.lat),parseFloat(d.results[0].geometry.viewport.southwest.lng));
							
									places_bounds = new google.maps.LatLngBounds(places_bounds_sw, places_bounds_ne)
									map.fitBounds(places_bounds);
							
								} else {
									trace("NO RESULTS");
								}
						
								if (has_location) {
									map.panTo(location);
								} 
								if (has_zoom) {
									map.setZoom(zoom);
								}
							}
						
						})
						.error(function(jqXHR, textStatus, errorThrown) {
							trace("PLACES JSON ERROR");
							trace("PLACES JSON ERROR: " + textStatus + " " + jqXHR.responseText);
						})
						.success(function(d) {
							trace("PLACES JSON SUCCESS");
						});
					} else {
						if (has_location) {
							map.panTo(location);
							if (has_zoom) {
								map.setZoom(zoom);
							}
						} else {
							trace("DOING TRADITIONAL MAP IFRAME EMBED BECAUSE NO GOOGLE MAP API KEY WAS PROVIDED");
							VMM.ExternalAPI.googlemaps.createiFrameMap(m);
						}
					}
					
					
				}
				
				// KML
				function loadKML() {
					var kml_url, kml_layer, infowindow, text;
					
					kml_url				= m.id + "&output=kml";
					kml_url				= kml_url.replace("&output=embed", "");
					kml_layer			= new google.maps.KmlLayer(kml_url, {preserveViewport:true});
					infowindow			= new google.maps.InfoWindow();
					kml_layer.setMap(map);
					
					google.maps.event.addListenerOnce(kml_layer, "defaultviewport_changed", function() {
					   
						if (has_location) {
							map.panTo(location);
						} else {
							map.fitBounds(kml_layer.getDefaultViewport() );
						}
						if (has_zoom) {
							map.setZoom(zoom);
						}
					});
					
					google.maps.event.addListener(kml_layer, 'click', function(kmlEvent) {
						text			= kmlEvent.featureData.description;
						showInfoWindow(text);
						
						function showInfoWindow(c) {
							infowindow.setContent(c);
							infowindow.open(map);
						}
					});
				}
				
				
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.googlemaps.que.length; i++) {
					VMM.ExternalAPI.googlemaps.create(VMM.master_config.googlemaps.que[i]);
				}
				VMM.master_config.googlemaps.que = [];
			},
			
			onMapAPIReady: function() {
				VMM.master_config.googlemaps.map_active = true;
				VMM.master_config.googlemaps.places_active = true;
				VMM.ExternalAPI.googlemaps.onAPIReady();
			},
			
			onPlacesAPIReady: function() {
				VMM.master_config.googlemaps.places_active = true;
				VMM.ExternalAPI.googlemaps.onAPIReady();
			},
			
			onAPIReady: function() {
				if (!VMM.master_config.googlemaps.active) {
					if (VMM.master_config.googlemaps.map_active && VMM.master_config.googlemaps.places_active) {
						VMM.master_config.googlemaps.active = true;
						VMM.ExternalAPI.googlemaps.pushQue();
					}
				}
			},
			
			defaultType: function(name) {
				if (name.toLowerCase() == "satellite" || name.toLowerCase() == "hybrid" || name.toLowerCase() == "terrain" || name.toLowerCase() == "roadmap") {
					return true;
				} else {
					return false;
				}
			},
			
			map_subdomains: ["", "a.", "b.", "c.", "d."],
			
			map_attribution: {
				"stamen": 			"Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",
				"apple": 			"Map data &copy; 2012  Apple, Imagery &copy; 2012 Apple",
				"osm":				"&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
			},
									
			map_providers: {
				"toner": {
					"url": 			"//{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",
					"minZoom": 		0,
					"maxZoom": 		20,
					"attribution": 	"stamen"
					
				},
				"toner-lines": {
					"url": 			"//{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",
					"minZoom": 		0,
					"maxZoom": 		20,
					"attribution": 	"stamen"
				},
				"toner-labels": {
					"url": 			"//{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",
					"minZoom": 		0,
					"maxZoom": 		20,
					"attribution": 	"stamen"
				},
				"sterrain": {
					"url": 			"//{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",
					"minZoom": 		4,
					"maxZoom": 		20,
					"attribution": 	"stamen"
				},
				"apple": {
					"url": 			"//gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",
					"minZoom": 		4,
					"maxZoom": 		14,
					"attribution": 	"apple"
				},
				"watercolor": {
					"url": 			"//{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",
					"minZoom": 		3,
					"maxZoom": 		16,
					"attribution": 	"stamen"
				},
				"osm": {
					"url": 			"//tile.openstreetmap.org/{z}/{x}/{y}.png",
					"minZoom": 		3,
					"maxZoom": 		18,
					"attribution":		"osm"
				}
			}
		},
		
		googleplus: {
			
			get: function(m) {
				var api_key;
				var gplus = {user: m.user, activity: m.id, id: m.uid};
				
				VMM.master_config.googleplus.que.push(gplus);
				VMM.master_config.googleplus.active = true;
			},
			
			create: function(gplus, callback) {
				var mediaElem			= "",
					api_key				= "",
					g_activity			= "",
					g_content			= "",
					g_attachments		= "",
					gperson_api_url,
					gactivity_api_url;
					googleplus_timeout	= setTimeout(VMM.ExternalAPI.googleplus.errorTimeOut, VMM.master_config.timers.api, gplus),
					callback_timeout	= setTimeout(callback, VMM.master_config.timers.api, gplus);
					
				
				if (VMM.master_config.Timeline.api_keys.google != "") {
					api_key = VMM.master_config.Timeline.api_keys.google;
				} else {
					api_key = Aes.Ctr.decrypt(VMM.master_config.api_keys_master.google, VMM.master_config.vp, 256);
				}
				
				gperson_api_url = "https://www.googleapis.com/plus/v1/people/" + gplus.user + "/activities/public?alt=json&maxResults=100&fields=items(id,url)&key=" + api_key;
				
				//mediaElem	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + gplus.url + "&amp;embedded=true'></iframe>";
				mediaElem = "GOOGLE PLUS API CALL";
				
				VMM.getJSON(gperson_api_url, function(p_data) {
					for(var i = 0; i < p_data.items.length; i++) {
						trace("loop");
						if (p_data.items[i].url.split("posts/")[1] == gplus.activity) {
							trace("FOUND IT!!");
							
							g_activity = p_data.items[i].id;
							gactivity_api_url = "https://www.googleapis.com/plus/v1/activities/" + g_activity + "?alt=json&key=" + api_key;
							
							VMM.getJSON(gactivity_api_url, function(a_data) {
								trace(a_data);
								//a_data.url
								//a_data.image.url
								//a_data.actor.displayName
								//a_data.provider.title
								//a_data.object.content
								
								//g_content		+=	"<h4>" + a_data.title + "</h4>";
								
								if (typeof a_data.annotation != 'undefined') {
									g_content	+=	"<div class='googleplus-annotation'>'" + a_data.annotation + "</div>";
									g_content	+=	a_data.object.content;
								} else {
									g_content	+=	a_data.object.content;
								}
								
								if (typeof a_data.object.attachments != 'undefined') {
									
									//g_attachments	+=	"<div class='googleplus-attachemnts'>";
									
									for(var k = 0; k < a_data.object.attachments.length; k++) {
										if (a_data.object.attachments[k].objectType == "photo") {
											g_attachments	=	"<a href='" + a_data.object.url + "' target='_blank'>" + "<img src='" + a_data.object.attachments[k].image.url + "' class='article-thumb'></a>" + g_attachments;
										} else if (a_data.object.attachments[k].objectType == "video") {
											g_attachments	=	"<img src='" + a_data.object.attachments[k].image.url + "' class='article-thumb'>" + g_attachments;
											g_attachments	+=	"<div>";
											g_attachments	+=	"<a href='" + a_data.object.attachments[k].url + "' target='_blank'>"
											g_attachments	+=	"<h5>" + a_data.object.attachments[k].displayName + "</h5>";
											//g_attachments	+=	"<p>" + a_data.object.attachments[k].content + "</p>";
											g_attachments	+=	"</a>";
											g_attachments	+=	"</div>";
										} else if (a_data.object.attachments[k].objectType == "article") {
											g_attachments	+=	"<div>";
											g_attachments	+=	"<a href='" + a_data.object.attachments[k].url + "' target='_blank'>"
											g_attachments	+=	"<h5>" + a_data.object.attachments[k].displayName + "</h5>";
											g_attachments	+=	"<p>" + a_data.object.attachments[k].content + "</p>";
											g_attachments	+=	"</a>";
											g_attachments	+=	"</div>";
										}
										
										trace(a_data.object.attachments[k]);
									}
									
									g_attachments	=	"<div class='googleplus-attachments'>" + g_attachments + "</div>";
								}
								
								//mediaElem		=	"<div class='googleplus'>";
								mediaElem		=	"<div class='googleplus-content'>" + g_content + g_attachments + "</div>";

								mediaElem		+=	"<div class='vcard author'><a class='screen-name url' href='" + a_data.url + "' target='_blank'>";
								mediaElem		+=	"<span class='avatar'><img src='" + a_data.actor.image.url + "' style='max-width: 32px; max-height: 32px;'></span>"
								mediaElem		+=	"<span class='fn'>" + a_data.actor.displayName + "</span>";
								mediaElem		+=	"<span class='nickname'><span class='thumbnail-inline'></span></span>";
								mediaElem		+=	"</a></div>";
								
								VMM.attachElement("#googleplus_" + gplus.activity, mediaElem);
								
								
							});
							
							break;
						}
					}
					
					
					
				})
				.error(function(jqXHR, textStatus, errorThrown) {
					var error_obj = VMM.parseJSON(jqXHR.responseText);
					trace(error_obj.error.message);
					VMM.attachElement("#googleplus_" + gplus.activity, VMM.MediaElement.loadingmessage("<p>ERROR LOADING GOOGLE+ </p><p>" + error_obj.error.message + "</p>"));
				})
				.success(function(d) {
					clearTimeout(googleplus_timeout);
					clearTimeout(callback_timeout);
					callback();
				});
				
				
				
			},
			
			pushQue: function() {
				if (VMM.master_config.googleplus.que.length > 0) {
					VMM.ExternalAPI.googleplus.create(VMM.master_config.googleplus.que[0], VMM.ExternalAPI.googleplus.pushQue);
					VMM.Util.removeRange(VMM.master_config.googleplus.que,0);
				}
				/*
				for(var i = 0; i < VMM.master_config.googleplus.que.length; i++) {
					VMM.ExternalAPI.googleplus.create(VMM.master_config.googleplus.que[i]);
				}
				VMM.master_config.googleplus.que = [];
				*/
			},
			
			errorTimeOut: function(gplus) {
				trace("GOOGLE+ JSON ERROR TIMEOUT " + gplus.activity);
				VMM.attachElement("#googleplus_" + gplus.activity, VMM.MediaElement.loadingmessage("<p>Still waiting on GOOGLE+ </p><p>" + gplus.activity + "</p>"));
				
			}
			
		},
		
		googledocs: {
			
			get: function(m) {
				VMM.master_config.googledocs.que.push(m);
				VMM.master_config.googledocs.active = true;
			},
			
			create: function(m) {
				var mediaElem = ""; 
				if (m.id.match(/docs.google.com/i)) {
					mediaElem	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + m.id + "&amp;embedded=true'></iframe>";
				} else {
					mediaElem	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + "//docs.google.com/viewer?url=" + m.id + "&amp;embedded=true'></iframe>";
				}
				VMM.attachElement("#"+m.uid, mediaElem);
			},
			
			pushQue: function() {
				
				for(var i = 0; i < VMM.master_config.googledocs.que.length; i++) {
					VMM.ExternalAPI.googledocs.create(VMM.master_config.googledocs.que[i]);
				}
				VMM.master_config.googledocs.que = [];
			}
		
		},
		
		flickr: {
			
			get: function(m) {
				VMM.master_config.flickr.que.push(m);
				VMM.master_config.flickr.active = true;
			},
			
			create: function(m, callback) {
				var api_key,
					callback_timeout= setTimeout(callback, VMM.master_config.timers.api, m);
					
				if (typeof VMM.master_config.Timeline != 'undefined' && VMM.master_config.Timeline.api_keys.flickr != "") {
					api_key = VMM.master_config.Timeline.api_keys.flickr;
				} else {
					api_key = Aes.Ctr.decrypt(VMM.master_config.api_keys_master.flickr, VMM.master_config.vp, 256)
				}
				var the_url = "//api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + m.id + "&format=json&jsoncallback=?";
				
				VMM.getJSON(the_url, function(d) {
					var flickr_id = VMM.ExternalAPI.flickr.getFlickrIdFromUrl(d.sizes.size[0].url);
				
					var flickr_large_id = "#" + m.uid,
						flickr_thumb_id = "#" + m.uid + "_thumb";
						//flickr_thumb_id = "flickr_" + uid + "_thumb";
				
					var flickr_img_size,
						flickr_img_thumb,
						flickr_size_found = false,
						flickr_best_size = "Large";
				
					flickr_best_size = VMM.ExternalAPI.flickr.sizes(VMM.master_config.sizes.api.height);
					for(var i = 0; i < d.sizes.size.length; i++) {
						if (d.sizes.size[i].label == flickr_best_size) {
							
							flickr_size_found = true;
							flickr_img_size = d.sizes.size[i].source;
						}
					}
					if (!flickr_size_found) {
						flickr_img_size = d.sizes.size[d.sizes.size.length - 2].source;
					}
				
					flickr_img_thumb = d.sizes.size[0].source;
					VMM.Lib.attr(flickr_large_id, "src", flickr_img_size);
					//VMM.attachElement(flickr_large_id, "<a href='" + flick.link + "' target='_blank'><img src='" + flickr_img_size + "'></a>");
					VMM.attachElement(flickr_thumb_id, "<img src='" + flickr_img_thumb + "'>");
					
				})
				.error(function(jqXHR, textStatus, errorThrown) {
					trace("FLICKR error");
					trace("FLICKR ERROR: " + textStatus + " " + jqXHR.responseText);
				})
				.success(function(d) {
					clearTimeout(callback_timeout);
					callback();
				});
				
			},
			
			pushQue: function() {
				if (VMM.master_config.flickr.que.length > 0) {
					VMM.ExternalAPI.flickr.create(VMM.master_config.flickr.que[0], VMM.ExternalAPI.flickr.pushQue);
					VMM.Util.removeRange(VMM.master_config.flickr.que,0);
				}
			},
			
			sizes: function(s) {
				var _size = "";
				if (s <= 75) {
					_size = "Thumbnail";
				} else if (s <= 180) {
					_size = "Small";
				} else if (s <= 240) {
					_size = "Small 320";
				} else if (s <= 375) {
					_size = "Medium";
				} else if (s <= 480) {
					_size = "Medium 640";
				} else if (s <= 600) {
					_size = "Large";
				} else {
					_size = "Large";
				}
				
				return _size;
			},

			getFlickrIdFromUrl: function(url) {
				var idx = url.indexOf("flickr.com/photos/");
				if (idx == -1) return null; 
				var pos = idx + "flickr.com/photos/".length;
				var photo_info = url.substr(pos)
				if (photo_info.indexOf('/') == -1) return null;
				if (photo_info.indexOf('/') == 0) photo_info = photo_info.substr(1);
				return photo_info.split("/")[1];
			}
		},
		
		instagram: {
			get: function(m, thumb) {
				if (thumb) {
					return "//instagr.am/p/" + m.id + "/media/?size=t";
				} else {
					return "//instagr.am/p/" + m.id + "/media/?size=" + VMM.ExternalAPI.instagram.sizes(VMM.master_config.sizes.api.height);
				}
			},
			
			sizes: function(s) {
				var _size = "";
				if (s <= 150) {
					_size = "t";
				} else if (s <= 306) {
					_size = "m";
				} else {
					_size = "l";
				}
				
				return _size;
			},

			isInstagramUrl: function(url) {
				return url.match("instagr.am/p/") || url.match("instagram.com/p/");
			},

			getInstagramIdFromUrl: function(url) {
				try {
					return url.split("\/p\/")[1].split("/")[0];	
				} catch(e) {
					trace("Invalid Instagram url: " + url);
					return null;
				}
				
			}
		},
		
		soundcloud: {
			
			get: function(m) {
				VMM.master_config.soundcloud.que.push(m);
				VMM.master_config.soundcloud.active = true;
			},
			
			create: function(m, callback) {
				var the_url = "//soundcloud.com/oembed?url=" + m.id + "&format=js&callback=?";
				VMM.getJSON(the_url, function(d) {
					VMM.attachElement("#"+m.uid, d.html);
					callback();
				});
			},
			
			pushQue: function() {
				if (VMM.master_config.soundcloud.que.length > 0) {
					VMM.ExternalAPI.soundcloud.create(VMM.master_config.soundcloud.que[0], VMM.ExternalAPI.soundcloud.pushQue);
					VMM.Util.removeRange(VMM.master_config.soundcloud.que,0);
				}
			}
			
		},
		
		wikipedia: {
			
			get: function(m) {
				VMM.master_config.wikipedia.que.push(m);
				VMM.master_config.wikipedia.active = true;
			},
			
			create: function(m, callback) {
				var the_url = "//" + m.lang + ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" + m.id + "&exintro=1&format=json&callback=?";
				callback_timeout= setTimeout(callback, VMM.master_config.timers.api, m);
				
				if ( VMM.Browser.browser == "Explorer" && parseInt(VMM.Browser.version, 10) >= 7 && window.XDomainRequest) {
					var temp_text	=	"<h4><a href='http://" + VMM.master_config.language.api.wikipedia + ".wikipedia.org/wiki/" + m.id + "' target='_blank'>" + m.url + "</a></h4>";
					temp_text		+=	"<span class='wiki-source'>" + VMM.master_config.language.messages.wikipedia + "</span>";
					temp_text		+=	"<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>";
					VMM.attachElement("#"+m.uid, temp_text );
				}
				
				VMM.getJSON(the_url, function(d) {
					if (d.query) {
						var wiki_extract,
							wiki_title, 
							_wiki = "", 
							wiki_text = "", 
							wiki_number_of_paragraphs = 1, 
							wiki_text_array = [];
						
						wiki_extract = VMM.Util.getObjectAttributeByIndex(d.query.pages, 0).extract;
						wiki_title = VMM.Util.getObjectAttributeByIndex(d.query.pages, 0).title;
						
						if (wiki_extract.match("<p>")) {
							wiki_text_array = wiki_extract.split("<p>");
						} else {
							wiki_text_array.push(wiki_extract);
						}
					
						for(var i = 0; i < wiki_text_array.length; i++) {
							if (i+1 <= wiki_number_of_paragraphs && i+1 < wiki_text_array.length) {
								wiki_text	+= "<p>" + wiki_text_array[i+1];
							}
						}
					
						_wiki		=	"<h4><a href='http://" + VMM.master_config.language.api.wikipedia + ".wikipedia.org/wiki/" + wiki_title + "' target='_blank'>" + wiki_title + "</a></h4>";
						_wiki		+=	"<span class='wiki-source'>" + VMM.master_config.language.messages.wikipedia + "</span>";
						_wiki		+=	VMM.Util.linkify_wikipedia(wiki_text);
					
						if (wiki_extract.match("REDIRECT")) {
						
						} else {
							VMM.attachElement("#"+m.uid, _wiki );
						}
					}
					//callback();
				})
				.error(function(jqXHR, textStatus, errorThrown) {
					trace("WIKIPEDIA error");
					trace("WIKIPEDIA ERROR: " + textStatus + " " + jqXHR.responseText);
					trace(errorThrown);
					
					VMM.attachElement("#"+m.uid, VMM.MediaElement.loadingmessage("<p>Wikipedia is not responding</p>"));
					// TRY AGAIN?
					clearTimeout(callback_timeout);
					if (VMM.master_config.wikipedia.tries < 4) {
						trace("WIKIPEDIA ATTEMPT " + VMM.master_config.wikipedia.tries);
						trace(m);
						VMM.master_config.wikipedia.tries++;
						VMM.ExternalAPI.wikipedia.create(m, callback);
					} else {
						callback();
					}
					
				})
				.success(function(d) {
					VMM.master_config.wikipedia.tries = 0;
					clearTimeout(callback_timeout);
					callback();
				});
				
				
			},
			
			pushQue: function() {
				
				if (VMM.master_config.wikipedia.que.length > 0) {
					trace("WIKIPEDIA PUSH QUE " + VMM.master_config.wikipedia.que.length);
					VMM.ExternalAPI.wikipedia.create(VMM.master_config.wikipedia.que[0], VMM.ExternalAPI.wikipedia.pushQue);
					VMM.Util.removeRange(VMM.master_config.wikipedia.que,0);
				}

			}
			
		},
		
		youtube: {
			
			get: function(m) {
				var the_url = "//gdata.youtube.com/feeds/api/videos/" + m.id + "?v=2&alt=jsonc&callback=?";
					
				VMM.master_config.youtube.que.push(m);
				
				if (!VMM.master_config.youtube.active) {
					if (!VMM.master_config.youtube.api_loaded) {
						LoadLib.js('//www.youtube.com/player_api', function() {
							trace("YouTube API Library Loaded");
						});
					}
				}
				
				// THUMBNAIL
				VMM.getJSON(the_url, function(d) {
					VMM.ExternalAPI.youtube.createThumb(d, m)
				});
				
			},
			
			create: function(m) {
				if (typeof(m.start) != 'undefined') {
					
					var vidstart			= m.start.toString(),
						vid_start_minutes	= 0,
						vid_start_seconds	= 0;
						
					if (vidstart.match('m')) {
						vid_start_minutes = parseInt(vidstart.split("m")[0], 10);
						vid_start_seconds = parseInt(vidstart.split("m")[1].split("s")[0], 10);
						m.start = (vid_start_minutes * 60) + vid_start_seconds;
					} else {
						m.start = 0;
					}
				} else {
					m.start = 0;
				}
				
				var p = {
					active: 				false,
					player: 				{},
					name:					m.uid,
					playing:				false,
					hd:						false
				};
				
				if (typeof(m.hd) != 'undefined') {
					p.hd = true;
				}
				
				p.player[m.id] = new YT.Player(m.uid, {
					height: 				'390',
					width: 					'640',
					playerVars: {
						enablejsapi:		1,
						color: 				'white',
						showinfo:			0,
						theme:				'light',
						start:				m.start,
						rel:				0
					},
					videoId: m.id,
					events: {
						'onReady': 			VMM.ExternalAPI.youtube.onPlayerReady,
						'onStateChange': 	VMM.ExternalAPI.youtube.onStateChange
					}
				});
				
				VMM.master_config.youtube.array.push(p);
			},
			
			createThumb: function(d, m) {
				trace("CREATE THUMB");
				trace(d);
				trace(m);
				if (typeof d.data != 'undefined') {
					var thumb_id = "#" + m.uid + "_thumb";
					VMM.attachElement(thumb_id, "<img src='" + d.data.thumbnail.sqDefault + "'>");
					
				}
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.youtube.que.length; i++) {
					VMM.ExternalAPI.youtube.create(VMM.master_config.youtube.que[i]);
				}
				VMM.master_config.youtube.que = [];
			},
			
			onAPIReady: function() {
				VMM.master_config.youtube.active = true;
				VMM.ExternalAPI.youtube.pushQue();
			},
			
			stopPlayers: function() {
				for(var i = 0; i < VMM.master_config.youtube.array.length; i++) {
					if (VMM.master_config.youtube.array[i].playing) {
						if (typeof VMM.master_config.youtube.array[i].player.the_name !== 'undefined') {
							VMM.master_config.youtube.array[i].player.the_name.stopVideo();
						}
					}
				}
			},
			 
			onStateChange: function(e) {
				for(var i = 0; i < VMM.master_config.youtube.array.length; i++) {
					for (var z in VMM.master_config.youtube.array[i].player) {
						if (VMM.master_config.youtube.array[i].player[z] == e.target) {
							VMM.master_config.youtube.array[i].player.the_name = VMM.master_config.youtube.array[i].player[z];
						}
					}
					if (VMM.master_config.youtube.array[i].player.the_name == e.target) {
						if (e.data == YT.PlayerState.PLAYING) {
							VMM.master_config.youtube.array[i].playing = true;
							if (VMM.master_config.youtube.array[i].hd === false) {
								VMM.master_config.youtube.array[i].hd = true;
								VMM.master_config.youtube.array[i].player.the_name.setPlaybackQuality("hd720");
							}
						}
					}
				}
			},
			
			onPlayerReady: function(e) {
				
			}
			
			
		},
		
		vimeo: {
			
			get: function(m) {
				VMM.master_config.vimeo.que.push(m);
				VMM.master_config.vimeo.active = true;
			},
			
			create: function(m, callback) {
				trace("VIMEO CREATE");
				
				// THUMBNAIL
				var thumb_url	= "//vimeo.com/api/v2/video/" + m.id + ".json",
					video_url	= "//player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
					
				VMM.getJSON(thumb_url, function(d) {
					VMM.ExternalAPI.vimeo.createThumb(d, m);
					callback();
				});
				
				
				// VIDEO
				VMM.attachElement("#" + m.uid, "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe>");
				
			},
			
			createThumb: function(d, m) {
				trace("VIMEO CREATE THUMB");
				var thumb_id = "#" + m.uid + "_thumb";
				VMM.attachElement(thumb_id, "<img src='" + d[0].thumbnail_small + "'>");
			},
			
			pushQue: function() {
				if (VMM.master_config.vimeo.que.length > 0) {
					VMM.ExternalAPI.vimeo.create(VMM.master_config.vimeo.que[0], VMM.ExternalAPI.vimeo.pushQue);
					VMM.Util.removeRange(VMM.master_config.vimeo.que,0);
				}
			}
			
		},
		
		vine: {
			
			get: function(m) {
				VMM.master_config.vine.que.push(m);
				VMM.master_config.vine.active = true;
			},
			
			create: function(m, callback) {
				trace("VINE CREATE");				
				
				var video_url	= "https://vine.co/v/" + m.id + "/embed/simple";
					
				
				
				// VIDEO
				// TODO: NEED TO ADD ASYNC SCRIPT TO TIMELINE FLOW
				VMM.attachElement("#" + m.uid, "<iframe frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>");
				
			},
			
			pushQue: function() {
				if (VMM.master_config.vine.que.length > 0) {
					VMM.ExternalAPI.vine.create(VMM.master_config.vine.que[0], VMM.ExternalAPI.vine.pushQue);
					VMM.Util.removeRange(VMM.master_config.vine.que,0);
				}
			}
			
		},
		
		webthumb: {
			
			get: function(m, thumb) {
				VMM.master_config.webthumb.que.push(m);
				VMM.master_config.webthumb.active = true;
			},
			
			sizes: function(s) {
				var _size = "";
				if (s <= 150) {
					_size = "t";
				} else if (s <= 306) {
					_size = "m";
				} else {
					_size = "l";
				}
				
				return _size;
			},
			
			create: function(m) {
				trace("WEB THUMB CREATE");
				
				var thumb_url	= "//api.pagepeeker.com/v2/thumbs.php?";
					url			= m.id.replace("http://", "");//.split("/")[0];
					
				// Main Image
				VMM.attachElement("#" + m.uid, "<a href='" + m.id + "' target='_blank'><img src='" + thumb_url + "size=x&url=" + url + "'></a>");
				
				// Thumb
				VMM.attachElement("#" + m.uid + "_thumb", "<img src='" + thumb_url + "size=t&url=" + url + "'>");
			},
			
			pushQue: function() {
				for(var i = 0; i < VMM.master_config.webthumb.que.length; i++) {
					VMM.ExternalAPI.webthumb.create(VMM.master_config.webthumb.que[i]);
				}
				VMM.master_config.webthumb.que = [];
			}
		}
	
	}).init();
	
}

/*  YOUTUBE API READY
	Can't find a way to customize this callback and keep it in the VMM namespace
	Youtube wants it to be this function. 
================================================== */
function onYouTubePlayerAPIReady() {
	trace("GLOBAL YOUTUBE API CALLED")
	VMM.ExternalAPI.youtube.onAPIReady();
}


/* **********************************************
     Begin VMM.MediaElement.js
********************************************** */

/* MediaElement
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.MediaElement == 'undefined') {
	
	VMM.MediaElement = ({
		
		init: function() {
			return this;
		},
		
		loadingmessage: function(m) {
			return "<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div>" + "<div class='vco-message'><p>" + m + "</p></div></div></div>";
		},
		
		thumbnail: function(data, w, h, uid) {
			var _w		= 16,
				_h		= 24,
				_uid	= "";
				
			if (w != null && w != "") {_w = w};
			if (h != null && h != "") {_h = h};
			if (uid != null && uid != "") {_uid = uid};
			

			if (data.thumbnail != null && data.thumbnail != "") {
					trace("CUSTOM THUMB");
					mediaElem =	"<div class='thumbnail thumb-custom' id='" + uid + "_custom_thumb'><img src='" + data.thumbnail + "'></div>";
					return mediaElem;
			} else if (data.media != null && data.media != "") {
				var _valid		= true,
					mediaElem	= "",
					m			= VMM.MediaType(data.media); //returns an object with .type and .id
					
				// DETERMINE THUMBNAIL OR ICON
				if (m.type == "image") {
					mediaElem		=	"<div class='thumbnail thumb-photo'></div>";
					return mediaElem;
				} else if (m.type	==	"flickr") {
					mediaElem		=	"<div class='thumbnail thumb-photo' id='" + uid + "_thumb'></div>";
					return mediaElem;
				} else if (m.type	==	"instagram") {
					mediaElem		=	"<div class='thumbnail thumb-instagram' id='" + uid + "_thumb'><img src='" + VMM.ExternalAPI.instagram.get(m, true) + "'></div>";
					return mediaElem;
				} else if (m.type	==	"youtube") {
					mediaElem		=	"<div class='thumbnail thumb-youtube' id='" + uid + "_thumb'></div>";
					return mediaElem;
				} else if (m.type	==	"googledoc") {
					mediaElem		=	"<div class='thumbnail thumb-document'></div>";
					return mediaElem;
				} else if (m.type	==	"vimeo") {
					mediaElem		=	"<div class='thumbnail thumb-vimeo' id='" + uid + "_thumb'></div>";
					return mediaElem;
				} else if (m.type  ==  "vine") {
					mediaElem		=  "<div class='thumbnail thumb-vine'></div>";
					return mediaElem;
				} else if (m.type  ==  "dailymotion") {
					mediaElem		=  "<div class='thumbnail thumb-video'></div>";
					return mediaElem;
				} else if (m.type	==	"twitter"){
					mediaElem		=	"<div class='thumbnail thumb-twitter'></div>";
					return mediaElem;
				} else if (m.type	==	"twitter-ready") {
					mediaElem		=	"<div class='thumbnail thumb-twitter'></div>";
					return mediaElem;
				} else if (m.type	==	"soundcloud") {
					mediaElem		=	"<div class='thumbnail thumb-audio'></div>";
					return mediaElem;
				} else if (m.type	==	"google-map") {
					mediaElem		=	"<div class='thumbnail thumb-map'></div>";
					return mediaElem;
				} else if (m.type		==	"googleplus") {
					mediaElem		=	"<div class='thumbnail thumb-googleplus'></div>";
					return mediaElem;
				} else if (m.type	==	"wikipedia") {
					mediaElem		=	"<div class='thumbnail thumb-wikipedia'></div>";
					return mediaElem;
				} else if (m.type	==	"storify") {
					mediaElem		=	"<div class='thumbnail thumb-storify'></div>";
					return mediaElem;
				} else if (m.type	==	"quote") {
					mediaElem		=	"<div class='thumbnail thumb-quote'></div>";
					return mediaElem;
				} else if (m.type	==	"iframe") {
					mediaElem		=	"<div class='thumbnail thumb-video'></div>";
					return mediaElem;
				} else if (m.type	==	"unknown") {
					if (m.id.match("blockquote")) {
						mediaElem	=	"<div class='thumbnail thumb-quote'></div>";
					} else {
						mediaElem	=	"<div class='thumbnail thumb-plaintext'></div>";
					}
					return mediaElem;
				} else if (m.type	==	"website") {
					mediaElem		=	"<div class='thumbnail thumb-website' id='" + uid + "_thumb'></div>";
					return mediaElem;
				} else {
					mediaElem = "<div class='thumbnail thumb-plaintext'></div>";
					return mediaElem;
				}
			} 
		},
		
		create: function(data, uid) {
			var _valid = false,
				//loading_messege			=	"<span class='messege'><p>" + VMM.master_config.language.messages.loading + "</p></span>";
				loading_messege			=	VMM.MediaElement.loadingmessage(VMM.master_config.language.messages.loading + "...");
			
			if (data.media != null && data.media != "") {
				var mediaElem = "", captionElem = "", creditElem = "", _id = "", isTextMedia = false, m;
				
				m = VMM.MediaType(data.media); //returns an object with .type and .id
				m.uid = uid;
				_valid = true;
				
			// CREDIT
				if (data.credit != null && data.credit != "") {
					creditElem			=	"<div class='credit'>" + VMM.Util.linkify_with_twitter(data.credit, "_blank") + "</div>";
				}
			// CAPTION
				if (data.caption != null && data.caption != "") {
					captionElem			=	"<div class='caption'>" + VMM.Util.linkify_with_twitter(data.caption, "_blank") + "</div>";
				}
			// IMAGE
				if (m.type				==	"image") {
					if (m.id.match("https://")) {
						m.id = m.id.replace("https://","http://");
					}
					mediaElem			=	"<div class='media-image media-shadow'><img src='" + m.id + "' class='media-image'></div>";
			// FLICKR
				} else if (m.type		==	"flickr") {
					//mediaElem			=	"<div class='media-image media-shadow' id='" + uid + "'>" + loading_messege + "</div>";
					mediaElem			=	"<div class='media-image media-shadow'><a href='" + m.link + "' target='_blank'><img id='" + uid + "'></a></div>";
					VMM.ExternalAPI.flickr.get(m);
			// INSTAGRAM
				} else if (m.type		==	"instagram") {
					mediaElem			=	"<div class='media-image media-shadow'><a href='" + m.link + "' target='_blank'><img src='" + VMM.ExternalAPI.instagram.get(m) + "'></a></div>";
			// GOOGLE DOCS
				} else if (m.type		==	"googledoc") {
					mediaElem			=	"<div class='media-frame media-shadow doc' id='" + m.uid + "'>" + loading_messege + "</div>";
					VMM.ExternalAPI.googledocs.get(m);
			// YOUTUBE
				} else if (m.type		==	"youtube") {
					mediaElem			=	"<div class='media-shadow'><div class='media-frame video youtube' id='" + m.uid + "'>" + loading_messege + "</div></div>";
					VMM.ExternalAPI.youtube.get(m);
			// VIMEO
				} else if (m.type		==	"vimeo") {
					mediaElem			=	"<div class='media-shadow media-frame video vimeo' id='" + m.uid + "'>" + loading_messege + "</div>";
					VMM.ExternalAPI.vimeo.get(m);
			// DAILYMOTION
				} else if (m.type		==	"dailymotion") {
					mediaElem			=	"<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + m.id + "'></iframe></div>";
			// VINE
				} else if (m.type		==	"vine") {
					mediaElem			=	"<div class='media-shadow media-frame video vine' id='" + m.uid + "'>" + loading_messege + "</div>";
					VMM.ExternalAPI.vine.get(m);
			// TWITTER
				} else if (m.type		==	"twitter"){
					mediaElem			=	"<div class='twitter' id='" + m.uid + "'>" + loading_messege + "</div>";
					isTextMedia			=	true;
					VMM.ExternalAPI.twitter.get(m);
			// TWITTER
				} else if (m.type		==	"twitter-ready") {
					isTextMedia			=	true;
					mediaElem			=	m.id;
			// SOUNDCLOUD
				} else if (m.type		==	"soundcloud") {
					mediaElem			=	"<div class='media-frame media-shadow soundcloud' id='" + m.uid + "'>" + loading_messege + "</div>";
					VMM.ExternalAPI.soundcloud.get(m);
			// GOOGLE MAPS
				} else if (m.type		==	"google-map") {
					mediaElem			=	"<div class='media-frame media-shadow map' id='" + m.uid + "'>" + loading_messege + "</div>";
					VMM.ExternalAPI.googlemaps.get(m);
			// GOOGLE PLUS
				} else if (m.type		==	"googleplus") {
					_id					=	"googleplus_" + m.id;
					mediaElem			=	"<div class='googleplus' id='" + _id + "'>" + loading_messege + "</div>";
					isTextMedia			=	true;
					VMM.ExternalAPI.googleplus.get(m);
			// WIKIPEDIA
				} else if (m.type		==	"wikipedia") {
					mediaElem			=	"<div class='wikipedia' id='" + m.uid + "'>" + loading_messege + "</div>";
					isTextMedia			=	true;
					VMM.ExternalAPI.wikipedia.get(m);
			// STORIFY
				} else if (m.type		==	"storify") { 
					isTextMedia			=	true;
					mediaElem			=	"<div class='plain-text-quote'>" + m.id + "</div>";
			// IFRAME
				} else if (m.type		==	"iframe") { 
					isTextMedia			=	true;
					mediaElem			=	"<div class='media-shadow'><iframe class='media-frame video' autostart='false' frameborder='0' width='100%' height='100%' src='" + m.id + "'></iframe></div>";
			// QUOTE
				} else if (m.type		==	"quote") { 
					isTextMedia			=	true;
					mediaElem			=	"<div class='plain-text-quote'>" + m.id + "</div>";
			// UNKNOWN
				} else if (m.type		==	"unknown") { 
					trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML"); 
					isTextMedia			=	true;
					mediaElem			=	"<div class='plain-text'><div class='container'>" + VMM.Util.properQuotes(m.id) + "</div></div>";
			// WEBSITE
				} else if (m.type		==	"website") { 
					
					mediaElem			=	"<div class='media-shadow website' id='" + m.uid + "'>" + loading_messege + "</div>";
					VMM.ExternalAPI.webthumb.get(m);
					//mediaElem			=	"<div class='media-shadow website'><a href='" + m.id + "' target='_blank'>" + "<img src='http://api1.thumbalizr.com/?url=" + m.id.replace(/[\./]$/g, "") + "&width=300' class='media-image'></a></div>";
					
			// NO MATCH
				} else {
					trace("NO KNOWN MEDIA TYPE FOUND");
					trace(m.type);
				}
				
			// WRAP THE MEDIA ELEMENT
				mediaElem				=	"<div class='media-container' >" + mediaElem + creditElem + captionElem + "</div>";
			// RETURN
				if (isTextMedia) {
					return "<div class='text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
				} else {
					return "<div class='media-wrapper'>" + mediaElem + "</div>";
				}
				
			};
			
		}
		
	}).init();
}

/* **********************************************
     Begin VMM.MediaType.js
********************************************** */

/*	MediaType
	Determines the type of media the url string is.
	returns an object with .type and .id
	the id is a key piece of information needed to make
	the request of the api.
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.MediaType == 'undefined') {
	
	VMM.MediaType = function(_d) {
		var d		= _d.replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
			success	= false,
			media	= {
				type:		"unknown",
				id:			"",
				start:		0,
				hd:			false,
				link:		"",
				lang:		VMM.Language.lang,
				uniqueid:	VMM.Util.unique_ID(6)
			};
		
		if (d.match("div class='twitter'")) {
			media.type = "twitter-ready";
		    media.id = d;
		    success = true;
		} else if (d.match('<blockquote')) {
			media.type = "quote";
			media.id = d;
			success = true;
		} else if (d.match('<iframe')) {
			media.type = "iframe";
			trace("IFRAME")
			regex = /src=['"](\S+?)['"]\s/;
			group = d.match(regex);
			if (group) {
				media.id = group[1];
			}
			trace( "iframe url: " + media.id );
			success = Boolean(media.id);
		} else if (d.match('(www.)?youtube|youtu\.be')) {
			if (d.match('v=')) {
				media.id	= VMM.Util.getUrlVars(d)["v"];
			} else if (d.match('\/embed\/')) {
				media.id	= d.split("embed\/")[1].split(/[?&]/)[0];
			} else if (d.match(/v\/|v=|youtu\.be\//)){
				media.id	= d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
			} else {
				trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
			}
			media.start	= VMM.Util.getUrlVars(d)["t"];
			media.hd	= VMM.Util.getUrlVars(d)["hd"];
		    media.type = "youtube";
		    success = true;
		} else if (d.match('(player.)?vimeo\.com')) {
		    media.type = "vimeo";
		    media.id = d.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];;
		    success = true;
	    } else if (d.match('(www.)?dailymotion\.com')) {
			media.id = d.split(/video\/|\/\/dailymotion\.com\//)[1];
			media.type = "dailymotion";
			success = true;
	    } else if (d.match('(www.)?vine\.co')) {
			trace("VINE");
			//https://vine.co/v/b55LOA1dgJU
			if (d.match("vine.co/v/")) {
				media.id = d.split("vine.co/v/")[1];
				trace(media.id);
			}
			trace(d);
			media.type = "vine";
			success = true;
		} else if (d.match('(player.)?soundcloud\.com')) {
			media.type = "soundcloud";
			media.id = d;
			success = true;
		} else if (d.match('(www.)?twitter\.com') && d.match('status') ) {
			if (d.match("status\/")) {
				media.id = d.split("status\/")[1];
			} else if (d.match("statuses\/")) {
				media.id = d.split("statuses\/")[1];
			} else {
				media.id = "";
			}
			media.type = "twitter";
			success = true;
		} else if (d.match("maps.google") && !d.match("staticmap")) {
			media.type = "google-map";
		    media.id = d.split(/src=['|"][^'|"]*?['|"]/gi);
			success = true;
		} else if (d.match("plus.google")) {
			media.type = "googleplus";
		    media.id = d.split("/posts/")[1];
			//https://plus.google.com/u/0/112374836634096795698/posts/bRJSvCb5mUU
			//https://plus.google.com/107096716333816995401/posts/J5iMpEDHWNL
			if (d.split("/posts/")[0].match("u/0/")) {
				media.user = d.split("u/0/")[1].split("/posts")[0];
			} else {
				media.user = d.split("google.com/")[1].split("/posts/")[0];
			}
			success = true;
		} else if (d.match("flickr.com/photos/")) {
			media.type = "flickr";
			media.id = VMM.ExternalAPI.flickr.getFlickrIdFromUrl(d)
			media.link = d;
			success = Boolean(media.id);
		} else if (VMM.ExternalAPI.instagram.isInstagramUrl(d)) {
			media.type = "instagram";
			media.link = d;
			media.id = VMM.ExternalAPI.instagram.getInstagramIdFromUrl(d)
			success = Boolean(media.id);
		} else if (d.match(/jpg|jpeg|png|gif|svg/i) || d.match("staticmap") || d.match("yfrog.com") || d.match("twitpic.com")) {
			media.type = "image";
			media.id = d;
			success = true;
		} else if (VMM.FileExtention.googleDocType(d)) {
			media.type = "googledoc";
			media.id = d;
			success = true;
		} else if (d.match('(www.)?wikipedia\.org')) {
			media.type = "wikipedia";
			//media.id = d.split("wiki\/")[1];
			var wiki_id = d.split("wiki\/")[1].split("#")[0].replace("_", " ");
			media.id = wiki_id.replace(" ", "%20");
			media.lang = d.split("//")[1].split(".wikipedia")[0];
			success = true;
		} else if (d.indexOf('http://') == 0) {
			media.type = "website";
			media.id = d;
			success = true;
		} else if (d.match('storify')) {
			media.type = "storify";
			media.id = d;
			success = true;
		} else {
			trace("unknown media");  
			media.type = "unknown";
			media.id = d;
			success = true;
		}
		
		if (success) { 
			return media;
		} else {
			trace("No valid media id detected");
			trace(d);
		}
		return false;
	}
}

/* **********************************************
     Begin VMM.TextElement.js
********************************************** */

/* TextElement
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.TextElement == 'undefined') {
	
	VMM.TextElement = ({
		
		init: function() {
			return this;
		},
		
		create: function(data) {
			return data;
		}
		
	}).init();
}

/* **********************************************
     Begin VMM.Media.js
********************************************** */

/* Media
================================================== */

/*	* CodeKit Import
	* http://incident57.com/codekit/
================================================== */
// @codekit-prepend "VMM.ExternalAPI.js";
// @codekit-prepend "VMM.MediaElement.js";
// @codekit-prepend "VMM.MediaType.js";
// @codekit-prepend "VMM.TextElement.js";


/* **********************************************
     Begin VMM.DragSlider.js
********************************************** */

/* DRAG SLIDER
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.DragSlider == 'undefined') {

	VMM.DragSlider = function() {
		var drag = {
			element:		"",
			element_move:	"",
			constraint:		"",
			sliding:		false,
			pagex: {
				start:		0,
				end:		0
			},
			pagey: {
				start:		0,
				end:		0
			},
			left: {
				start:		0,
				end:		0
			},
			time: {
				start:		0,
				end:		0
			},
			touch:			false,
			ease:			"easeOutExpo"
		},
		dragevent = {
			down:		"mousedown",
			up:			"mouseup",
			leave:		"mouseleave",
			move:		"mousemove"
		},
		mousedrag = {
			down:		"mousedown",
			up:			"mouseup",
			leave:		"mouseleave",
			move:		"mousemove"
		},
		touchdrag = {
			down:		"touchstart",
			up:			"touchend",
			leave:		"mouseleave",
			move:		"touchmove"
		},
		dragslider		= this,
		is_sticky		= false;
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.createPanel = function(drag_object, move_object, constraint, touch, sticky) {
			drag.element		= drag_object;
			drag.element_move	= move_object;
			//dragslider			= drag_object;
			if ( sticky != null && sticky != "") {
				is_sticky = sticky;
			}
			if ( constraint != null && constraint != "") {
				drag.constraint = constraint;
			} else {
				drag.constraint = false;
			}
			if ( touch) {
				drag.touch = touch;
			} else {
				drag.touch = false;
			}
			trace("TOUCH" + drag.touch);
			if (drag.touch) {
				dragevent = touchdrag;
			} else {
				dragevent = mousedrag;
			}
			
			makeDraggable(drag.element, drag.element_move);
		}
		
		this.updateConstraint = function(constraint) {
			trace("updateConstraint");
			drag.constraint = constraint;
		}
		
		this.cancelSlide = function(e) {
			VMM.unbindEvent(drag.element, onDragMove, dragevent.move);
			return true;
		}
		
		/* PRIVATE FUNCTIONS
		================================================== */
		function makeDraggable(drag_object, move_object) {
			
			VMM.bindEvent(drag_object, onDragStart, dragevent.down, {element: move_object, delement: drag_object});
			VMM.bindEvent(drag_object, onDragEnd, dragevent.up, {element: move_object, delement: drag_object});
			VMM.bindEvent(drag_object, onDragLeave, dragevent.leave, {element: move_object, delement: drag_object});
			
	    }
		
		function onDragLeave(e) {
			VMM.unbindEvent(e.data.delement, onDragMove, dragevent.move);
			if (!drag.touch) {
				e.preventDefault();
			}
			e.stopPropagation();
			if (drag.sliding) {
				drag.sliding = false;
				dragEnd(e.data.element, e.data.delement, e);
				return false;
			} else {
				return true;
			}
		}
		
		function onDragStart(e) {
			dragStart(e.data.element, e.data.delement, e);
			if (!drag.touch) {
				e.preventDefault();
			}
			//e.stopPropagation();
			return true;
		}
		
		function onDragEnd(e) {
			if (!drag.touch) {
				e.preventDefault();
			}
			//e.stopPropagation();
			if (drag.sliding) {
				drag.sliding = false;
				dragEnd(e.data.element, e.data.delement, e);
				return false;
			} else {
				return true;
			}
		}
		
		function onDragMove(e) {
			dragMove(e.data.element, e);
			
		}
		
		function dragStart(elem, delem, e) {
			if (drag.touch) {
				trace("IS TOUCH")
				VMM.Lib.css(elem, '-webkit-transition-duration', '0');
				drag.pagex.start = e.originalEvent.touches[0].screenX;
				drag.pagey.start = e.originalEvent.touches[0].screenY;
			} else {
				drag.pagex.start = e.pageX;
				drag.pagey.start = e.pageY;
			}
			drag.left.start = getLeft(elem);
			drag.time.start = new Date().getTime();
			
			VMM.Lib.stop(elem);
			VMM.bindEvent(delem, onDragMove, dragevent.move, {element: elem});

	    }
		
		function dragEnd(elem, delem, e) {
			VMM.unbindEvent(delem, onDragMove, dragevent.move);
			dragMomentum(elem, e);
		}
		
		function dragMove(elem, e) {
			var drag_to, drag_to_y;
			drag.sliding = true;
			if (drag.touch) {
				drag.pagex.end = e.originalEvent.touches[0].screenX;
				drag.pagey.end = e.originalEvent.touches[0].screenY;
			} else {
				drag.pagex.end = e.pageX;
				drag.pagey.end = e.pageY;
			}
			
			drag.left.end	= getLeft(elem);
			drag_to			= -(drag.pagex.start - drag.pagex.end - drag.left.start);
			
			
			if (Math.abs(drag.pagey.start) - Math.abs(drag.pagey.end) > 10) {
				trace("SCROLLING Y")
				trace(Math.abs(drag.pagey.start) - Math.abs(drag.pagey.end));
			}
			if (Math.abs(drag_to - drag.left.start) > 10) {
				VMM.Lib.css(elem, 'left', drag_to);
				e.preventDefault();
				e.stopPropagation();
			}
		}
		
		function dragMomentum(elem, e) {
			var drag_info = {
					left:			drag.left.end,
					left_adjust:	0,
					change: {
						x:			0
					},
					time:			(new Date().getTime() - drag.time.start) * 10,
					time_adjust:	(new Date().getTime() - drag.time.start) * 10
				},
				multiplier = 3000;
				
			if (drag.touch) {
				multiplier = 6000;
			}
			
			drag_info.change.x = multiplier * (Math.abs(drag.pagex.end) - Math.abs(drag.pagex.start));
			
			
			drag_info.left_adjust = Math.round(drag_info.change.x / drag_info.time);
			
			drag_info.left = Math.min(drag_info.left + drag_info.left_adjust);
			
			if (drag.constraint) {
				if (drag_info.left > drag.constraint.left) {
					drag_info.left = drag.constraint.left;
					if (drag_info.time > 5000) {
						drag_info.time = 5000;
					}
				} else if (drag_info.left < drag.constraint.right) {
					drag_info.left = drag.constraint.right;
					if (drag_info.time > 5000) {
						drag_info.time = 5000;
					}
				}
			}
			
			VMM.fireEvent(dragslider, "DRAGUPDATE", [drag_info]);
			
			if (!is_sticky) {
				if (drag_info.time > 0) {
					if (drag.touch) {
						VMM.Lib.animate(elem, drag_info.time, "easeOutCirc", {"left": drag_info.left});
					} else {
						VMM.Lib.animate(elem, drag_info.time, drag.ease, {"left": drag_info.left});
					}
				}
			}
		}
		
		function getLeft(elem) {
			return parseInt(VMM.Lib.css(elem, 'left').substring(0, VMM.Lib.css(elem, 'left').length - 2), 10);
		}
		
	}
}

/* **********************************************
     Begin VMM.Slider.js
********************************************** */

/* Slider
================================================== */
/*	* CodeKit Import
	* http://incident57.com/codekit/
================================================== */
// @codekit-append "VMM.Slider.Slide.js";

if(typeof VMM != 'undefined' && typeof VMM.Slider == 'undefined') {
	
	VMM.Slider = function(parent, parent_config) {
		
		var config,
			timer,
			$slider,
			$slider_mask,
			$slider_container,
			$slides_items,
			$dragslide,
			$explainer,
			events				= {},
			data				= [],
			slides				= [],
			slide_positions		= [],
			slides_content		= "",
			current_slide		= 0,
			current_width		= 960,
			touch = {
				move:			false,
				x:				10,
				y:				0,
				off:			0,
				dampen:			48
			},
			content				= "",
			_active				= false,
			layout				= parent,
			navigation = {
				nextBtn:		"",
				prevBtn:		"",
				nextDate:		"",
				prevDate:		"",
				nextTitle:		"",
				prevTitle:		""
			};
		
		// CONFIG
		if(typeof parent_config != 'undefined') {
			config	= parent_config;
		} else {
			config	= {
				preload:			4,
				current_slide:		0,
				interval:			10, 
				something:			0, 
				width:				720, 
				height:				400, 
				ease:				"easeInOutExpo", 
				duration:			1000, 
				timeline:			false, 
				spacing:			15,
				slider: {
					width:			720, 
					height:			400, 
					content: {
						width:		720, 
						height:		400, 
						padding:	120,
						padding_default: 120
					}, 
					nav: {
						width:		100, 
						height:		200
					} 
				} 
			};
		}
		
		/* PUBLIC VARS
		================================================== */
		this.ver = "0.6";
		
		config.slider.width		= config.width;
		config.slider.height	= config.height;
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(d) {
			slides			= [];
			slide_positions	= [];
			
			if(typeof d != 'undefined') {
				this.setData(d);
			} else {
				trace("WAITING ON DATA");
			}
		};
		
		this.width = function(w) {
			if (w != null && w != "") {
				config.slider.width = w;
				reSize();
			} else {
				return config.slider.width;
			}
		}
		
		this.height = function(h) {
			if (h != null && h != "") {
				config.slider.height = h;
				reSize();
			} else {
				return config.slider.height;
			}
		}
		
		/* GETTERS AND SETTERS
		================================================== */
		this.setData = function(d) {
			if(typeof d != 'undefined') {
				data = d;
				build();
			} else{
				trace("NO DATA");
			}
		};
		
		this.getData = function() {
			return data;
		};
		
		this.setConfig = function(d) {
			if(typeof d != 'undefined') {
				config = d;
			} else{
				trace("NO CONFIG DATA");
			}
		}
		
		this.getConfig = function() {
			return config;
		};
		
		this.setSize = function(w, h) {
			if (w != null) {config.slider.width = w};
			if (h != null) {config.slider.height = h};
			if (_active) {
				reSize();
			}
			
		}
		
		this.active = function() {
			return _active;
		};
		
		this.getCurrentNumber = function() {
			return current_slide;
		};
		
		this.setSlide = function(n) {
			goToSlide(n);
		};
		
		/* ON EVENT
		================================================== */
		function onConfigSet() {
			trace("onConfigSet");
		};
		
		function reSize(go_to_slide, from_start) {
			var _go_to_slide	= true,
				_from_start		= false;
			
			if (go_to_slide != null) {_go_to_slide = go_to_slide};
			if (from_start != null) {_from_start = from_start};
			
			current_width = config.slider.width;
			
			config.slider.nav.height = VMM.Lib.height(navigation.prevBtnContainer);
			
			// Handle smaller sizes
			if (VMM.Browser.device == "mobile" || current_width <= 640) {
				config.slider.content.padding	= 10;
			} else {
				config.slider.content.padding	= config.slider.content.padding_default;
			}
			
			config.slider.content.width = current_width - (config.slider.content.padding *2);
			
			VMM.Lib.width($slides_items, (slides.length * config.slider.content.width));
			
			if (_from_start) {
				VMM.Lib.css($slider_container, "left", slides[current_slide].leftpos());
			}
			
			// RESIZE SLIDES
			sizeSlides();
			
			// POSITION SLIDES
			positionSlides();
			
			// POSITION NAV
			VMM.Lib.css(navigation.nextBtn, "left", (current_width - config.slider.nav.width));
			VMM.Lib.height(navigation.prevBtn, config.slider.height);
			VMM.Lib.height(navigation.nextBtn, config.slider.height);
			VMM.Lib.css(navigation.nextBtnContainer, "top", ( (config.slider.height/2) - (config.slider.nav.height/2) ) + 10 );
			VMM.Lib.css(navigation.prevBtnContainer, "top", ( (config.slider.height/2) - (config.slider.nav.height/2) ) + 10 );
			
			// Animate Changes
			VMM.Lib.height($slider_mask, config.slider.height);
			VMM.Lib.width($slider_mask, current_width);
			
			if (_go_to_slide) {
				goToSlide(current_slide, "linear", 1);
			};
			
			if (current_slide == 0) {
				VMM.Lib.visible(navigation.prevBtn, false);
			}
			
		}
		
		function onDragFinish(e, d) {
			trace("DRAG FINISH");
			trace(d.left_adjust);
			trace((config.slider.width / 2));
			
			if (d.left_adjust < 0 ) {
				if (Math.abs(d.left_adjust) > (config.slider.width / 2) ) {
					//onNextClick(e);
					if (current_slide == slides.length - 1) {
						backToCurrentSlide();
					} else {
						goToSlide(current_slide+1, "easeOutExpo");
						upDate();
					}
				} else {
					backToCurrentSlide();
					
				}
			} else if (Math.abs(d.left_adjust) > (config.slider.width / 2) ) {
				if (current_slide == 0) {
					backToCurrentSlide();
				} else {
					goToSlide(current_slide-1, "easeOutExpo");
					upDate();
				}
			} else {
				backToCurrentSlide();
			}
				
			
			
		}
		/* NAVIGATION
		================================================== */
		function onNextClick(e) {
			if (current_slide == slides.length - 1) {
				backToCurrentSlide();
			} else {
				goToSlide(current_slide+1);
				upDate();
			}
		}
		
		function onPrevClick(e) {
			if (current_slide == 0) {
				backToCurrentSlide();
			} else {
				goToSlide(current_slide-1);
				upDate();
			}
		}

		function onKeypressNav(e) {
			switch(e.keyCode) {
				case 39:
					// RIGHT ARROW
					onNextClick(e);
					break;
				case 37:
					// LEFT ARROW
					onPrevClick(e);
					break;
			}
		}
		
		function onTouchUpdate(e, b) {
			if (slide_positions.length == 0) {
				for(var i = 0; i < slides.length; i++) {
					slide_positions.push( slides[i].leftpos() );
				}
			}
			if (typeof b.left == "number") {
				var _pos = b.left;
				var _slide_pos = -(slides[current_slide].leftpos());
				if (_pos < _slide_pos - (config.slider_width/3)) {
					onNextClick();
				} else if (_pos > _slide_pos + (config.slider_width/3)) {
					onPrevClick();
				} else {
					VMM.Lib.animate($slider_container, config.duration, config.ease, {"left": _slide_pos });
				}
			} else {
				VMM.Lib.animate($slider_container, config.duration, config.ease, {"left": _slide_pos });
			}
			
			if (typeof b.top == "number") {
				VMM.Lib.animate($slider_container, config.duration, config.ease, {"top": -b.top});
			} else {
				
			}
		};
		
		function onExplainerClick(e) {
			detachMessege();
		}
		
		/* UPDATE
		================================================== */
		function upDate() {
			config.current_slide = current_slide;
			VMM.fireEvent(layout, "UPDATE");
		};
		
		/* GET DATA
		================================================== */
		function getData(d) {
			data = d;
		};
		
		/* BUILD SLIDES
		================================================== */
		function buildSlides(d) {
			var i	= 0;
			
			VMM.attachElement($slides_items, "");
			slides = [];
			
			for(i = 0; i < d.length; i++) {
				var _slide = new VMM.Slider.Slide(d[i], $slides_items);
				//_slide.show();
				slides.push(_slide);
			}
		}
		
		function preloadSlides(skip) {
			var i	= 0;
			
			if (skip) {
				preloadTimeOutSlides();
			} else {
				for(i = 0; i < slides.length; i++) {
					slides[i].clearTimers();
				}
				timer = setTimeout(preloadTimeOutSlides, config.duration);
				
			}
		}
		
		function preloadTimeOutSlides() {
			var i = 0;
			
			for(i = 0; i < slides.length; i++) {
				slides[i].enqueue = true;
			}
			
			for(i = 0; i < config.preload; i++) {
				if ( !((current_slide + i) > slides.length - 1)) {
					slides[current_slide + i].show();
					slides[current_slide + i].enqueue = false;
				}
				if ( !( (current_slide - i) < 0 ) ) {
					slides[current_slide - i].show();
					slides[current_slide - i].enqueue = false;
				}
			}
			
			if (slides.length > 50) {
				for(i = 0; i < slides.length; i++) {
					if (slides[i].enqueue) {
						slides[i].hide();
					}
				}
			}
			
			sizeSlides();
		}
		
		function sizeSlide(slide_id) {
			
		}
		
		/* SIZE SLIDES
		================================================== */
		function sizeSlides() {
			var i						= 0,
				layout_text_media		= ".slider-item .layout-text-media .media .media-container ",
				layout_media			= ".slider-item .layout-media .media .media-container ",
				layout_both				= ".slider-item .media .media-container",
				layout_caption			= ".slider-item .media .media-container .media-shadow .caption",
				is_skinny				= false,
				mediasize = {
					text_media: {
						width: 			(config.slider.content.width/100) * 60,
						height: 		config.slider.height - 60,
						video: {
							width:		0,
							height:		0
						},
						text: {
							width:		((config.slider.content.width/100) * 40) - 30,
							height:		config.slider.height
						}
					},
					media: {
						width: 			config.slider.content.width,
						height: 		config.slider.height - 110,
						video: {
							width: 		0,
							height: 	0
						}
					}
				};
				
			// Handle smaller sizes
			if (VMM.Browser.device == "mobile" || current_width < 641) {
				is_skinny = true;

			} 
			
			VMM.master_config.sizes.api.width	= mediasize.media.width;
			VMM.master_config.sizes.api.height	= mediasize.media.height;
			
			mediasize.text_media.video			= VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
			mediasize.media.video				= VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
			
			VMM.Lib.css(".slider-item", "width", config.slider.content.width );
			VMM.Lib.height(".slider-item", config.slider.height);
			
			
			
			if (is_skinny) {
				
				mediasize.text_media.width = 	config.slider.content.width - (config.slider.content.padding*2);
				mediasize.media.width = 		config.slider.content.width - (config.slider.content.padding*2);
				mediasize.text_media.height = 	((config.slider.height/100) * 50 ) - 50;
				mediasize.media.height = 		((config.slider.height/100) * 70 ) - 40;
				
				mediasize.text_media.video = 	VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
				mediasize.media.video = 		VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
				
				VMM.Lib.css(".slider-item .layout-text-media .text", "width", "100%" );
				VMM.Lib.css(".slider-item .layout-text-media .text", "display", "block" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "display", "block" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "width", mediasize.media.width );
				VMM.Lib.css(".slider-item .layout-text-media .text .container .start", "width", "auto" );
				
				VMM.Lib.css(".slider-item .layout-text-media .media", "float", "none" );
				VMM.Lib.addClass(".slider-item .content-container", "pad-top");
				
				VMM.Lib.css(".slider-item .media blockquote p", "line-height", "18px" );
				VMM.Lib.css(".slider-item .media blockquote p", "font-size", "16px" );
				
				VMM.Lib.css(".slider-item", "overflow-y", "auto" );
				
				
			} else {
				
				VMM.Lib.css(".slider-item .layout-text-media .text", "width", "40%" );
				VMM.Lib.css(".slider-item .layout-text-media .text", "display", "table-cell" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "display", "table-cell" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container", "width", "auto" );
				VMM.Lib.css(".slider-item .layout-text-media .text .container .start", "width", mediasize.text_media.text.width );
				//VMM.Lib.addClass(".slider-item .content-container", "pad-left");
				VMM.Lib.removeClass(".slider-item .content-container", "pad-top");
				
				VMM.Lib.css(".slider-item .layout-text-media .media", "float", "left" );
				VMM.Lib.css(".slider-item .layout-text-media", "display", "table" );
				
				VMM.Lib.css(".slider-item .media blockquote p", "line-height", "36px" );
				VMM.Lib.css(".slider-item .media blockquote p", "font-size", "28px" );
				
				VMM.Lib.css(".slider-item", "display", "table" );
				VMM.Lib.css(".slider-item", "overflow-y", "auto" );
			}
			
			// MEDIA FRAME
			VMM.Lib.css(	layout_text_media + ".media-frame", 		"max-width", 	mediasize.text_media.width);
			VMM.Lib.height(	layout_text_media + ".media-frame", 						mediasize.text_media.height);
			VMM.Lib.width(	layout_text_media + ".media-frame", 						mediasize.text_media.width);
			
			// WEBSITES
			//VMM.Lib.css(	layout_both + 		".website", 			"max-width", 	300 );
			
			// IMAGES
			VMM.Lib.css(	layout_text_media + "img", 					"max-height", 	mediasize.text_media.height );
			VMM.Lib.css(	layout_media + 		"img", 					"max-height", 	mediasize.media.height );
			
			// FIX FOR NON-WEBKIT BROWSERS
			VMM.Lib.css(	layout_text_media + "img", 					"max-width", 	mediasize.text_media.width );
			VMM.Lib.css(	layout_text_media + ".avatar img", "max-width", 			32 );
			VMM.Lib.css(	layout_text_media + ".avatar img", "max-height", 			32 );
			VMM.Lib.css(	layout_media + 		".avatar img", "max-width", 			32 );
			VMM.Lib.css(	layout_media + 		".avatar img", "max-height", 			32 );
			
			VMM.Lib.css(	layout_text_media + ".article-thumb", "max-width", 			"50%" );
			//VMM.Lib.css(	layout_text_media + ".article-thumb", "max-height", 		100 );
			VMM.Lib.css(	layout_media + 		".article-thumb", "max-width", 			200 );
			//VMM.Lib.css(	layout_media + 		".article-thumb", "max-height", 		100 );
			
			
			// IFRAME FULL SIZE VIDEO
			VMM.Lib.width(	layout_text_media + ".media-frame", 						mediasize.text_media.video.width);
			VMM.Lib.height(	layout_text_media + ".media-frame", 						mediasize.text_media.video.height);
			VMM.Lib.width(	layout_media + 		".media-frame", 						mediasize.media.video.width);
			VMM.Lib.height(	layout_media + 		".media-frame", 						mediasize.media.video.height);
			VMM.Lib.css(	layout_media + 		".media-frame", 		"max-height", 	mediasize.media.video.height);
			VMM.Lib.css(	layout_media + 		".media-frame", 		"max-width", 	mediasize.media.video.width);
			
			// SOUNDCLOUD
			VMM.Lib.height(	layout_media + 		".soundcloud", 							168);
			VMM.Lib.height(	layout_text_media + ".soundcloud", 							168);
			VMM.Lib.width(	layout_media + 		".soundcloud", 							mediasize.media.width);
			VMM.Lib.width(	layout_text_media + ".soundcloud", 							mediasize.text_media.width);
			VMM.Lib.css(	layout_both + 		".soundcloud", 			"max-height", 	168 );
			
			// MAPS
			VMM.Lib.height(	layout_text_media	+ ".map", 								mediasize.text_media.height);
			VMM.Lib.width(	layout_text_media	+ ".map", 								mediasize.text_media.width);
			VMM.Lib.css(	layout_media		+ ".map", 				"max-height", 	mediasize.media.height);
			VMM.Lib.width(	layout_media		+ ".map", 								mediasize.media.width);
			
			
			// DOCS
			VMM.Lib.height(	layout_text_media + ".doc", 								mediasize.text_media.height);
			VMM.Lib.width(	layout_text_media	+ ".doc", 								mediasize.text_media.width);
			VMM.Lib.height(	layout_media + 		".doc", 								mediasize.media.height);
			VMM.Lib.width(	layout_media		+ ".doc", 								mediasize.media.width);
			
			// IE8 NEEDS THIS
			VMM.Lib.width(	layout_media + 		".wikipedia", 							mediasize.media.width);
			VMM.Lib.width(	layout_media + 		".twitter", 							mediasize.media.width);
			VMM.Lib.width(	layout_media + 		".plain-text-quote", 					mediasize.media.width);
			VMM.Lib.width(	layout_media + 		".plain-text", 							mediasize.media.width);
			
			VMM.Lib.css(	layout_both, 		"max-width", 							mediasize.media.width);
			
			
			// CAPTION WIDTH
			VMM.Lib.css( layout_text_media + 	".caption",	"max-width",	mediasize.text_media.video.width);
			VMM.Lib.css( layout_media + 		".caption",	"max-width",	mediasize.media.video.width);
			//VMM.Lib.css( layout_text_media + 	".caption",	"max-width",	mediasize.text_media.width);
			//VMM.Lib.css( layout_media + 		".caption",	"max-width",	mediasize.media.width);
			
			// MAINTAINS VERTICAL CENTER IF IT CAN
			for(i = 0; i < slides.length; i++) {
				
				slides[i].layout(is_skinny);
				
				if (slides[i].content_height() > config.slider.height + 20) {
					slides[i].css("display", "block");
				} else {
					slides[i].css("display", "table");
				}
			}
			
		}
		
		/* POSITION SLIDES
		================================================== */
		function positionSlides() {
			var pos = 0,
				i	= 0;
				
			for(i = 0; i < slides.length; i++) {
				pos = i * (config.slider.width+config.spacing);
				slides[i].leftpos(pos);
			}
		}
		
		/* OPACITY SLIDES
		================================================== */
		function opacitySlides(n) {
			var _ease	= "linear",
				i		= 0;
				
			for(i = 0; i < slides.length; i++) {
				if (i == current_slide) {
					slides[i].animate(config.duration, _ease, {"opacity": 1});
				} else if (i == current_slide - 1 || i == current_slide + 1) {
					slides[i].animate(config.duration, _ease, {"opacity": 0.1});
				} else {
					slides[i].opacity(n);
				}
			}
		}
		
		/* GO TO SLIDE
			goToSlide(n, ease, duration);
		================================================== */
		function goToSlide(n, ease, duration, fast, firstrun) {
			var _ease		= config.ease,
				_duration	= config.duration,
				is_last		= false,
				is_first	= false,
				_title		= "",
				_pos;
			
			/* STOP ANY VIDEO PLAYERS ACTIVE
			================================================== */
			VMM.ExternalAPI.youtube.stopPlayers();
			
			// Set current slide
			current_slide	= n;
			_pos			= slides[current_slide].leftpos();
			
			
			if (current_slide == 0) {is_first = true};
			if (current_slide +1 >= slides.length) {is_last = true};
			if (ease != null && ease != "") {_ease = ease};
			if (duration != null && duration != "") {_duration = duration};
			
			/*	NAVIGATION
				set proper nav titles and dates etc.
			================================================== */
			// Handle smaller sizes
			if (VMM.Browser.device == "mobile") {
			//if (VMM.Browser.device == "mobile" || current_width <= 640) {
				VMM.Lib.visible(navigation.prevBtn, false);
				VMM.Lib.visible(navigation.nextBtn, false);
			} else {
				if (is_first) {
					VMM.Lib.visible(navigation.prevBtn, false);
				} else {
					VMM.Lib.visible(navigation.prevBtn, true);
					_title = VMM.Util.unlinkify(data[current_slide - 1].title)
					if (config.type == "timeline") {
						if(typeof data[current_slide - 1].date === "undefined") {
							VMM.attachElement(navigation.prevDate, _title);
							VMM.attachElement(navigation.prevTitle, "");
						} else {
							VMM.attachElement(navigation.prevDate, VMM.Date.prettyDate(data[current_slide - 1].startdate, false, data[current_slide - 1].precisiondate));
							VMM.attachElement(navigation.prevTitle, _title);
						}
					} else {
						VMM.attachElement(navigation.prevTitle, _title);
					}
				
				}
				if (is_last) {
					VMM.Lib.visible(navigation.nextBtn, false);
				} else {
					VMM.Lib.visible(navigation.nextBtn, true);
					_title = VMM.Util.unlinkify(data[current_slide + 1].title);
					if (config.type == "timeline") {
						if(typeof data[current_slide + 1].date === "undefined") {
							VMM.attachElement(navigation.nextDate, _title);
							VMM.attachElement(navigation.nextTitle, "");
						} else {
							VMM.attachElement(navigation.nextDate, VMM.Date.prettyDate(data[current_slide + 1].startdate, false, data[current_slide + 1].precisiondate) );
							VMM.attachElement(navigation.nextTitle, _title);
						}
					} else {
						VMM.attachElement(navigation.nextTitle,  _title);
					}
				
				}
			}
			
			
			/* ANIMATE SLIDE
			================================================== */
			if (fast) {
				VMM.Lib.css($slider_container, "left", -(_pos - config.slider.content.padding));	
			} else{
				VMM.Lib.stop($slider_container);
				VMM.Lib.animate($slider_container, _duration, _ease, {"left": -(_pos - config.slider.content.padding)});
			}
			
			if (firstrun) {
				VMM.fireEvent(layout, "LOADED");
			}
			
			/* SET Vertical Scoll
			================================================== */
			if (slides[current_slide].height() > config.slider_height) {
				VMM.Lib.css(".slider", "overflow-y", "scroll" );
			} else {
				VMM.Lib.css(layout, "overflow-y", "hidden" );
				var scroll_height = 0;
				try {
					scroll_height = VMM.Lib.prop(layout, "scrollHeight");
					VMM.Lib.animate(layout, _duration, _ease, {scrollTop: scroll_height - VMM.Lib.height(layout) });
				}
				catch(err) {
					scroll_height = VMM.Lib.height(layout);
				}
			}
			
			preloadSlides();
			VMM.fireEvent($slider, "MESSAGE", "TEST");
		}

		function backToCurrentSlide() {
			VMM.Lib.stop($slider_container);
			VMM.Lib.animate($slider_container, config.duration, "easeOutExpo", {"left": -(slides[current_slide].leftpos()) +  config.slider.content.padding} );
		}
		
		/* MESSEGES 
		================================================== */
		function showMessege(e, msg, other) {
			trace("showMessege " + msg);
			//VMM.attachElement($timeline, $feedback);
			VMM.attachElement($explainer, "<div class='vco-explainer'><div class='vco-explainer-container'><div class='vco-bezel'><div class='vco-gesture-icon'></div>" + "<div class='vco-message'><p>" + msg + "</p></div></div></div></div>");
		};
		
		function hideMessege() {
			VMM.Lib.animate($explainer, config.duration, config.ease, {"opacity": 0}, detachMessege);
		};
		
		function detachMessege() {
			VMM.Lib.detach($explainer);
		}
		
		/* BUILD NAVIGATION
		================================================== */
		function buildNavigation() {
			
			var temp_icon = "<div class='icon'>&nbsp;</div>";
			
			navigation.nextBtn = VMM.appendAndGetElement($slider, "<div>", "nav-next");
			navigation.prevBtn = VMM.appendAndGetElement($slider, "<div>", "nav-previous");
			navigation.nextBtnContainer = VMM.appendAndGetElement(navigation.nextBtn, "<div>", "nav-container", temp_icon);
			navigation.prevBtnContainer = VMM.appendAndGetElement(navigation.prevBtn, "<div>", "nav-container", temp_icon);
			if (config.type == "timeline") {
				navigation.nextDate = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "date", "");
				navigation.prevDate = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "date", "");
			}
			navigation.nextTitle = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "title", "");
			navigation.prevTitle = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "title", "");
			
			VMM.bindEvent(".nav-next", onNextClick);
			VMM.bindEvent(".nav-previous", onPrevClick);
			VMM.bindEvent(window, onKeypressNav, 'keydown');
			
		}
		
		/* BUILD
		================================================== */
		function build() {
			var __duration = 3000;
			// Clear out existing content
			VMM.attachElement(layout, "");
			
			// Get DOM Objects to local objects
			$slider				= VMM.getElement(layout);
			$slider_mask		= VMM.appendAndGetElement($slider, "<div>", "slider-container-mask");
			$slider_container	= VMM.appendAndGetElement($slider_mask, "<div>", "slider-container");
			$slides_items		= VMM.appendAndGetElement($slider_container, "<div>", "slider-item-container");
			
			
			// BUILD NAVIGATION
			buildNavigation();

			// ATTACH SLIDES
			buildSlides(data);
			
			/* MAKE SLIDER DRAGGABLE/TOUCHABLE
			================================================== */
			
			if (VMM.Browser.device == "tablet" || VMM.Browser.device == "mobile") {
				// Different Animation duration for touch
				config.duration = 500;
				__duration = 1000;
				
				// Make touchable
				$dragslide = new VMM.DragSlider();
				$dragslide.createPanel($slider, $slider_container, "", config.touch, true);
				VMM.bindEvent($dragslide, onDragFinish, 'DRAGUPDATE');
				
				// EXPLAINER
				$explainer = VMM.appendAndGetElement($slider_mask, "<div>", "vco-feedback", "");
				showMessege(null, "Swipe to Navigate");
				VMM.Lib.height($explainer, config.slider.height);
				VMM.bindEvent($explainer, onExplainerClick);
				VMM.bindEvent($explainer, onExplainerClick, 'touchend');
			}
			
			reSize(false, true);
			
			
			VMM.Lib.visible(navigation.prevBtn, false);
			goToSlide(config.current_slide, "easeOutExpo", __duration, true, true);
			
			_active = true;
		};
		
	};
	
}






/* **********************************************
     Begin VMM.Slider.Slide.js
********************************************** */

/* Slider Slide 
================================================== */

if (typeof VMM.Slider != 'undefined') {
	VMM.Slider.Slide = function(d, _parent) {
		
		var $media, $text, $slide, $wrap, element, c,
			data		= d,
			slide		= {},
			element		= "",
			media		= "",
			loaded		= false,
			preloaded	= false,
			is_skinny	= false,
			_enqueue	= true,
			_removeque	= false,
			_id			= "slide_",
			_class		= 0,
			timer		= {pushque:"", render:"", relayout:"", remove:"", skinny:false},
			times		= {pushque:500, render:100, relayout:100, remove:30000};
		
		_id				= _id + data.uniqueid;
		this.enqueue	= _enqueue;
		this.id			= _id;
		
		
		element		=	VMM.appendAndGetElement(_parent, "<div>", "slider-item");
		
		if (typeof data.classname != 'undefined') {
			trace("HAS CLASSNAME");
			VMM.Lib.addClass(element, data.classname);
		} else {
			trace("NO CLASSNAME");
			trace(data);
		}
		
		c = {slide:"", text: "", media: "", media_element: "", layout: "content-container layout", has: { headline: false, text: false, media: false }};
		
		/* PUBLIC
		================================================== */
		this.show = function(skinny) {
			_enqueue = false;
			timer.skinny = skinny;
			_removeque = false;
			clearTimeout(timer.remove);
			
			if (!loaded) {
				if (preloaded) {
					clearTimeout(timer.relayout);
					timer.relayout = setTimeout(reloadLayout, times.relayout);
				} else {
					render(skinny);
				}
			}
		};
		
		this.hide = function() {
			if (loaded && !_removeque) {
				_removeque = true;
				clearTimeout(timer.remove);
				timer.remove = setTimeout(removeSlide, times.remove);
			}
		};
		
		this.clearTimers = function() {
			//clearTimeout(timer.remove);
			clearTimeout(timer.relayout);
			clearTimeout(timer.pushque);
			clearTimeout(timer.render);
		};
		
		this.layout = function(skinny) {
			if (loaded && preloaded) {
				reLayout(skinny);
			}
		};
		
		this.elem = function() {	
			return element;
		};
		
		this.position = function() {
			return VMM.Lib.position(element);
		};
		
		this.leftpos = function(p) {
			if(typeof p != 'undefined') {
				VMM.Lib.css(element, "left", p);
			} else {
				return VMM.Lib.position(element).left
			}
		};
		
		this.animate = function(d, e, p) {
			VMM.Lib.animate(element, d, e, p);
		};
		
		this.css = function(p, v) {
			VMM.Lib.css(element, p, v );
		}
		
		this.opacity = function(p) {
			VMM.Lib.css(element, "opacity", p);	
		}
		
		this.width = function() {
			return VMM.Lib.width(element);
		};
		
		this.height = function() {
			return VMM.Lib.height(element);
		};
		
		this.content_height = function () {
			var ch = VMM.Lib.find( element, ".content")[0];
			
			if (ch != 'undefined' && ch != null) {
				return VMM.Lib.height(ch);
			} else {
				return 0;
			}
		}
		
		/* PRIVATE
		================================================== */
		var render = function(skinny) {
			trace("RENDER " + _id);
			
			loaded = true;
			preloaded = true;
			timer.skinny = skinny;
			
			buildSlide();
			
			clearTimeout(timer.pushque);
			clearTimeout(timer.render);
			timer.pushque = setTimeout(VMM.ExternalAPI.pushQues, times.pushque);
			
		};
		
		var removeSlide = function() {
			//VMM.attachElement(element, "");
			trace("REMOVE SLIDE TIMER FINISHED");
			loaded = false;
			VMM.Lib.detach($text);
			VMM.Lib.detach($media);
			
		};
		
		var reloadLayout = function() {
			loaded = true;
			reLayout(timer.skinny, true);
		};
		
		var reLayout = function(skinny, reload) {
			if (c.has.text)	{
				if (skinny) {
					if (!is_skinny || reload) {
						VMM.Lib.removeClass($slide, "pad-left");
						VMM.Lib.detach($text);
						VMM.Lib.detach($media);
						VMM.Lib.append($slide, $text);
						VMM.Lib.append($slide, $media);
						is_skinny = true;
					} 
				} else {
					if (is_skinny || reload) {
						VMM.Lib.addClass($slide, "pad-left");
						VMM.Lib.detach($text);
						VMM.Lib.detach($media);
						VMM.Lib.append($slide, $media);
						VMM.Lib.append($slide, $text);
						is_skinny = false;
						
					} 
				}
			} else if (reload) {
				if (c.has.headline) {
					VMM.Lib.detach($text);
					VMM.Lib.append($slide, $text);
				}
				VMM.Lib.detach($media);
				VMM.Lib.append($slide, $media);
			}
		}
		
		var buildSlide = function() {
			trace("BUILDSLIDE");
			$wrap	= VMM.appendAndGetElement(element, "<div>", "content");
			$slide	= VMM.appendAndGetElement($wrap, "<div>");
			
			/* DATE
			================================================== */
			if (data.startdate != null && data.startdate != "") {
				if (type.of(data.startdate) == "date") {
					if (data.type != "start") {
						var st	= VMM.Date.prettyDate(data.startdate, false, data.precisiondate);
						var en	= VMM.Date.prettyDate(data.enddate, false, data.precisiondate);
						var tag	= "";
						/* TAG / CATEGORY
						================================================== */
						if (data.tag != null && data.tag != "") {
							tag		= VMM.createElement("span", data.tag, "slide-tag");
						}
						
						if (st != en) {
							c.text += VMM.createElement("h2", st + " &mdash; " + en + tag, "date");
						} else {
							c.text += VMM.createElement("h2", st + tag, "date");
						}
					}
				}
			}
			
			/* HEADLINE
			================================================== */
			if (data.headline != null && data.headline != "") {
				c.has.headline	=	true;
				if (data.type == "start") {
					c.text		+=	VMM.createElement("h2", VMM.Util.linkify_with_twitter(data.headline, "_blank"), "start");
				} else { 
					c.text		+=	VMM.createElement("h3", VMM.Util.linkify_with_twitter(data.headline, "_blank"));
				}
			}
			
			/* TEXT
			================================================== */
			if (data.text != null && data.text != "") {
				c.has.text		=  true;
				c.text			+= VMM.createElement("p", VMM.Util.linkify_with_twitter(data.text, "_blank"));
			}
			
			if (c.has.text || c.has.headline) {
				c.text		= VMM.createElement("div", c.text, "container");
				//$text		=	VMM.appendAndGetElement($slide, "<div>", "text", c.text);
				
				$text		= VMM.appendAndGetElement($slide, "<div>", "text", VMM.TextElement.create(c.text));
				
			}
			
			/* SLUG
			================================================== */
			if (data.needs_slug) {
				
			}
			
			/* MEDIA
			================================================== */
			if (data.asset != null && data.asset != "") {
				if (data.asset.media != null && data.asset.media != "") {
					c.has.media	= true;
					$media		= VMM.appendAndGetElement($slide, "<div>", "media", VMM.MediaElement.create(data.asset, data.uniqueid));
				}
			}
			
			/* COMBINE
			================================================== */
			if (c.has.text)	{ c.layout		+=	"-text"		};
			if (c.has.media){ c.layout		+=	"-media"	};

			if (c.has.text)	{
				if (timer.skinny) {
					VMM.Lib.addClass($slide, c.layout);
					is_skinny = true;
				} else {
					VMM.Lib.addClass($slide, c.layout);
					VMM.Lib.addClass($slide, "pad-left");
					VMM.Lib.detach($text);
					VMM.Lib.append($slide, $text);
				}
				
			} else {
				VMM.Lib.addClass($slide, c.layout);
			}
			
			
		};
		
	}
	
};


/* **********************************************
     Begin AES.js
********************************************** */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript (c) Chris Veness 2005-2011                                   */
/*   - see http://csrc.nist.gov/publications/PubsFIPS.html#197                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Aes = {};  // Aes namespace

/**
 * AES Cipher function: encrypt 'input' state with Rijndael algorithm
 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
 *
 * @param {Number[]} input 16-byte (128-bit) input state array
 * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
 * @returns {Number[]}     Encrypted output state array
 */
Aes.cipher = function(input, w) {    // main Cipher function [§5.1]
  var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

  var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
  for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

  state = Aes.addRoundKey(state, w, 0, Nb);

  for (var round=1; round<Nr; round++) {
    state = Aes.subBytes(state, Nb);
    state = Aes.shiftRows(state, Nb);
    state = Aes.mixColumns(state, Nb);
    state = Aes.addRoundKey(state, w, round, Nb);
  }

  state = Aes.subBytes(state, Nb);
  state = Aes.shiftRows(state, Nb);
  state = Aes.addRoundKey(state, w, Nr, Nb);

  var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
  for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
  return output;
}

/**
 * Perform Key Expansion to generate a Key Schedule
 *
 * @param {Number[]} key Key as 16/24/32-byte array
 * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
 */
Aes.keyExpansion = function(key) {  // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
  var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nk = key.length/4  // key length (in words): 4/6/8 for 128/192/256-bit keys
  var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

  var w = new Array(Nb*(Nr+1));
  var temp = new Array(4);

  for (var i=0; i<Nk; i++) {
    var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
    w[i] = r;
  }

  for (var i=Nk; i<(Nb*(Nr+1)); i++) {
    w[i] = new Array(4);
    for (var t=0; t<4; t++) temp[t] = w[i-1][t];
    if (i % Nk == 0) {
      temp = Aes.subWord(Aes.rotWord(temp));
      for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
    } else if (Nk > 6 && i%Nk == 4) {
      temp = Aes.subWord(temp);
    }
    for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
  }

  return w;
}

/*
 * ---- remaining routines are private, not called externally ----
 */
 
Aes.subBytes = function(s, Nb) {    // apply SBox to state S [§5.1.1]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
  }
  return s;
}

Aes.shiftRows = function(s, Nb) {    // shift row r of state S left by r bytes [§5.1.2]
  var t = new Array(4);
  for (var r=1; r<4; r++) {
    for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
    for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
  }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
  return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
}

Aes.mixColumns = function(s, Nb) {   // combine bytes of each col of state S [§5.1.3]
  for (var c=0; c<4; c++) {
    var a = new Array(4);  // 'a' is a copy of the current column from 's'
    var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
    for (var i=0; i<4; i++) {
      a[i] = s[i][c];
      b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;

    }
    // a[n] ^ b[n] is a•{03} in GF(2^8)
    s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
    s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
    s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
    s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
  }
  return s;
}

Aes.addRoundKey = function(state, w, rnd, Nb) {  // xor Round Key into state S [§5.1.4]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
  }
  return state;
}

Aes.subWord = function(w) {    // apply SBox to 4-byte word w
  for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
  return w;
}

Aes.rotWord = function(w) {    // rotate 4-byte word w left by one byte
  var tmp = w[0];
  for (var i=0; i<3; i++) w[i] = w[i+1];
  w[3] = tmp;
  return w;
}

// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
             [0x01, 0x00, 0x00, 0x00],
             [0x02, 0x00, 0x00, 0x00],
             [0x04, 0x00, 0x00, 0x00],
             [0x08, 0x00, 0x00, 0x00],
             [0x10, 0x00, 0x00, 0x00],
             [0x20, 0x00, 0x00, 0x00],
             [0x40, 0x00, 0x00, 0x00],
             [0x80, 0x00, 0x00, 0x00],
             [0x1b, 0x00, 0x00, 0x00],
             [0x36, 0x00, 0x00, 0x00] ]; 


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES Counter-mode implementation in JavaScript (c) Chris Veness 2005-2011                      */
/*   - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

Aes.Ctr = {};  // Aes.Ctr namespace: a subclass or extension of Aes

/** 
 * Encrypt a text using AES encryption in Counter mode of operation
 *
 * Unicode multi-byte character safe
 *
 * @param {String} plaintext Source text to be encrypted
 * @param {String} password  The password to use to generate a key
 * @param {Number} nBits     Number of bits to be used in the key (128, 192, or 256)
 * @returns {string}         Encrypted text
 */
Aes.Ctr.encrypt = function(plaintext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  plaintext = Utf8.encode(plaintext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
	
  // use AES itself to encrypt password to get cipher key (using plain password as source for key 
  // expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
  var nBytes = nBits/8;  // no bytes in key (16/24/32)
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {  // use 1st 16/24/32 chars of password for key
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));  // gives us 16-byte key
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec, 
  // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
  var counterBlock = new Array(blockSize);
  
  var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
  var nonceMs = nonce%1000;
  var nonceSec = Math.floor(nonce/1000);
  var nonceRnd = Math.floor(Math.random()*0xffff);
  
  for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
  for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
  for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;
  
  // and convert it to a string to go on the front of the ciphertext
  var ctrTxt = '';
  for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

  // generate key schedule - an expansion of the key into distinct Key Rounds for each round
  var keySchedule = Aes.keyExpansion(key);
  
  var blockCount = Math.ceil(plaintext.length/blockSize);
  var ciphertxt = new Array(blockCount);  // ciphertext as array of strings
  
  for (var b=0; b<blockCount; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
    for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8)

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --
    
    // block size is reduced on final block
    var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
    var cipherChar = new Array(blockLength);
    
    for (var i=0; i<blockLength; i++) {  // -- xor plaintext with ciphered counter char-by-char --
      cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
      cipherChar[i] = String.fromCharCode(cipherChar[i]);
    }
    ciphertxt[b] = cipherChar.join(''); 
  }

  // Array.join is more efficient than repeated string concatenation in IE
  var ciphertext = ctrTxt + ciphertxt.join('');
  ciphertext = Base64.encode(ciphertext);  // encode in base64
  
  //alert((new Date()) - t);
  return ciphertext;
}

/** 
 * Decrypt a text encrypted by AES in counter mode of operation
 *
 * @param {String} ciphertext Source text to be encrypted
 * @param {String} password   The password to use to generate a key
 * @param {Number} nBits      Number of bits to be used in the key (128, 192, or 256)
 * @returns {String}          Decrypted text
 */
Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  ciphertext = Base64.decode(ciphertext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
  
  // use AES to encrypt password (mirroring encrypt routine)
  var nBytes = nBits/8;  // no bytes in key
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // recover nonce from 1st 8 bytes of ciphertext
  var counterBlock = new Array(8);
  ctrTxt = ciphertext.slice(0, 8);
  for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);
  
  // generate key schedule
  var keySchedule = Aes.keyExpansion(key);

  // separate ciphertext into blocks (skipping past initial 8 bytes)
  var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
  var ct = new Array(nBlocks);
  for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
  ciphertext = ct;  // ciphertext is now array of block-length strings

  // plaintext will get generated block-by-block into array of block-length strings
  var plaintxt = new Array(ciphertext.length);

  for (var b=0; b<nBlocks; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

    var plaintxtByte = new Array(ciphertext[b].length);
    for (var i=0; i<ciphertext[b].length; i++) {
      // -- xor plaintxt with ciphered counter byte-by-byte --
      plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
      plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
    }
    plaintxt[b] = plaintxtByte.join('');
  }

  // join array of blocks into single plaintext string
  var plaintext = plaintxt.join('');
  plaintext = Utf8.decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars
  
  //alert((new Date()) - t);
  return plaintext;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2011                          */
/*    note: depends on Utf8 class                                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Base64 = {};  // Base64 namespace

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param {String} str The string to be encoded as base-64
 * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded 
 *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
 * @returns {String} Base64-encoded string
 */ 
Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
  var b64 = Base64.code;
   
  plain = utf8encode ? str.encodeUTF8() : str;
  
  c = plain.length % 3;  // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
   
  for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);
      
    bits = o1<<16 | o2<<8 | o3;
      
    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into code string
    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');  // join() is far faster than repeated string concatenation in IE
  
  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length-pad.length) + pad;
   
  return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param {String} str The string to be decoded from base-64
 * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded 
 *   from UTF8 after conversion from base64
 * @returns {String} decoded string
 */ 
Base64.decode = function(str, utf8decode) {
  utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
  var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
  var b64 = Base64.code;

  coded = utf8decode ? str.decodeUTF8() : str;
  
  
  for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));
      
    bits = h1<<18 | h2<<12 | h3<<6 | h4;
      
    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;
    
    d[c/4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
  }
  plain = d.join('');  // join() is far faster than repeated string concatenation in IE
   
  return utf8decode ? plain.decodeUTF8() : plain; 
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2011                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* **********************************************
     Begin bootstrap-tooltip.js
********************************************** */

/* ===========================================================
 * bootstrap-tooltip.js v2.0.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function( $ ) {

  "use strict"

 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function ( element, options ) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function ( type, element, options ) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function ( options ) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function ( e ) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) {
        self.show()
      } else {
        self.hoverState = 'in'
        setTimeout(function() {
          if (self.hoverState == 'in') {
            self.show()
          }
        }, self.options.delay.show)
      }
    }

  , leave: function ( e ) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.hide) {
        self.hide()
      } else {
        self.hoverState = 'out'
        setTimeout(function() {
          if (self.hoverState == 'out') {
            self.hide()
          }
        }, self.options.delay.hide)
      }
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
      $tip.find('.timeline-tooltip-inner').html(this.getTitle())
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      title = title.toString().replace(/(^\s*|\s*$)/, "")

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , delay: 0
  , selector: false
  , placement: 'top'
  , trigger: 'hover'
  , title: ''
  , template: '<div class="timeline-tooltip"><div class="timeline-tooltip-arrow"></div><div class="timeline-tooltip-inner"></div></div>'
  }

}( window.jQuery );

/* **********************************************
     Begin VMM.StoryJS.js
********************************************** */

/* VeriteCo StoryJS
================================================== */

/*	* CodeKit Import
	* http://incident57.com/codekit/
================================================== */
// @codekit-prepend "Core/VMM.Core.js";
// @codekit-prepend "Language/VMM.Language.js";
// @codekit-prepend "Media/VMM.Media.js";
// @codekit-prepend "Slider/VMM.DragSlider.js";
// @codekit-prepend "Slider/VMM.Slider.js";
// @codekit-prepend "Library/AES.js";
// @codekit-prepend "Library/bootstrap-tooltip.js";


if(typeof VMM != 'undefined' && typeof VMM.StoryJS == 'undefined') {
	
	VMM.StoryJS = function() {  
		
		/* PRIVATE VARS
		================================================== */
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(d) {
			
		};
		
	}
}


/* **********************************************
     Begin VMM.Timeline.js
********************************************** */

// VMM.Timeline.js
/*	* CodeKit Import
	* http://incident57.com/codekit/
================================================== */
// @codekit-prepend "Core/VMM.StoryJS.js";

// @codekit-append "VMM.Timeline.TimeNav.js";
// @codekit-append "VMM.Timeline.DataObj.js";


/* Timeline
================================================== */

if(typeof VMM != 'undefined' && typeof VMM.Timeline == 'undefined') {
	
	VMM.Timeline = function(_timeline_id, w, h) {
		
		var $timeline,
			$container,
			$feature,
			$feedback,
			$slider,
			$navigation,
			slider,
			timenav,
			version		= "2.x",
			timeline_id	= "#timelinejs",
			events		= {},
			data		= {},
			_dates		= [],
			config		= {},
			has_width	= false,
			has_height	= false,
			ie7			= false,
			is_moving	= false;
		

		if (type.of(_timeline_id) == "string") {
			if (_timeline_id.match("#")) {
				timeline_id	= _timeline_id;
			} else {
				timeline_id	= "#" + _timeline_id;
			}
		} else {
			timeline_id		= "#timelinejs";
		}
		
		
		/* CONFIG
		================================================== */
		config = {
			embed:					false,
			events: {
				data_ready:			"DATAREADY",
				messege:			"MESSEGE",
				headline:			"HEADLINE",
				slide_change:		"SLIDE_CHANGE",
				resize:				"resize"
			},
			id: 					timeline_id,
			source:					"nothing",
			type: 					"timeline",
			touch:					false,
			orientation: 			"normal", 
			maptype: 				"",
			version: 				"2.x", 
			preload:				4,
			current_slide:			0,
			hash_bookmark:			false,
			start_at_end: 			false,
			start_at_slide:			0,
			start_zoom_adjust:		0,
			start_page: 			false,
			api_keys: {
				google:				"",
				flickr:				"",
				twitter:			""
			},
			interval: 				10,
			something: 				0,
			width: 					960,
			height: 				540,
			spacing: 				15,
			loaded: {
				slider: 			false, 
				timenav: 			false, 
				percentloaded: 		0
			},
			nav: {
				start_page: 		false,
				interval_width: 	200,
				density: 			4,
				minor_width: 		0,
				minor_left:			0,
				constraint: {
					left:			0,
					right:			0,
					right_min:		0,
					right_max:		0
				},
				zoom: {
					adjust:			0
				},
				multiplier: {
					current: 		6,
					min: 			.1,
					max: 			50
				},
				rows: 				[1, 1, 1],
				width: 				960,
				height: 			200,
				marker: {
					width: 			150,
					height: 		50
				}
			},
			feature: {
				width: 				960,
				height: 			540
			},
			slider: {
				width: 				720,
				height: 			400,
				content: {
					width: 			720,
					height: 		400,
					padding: 		130,
					padding_default:130
				},
				nav: {
					width: 			100,
					height: 		200
				}
			},
			ease: 					"easeInOutExpo",
			duration: 				1000,
			gmap_key: 				"",
			language: 				VMM.Language
		};
		
		if ( w != null && w != "") {
			config.width = w;
			has_width = true;
		} 

		if ( h != null && h != "") {
			config.height = h;
			has_height = true;
		}
		
		if(window.location.hash) {
			 var hash					=	window.location.hash.substring(1);
			 if (!isNaN(hash)) {
			 	 config.current_slide	=	parseInt(hash);
			 }
		}
		
		window.onhashchange = function () {
			var hash					=	window.location.hash.substring(1);
			if (config.hash_bookmark) {
				if (is_moving) {
					goToEvent(parseInt(hash));
				} else {
					is_moving = false;
				}
			} else {
				goToEvent(parseInt(hash));
			}
		}
		
		/* CREATE CONFIG
		================================================== */
		function createConfig(conf) {
			
			// APPLY SUPPLIED CONFIG TO TIMELINE CONFIG
			if (typeof embed_config == 'object') {
				timeline_config = embed_config;
			}
			if (typeof timeline_config == 'object') {
				trace("HAS TIMELINE CONFIG");
				config = VMM.Util.mergeConfig(config, timeline_config);
			} else if (typeof conf == 'object') {
				config = VMM.Util.mergeConfig(config, conf);
			}
			
			if (VMM.Browser.device == "mobile" || VMM.Browser.device == "tablet") {
				config.touch = true;
			}
			
			config.nav.width			= config.width;
			config.nav.height			= 200;
			config.feature.width		= config.width;
			config.feature.height		= config.height - config.nav.height;
			config.nav.zoom.adjust		= parseInt(config.start_zoom_adjust, 10);
			VMM.Timeline.Config			= config;
			VMM.master_config.Timeline	= VMM.Timeline.Config;
			this.events					= config.events;
			
			if (config.gmap_key != "") {
				config.api_keys.google = config.gmap_key;
			}
			
			trace("VERSION " + config.version);
			version = config.version;
		}
		
		/* CREATE TIMELINE STRUCTURE
		================================================== */
		function createStructure() {
			// CREATE DOM STRUCTURE
			$timeline	= VMM.getElement(timeline_id);
			VMM.Lib.addClass($timeline, "vco-timeline");
			VMM.Lib.addClass($timeline, "vco-storyjs");
			
			$container	= VMM.appendAndGetElement($timeline, "<div>", "vco-container vco-main");
			$feature	= VMM.appendAndGetElement($container, "<div>", "vco-feature");
			$slider		= VMM.appendAndGetElement($feature, "<div>", "vco-slider");
			$navigation	= VMM.appendAndGetElement($container, "<div>", "vco-navigation");
			$feedback	= VMM.appendAndGetElement($timeline, "<div>", "vco-feedback", "");
			
			
			if (typeof config.language.right_to_left != 'undefined') {
				VMM.Lib.addClass($timeline, "vco-right-to-left");
			}
			
			slider		= new VMM.Slider($slider, config);
			timenav		= new VMM.Timeline.TimeNav($navigation);
			
			if (!has_width) {
				config.width = VMM.Lib.width($timeline);
			} else {
				VMM.Lib.width($timeline, config.width);
			}

			if (!has_height) {
				config.height = VMM.Lib.height($timeline);
			} else {
				VMM.Lib.height($timeline, config.height);
			}
			
			if (config.touch) {
				VMM.Lib.addClass($timeline, "vco-touch");
			} else {
				VMM.Lib.addClass($timeline, "vco-notouch");
			}
			
			
		}
		
		/* ON EVENT
		================================================== */

		function onDataReady(e, d) {
			trace("onDataReady");
			data = d.timeline;
			
			if (type.of(data.era) != "array") {
				data.era = [];
			}
			
			buildDates();
			
		};
		
		function onDatesProcessed() {
			build();
		}
		
		function reSize() {
			
			updateSize();
			
			slider.setSize(config.feature.width, config.feature.height);
			timenav.setSize(config.width, config.height);
			if (orientationChange()) {
				setViewport();
			}
			
		};
		
		function onSliderLoaded(e) {
			config.loaded.slider = true;
			onComponentLoaded();
		};
		
		function onComponentLoaded(e) {
			config.loaded.percentloaded = config.loaded.percentloaded + 25;
			
			if (config.loaded.slider && config.loaded.timenav) {
				hideMessege();
			}
		}
		
		function onTimeNavLoaded(e) {
			config.loaded.timenav = true;
			onComponentLoaded();
		}
		
		function onSlideUpdate(e) {
			is_moving = true;
			config.current_slide = slider.getCurrentNumber();
			setHash(config.current_slide);
			timenav.setMarker(config.current_slide, config.ease,config.duration);
		};
		
		function onMarkerUpdate(e) {
			is_moving = true;
			config.current_slide = timenav.getCurrentNumber();
			setHash(config.current_slide);
			slider.setSlide(config.current_slide);
		};
		
		function goToEvent(n) {
			if (n <= _dates.length - 1 && n >= 0) {
				config.current_slide = n;
				slider.setSlide(config.current_slide);
				timenav.setMarker(config.current_slide, config.ease,config.duration);
			} 
		}
		
		function setHash(n) {
			if (config.hash_bookmark) {
				window.location.hash = "#" + n.toString();
			}
		}
		
		function getViewport() {
			
		}
		
		function setViewport() {
			var viewport_content		= "",
				viewport_orientation	= searchOrientation(window.orientation);
			
			if (VMM.Browser.device == "mobile") {
				if (viewport_orientation == "portrait") {
					//viewport_content	= "width=device-width; initial-scale=0.75, maximum-scale=0.75";
					viewport_content	= "width=device-width; initial-scale=0.5, maximum-scale=0.5";
				} else if (viewport_orientation == "landscape") {
					viewport_content	= "width=device-width; initial-scale=0.5, maximum-scale=0.5";
				} else {
					viewport_content	= "width=device-width, initial-scale=1, maximum-scale=1.0";
				}
			} else if (VMM.Browser.device == "tablet") {
				//viewport_content		= "width=device-width, initial-scale=1, maximum-scale=1.0";
			}
			
			if (document.getElementById("viewport")) {
				//VMM.Lib.attr("#viewport", "content", viewport_content);
			} else {
				//VMM.appendElement("head", "<meta id='viewport' name='viewport' content=" + viewport_content + "/>");
			}

		}
		
		/* ORIENTATION
		================================================== */
		function searchOrientation(orientation) {
			var orient = "";
			
			if ( orientation == 0  || orientation == 180) {  
				orient = "portrait";
			} else if ( orientation == 90 || orientation == -90) {  
				orient = "landscape";
			} else {
				orient = "normal";
			}
			
			return orient;
		}
		
		function orientationChange() {
			var orientation	= searchOrientation(window.orientation);
			
			if (orientation == config.orientation) {
				return false;
			} else {
				config.orientation = orientation;
				return true;
			}
			
		}
		
		
		/* PUBLIC FUNCTIONS
		================================================== */
		this.init = function(c, _data) {
			trace('INIT');
			setViewport();
			createConfig(c);
			createStructure();
			
			if (type.of(_data) == "string") {
				config.source	= _data;
			}
			
			// LANGUAGE
			VMM.Date.setLanguage(config.language);
			VMM.master_config.language = config.language;
			
			// EXTERNAL API
			VMM.ExternalAPI.setKeys(config.api_keys);
			VMM.ExternalAPI.googlemaps.setMapType(config.maptype);
			
			// EVENTS
			VMM.bindEvent(global, onDataReady, config.events.data_ready);
			VMM.bindEvent(global, showMessege, config.events.messege);
			
			VMM.fireEvent(global, config.events.messege, config.language.messages.loading_timeline);
			
			/* GET DATA
			================================================== */
			if (VMM.Browser.browser == "Explorer" || VMM.Browser.browser == "MSIE") {
				if ( parseInt(VMM.Browser.version, 10) <= 7 ) {
					ie7 = true;
				}
			}
			
			if (type.of(config.source) == "string" || type.of(config.source) == "object") {
				VMM.Timeline.DataObj.getData(config.source);
			} else {
				VMM.fireEvent(global, config.events.messege, "No data source provided");
				//VMM.Timeline.DataObj.getData(VMM.getElement(timeline_id));
			}
			
			
		};
		
		this.iframeLoaded = function() {
			trace("iframeLoaded");
		};
		
		this.reload = function(_d) {
			trace("Load new timeline data" + _d);
			VMM.fireEvent(global, config.events.messege, config.language.messages.loading_timeline);
			data = {};
			VMM.Timeline.DataObj.getData(_d);
			config.current_slide = 0;
			slider.setSlide(0);
			timenav.setMarker(0, config.ease,config.duration);
		};
		
		/* DATA 
		================================================== */
		function getData(url) {
			VMM.getJSON(url, function(d) {
				data = VMM.Timeline.DataObj.getData(d);
				VMM.fireEvent(global, config.events.data_ready);
			});
		};
		
		/* MESSEGES 
		================================================== */
		function showMessege(e, msg, other) {
			trace("showMessege " + msg);
			//VMM.attachElement($timeline, $feedback);
			if (other) {
				VMM.attachElement($feedback, msg);
			} else{
				VMM.attachElement($feedback, VMM.MediaElement.loadingmessage(msg));
			}
		};
		
		function hideMessege() {
			VMM.Lib.animate($feedback, config.duration, config.ease*4, {"opacity": 0}, detachMessege);
		};
		
		function detachMessege() {
			VMM.Lib.detach($feedback);
		}
		
		/* BUILD DISPLAY
		================================================== */
		function build() {
			
			// START AT SLIDE
			if (parseInt(config.start_at_slide) > 0 && config.current_slide == 0) {
				config.current_slide = parseInt(config.start_at_slide); 
			}
			// START AT END
			if (config.start_at_end && config.current_slide == 0) {
				config.current_slide = _dates.length - 1;
			}
			
			
			// IE7
			if (ie7) {
				ie7 = true;
				VMM.fireEvent(global, config.events.messege, "Internet Explorer " + VMM.Browser.version + " is not supported by TimelineJS. Please update your browser to version 8 or higher. If you are using a recent version of Internet Explorer you may need to disable compatibility mode in your browser.");
			} else {
				
				detachMessege();
				reSize();
				
				// EVENT LISTENERS
				VMM.bindEvent($slider, onSliderLoaded, "LOADED");
				VMM.bindEvent($navigation, onTimeNavLoaded, "LOADED");
				VMM.bindEvent($slider, onSlideUpdate, "UPDATE");
				VMM.bindEvent($navigation, onMarkerUpdate, "UPDATE");
				
				// INITIALIZE COMPONENTS
				slider.init(_dates);
				timenav.init(_dates, data.era);
			
				// RESIZE EVENT LISTENERS
				VMM.bindEvent(global, reSize, config.events.resize);
				
				
				
			}
			
			
		};
		
		function updateSize() {
			trace("UPDATE SIZE");
			config.width = VMM.Lib.width($timeline);
			config.height = VMM.Lib.height($timeline);
			
			config.nav.width = config.width;
			config.feature.width = config.width;
			
			config.feature.height = config.height - config.nav.height - 3;
			
			if (VMM.Browser.device == "mobile") {
				/*
				if (VMM.Browser.orientation == "portrait") {
					config.feature.height	= 480;
					config.height			= 480 + config.nav.height;
				} else if(VMM.Browser.orientation == "landscape") {
					config.feature.height	= 320;
					config.height			= 320 + config.nav.height;
				} else {
					config.feature.height = config.height - config.nav.height - 3;
				}
				*/
			}
			
			if (config.width < 641) {
				VMM.Lib.addClass($timeline, "vco-skinny");
			} else {
				VMM.Lib.removeClass($timeline, "vco-skinny");
			}
			
		};
		
		// BUILD DATE OBJECTS
		function buildDates() {
			
			_dates = [];
			VMM.fireEvent(global, config.events.messege, "Building Dates");
			updateSize();
			
			for(var i = 0; i < data.date.length; i++) {
				
				if (data.date[i].startDate != null && data.date[i].startDate != "") {
					
					var _date		= {},
						do_start	= VMM.Date.parse(data.date[i].startDate, true),
						do_end;
						
					_date.startdate		= do_start.date;
					_date.precisiondate	= do_start.precision;
					
					if (!isNaN(_date.startdate)) {
						
					
						// END DATE
						if (data.date[i].endDate != null && data.date[i].endDate != "") {
							_date.enddate = VMM.Date.parse(data.date[i].endDate);
						} else {
							_date.enddate = _date.startdate;
						}
						
						_date.needs_slug = false;
						
						if (data.date[i].headline == "") {
							if (data.date[i].slug != null && data.date[i].slug != "") {
								_date.needs_slug = true;
							}
						}
						
						_date.title				= data.date[i].headline;
						_date.headline			= data.date[i].headline;
						_date.type				= data.date[i].type;
						_date.date				= VMM.Date.prettyDate(_date.startdate, false, _date.precisiondate);
						_date.asset				= data.date[i].asset;
						_date.fulldate			= _date.startdate.getTime();
						_date.text				= data.date[i].text;
						_date.content			= "";
						_date.tag				= data.date[i].tag;
						_date.slug				= data.date[i].slug;
						_date.uniqueid			= VMM.Util.unique_ID(7);
						_date.classname			= data.date[i].classname;
						
						
						_dates.push(_date);
					} 
					
				}
				
			};
			
			/* CUSTOM SORT
			================================================== */
			if (data.type != "storify") {
				_dates.sort(function(a, b){
					return a.fulldate - b.fulldate
				});
			}
			
			/* CREATE START PAGE IF AVAILABLE
			================================================== */
			if (data.headline != null && data.headline != "" && data.text != null && data.text != "") {

				var startpage_date,
					do_start,
					_date			= {},
					td_num			= 0,
					td;
					
				if (typeof data.startDate != 'undefined') {
					do_start		= VMM.Date.parse(data.startDate, true);
					startpage_date	= do_start.date;
				} else {
					startpage_date = false;
				}
				trace("HAS STARTPAGE");
				trace(startpage_date);
				
				if (startpage_date && startpage_date < _dates[0].startdate) {
					_date.startdate = new Date(startpage_date);
				} else {
					td = _dates[0].startdate;
					_date.startdate = new Date(_dates[0].startdate);
				
					if (td.getMonth() === 0 && td.getDate() == 1 && td.getHours() === 0 && td.getMinutes() === 0 ) {
						// trace("YEAR ONLY");
						_date.startdate.setFullYear(td.getFullYear() - 1);
					} else if (td.getDate() <= 1 && td.getHours() === 0 && td.getMinutes() === 0) {
						// trace("YEAR MONTH");
						_date.startdate.setMonth(td.getMonth() - 1);
					} else if (td.getHours() === 0 && td.getMinutes() === 0) {
						// trace("YEAR MONTH DAY");
						_date.startdate.setDate(td.getDate() - 1);
					} else  if (td.getMinutes() === 0) {
						// trace("YEAR MONTH DAY HOUR");
						_date.startdate.setHours(td.getHours() - 1);
					} else {
						// trace("YEAR MONTH DAY HOUR MINUTE");
						_date.startdate.setMinutes(td.getMinutes() - 1);
					}
				}
				
				_date.uniqueid		= VMM.Util.unique_ID(7);
				_date.enddate		= _date.startdate;
				_date.precisiondate	= do_start.precision;
				_date.title			= data.headline;
				_date.headline		= data.headline;
				_date.text			= data.text;
				_date.type			= "start";
				_date.date			= VMM.Date.prettyDate(data.startDate, false, _date.precisiondate);
				_date.asset			= data.asset;
				_date.slug			= false;
				_date.needs_slug	= false;
				_date.fulldate		= _date.startdate.getTime();
				
				if (config.embed) {
					VMM.fireEvent(global, config.events.headline, _date.headline);
				}
				
				_dates.unshift(_date);
			}
			
			/* CUSTOM SORT
			================================================== */
			if (data.type != "storify") {
				_dates.sort(function(a, b){
					return a.fulldate - b.fulldate
				});
			}
			
			onDatesProcessed();
		}
		
	};

	VMM.Timeline.Config = {};
	
};


/* **********************************************
     Begin VMM.Timeline.TimeNav.js
********************************************** */

/* 	VMM.Timeline.TimeNav.js
    TimeNav
	This class handles the bottom timeline navigation.
	It requires the VMM.Util class and VMM.Date class
================================================== */

if(typeof VMM.Timeline != 'undefined' && typeof VMM.Timeline.TimeNav == 'undefined') {
	
	VMM.Timeline.TimeNav = function(parent, content_width, content_height) {
		trace("VMM.Timeline.TimeNav");
		
		var $timenav, $content, $time, $timeintervalminor, $timeinterval, $timeintervalmajor, $timebackground, 
			$timeintervalbackground, $timenavline, $timenavindicator, $timeintervalminor_minor, $toolbar, $zoomin, $zoomout, $dragslide,
			config					= VMM.Timeline.Config,
			row_height,
			events					= {},
			timespan				= {},
			layout					= parent,
			data					= [],
			era_markers				= [],
			markers					= [],
			interval_array			= [],
			interval_major_array	= [],
			tags					= [],
			current_marker			= 0,
			_active					= false,
			eras,
			content,
			timeouts = {
				interval_position:	""
			},
			timenav_pos = {
				left:				"",
				visible: {
					left:			"",
					right:			""
				}
			},
			timelookup = {
				day:			24,
				month:			12,
				year:			10,
				hour:			60,
				minute:			60,
				second:			1000,
				decade:			10,
				century:		100,
				millenium:		1000,
				age:			1000000,
				epoch:			10000000,
				era:			100000000,
				eon:			500000000,
				week:			4.34812141,
				days_in_month:	30.4368499,
				days_in_week:	7,
				weeks_in_month:	4.34812141,
				weeks_in_year:	52.177457,
				days_in_year:	365.242199,
				hours_in_day:	24
			},
			dateFractionBrowser = {
				day:			86400000,
				week:			7,
				month:			30.4166666667,
				year:			12,
				hour:			24,
				minute:			1440,
				second:			86400,
				decade:			10,
				century:		100,
				millenium:		1000,
				age:			1000000,
				epoch:			10000000,
				era:			100000000,
				eon:			500000000
			},
			interval = {
				type:			"year",
				number:			10,
				first:			1970,
				last:			2011,
				multiplier:		100,
				classname:		"_idd",
				interval_type:	"interval"
			},
			interval_major = {
				type:			"year",
				number:			10,
				first:			1970,
				last:			2011,
				multiplier:		100,
				classname:		"major",
				interval_type:	"interval major"
			},
			interval_macro = {
				type:			"year",
				number:			10,
				first:			1970,
				last:			2011,
				multiplier:		100,
				classname:		"_dd_minor",
				interval_type:	"interval minor"
			},
			interval_calc = {
				day: {},
				month: {},
				year: {},
				hour: {},
				minute: {},
				second: {},
				decade: {},
				century: {},
				millenium: {},
				week: {},
				age: {},
				epoch: {},
				era: {},
				eon: {}
			};
		
		
		/* ADD to Config
		================================================== */
		row_height			=	config.nav.marker.height/2;
		config.nav.rows = {
			full:				[1, row_height*2, row_height*4],
			half:				[1, row_height, row_height*2, row_height*3, row_height*4, row_height*5],
			current:			[]
		}
		
		if (content_width != null && content_width != "") {
			config.nav.width	= 	content_width;
		} 
		if (content_height != null && content_height != "") {
			config.nav.height	= 	content_height;
		}
		
		/* INIT
		================================================== */
		this.init = function(d,e) {
			trace('VMM.Timeline.TimeNav init');
			// need to evaluate d
			// some function to determine type of data and prepare it
			if(typeof d != 'undefined') {
				this.setData(d, e);
			} else {
				trace("WAITING ON DATA");
			}
		};
		
		/* GETTERS AND SETTERS
		================================================== */
		this.setData = function(d,e) {
			if(typeof d != 'undefined') {
				data = {};
				data = d;
				eras = e;
				build();
			} else{
				trace("NO DATA");
			}
		};
		
		this.setSize = function(w, h) {
			if (w != null) {config.width = w};
			if (h != null) {config.height = h};
			if (_active) {
				reSize();
			}

			
		}
		
		this.setMarker = function(n, ease, duration, fast) {
			goToMarker(n, ease, duration);
		}
		
		this.getCurrentNumber = function() {
			return current_marker;
		}
		
		/* ON EVENT
		================================================== */
		
		function onConfigSet() {
			trace("onConfigSet");
		};
		
		function reSize(firstrun) {
			config.nav.constraint.left = (config.width/2);
			config.nav.constraint.right = config.nav.constraint.right_min - (config.width/2);
			$dragslide.updateConstraint(config.nav.constraint);
			
			VMM.Lib.css($timenavline, "left", Math.round(config.width/2)+2);
			VMM.Lib.css($timenavindicator, "left", Math.round(config.width/2)-8);
			goToMarker(config.current_slide, config.ease, config.duration, true, firstrun);
		};
		
		function upDate() {
			VMM.fireEvent(layout, "UPDATE");
		}
		
		function onZoomIn() {
			
			$dragslide.cancelSlide();
			if (config.nav.multiplier.current > config.nav.multiplier.min) {
				if (config.nav.multiplier.current <= 1) {
					config.nav.multiplier.current = config.nav.multiplier.current - .25;
				} else {
					if (config.nav.multiplier.current > 5) {
						if (config.nav.multiplier.current > 16) {
							config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 10);
						} else {
							config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 4);
						}
					} else {
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 1);
					}
					
				}
				if (config.nav.multiplier.current <= 0) {
					config.nav.multiplier.current = config.nav.multiplier.min;
				}
				refreshTimeline();
			}
		}
		
		function onZoomOut() {
			$dragslide.cancelSlide();
			if (config.nav.multiplier.current < config.nav.multiplier.max) {
				if (config.nav.multiplier.current > 4) {
					if (config.nav.multiplier.current > 16) {
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 10);
					} else {
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 4);
					}
				} else {
					config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 1);
				}
				
				if (config.nav.multiplier.current >= config.nav.multiplier.max) {
					config.nav.multiplier.current = config.nav.multiplier.max;
				}
				refreshTimeline();
			}
		}
		
		function onBackHome(e) {
			$dragslide.cancelSlide();
			goToMarker(0);
			upDate();
		}
		
		function onMouseScroll(e) {
			var delta		= 0,
				scroll_to	= 0;
			if (!e) {
				e = window.event;
			}
			if (e.originalEvent) {
				e = e.originalEvent;
			}
			
			// Browsers unable to differntiate between up/down and left/right scrolling
			/*
			if (e.wheelDelta) {
				delta = e.wheelDelta/6;
			} else if (e.detail) {
				delta = -e.detail*12;
			}
			*/
			
			// Webkit and browsers able to differntiate between up/down and left/right scrolling
			if (typeof e.wheelDeltaX != 'undefined' ) {
				delta = e.wheelDeltaY/6;
				if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
					delta = e.wheelDeltaX/6;
				} else {
					//delta = e.wheelDeltaY/6;
					delta = 0;
				}
			}
			if (delta) {
				if (e.preventDefault) {
					 e.preventDefault();
				}
				e.returnValue = false;
			}
			// Stop from scrolling too far
			scroll_to = VMM.Lib.position($timenav).left + delta;
			
			if (scroll_to > config.nav.constraint.left) {
				scroll_to = config.width/2;
			} else if (scroll_to < config.nav.constraint.right) {
				scroll_to = config.nav.constraint.right;
			}
			
			//VMM.Lib.stop($timenav);
			//VMM.Lib.animate($timenav, config.duration/2, "linear", {"left": scroll_to});
			VMM.Lib.css($timenav, "left", scroll_to);	
		}
		
		function refreshTimeline() {
			trace("config.nav.multiplier " + config.nav.multiplier.current);
			positionMarkers(true);
			positionEras(true);
			positionInterval($timeinterval, interval_array, true, true);
			positionInterval($timeintervalmajor, interval_major_array, true);
			config.nav.constraint.left = (config.width/2);
			config.nav.constraint.right = config.nav.constraint.right_min - (config.width/2);
			$dragslide.updateConstraint(config.nav.constraint);
		};
		
		/* MARKER EVENTS
		================================================== */
		function onMarkerClick(e) {
			$dragslide.cancelSlide();
			goToMarker(e.data.number);
			upDate();
		};
		
		function onMarkerHover(e) {
			VMM.Lib.toggleClass(e.data.elem, "zFront");
		};
		
		function goToMarker(n, ease, duration, fast, firstrun) {
			trace("GO TO MARKER");
			var _ease		= config.ease,
				_duration	= config.duration,
				is_last		= false,
				is_first	= false;
			
			current_marker = 	n;
			
			timenav_pos.left			= (config.width/2) - markers[current_marker].pos_left
			timenav_pos.visible.left	= Math.abs(timenav_pos.left) - 100;
			timenav_pos.visible.right	= Math.abs(timenav_pos.left) + config.width + 100;
			
			if (current_marker == 0) {
				is_first = true;
			}
			if (current_marker +1 == markers.length) {
				is_last = true
			}
			if (ease != null && ease != "") {_ease = ease};
			if (duration != null && duration != "") {_duration = duration};
			
			// set marker style
			for(var i = 0; i < markers.length; i++) {
				VMM.Lib.removeClass(markers[i].marker, "active");
			}
			
			if (config.start_page && markers[0].type == "start") {
				VMM.Lib.visible(markers[0].marker, false);
				VMM.Lib.addClass(markers[0].marker, "start");
			}
			
			VMM.Lib.addClass(markers[current_marker].marker, "active");
			
			// ANIMATE MARKER
			VMM.Lib.stop($timenav);
			VMM.Lib.animate($timenav, _duration, _ease, {"left": timenav_pos.left});
			
		}
		
		/* TOUCH EVENTS
		================================================== */
		function onTouchUpdate(e, b) {
			VMM.Lib.animate($timenav, b.time/2, config.ease, {"left": b.left});
		};
		
		/* CALCULATIONS
		================================================== */
		function averageMarkerPositionDistance() {
			var last_pos	= 0,
				pos			= 0,
				pos_dif		= 0,
				mp_diff		= [],
				i			= 0;
			
			for(i = 0; i < markers.length; i++) {
				if (data[i].type == "start") {
					
				} else {
					var _pos = positionOnTimeline(interval, markers[i].relative_pos),
					last_pos = pos;
					pos = _pos.begin;
					pos_dif = pos - last_pos;
					mp_diff.push(pos_dif);
				}
			}
			return VMM.Util.average(mp_diff).mean;
		}
		
		function averageDateDistance() {
			var last_dd			= 0,
				dd				= 0,
				_dd				= "",
				date_dif		= 0,
				date_diffs		= [],
				is_first_date	= true,
				i				= 0;
			
			for(i = 0; i < data.length; i++) {
				if (data[i].type == "start") {
					trace("DATA DATE IS START")
				} else {
					_dd			= data[i].startdate;
					last_dd		= dd;
					dd			= _dd;
					date_dif	= dd - last_dd;
					date_diffs.push(date_dif);
				}
			}
			
			return VMM.Util.average(date_diffs);
		}
		
		function calculateMultiplier() {
			var temp_multiplier	= config.nav.multiplier.current,
				i				= 0;
				
			for(i = 0; i < temp_multiplier; i++) {
				if (averageMarkerPositionDistance() < 75) {
					if (config.nav.multiplier.current > 1) {
						config.nav.multiplier.current = (config.nav.multiplier.current - 1);
					}
				}
			}
			
		}
		
		function calculateInterval() {
			// NEED TO REWRITE ALL OF THIS
			var _first								= getDateFractions(data[0].startdate),
				_last								= getDateFractions(data[data.length - 1].enddate);
			
			// EON
			interval_calc.eon.type					=	"eon";
			interval_calc.eon.first					=	_first.eons;
			interval_calc.eon.base					=	Math.floor(_first.eons);
			interval_calc.eon.last					=	_last.eons;
			interval_calc.eon.number				=	timespan.eons;
			interval_calc.eon.multiplier		 	=	timelookup.eons;
			interval_calc.eon.minor					=	timelookup.eons;
			
			// ERA
			interval_calc.era.type					=	"era";
			interval_calc.era.first					=	_first.eras;
			interval_calc.era.base					=	Math.floor(_first.eras);
			interval_calc.era.last					=	_last.eras;
			interval_calc.era.number				=	timespan.eras;
			interval_calc.era.multiplier		 	=	timelookup.eras;
			interval_calc.era.minor					=	timelookup.eras;
			
			// EPOCH
			interval_calc.epoch.type				=	"epoch";
			interval_calc.epoch.first				=	_first.epochs;
			interval_calc.epoch.base				=	Math.floor(_first.epochs);
			interval_calc.epoch.last				=	_last.epochs;
			interval_calc.epoch.number				=	timespan.epochs;
			interval_calc.epoch.multiplier		 	=	timelookup.epochs;
			interval_calc.epoch.minor				=	timelookup.epochs;
			
			// AGE
			interval_calc.age.type					=	"age";
			interval_calc.age.first					=	_first.ages;
			interval_calc.age.base					=	Math.floor(_first.ages);
			interval_calc.age.last					=	_last.ages;
			interval_calc.age.number				=	timespan.ages;
			interval_calc.age.multiplier		 	=	timelookup.ages;
			interval_calc.age.minor					=	timelookup.ages;
			
			// MILLENIUM
			interval_calc.millenium.type 			=	"millenium";
			interval_calc.millenium.first			=	_first.milleniums;
			interval_calc.millenium.base			=	Math.floor(_first.milleniums);
			interval_calc.millenium.last			=	_last.milleniums;
			interval_calc.millenium.number			=	timespan.milleniums;
			interval_calc.millenium.multiplier	 	=	timelookup.millenium;
			interval_calc.millenium.minor			=	timelookup.millenium;
			
			// CENTURY
			interval_calc.century.type 				= "century";
			interval_calc.century.first 			= _first.centuries;
			interval_calc.century.base 				= Math.floor(_first.centuries);
			interval_calc.century.last 				= _last.centuries;
			interval_calc.century.number 			= timespan.centuries;
			interval_calc.century.multiplier	 	= timelookup.century;
			interval_calc.century.minor 			= timelookup.century;
			
			// DECADE
			interval_calc.decade.type 				= "decade";
			interval_calc.decade.first 				= _first.decades;
			interval_calc.decade.base 				= Math.floor(_first.decades);
			interval_calc.decade.last 				= _last.decades;
			interval_calc.decade.number 			= timespan.decades;
			interval_calc.decade.multiplier 		= timelookup.decade;
			interval_calc.decade.minor 				= timelookup.decade;
			
			// YEAR
			interval_calc.year.type					= "year";
			interval_calc.year.first 				= _first.years;
			interval_calc.year.base 				= Math.floor(_first.years);
			interval_calc.year.last					= _last.years;
			interval_calc.year.number 				= timespan.years;
			interval_calc.year.multiplier 			= 1;
			interval_calc.year.minor 				= timelookup.month;
			
			// MONTH
			interval_calc.month.type 				= "month";
			interval_calc.month.first 				= _first.months;
			interval_calc.month.base 				= Math.floor(_first.months);
			interval_calc.month.last 				= _last.months;
			interval_calc.month.number 				= timespan.months;
			interval_calc.month.multiplier 			= 1;
			interval_calc.month.minor 				= Math.round(timelookup.week);
			
			// WEEK
			// NOT DONE
			interval_calc.week.type 				= "week";
			interval_calc.week.first 				= _first.weeks;
			interval_calc.week.base 				= Math.floor(_first.weeks);
			interval_calc.week.last 				= _last.weeks;
			interval_calc.week.number 				= timespan.weeks;
			interval_calc.week.multiplier 			= 1;
			interval_calc.week.minor 				= 7;
			
			// DAY
			interval_calc.day.type 					= "day";
			interval_calc.day.first 				= _first.days;
			interval_calc.day.base	 				= Math.floor(_first.days);
			interval_calc.day.last 					= _last.days;
			interval_calc.day.number 				= timespan.days;
			interval_calc.day.multiplier 			= 1;
			interval_calc.day.minor 				= 24;
			
			// HOUR
			interval_calc.hour.type 				= "hour";
			interval_calc.hour.first 				= _first.hours;
			interval_calc.hour.base 				= Math.floor(_first.hours);
			interval_calc.hour.last 				= _last.hours;
			interval_calc.hour.number 				= timespan.hours;
			interval_calc.hour.multiplier 			= 1;
			interval_calc.hour.minor 				= 60;
			
			// MINUTE
			interval_calc.minute.type 				= "minute";
			interval_calc.minute.first 				= _first.minutes;
			interval_calc.minute.base 				= Math.floor(_first.minutes);
			interval_calc.minute.last 				= _last.minutes;
			interval_calc.minute.number 			= timespan.minutes;
			interval_calc.minute.multiplier 		= 1;
			interval_calc.minute.minor 				= 60;
			
			// SECOND
			interval_calc.second.type 				= "decade";
			interval_calc.second.first 				= _first.seconds;
			interval_calc.second.base 				= Math.floor(_first.seconds);
			interval_calc.second.last 				= _last.seconds;
			interval_calc.second.number 			= timespan.seconds;
			interval_calc.second.multiplier 		= 1;
			interval_calc.second.minor 				= 10;
		}
		
		function getDateFractions(the_date, is_utc) {
			
			var _time = {};
			_time.days			=		the_date		/	dateFractionBrowser.day;
			_time.weeks 		=		_time.days		/	dateFractionBrowser.week;
			_time.months 		=		_time.days		/	dateFractionBrowser.month;
			_time.years 		=		_time.months 	/	dateFractionBrowser.year;
			_time.hours 		=		_time.days		*	dateFractionBrowser.hour;
			_time.minutes 		=		_time.days		*	dateFractionBrowser.minute;
			_time.seconds 		=		_time.days		*	dateFractionBrowser.second;
			_time.decades 		=		_time.years		/	dateFractionBrowser.decade;
			_time.centuries 	=		_time.years		/	dateFractionBrowser.century;
			_time.milleniums 	=		_time.years		/	dateFractionBrowser.millenium;
			_time.ages			=		_time.years		/	dateFractionBrowser.age;
			_time.epochs		=		_time.years		/	dateFractionBrowser.epoch;
			_time.eras			=		_time.years		/	dateFractionBrowser.era;
			_time.eons			=		_time.years		/	dateFractionBrowser.eon;
			
			/*
			trace("AGES "		 + 		_time.ages);
			trace("EPOCHS "		 + 		_time.epochs);
			trace("MILLENIUMS "  + 		_time.milleniums);
			trace("CENTURIES "	 + 		_time.centuries);
			trace("DECADES "	 + 		_time.decades);
			trace("YEARS "		 + 		_time.years);
			trace("MONTHS "		 + 		_time.months);
			trace("WEEKS "		 + 		_time.weeks);
			trace("DAYS "		 + 		_time.days);
			trace("HOURS "		 + 		_time.hours);
			trace("MINUTES "	 + 		_time.minutes);
			trace("SECONDS "	 + 		_time.seconds);
			*/
			return _time;
		}
		
		/*	POSITION
			Positions elements on the timeline based on date
			relative to the calculated interval
		================================================== */
		function positionRelative(_interval, first, last) {
			var _first,
				_last,
				_type			= _interval.type,
				timerelative = {
					start:		"",
					end:		"",
					type:		_type
				};
			
			/* FIRST
			================================================== */
			_first					= getDateFractions(first);
			timerelative.start		= first.months;
			
			if (_type == "eon") {
				timerelative.start	= _first.eons;
			} else if (_type == "era") {
				timerelative.start	= _first.eras;
			} else if (_type == "epoch") {
				timerelative.start	= _first.epochs;
			} else if (_type == "age") {
				timerelative.start	= _first.ages;
			} else if (_type == "millenium") {
				timerelative.start	= first.milleniums;
			} else if (_type == "century") {
				timerelative.start	= _first.centuries;
			} else if (_type == "decade") {
				timerelative.start	= _first.decades;
			} else if (_type == "year") {
				timerelative.start	= _first.years;
			} else if (_type == "month") {
				timerelative.start	= _first.months;
			} else if (_type == "week") {
				timerelative.start	= _first.weeks;
			} else if (_type == "day") {
				timerelative.start	= _first.days;
			} else if (_type == "hour") {
				timerelative.start	= _first.hours;
			} else if (_type == "minute") {
				timerelative.start	= _first.minutes;
			}
			
			/* LAST
			================================================== */
			if (type.of(last) == "date") {
				
				_last					= getDateFractions(last);
				timerelative.end		= last.months;
				
				if (_type == "eon") {
					timerelative.end	= _last.eons;
				} else if (_type == "era") {
					timerelative.end	= _last.eras;
				} else if (_type == "epoch") {
					timerelative.end	= _last.epochs;
				} else if (_type == "age") {
					timerelative.end	= _last.ages;
				} else if (_type == "millenium") {
					timerelative.end	= last.milleniums;
				} else if (_type == "century") {
					timerelative.end	= _last.centuries;
				} else if (_type == "decade") {
					timerelative.end	= _last.decades;
				} else if (_type == "year") {
					timerelative.end	= _last.years;
				} else if (_type == "month") {
					timerelative.end	= _last.months;
				} else if (_type == "week") {
					timerelative.end	= _last.weeks;
				} else if (_type == "day") {
					timerelative.end	= _last.days;
				} else if (_type == "hour") {
					timerelative.end	= _last.hours;
				} else if (_type == "minute") {
					timerelative.end	= _last.minutes;
				}
				
			} else {
				
				timerelative.end		= timerelative.start;
				
			}
			
			return timerelative
		}
		
		function positionOnTimeline(the_interval, timerelative) {
			return {
				begin:	(timerelative.start	-	interval.base) * (config.nav.interval_width / config.nav.multiplier.current), 
				end:	(timerelative.end	-	interval.base) * (config.nav.interval_width / config.nav.multiplier.current)
			};
		}
		
		function positionMarkers(is_animated) {
			
			var row						= 2,
				previous_pos			= 0,
				pos_offset				= -2,
				row_depth				= 0,
				row_depth_sub			= 0,
				line_last_height_pos	= 150,
				line_height				= 6,
				cur_mark				= 0,
				in_view_margin			= config.width,
				pos_cache_array			= [],
				pos_cache_max			= 6,
				in_view = {
					left:				timenav_pos.visible.left - in_view_margin,
					right:				timenav_pos.visible.right + in_view_margin
				},
				i						= 0,
				k						= 0;
				
			config.nav.minor_width = config.width;
			
			VMM.Lib.removeClass(".flag", "row1");
			VMM.Lib.removeClass(".flag", "row2");
			VMM.Lib.removeClass(".flag", "row3");
			
			for(i = 0; i < markers.length; i++) {
				
				var line,
					marker				= markers[i],
					pos					= positionOnTimeline(interval, markers[i].relative_pos),
					row_pos				= 0,
					is_in_view			= false,
					pos_cache_obj		= {id: i, pos: 0, row: 0},
					pos_cache_close		= 0;
				
				
				// COMPENSATE FOR DATES BEING POITIONED IN THE MIDDLE
				pos.begin				= Math.round(pos.begin +  pos_offset);
				pos.end					= Math.round(pos.end + pos_offset);
				line					= Math.round(pos.end - pos.begin);
				marker.pos_left			= pos.begin;
				
				if (current_marker == i) {
					timenav_pos.left			= (config.width/2) - pos;
					timenav_pos.visible.left	= Math.abs(timenav_pos.left);
					timenav_pos.visible.right	= Math.abs(timenav_pos.left) + config.width;
					in_view.left				= timenav_pos.visible.left - in_view_margin;
					in_view.right				= timenav_pos.visible.right + in_view_margin;
				}
				
				if (Math.abs(pos.begin) >= in_view.left && Math.abs(pos.begin) <= in_view.right ) {
					is_in_view = true;
				}
				
				// APPLY POSITION TO MARKER
				if (is_animated) {
					VMM.Lib.stop(marker.marker);
					VMM.Lib.animate(marker.marker, config.duration/2, config.ease, {"left": pos.begin});
				} else {
					VMM.Lib.stop(marker.marker);
					VMM.Lib.css(marker.marker, "left", pos.begin);
				}
				
				if (i == current_marker) {
					cur_mark = pos.begin;
				}
				
				// EVENT LENGTH LINE
				if (line > 5) {
					VMM.Lib.css(marker.lineevent, "height", line_height);
					VMM.Lib.css(marker.lineevent, "top", line_last_height_pos);
					if (is_animated) {
						VMM.Lib.animate(marker.lineevent, config.duration/2, config.ease, {"width": line});
					} else {
						VMM.Lib.css(marker.lineevent, "width", line);
					}
				}
				
				// CONTROL ROW POSITION
				if (tags.length > 0) {
					
					for (k = 0; k < tags.length; k++) {
						if (k < config.nav.rows.current.length) {
							if (marker.tag == tags[k]) {
								row = k;
								if (k == config.nav.rows.current.length - 1) {
									trace("ON LAST ROW");
									VMM.Lib.addClass(marker.flag, "flag-small-last");
								}
							}
						}
					}
					row_pos = config.nav.rows.current[row];
				} else {
					
					if (pos.begin - previous_pos.begin < (config.nav.marker.width + config.spacing)) {
						if (row < config.nav.rows.current.length - 1) {
							row ++;
						
						} else {
							row = 0;
							row_depth ++;
						}
					} else {
						row_depth = 1;
						row = 1;
					}
					row_pos = config.nav.rows.current[row];
					
				}
				
				// SET LAST MARKER POSITION
				previous_pos = pos;
				
				// POSITION CACHE
				pos_cache_obj.pos = pos;
				pos_cache_obj.row = row;
				pos_cache_array.push(pos_cache_obj);
				if (pos_cache_array.length > pos_cache_max) {
					VMM.Util.removeRange(pos_cache_array,0);
				}
				
				//if (is_animated && is_in_view) {
				if (is_animated) {
					VMM.Lib.stop(marker.flag);
					VMM.Lib.animate(marker.flag, config.duration, config.ease, {"top": row_pos});
				} else {
					VMM.Lib.stop(marker.flag);
					VMM.Lib.css(marker.flag, "top", row_pos);
				}
				
				// IS THE MARKER A REPRESENTATION OF A START SCREEN?
				if (config.start_page && markers[i].type == "start") {
					VMM.Lib.visible(marker.marker, false);
					
				}
				
				if (pos > config.nav.minor_width) {
					config.nav.minor_width = pos;
				}
				
				if (pos < config.nav.minor_left) {
					config.nav.minor_left = pos;
				}
				
			}
			
			// ANIMATE THE TIMELINE TO ADJUST TO CHANGES
			if (is_animated) {
				VMM.Lib.stop($timenav);
				VMM.Lib.animate($timenav, config.duration/2, config.ease, {"left": (config.width/2) - (cur_mark)});
			} else {
				
			}
			
			//VMM.Lib.delay_animate(config.duration, $timenav, config.duration/2, config.ease, {"left": (config.width/2) - (cur_mark)});
			
		
		}
		
		function positionEras(is_animated) {
			var i	= 0,
				p	= 0;
				
			for(i = 0; i < era_markers.length; i++) {
				var era			= era_markers[i],
					pos			= positionOnTimeline(interval, era.relative_pos),
					row_pos		= 0,
					row			= 0,
					era_height	= config.nav.marker.height * config.nav.rows.full.length,
					era_length	= pos.end - pos.begin;
					
				// CONTROL ROW POSITION
				if (era.tag != "") {
					era_height = (config.nav.marker.height * config.nav.rows.full.length) / config.nav.rows.current.length;
					for (p = 0; p < tags.length; p++) {
						if (p < config.nav.rows.current.length) {
							if (era.tag == tags[p]) {
								row = p;
							}
						}
					}
					row_pos = config.nav.rows.current[row];
					
				} else {
					row_pos = -1;
				}
				
				// APPLY POSITION TO MARKER
				if (is_animated) {
					VMM.Lib.stop(era.content);
					VMM.Lib.stop(era.text_content);
					VMM.Lib.animate(era.content, config.duration/2, config.ease, {"top": row_pos, "left": pos.begin, "width": era_length, "height":era_height});
					VMM.Lib.animate(era.text_content, config.duration/2, config.ease, {"left": pos.begin});
				} else {
					VMM.Lib.stop(era.content);
					VMM.Lib.stop(era.text_content);
					VMM.Lib.css(era.content, "left", pos.begin);
					VMM.Lib.css(era.content, "width", era_length);
					VMM.Lib.css(era.content, "height", era_height);
					VMM.Lib.css(era.content, "top", row_pos);
					VMM.Lib.css(era.text_content, "left", pos.begin);
					
				}

			}
		}
		
		function positionInterval(the_main_element, the_intervals, is_animated, is_minor) {
			
			var last_position		= 0,
				last_position_major	= 0,
				//in_view_margin		= (config.nav.minor_width/config.nav.multiplier.current)/2,
				in_view_margin		= config.width,
				in_view = {
					left:			timenav_pos.visible.left - in_view_margin,
					right:			timenav_pos.visible.right + in_view_margin
				}
				not_too_many		= true,
				i					= 0;
			
			config.nav.minor_left = 0;
				
			if (the_intervals.length > 100) {
				not_too_many = false;
				trace("TOO MANY " + the_intervals.length);
			}
			
			
			for(i = 0; i < the_intervals.length; i++) {
				var _interval			= the_intervals[i].element,
					_interval_date		= the_intervals[i].date,
					_interval_visible	= the_intervals[i].visible,
					_pos				= positionOnTimeline(interval, the_intervals[i].relative_pos),
					pos					= _pos.begin,
					_animation			= the_intervals[i].animation,
					is_visible			= true,
					is_in_view			= false,
					pos_offset			= 50;
				
				
				_animation.pos			= pos;
				_animation.animate		= false;
				
				if (Math.abs(pos) >= in_view.left && Math.abs(pos) <= in_view.right ) {
					is_in_view = true;
				}
				
				if (true) {
					
					// CONDENSE WHAT IS DISPLAYED
					if (config.nav.multiplier.current > 16 && is_minor) {
						is_visible = false;
					} else {
						if ((pos - last_position) < 65 ) {
							if ((pos - last_position) < 35 ) {
								if (i%4 == 0) {
									if (pos == 0) {
										is_visible = false;
									}
								} else {
									is_visible = false;
								}
							} else {
								if (!VMM.Util.isEven(i)) {
									is_visible = false;
								}
							}
						}
					}
					
					if (is_visible) {
						if (the_intervals[i].is_detached) {
							VMM.Lib.append(the_main_element, _interval);
							the_intervals[i].is_detached = false;
						}
					} else {
						the_intervals[i].is_detached = true;
						VMM.Lib.detach(_interval);
					}
					
					
					if (_interval_visible) {
						if (!is_visible) {
							_animation.opacity	= "0";
							if (is_animated && not_too_many) {
								_animation.animate	= true;
							}
							the_intervals[i].interval_visible = false;
						} else {
							_animation.opacity	= "100";
							if (is_animated && is_in_view) {
								_animation.animate	= true;
							}
						}
					} else {
						_animation.opacity	= "100";
						if (is_visible) {
							if (is_animated && not_too_many) {
								_animation.animate	= true;
							} else {
								if (is_animated && is_in_view) {
									_animation.animate	= true;
								}
							}
							the_intervals[i].interval_visible = true;
						} else {
							if (is_animated && not_too_many) {
								_animation.animate	= true;
							}
						}
					}
				
					last_position = pos;
				
					if (pos > config.nav.minor_width) {
						config.nav.minor_width = pos;
					}
					
					if (pos < config.nav.minor_left) {
						config.nav.minor_left = pos;
					}
					
				}
				
				if (_animation.animate) {
					VMM.Lib.animate(_interval, config.duration/2, config.ease, {opacity: _animation.opacity, left: _animation.pos});
				} else {
					VMM.Lib.css(_interval, "opacity", _animation.opacity);
					VMM.Lib.css(_interval, "left", pos);
				}
			}
			
			config.nav.constraint.right_min = -(config.nav.minor_width)+(config.width);
			config.nav.constraint.right = config.nav.constraint.right_min + (config.width/2);
			
			VMM.Lib.css($timeintervalminor_minor, "left", config.nav.minor_left - (config.width)/2);
			VMM.Lib.width($timeintervalminor_minor, (config.nav.minor_width)+(config.width) + Math.abs(config.nav.minor_left) );
			
		}
		
		/* Interval Elements
		================================================== */
		function createIntervalElements(_interval, _array, _element_parent) {
			
			var inc_time			= 0,
				_first_run			= true,
				_last_pos			= 0,
				_largest_pos		= 0,
				_timezone_offset,
				_first_date,
				_last_date,
				int_number			= Math.ceil(_interval.number) + 2,
				firefox = {
					flag:			false,
					offset:			0
				},
				i					= 0;
			
			VMM.attachElement(_element_parent, "");
			
			_interval.date = new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0);
			_timezone_offset = _interval.date.getTimezoneOffset();
			
			for(i = 0; i < int_number; i++) {
				trace(_interval.type);
				var _is_year			= false,
					int_obj = {
						element: 		VMM.appendAndGetElement(_element_parent, "<div>", _interval.classname),
						date: 			new Date(data[0].startdate.getFullYear(), 0, 1, 0,0,0),
						visible: 		false,
						date_string:	"",
						type: 			_interval.interval_type,
						relative_pos:	0,
						is_detached:	false,
						animation: {
							animate:	false,
							pos:		"",
							opacity:	"100"
						
						}
					};
				
				if (_interval.type == "eon") {
					if (_first_run) {
						_first_date = Math.floor(data[0].startdate.getFullYear() / 500000000) * 500000000;
					}
					int_obj.date.setFullYear(_first_date + (inc_time * 500000000));
					_is_year = true;
				} else if (_interval.type == "era") {
					if (_first_run) {
						_first_date = Math.floor(data[0].startdate.getFullYear() / 100000000) * 100000000;
					}
					int_obj.date.setFullYear(_first_date + (inc_time * 100000000));
					_is_year = true;
				} else if (_interval.type == "epoch") {
					if (_first_run) {
						_first_date = Math.floor(data[0].startdate.getFullYear() / 10000000) * 10000000
					}
					int_obj.date.setFullYear(_first_date + (inc_time * 10000000));
					_is_year = true;
				} else if (_interval.type == "age") {
					if (_first_run) {
						_first_date = Math.floor(data[0].startdate.getFullYear() / 1000000) * 1000000
					}
					int_obj.date.setFullYear(_first_date + (inc_time * 1000000));
					_is_year = true;
				} else if (_interval.type == "millenium") {
					if (_first_run) {
						_first_date = Math.floor(data[0].startdate.getFullYear() / 1000) * 1000;
					}
					int_obj.date.setFullYear(_first_date + (inc_time * 1000));
					_is_year = true;
				} else if (_interval.type == "century") {
					if (_first_run) {
						_first_date = Math.floor(data[0].startdate.getFullYear() / 100) * 100
					}
					int_obj.date.setFullYear(_first_date + (inc_time * 100));
					_is_year = true;
				} else if (_interval.type == "decade") {
					if (_first_run) {
						_first_date = Math.floor(data[0].startdate.getFullYear() / 10) * 10;
					}
					int_obj.date.setFullYear(_first_date + (inc_time * 10));
					_is_year = true;
				} else if (_interval.type == "year") {
					if (_first_run) {
						_first_date = data[0].startdate.getFullYear();
					}
					int_obj.date.setFullYear(_first_date + inc_time);
					_is_year = true;
				} else if (_interval.type == "month") {
					if (_first_run) {
						_first_date = data[0].startdate.getMonth();
					}
					int_obj.date.setMonth(_first_date + inc_time);
				} else if (_interval.type == "week") {
					if (_first_run) {
						_first_date = data[0].startdate.getMonth();
					}
					int_obj.date.setMonth(data[0].startdate.getMonth());
					int_obj.date.setDate(_first_date + (inc_time * 7) );
				} else if (_interval.type == "day") {
					if (_first_run) {
						_first_date = data[0].startdate.getDate();
					}
					int_obj.date.setMonth(data[0].startdate.getMonth());
					int_obj.date.setDate(_first_date + inc_time);
				} else if (_interval.type == "hour") {
					if (_first_run) {
						_first_date = data[0].startdate.getHours();
					}
					int_obj.date.setMonth(data[0].startdate.getMonth());
					int_obj.date.setDate(data[0].startdate.getDate());
					int_obj.date.setHours(_first_date + inc_time);
				} else if (_interval.type == "minute") {
					if (_first_run) {
						_first_date = data[0].startdate.getMinutes();
					}
					int_obj.date.setMonth(data[0].startdate.getMonth());
					int_obj.date.setDate(data[0].startdate.getDate());
					int_obj.date.setHours(data[0].startdate.getHours());
					int_obj.date.setMinutes(_first_date + inc_time);
				} else if (_interval.type == "second") {
					if (_first_run) {
						_first_date = data[0].startdate.getSeconds();
					}
					int_obj.date.setMonth(data[0].startdate.getMonth());
					int_obj.date.setDate(data[0].startdate.getDate());
					int_obj.date.setHours(data[0].startdate.getHours());
					int_obj.date.setMinutes(data[0].startdate.getMinutes());
					int_obj.date.setSeconds(_first_date + inc_time);
				}	else if (_interval.type == "millisecond") {
					if (_first_run) {
						_first_date = data[0].startdate.getMilliseconds();
					}
					int_obj.date.setMonth(data[0].startdate.getMonth());
					int_obj.date.setDate(data[0].startdate.getDate());
					int_obj.date.setHours(data[0].startdate.getHours());
					int_obj.date.setMinutes(data[0].startdate.getMinutes());
					int_obj.date.setSeconds(data[0].startdate.getSeconds());
					int_obj.date.setMilliseconds(_first_date + inc_time);
				}
				
				// FIX WEIRD FIREFOX BUG FOR GMT TIME FORMATTING
				if (VMM.Browser.browser == "Firefox") {
					if (int_obj.date.getFullYear() == "1970" && int_obj.date.getTimezoneOffset() != _timezone_offset) {
						
						trace("FIREFOX 1970 TIMEZONE OFFSET " + int_obj.date.getTimezoneOffset() + " SHOULD BE " + _timezone_offset);
						trace(_interval.type + " " + _interval.date);
						
						// try and fix firefox bug, if not the flag will catch it
						firefox.offset = (int_obj.date.getTimezoneOffset()/60);
						firefox.flag = true;
						int_obj.date.setHours(int_obj.date.getHours() + firefox.offset );
						
					} else if (firefox.flag) {
						// catch the bug the second time around
						firefox.flag = false;
						int_obj.date.setHours(int_obj.date.getHours() + firefox.offset );
						if (_is_year) {
							firefox.flag = true;
						}
					}
					
				}
				
				if (_is_year) {
					if ( int_obj.date.getFullYear() < 0 ) {
						int_obj.date_string = 	Math.abs( int_obj.date.getFullYear() ).toString() + " B.C.";
					} else {
						int_obj.date_string = int_obj.date.getFullYear();
					}
				} else {
					int_obj.date_string = VMM.Date.prettyDate(int_obj.date, true);
				}
				
				// Increment Time
				inc_time = inc_time + 1;
				
				// No longer first run
				_first_run = false;
				
				int_obj.relative_pos = positionRelative(interval, int_obj.date);
				_last_pos = int_obj.relative_pos.begin;
				if (int_obj.relative_pos.begin > _largest_pos) {
					_largest_pos = int_obj.relative_pos.begin;
				}
				
				// Add the time string to the element and position it.
				VMM.appendElement(int_obj.element, int_obj.date_string);
				VMM.Lib.css(int_obj.element, "text-indent", -(VMM.Lib.width(int_obj.element)/2));
				VMM.Lib.css(int_obj.element, "opacity", "0");
				
				// add the interval element to the array
				_array.push(int_obj);
				
			}
			
			VMM.Lib.width($timeintervalminor_minor, _largest_pos);
			
			positionInterval(_element_parent, _array);
			
			
			
		}
		
		/* BUILD
		================================================== */
		function build() {
			var i	= 0,
				j	= 0;
				
			VMM.attachElement(layout, "");
			
			$timenav					= VMM.appendAndGetElement(layout, "<div>", "timenav");
			$content					= VMM.appendAndGetElement($timenav, "<div>", "content");
			$time						= VMM.appendAndGetElement($timenav, "<div>", "time");
			$timeintervalminor			= VMM.appendAndGetElement($time, "<div>", "time-interval-minor");
			$timeintervalminor_minor	= VMM.appendAndGetElement($timeintervalminor, "<div>", "minor");
			$timeintervalmajor			= VMM.appendAndGetElement($time, "<div>", "time-interval-major");
			$timeinterval				= VMM.appendAndGetElement($time, "<div>", "time-interval");
			$timebackground				= VMM.appendAndGetElement(layout, "<div>", "timenav-background");
			$timenavline				= VMM.appendAndGetElement($timebackground, "<div>", "timenav-line");
			$timenavindicator			= VMM.appendAndGetElement($timebackground, "<div>", "timenav-indicator");
			$timeintervalbackground		= VMM.appendAndGetElement($timebackground, "<div>", "timenav-interval-background", "<div class='top-highlight'></div>");
			$toolbar					= VMM.appendAndGetElement(layout, "<div>", "vco-toolbar");
			
			
			buildInterval();
			buildMarkers();
			buildEras();
			calculateMultiplier();
			positionMarkers(false);
			positionEras();
			
			positionInterval($timeinterval, interval_array, false, true);
			positionInterval($timeintervalmajor, interval_major_array);
			
			
			if (config.start_page) {
				$backhome = VMM.appendAndGetElement($toolbar, "<div>", "back-home", "<div class='icon'></div>");
				VMM.bindEvent(".back-home", onBackHome, "click");
				VMM.Lib.attribute($backhome, "title", VMM.master_config.language.messages.return_to_title);
				VMM.Lib.attribute($backhome, "rel", "timeline-tooltip");
				
			}
			
			
			// MAKE TIMELINE DRAGGABLE/TOUCHABLE
			$dragslide = new VMM.DragSlider;
			$dragslide.createPanel(layout, $timenav, config.nav.constraint, config.touch);
			
			
			
			if (config.touch && config.start_page) {
				VMM.Lib.addClass($toolbar, "touch");
				VMM.Lib.css($toolbar, "top", 55);
				VMM.Lib.css($toolbar, "left", 10);
			} else {
				if (config.start_page) {
					VMM.Lib.css($toolbar, "top", 27);
				}
				$zoomin		= VMM.appendAndGetElement($toolbar, "<div>", "zoom-in", "<div class='icon'></div>");
				$zoomout	= VMM.appendAndGetElement($toolbar, "<div>", "zoom-out", "<div class='icon'></div>");
				// ZOOM EVENTS
				VMM.bindEvent($zoomin, onZoomIn, "click");
				VMM.bindEvent($zoomout, onZoomOut, "click");
				// TOOLTIP
				VMM.Lib.attribute($zoomin, "title", VMM.master_config.language.messages.expand_timeline);
				VMM.Lib.attribute($zoomin, "rel", "timeline-tooltip");
				VMM.Lib.attribute($zoomout, "title", VMM.master_config.language.messages.contract_timeline);
				VMM.Lib.attribute($zoomout, "rel", "timeline-tooltip");
				$toolbar.tooltip({selector: "div[rel=timeline-tooltip]", placement: "right"});
				
				
				// MOUSE EVENTS
				VMM.bindEvent(layout, onMouseScroll, 'DOMMouseScroll');
				VMM.bindEvent(layout, onMouseScroll, 'mousewheel');
			}
			
			
			
			// USER CONFIGURABLE ADJUSTMENT TO DEFAULT ZOOM
			if (config.nav.zoom.adjust != 0) {
				if (config.nav.zoom.adjust < 0) {
					for(i = 0; i < Math.abs(config.nav.zoom.adjust); i++) {
						onZoomOut();
					}
				} else {
					for(j = 0; j < config.nav.zoom.adjust; j++) {
						onZoomIn();
					}
				}
			}
			
			//VMM.fireEvent(layout, "LOADED");
			_active = true;
			
			reSize(true);
			VMM.fireEvent(layout, "LOADED");
			
		};
		
		function buildInterval() {
			var i	= 0,
				j	= 0;
			// CALCULATE INTERVAL
			timespan = getDateFractions((data[data.length - 1].enddate) - (data[0].startdate), true);
			trace(timespan);
			calculateInterval();

			/* DETERMINE DEFAULT INTERVAL TYPE
				millenium, ages, epoch, era and eon are not optimized yet. They may never be.
			================================================== */
			/*
			if (timespan.eons				>		data.length / config.nav.density) {
				interval					=		interval_calc.eon;
				interval_major				=		interval_calc.eon;
				interval_macro				=		interval_calc.era;
			} else if (timespan.eras		>		data.length / config.nav.density) {
				interval					=		interval_calc.era;
				interval_major				=		interval_calc.eon;
				interval_macro				=		interval_calc.epoch;
			} else if (timespan.epochs		>		data.length / config.nav.density) {
				interval					=		interval_calc.epoch;
				interval_major				=		interval_calc.era;
				interval_macro				=		interval_calc.age;
			} else if (timespan.ages		>		data.length / config.nav.density) {
				interval					=		interval_calc.ages;
				interval_major				=		interval_calc.epoch;
				interval_macro				=		interval_calc.millenium;
			} else if (timespan.milleniums			>		data.length / config.nav.density) {
				interval					=		interval_calc.millenium;
				interval_major				=		interval_calc.age;
				interval_macro				=		interval_calc.century;
			} else 
			*/
			if (timespan.centuries			>		data.length / config.nav.density) {
				interval					=		interval_calc.century;
				interval_major				=		interval_calc.millenium;
				interval_macro				=		interval_calc.decade;
			} else if (timespan.decades		>		data.length / config.nav.density) {
				interval					=		interval_calc.decade;
				interval_major				=		interval_calc.century;
				interval_macro				=		interval_calc.year;
			} else if (timespan.years		>		data.length / config.nav.density) {	
				interval					=		interval_calc.year;
				interval_major				=		interval_calc.decade;
				interval_macro				=		interval_calc.month;
			} else if (timespan.months		>		data.length / config.nav.density) {
				interval					=		interval_calc.month;
				interval_major				=		interval_calc.year;
				interval_macro				=		interval_calc.day;
			} else if (timespan.days		>		data.length / config.nav.density) {
				interval					=		interval_calc.day;
				interval_major				=		interval_calc.month;
				interval_macro				=		interval_calc.hour;
			} else if (timespan.hours		>		data.length / config.nav.density) {
				interval					=		interval_calc.hour;
				interval_major				=		interval_calc.day;
				interval_macro				=		interval_calc.minute;
			} else if (timespan.minutes		>		data.length / config.nav.density) {
				interval					=		interval_calc.minute;
				interval_major				=		interval_calc.hour;
				interval_macro				=		interval_calc.second;
			} else if (timespan.seconds		>		data.length / config.nav.density) {
				interval					=		interval_calc.second;
				interval_major				=		interval_calc.minute;
				interval_macro				=		interval_calc.second;
			} else {
				trace("NO IDEA WHAT THE TYPE SHOULD BE");
				interval					=		interval_calc.day;
				interval_major				=		interval_calc.month;
				interval_macro				=		interval_calc.hour;
			}
			
			trace("INTERVAL TYPE: " + interval.type);
			trace("INTERVAL MAJOR TYPE: " + interval_major.type);
			
			createIntervalElements(interval, interval_array, $timeinterval);
			createIntervalElements(interval_major, interval_major_array, $timeintervalmajor);
			
			// Cleanup duplicate interval elements between normal and major
			for(i = 0; i < interval_array.length; i++) {
				for(j = 0; j < interval_major_array.length; j++) {
					if (interval_array[i].date_string == interval_major_array[j].date_string) {
						VMM.attachElement(interval_array[i].element, "");
					}
				}
			}
		}
		
		function buildMarkers() {
			
			var row			= 2,
				lpos		= 0,
				row_depth	= 0,
				i			= 0,
				k			= 0,
				l			= 0;
				
				
			markers			= [];
			era_markers		= [];
			
			for(i = 0; i < data.length; i++) {
				
				var _marker,
					_marker_flag,
					_marker_content,
					_marker_dot,
					_marker_line,
					_marker_line_event,
					_marker_obj,
					_marker_title		= "",
					has_title			= false;
				
				
				_marker					= VMM.appendAndGetElement($content, "<div>", "marker");
				_marker_flag			= VMM.appendAndGetElement(_marker, "<div>", "flag");
				_marker_content			= VMM.appendAndGetElement(_marker_flag, "<div>", "flag-content");
				_marker_dot				= VMM.appendAndGetElement(_marker, "<div>", "dot");
				_marker_line			= VMM.appendAndGetElement(_marker, "<div>", "line");
				_marker_line_event		= VMM.appendAndGetElement(_marker_line, "<div>", "event-line");
				_marker_relative_pos	= positionRelative(interval, data[i].startdate, data[i].enddate);
				_marker_thumb			= "";
				
				// THUMBNAIL
				if (data[i].asset != null && data[i].asset != "") {
					VMM.appendElement(_marker_content, VMM.MediaElement.thumbnail(data[i].asset, 24, 24, data[i].uniqueid));
				} else {
					VMM.appendElement(_marker_content, "<div style='margin-right:7px;height:50px;width:2px;float:left;'></div>");
				}
				
				// ADD DATE AND TITLE
				if (data[i].title == "" || data[i].title == " " ) {
					trace("TITLE NOTHING")
					if (typeof data[i].slug != 'undefined' && data[i].slug != "") {
						trace("SLUG")
						_marker_title = VMM.Util.untagify(data[i].slug);
						has_title = true;
					} else {
						var m = VMM.MediaType(data[i].asset.media);
						if (m.type == "quote" || m.type == "unknown") {
							_marker_title = VMM.Util.untagify(m.id);
							has_title = true;
						} else {
							has_title = false;
						}
					}
				} else if (data[i].title != "" || data[i].title != " ") {
					trace(data[i].title)
					_marker_title = VMM.Util.untagify(data[i].title);
					has_title = true;
				} else {
					trace("TITLE SLUG NOT FOUND " + data[i].slug)
				}
				
				if (has_title) {
					VMM.appendElement(_marker_content, "<h3>" + _marker_title + "</h3>");
				} else {
					VMM.appendElement(_marker_content, "<h3>" + _marker_title + "</h3>");
					VMM.appendElement(_marker_content, "<h3 id='marker_content_" + data[i].uniqueid + "'>" + _marker_title + "</h3>");
				}
				
				// ADD ID
				VMM.Lib.attr(_marker, "id", ( "marker_" + data[i].uniqueid).toString() );
				
				// MARKER CLICK
				VMM.bindEvent(_marker_flag, onMarkerClick, "", {number: i});
				VMM.bindEvent(_marker_flag, onMarkerHover, "mouseenter mouseleave", {number: i, elem:_marker_flag});
				
				_marker_obj = {
					marker: 			_marker,
					flag: 				_marker_flag,
					lineevent: 			_marker_line_event,
					type: 				"marker",
					full:				true,
					relative_pos:		_marker_relative_pos,
					tag:				data[i].tag,
					pos_left:			0
				};
				
				
				if (data[i].type == "start") {
					trace("BUILD MARKER HAS START PAGE");
					config.start_page = true;
					_marker_obj.type = "start";
				}
				
				if (data[i].type == "storify") {
					_marker_obj.type = "storify";
				}
				
				
				if (data[i].tag) {
					tags.push(data[i].tag);
				}
				
				markers.push(_marker_obj);
				
				
				
			}
			
			// CREATE TAGS
			tags = VMM.Util.deDupeArray(tags);
			if (tags.length > 3) {
				config.nav.rows.current = config.nav.rows.half;
			} else {
				config.nav.rows.current = config.nav.rows.full;
			}
			for(k = 0; k < tags.length; k++) {
				if (k < config.nav.rows.current.length) {
					var tag_element = VMM.appendAndGetElement($timebackground, "<div>", "timenav-tag");
					VMM.Lib.addClass(tag_element, "timenav-tag-row-" + (k+1));
					if (tags.length > 3) {
						VMM.Lib.addClass(tag_element, "timenav-tag-size-half");
					} else {
						VMM.Lib.addClass(tag_element, "timenav-tag-size-full");
					}
					VMM.appendElement(tag_element, "<div><h3>" + tags[k] + "</h3></div>");
				}
				
			}
			
			// RESIZE FLAGS IF NEEDED
			if (tags.length > 3) {
				for(l = 0; l < markers.length; l++) {
					VMM.Lib.addClass(markers[l].flag, "flag-small");
					markers[l].full = false;
				}
			}

			
		}
		
		function buildEras() {
			var number_of_colors	= 6,
				current_color		= 0,
				j					= 0;
			// CREATE ERAS
			for(j = 0; j < eras.length; j++) {
				var era = {
						content: 			VMM.appendAndGetElement($content, "<div>", "era"),
						text_content: 		VMM.appendAndGetElement($timeinterval, "<div>", "era"),
						startdate: 			VMM.Date.parse(eras[j].startDate),
						enddate: 			VMM.Date.parse(eras[j].endDate),
						title: 				eras[j].headline,
						uniqueid: 			VMM.Util.unique_ID(6),
						tag:				"",
						relative_pos:	 	""
					},
					st						= VMM.Date.prettyDate(era.startdate),
					en						= VMM.Date.prettyDate(era.enddate),
					era_text				= "<div>&nbsp;</div>";
					
				if (typeof eras[j].tag != "undefined") {
					era.tag = eras[j].tag;
				}
				
				era.relative_pos = positionRelative(interval, era.startdate, era.enddate);
				
				VMM.Lib.attr(era.content, "id", era.uniqueid);
				VMM.Lib.attr(era.text_content, "id", era.uniqueid + "_text");
				
				// Background Color
				VMM.Lib.addClass(era.content, "era"+(current_color+1));
				VMM.Lib.addClass(era.text_content, "era"+(current_color+1));
				
				if (current_color < number_of_colors) {
					current_color++;
				} else {
					current_color = 0;
				}
				
				VMM.appendElement(era.content, era_text);
				VMM.appendElement(era.text_content, VMM.Util.unlinkify(era.title));
				
				era_markers.push(era);
				
			}
			
		}
		
	};
	
}


/* **********************************************
     Begin VMM.Timeline.DataObj.js
********************************************** */

/*	VMM.Timeline.DataObj.js
    TIMELINE SOURCE DATA PROCESSOR
================================================== */

if (typeof VMM.Timeline !== 'undefined' && typeof VMM.Timeline.DataObj == 'undefined') {
	VMM.Timeline.DataObj = {
		data_obj: {},
		model_array: [],
		getData: function (raw_data) {
			VMM.Timeline.DataObj.data_obj = {};
			VMM.fireEvent(global, VMM.Timeline.Config.events.messege, VMM.Timeline.Config.language.messages.loading_timeline);
			if (type.of(raw_data) == "object") {
				trace("DATA SOURCE: JSON OBJECT");
				VMM.Timeline.DataObj.parseJSON(raw_data);
			} else if (type.of(raw_data) == "string") {
				if (raw_data.match("%23")) {
					trace("DATA SOURCE: TWITTER SEARCH");
					VMM.Timeline.DataObj.model.tweets.getData("%23medill");
				} else if (	raw_data.match("spreadsheet") ) {
					trace("DATA SOURCE: GOOGLE SPREADSHEET");
					VMM.Timeline.DataObj.model.googlespreadsheet.getData(raw_data);
				} else if (raw_data.match("storify.com")) {
					trace("DATA SOURCE: STORIFY");
					VMM.Timeline.DataObj.model.storify.getData(raw_data);
					//http://api.storify.com/v1/stories/number10gov/g8-and-nato-chicago-summit
				} else if (raw_data.match("\.jsonp")) {
					trace("DATA SOURCE: JSONP");
					LoadLib.js(raw_data, VMM.Timeline.DataObj.onJSONPLoaded);
				} else {
					trace("DATA SOURCE: JSON");
					var req = "";
					if (raw_data.indexOf("?") > -1) {
						req = raw_data + "&callback=onJSONP_Data";
					} else {
						req = raw_data + "?callback=onJSONP_Data";
					}
					VMM.getJSON(req, VMM.Timeline.DataObj.parseJSON);
				}
			} else if (type.of(raw_data) == "html") {
				trace("DATA SOURCE: HTML");
				VMM.Timeline.DataObj.parseHTML(raw_data);
			} else {
				trace("DATA SOURCE: UNKNOWN");
			}
			
		},
		
		onJSONPLoaded: function() {
			trace("JSONP IS LOADED");
			VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, storyjs_jsonp_data);
		},
		
		parseHTML: function (d) {
			trace("parseHTML");
			trace("WARNING: THIS IS STILL ALPHA AND WILL NOT WORK WITH ID's other than #timeline");
			var _data_obj = VMM.Timeline.DataObj.data_template_obj;
			
			/*	Timeline start slide
			================================================== */
			if (VMM.Lib.find("#timeline section", "time")[0]) {
				_data_obj.timeline.startDate = VMM.Lib.html(VMM.Lib.find("#timeline section", "time")[0]);
				_data_obj.timeline.headline = VMM.Lib.html(VMM.Lib.find("#timeline section", "h2"));
				_data_obj.timeline.text = VMM.Lib.html(VMM.Lib.find("#timeline section", "article"));
				
				var found_main_media = false;
				
				if (VMM.Lib.find("#timeline section", "figure img").length != 0) {
					found_main_media = true;
					_data_obj.timeline.asset.media = VMM.Lib.attr(VMM.Lib.find("#timeline section", "figure img"), "src");
				} else if (VMM.Lib.find("#timeline section", "figure a").length != 0) {
					found_main_media = true;
					_data_obj.timeline.asset.media = VMM.Lib.attr(VMM.Lib.find("#timeline section", "figure a"), "href");
				} else {
					//trace("NOT FOUND");
				}

				if (found_main_media) {
					if (VMM.Lib.find("#timeline section", "cite").length != 0) {
						_data_obj.timeline.asset.credit = VMM.Lib.html(VMM.Lib.find("#timeline section", "cite"));
					}
					if (VMM.Lib.find(this, "figcaption").length != 0) {
						_data_obj.timeline.asset.caption = VMM.Lib.html(VMM.Lib.find("#timeline section", "figcaption"));
					}
				}
			}
			
			/*	Timeline Date Slides
			================================================== */
			VMM.Lib.each("#timeline li", function(i, elem){
				
				var valid_date = false;
				
				var _date = {
					"type":"default",
					"startDate":"",
		            "headline":"",
		            "text":"",
		            "asset":
		            {
		                "media":"",
		                "credit":"",
		                "caption":""
		            },
		            "tags":"Optional"
				};
				
				if (VMM.Lib.find(this, "time") != 0) {
					
					valid_date = true;
					
					_date.startDate = VMM.Lib.html(VMM.Lib.find(this, "time")[0]);

					if (VMM.Lib.find(this, "time")[1]) {
						_date.endDate = VMM.Lib.html(VMM.Lib.find(this, "time")[1]);
					}

					_date.headline = VMM.Lib.html(VMM.Lib.find(this, "h3"));

					_date.text = VMM.Lib.html(VMM.Lib.find(this, "article"));

					var found_media = false;
					if (VMM.Lib.find(this, "figure img").length != 0) {
						found_media = true;
						_date.asset.media = VMM.Lib.attr(VMM.Lib.find(this, "figure img"), "src");
					} else if (VMM.Lib.find(this, "figure a").length != 0) {
						found_media = true;
						_date.asset.media = VMM.Lib.attr(VMM.Lib.find(this, "figure a"), "href");
					} else {
						//trace("NOT FOUND");
					}

					if (found_media) {
						if (VMM.Lib.find(this, "cite").length != 0) {
							_date.asset.credit = VMM.Lib.html(VMM.Lib.find(this, "cite"));
						}
						if (VMM.Lib.find(this, "figcaption").length != 0) {
							_date.asset.caption = VMM.Lib.html(VMM.Lib.find(this, "figcaption"));
						}
					}
					
					trace(_date);
					_data_obj.timeline.date.push(_date);
					
				}
				
			});
			
			VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, _data_obj);
			
		},
		
		parseJSON: function(d) {
			trace("parseJSON");
			if (d.timeline.type == "default") {
				trace("DATA SOURCE: JSON STANDARD TIMELINE");
				VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, d);
			} else if (d.timeline.type == "twitter") {
				trace("DATA SOURCE: JSON TWEETS");
				VMM.Timeline.DataObj.model_Tweets.buildData(d);
				
			} else {
				trace("DATA SOURCE: UNKNOWN JSON");
				trace(type.of(d.timeline));
			};
		},
		
		/*	MODEL OBJECTS 
			New Types of Data can be formatted for the timeline here
		================================================== */
		
		model: {
			
			googlespreadsheet: {
				
				getData: function(raw) {
					var getjsondata, key, worksheet, url, timeout, tries = 0;
					
					key	= VMM.Util.getUrlVars(raw)["key"];
					worksheet = VMM.Util.getUrlVars(raw)["worksheet"];
					if (typeof worksheet == "undefined") worksheet = "od6";
					
					url	= "https://spreadsheets.google.com/feeds/list/" + key + "/" + worksheet + "/public/values?alt=json";
					
					timeout = setTimeout(function() {
						trace("Google Docs timeout " + url);
						trace(url);
						if (tries < 3) {
							VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Still waiting on Google Docs, trying again " + tries);
							tries ++;
							getjsondata.abort()
							requestJsonData();
						} else {
							VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Google Docs is not responding");
						}
					}, 16000);
					
					function requestJsonData() {
						getjsondata = VMM.getJSON(url, function(d) {
							clearTimeout(timeout);
							VMM.Timeline.DataObj.model.googlespreadsheet.buildData(d);
						})
							.error(function(jqXHR, textStatus, errorThrown) {
								if (jqXHR.status == 400) {
									VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Error reading Google spreadsheet. Check the URL and make sure it's published to the web.");
									clearTimeout(timeout);
									return;
								}
								trace("Google Docs ERROR");
								trace("Google Docs ERROR: " + textStatus + " " + jqXHR.responseText);
							})
							.success(function(d) {
								clearTimeout(timeout);
							});
					}
					
					requestJsonData();
				},
				
				buildData: function(d) {
					var data_obj	= VMM.Timeline.DataObj.data_template_obj,
						is_valid	= false;
					
					VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Parsing Google Doc Data");

					function getGVar(v) {
						if (typeof v != 'undefined') {
							return v.$t;
						} else {
							return "";
						}
					}
					if (typeof d.feed.entry == 'undefined') {
						VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Error parsing spreadsheet. Make sure you have no blank rows and that the headers have not been changed.");
					} else {
						is_valid = true;
						
						for(var i = 0; i < d.feed.entry.length; i++) {
							var dd		= d.feed.entry[i],
								dd_type	= "";
						
							if (typeof dd.gsx$type != 'undefined') {
								dd_type = dd.gsx$type.$t;
							} else if (typeof dd.gsx$titleslide != 'undefined') {
								dd_type = dd.gsx$titleslide.$t;
							}
						
							if (dd_type.match("start") || dd_type.match("title") ) {
								data_obj.timeline.startDate		= getGVar(dd.gsx$startdate);
								data_obj.timeline.headline		= getGVar(dd.gsx$headline);
								data_obj.timeline.asset.media	= getGVar(dd.gsx$media);
								data_obj.timeline.asset.caption	= getGVar(dd.gsx$mediacaption);
								data_obj.timeline.asset.credit	= getGVar(dd.gsx$mediacredit);
								data_obj.timeline.text			= getGVar(dd.gsx$text);
								data_obj.timeline.type			= "google spreadsheet";
							} else if (dd_type.match("era")) {
								var era = {
									startDate:		getGVar(dd.gsx$startdate),
									endDate:		getGVar(dd.gsx$enddate),
									headline:		getGVar(dd.gsx$headline),
									text:			getGVar(dd.gsx$text),
									tag:			getGVar(dd.gsx$tag)
								}
								data_obj.timeline.era.push(era);
							} else {
								var date = {
										type:			"google spreadsheet",
										startDate:		getGVar(dd.gsx$startdate),
										endDate:		getGVar(dd.gsx$enddate),
										headline:		getGVar(dd.gsx$headline),
										text:			getGVar(dd.gsx$text),
										tag:			getGVar(dd.gsx$tag),
										asset: {
											media:		getGVar(dd.gsx$media),
											credit:		getGVar(dd.gsx$mediacredit),
											caption:	getGVar(dd.gsx$mediacaption),
											thumbnail:	getGVar(dd.gsx$mediathumbnail)
										}
								};
							
								data_obj.timeline.date.push(date);
							}
						};
						
					}
					
					
					if (is_valid) {
						VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Finished Parsing Data");
						VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, data_obj);
					} else {
						VMM.fireEvent(global, VMM.Timeline.Config.events.messege, VMM.Language.messages.loading + " Google Doc Data (cells)");
						trace("There may be too many entries. Still trying to load data. Now trying to load cells to avoid Googles limitation on cells");
						VMM.Timeline.DataObj.model.googlespreadsheet.getDataCells(d.feed.link[0].href);
					}
				},
				
				getDataCells: function(raw) {
					var getjsondata, key, url, timeout, tries = 0;
					
					key	= VMM.Util.getUrlVars(raw)["key"];
					url	= "https://spreadsheets.google.com/feeds/cells/" + key + "/od6/public/values?alt=json";
					
					timeout = setTimeout(function() {
						trace("Google Docs timeout " + url);
						trace(url);
						if (tries < 3) {
							VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Still waiting on Google Docs, trying again " + tries);
							tries ++;
							getjsondata.abort()
							requestJsonData();
						} else {
							VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Google Docs is not responding");
						}
					}, 16000);
					
					function requestJsonData() {
						getjsondata = VMM.getJSON(url, function(d) {
							clearTimeout(timeout);
							VMM.Timeline.DataObj.model.googlespreadsheet.buildDataCells(d);
						})
							.error(function(jqXHR, textStatus, errorThrown) {
								trace("Google Docs ERROR");
								trace("Google Docs ERROR: " + textStatus + " " + jqXHR.responseText);
							})
							.success(function(d) {
								clearTimeout(timeout);
							});
					}
					
					requestJsonData();
				},
				
				buildDataCells: function(d) {
					var data_obj	= VMM.Timeline.DataObj.data_template_obj,
						is_valid	= false,
						cellnames	= ["timeline"],
						list 		= [],
						max_row		= 0,
						i			= 0,
						k			= 0;
					
					VMM.fireEvent(global, VMM.Timeline.Config.events.messege, VMM.Language.messages.loading_timeline + " Parsing Google Doc Data (cells)");

					function getGVar(v) {
						if (typeof v != 'undefined') {
							return v.$t;
						} else {
							return "";
						}
					}
					
					if (typeof d.feed.entry != 'undefined') {
						is_valid = true;
						
						// DETERMINE NUMBER OF ROWS
						for(i = 0; i < d.feed.entry.length; i++) {
							var dd				= d.feed.entry[i];
							
							if (parseInt(dd.gs$cell.row) > max_row) {
								max_row = parseInt(dd.gs$cell.row);
							}
						}
						
						// CREATE OBJECT FOR EACH ROW
						for(var i = 0; i < max_row + 1; i++) {
							var date = {
								type:			"",
								startDate:		"",
								endDate:		"",
								headline:		"",
								text:			"",
								tag:			"",
								asset: {
									media:		"",
									credit:		"",
									caption:	"",
									thumbnail:	""
								}
							};
							list.push(date);
						}
						
						// PREP GOOGLE DOC CELL DATA TO EVALUATE
						for(i = 0; i < d.feed.entry.length; i++) {
							var dd				= d.feed.entry[i],
								dd_type			= "",
								column_name		= "",
								cell = {
									content: 	getGVar(dd.gs$cell),
									col: 		dd.gs$cell.col,
									row: 		dd.gs$cell.row,
									name: 		""
								};
								
							//trace(cell);
							
							if (cell.row == 1) {
								if (cell.content == "Start Date") {
									column_name = "startDate";
								} else if (cell.content == "End Date") {
									column_name = "endDate";
								} else if (cell.content == "Headline") {
									column_name = "headline";
								} else if (cell.content == "Text") {
									column_name = "text";
								} else if (cell.content == "Media") {
									column_name = "media";
								} else if (cell.content == "Media Credit") {
									column_name = "credit";
								} else if (cell.content == "Media Caption") {
									column_name = "caption";
								} else if (cell.content == "Media Thumbnail") {
									column_name = "thumbnail";
								} else if (cell.content == "Type") {
									column_name = "type";
								} else if (cell.content == "Tag") {
									column_name = "tag";
								}
								
								cellnames.push(column_name);
								
							} else {
								cell.name = cellnames[cell.col];
								list[cell.row][cell.name] = cell.content;
							}
							
						};
						

						for(i = 0; i < list.length; i++) {
							var date	= list[i];
							if (date.type.match("start") || date.type.match("title") ) {
								data_obj.timeline.startDate		= date.startDate;
								data_obj.timeline.headline		= date.headline;
								data_obj.timeline.asset.media	= date.media;
								data_obj.timeline.asset.caption	= date.caption;
								data_obj.timeline.asset.credit	= date.credit;
								data_obj.timeline.text			= date.text;
								data_obj.timeline.type			= "google spreadsheet";
							} else if (date.type.match("era")) {
								var era = {
									startDate:		date.startDate,
									endDate:		date.endDate,
									headline:		date.headline,
									text:			date.text,
									tag:			date.tag
								}
								data_obj.timeline.era.push(era);
							} else {
								if (date.startDate) {

									var date = {
											type:			"google spreadsheet",
											startDate:		date.startDate,
											endDate:		date.endDate,
											headline:		date.headline,
											text:			date.text,
											tag:			date.tag,
											asset: {
												media:		date.media,
												credit:		date.credit,
												caption:	date.caption,
												thumbnail:	date.thumbnail
											}
									};
								
									data_obj.timeline.date.push(date);

								} else {
									trace("Skipping item " + i + " in list: no start date.")
								}
							}
							
						}
						
					}
					is_valid = data_obj.timeline.date.length > 0;
					if (is_valid) {
						VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Finished Parsing Data");
						VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, data_obj);
					} else {
						VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Unable to load Google Doc data source. Make sure you have no blank rows and that the headers have not been changed.");
					}
				}
				
			},
			
			storify: {
				
				getData: function(raw) {
					var key, url, storify_timeout;
					//http://storify.com/number10gov/g8-and-nato-chicago-summit
					//http://api.storify.com/v1/stories/number10gov/g8-and-nato-chicago-summit
					
					VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Loading Storify...");
					
					key	= raw.split("storify.com\/")[1];
					url	= "//api.storify.com/v1/stories/" + key + "?per_page=300&callback=?";
					
					storify_timeout = setTimeout(function() {
						trace("STORIFY timeout");
						VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Storify is not responding");
					}, 6000);
					
					VMM.getJSON(url, VMM.Timeline.DataObj.model.storify.buildData)
						.error(function(jqXHR, textStatus, errorThrown) {
							trace("STORIFY error");
							trace("STORIFY ERROR: " + textStatus + " " + jqXHR.responseText);
						})
						.success(function(d) {
							clearTimeout(storify_timeout);
						});
					
				},
				
				buildData: function(d) {
					VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Parsing Data");
					var _data_obj = VMM.Timeline.DataObj.data_template_obj;
					
					_data_obj.timeline.startDate	= 	new Date(d.content.date.created);;
					_data_obj.timeline.headline		= 	d.content.title;
					
					trace(d);
					//d.permalink
					var tt			=	"";
					var t_name		=	d.content.author.username;
					var t_nickname	=	"";
					if (typeof d.content.author.name != 'undefined') {
						t_name		=	d.content.author.name;
						t_nickname	=	d.content.author.username + "&nbsp;";
					}
					if (typeof d.content.description != 'undefined' && d.content.description != null) {
						tt			+=	d.content.description;
					}
					
					tt				+=	"<div class='storify'>"
					//tt				 += " <a href='" + d.content.permalink + "' target='_blank' alt='link to original story' title='link to original story'>" + "<span class='created-at'></span>" + " </a>";
					
					tt				+=	"<div class='vcard author'><a class='screen-name url' href='" + d.content.author.permalink + "' target='_blank'>";
					
					tt				+=	"<span class='avatar'><img src='" + d.content.author.avatar + "' style='max-width: 32px; max-height: 32px;'></span>"
					tt				+=	"<span class='fn'>" + t_name + "</span>";
					tt				+=	"<span class='nickname'>" + t_nickname + "<span class='thumbnail-inline'></span></span>";
					tt				+=	"</a>";
					//tt				+=	"<span class='nickname'>" + d.content.author.stats.stories + " Stories</span>";
					//tt				+=	"<span class='nickname'>" + d.content.author.stats.subscribers + " Subscribers</span>";
					tt				+=	"</div>"
					tt				+=	"</div>";
					
					_data_obj.timeline.text = tt;
					_data_obj.timeline.asset.media = d.content.thumbnail;
					
					//_data_obj.timeline.asset.media = 		dd.gsx$media.$t;
					//_data_obj.timeline.asset.caption = 		dd.gsx$mediacaption.$t;
					//_data_obj.timeline.asset.credit = 		dd.gsx$mediacredit.$t;
					_data_obj.timeline.type = 				"storify";
					
					for(var i = 0; i < d.content.elements.length; i++) {
						var dd = d.content.elements[i];
						var is_text = false;
						var d_date = new Date(dd.posted_at);
						//trace(tempdat);
						trace(dd.type);
						//trace(dd);
						var _date = {
							"type": 		"storify",
							"startDate": 	dd.posted_at,
							"endDate": 		dd.posted_at,
				            "headline": 	" ",
							"slug": 		"", 
				            "text": 		"",
				            "asset": {
								"media": 	"", 
								"credit": 	"", 
								"caption": 	"" 
							}
						};
						
						/*	MEDIA
						================================================== */
						if (dd.type == "image") {
							
							if (typeof dd.source.name != 'undefined') {
								if (dd.source.name == "flickr") {
									_date.asset.media		=	"//flickr.com/photos/" + dd.meta.pathalias + "/" + dd.meta.id + "/";
									_date.asset.credit		=	"<a href='" + _date.asset.media + "'>" + dd.attribution.name + "</a>";
									_date.asset.credit		+=	" on <a href='" + dd.source.href + "'>" + dd.source.name + "</a>";
								} else if (dd.source.name	==	"instagram") {
									_date.asset.media		=	dd.permalink;
									_date.asset.credit		=	"<a href='" + dd.permalink + "'>" + dd.attribution.name + "</a>";
									_date.asset.credit		+=	" on <a href='" + dd.source.href + "'>" + dd.source.name + "</a>";
								} else {
									_date.asset.credit		=	"<a href='" + dd.permalink + "'>" + dd.attribution.name + "</a>";
									
									if (typeof dd.source.href != 'undefined') {
										_date.asset.credit	+=	" on <a href='" + dd.source.href + "'>" + dd.source.name + "</a>";
									}
									
									_date.asset.media		=	dd.data.image.src;
								}
							} else {
								_date.asset.credit			=	"<a href='" + dd.permalink + "'>" + dd.attribution.name + "</a>";
								_date.asset.media			=	dd.data.image.src;
							}
							
							_date.slug	 					=	dd.attribution.name;
							if (typeof dd.data.image.caption != 'undefined') {
								if (dd.data.image.caption != 'undefined') {
									_date.asset.caption				=	dd.data.image.caption;
									_date.slug	 					=	dd.data.image.caption;
								}
							}
							
						} else if (dd.type == "quote") {
							if (dd.permalink.match("twitter")) {
								_date.asset.media	=	dd.permalink; 
								_date.slug = VMM.Util.untagify(dd.data.quote.text);
							} else if (dd.permalink.match("storify")) {
								is_text = true;
								_date.asset.media	=	"<blockquote>" + dd.data.quote.text.replace(/<\s*\/?\s*b\s*.*?>/g,"") + "</blockquote>";
							}
						} else if (dd.type == "link") {
							_date.headline		=	dd.data.link.title;
							_date.text			=	dd.data.link.description;
							if (dd.data.link.thumbnail != 'undefined' && dd.data.link.thumbnail != '') {
								_date.asset.media	=	dd.data.link.thumbnail;
							} else {
								_date.asset.media	=	dd.permalink;
							}
							//_date.asset.media	=	dd.permalink;
							_date.asset.caption	=	"<a href='" + dd.permalink + "' target='_blank'>" + dd.data.link.title + "</a>"
							_date.slug			=	dd.data.link.title;
							
						} else if (dd.type == "text") {
							if (dd.permalink.match("storify")) {
								is_text = true;
								var d_name		=	d.content.author.username;
								var d_nickname	=	"";
								if (typeof dd.attribution.name != 'undefined') {
									t_name		=	dd.attribution.name;
									t_nickname	=	dd.attribution.username + "&nbsp;";
								}
								
								var asset_text	=	"<div class='storify'>"
								asset_text		+=	"<blockquote><p>" + dd.data.text.replace(/<\s*\/?\s*b\s*.*?>/g,"") + "</p></blockquote>";
								//asset_text		+=	" <a href='" + dd.attribution.href + "' target='_blank' alt='link to author' title='link to author'>" + "<span class='created-at'></span>" + " </a>";

								asset_text		+=	"<div class='vcard author'><a class='screen-name url' href='" + dd.attribution.href + "' target='_blank'>";
								asset_text		+=	"<span class='avatar'><img src='" + dd.attribution.thumbnail + "' style='max-width: 32px; max-height: 32px;'></span>"
								asset_text		+=	"<span class='fn'>" + t_name + "</span>";
								asset_text		+=	"<span class='nickname'>" + t_nickname + "<span class='thumbnail-inline'></span></span>";
								asset_text		+=	"</a></div></div>";
								_date.text		=	asset_text;
								
								// Try and put it before the element where it is expected on storify
								if ( (i+1) >= d.content.elements.length ) {
									_date.startDate = d.content.elements[i-1].posted_at;
									
								} else {
									if (d.content.elements[i+1].type == "text" && d.content.elements[i+1].permalink.match("storify")) {
										if ( (i+2) >= d.content.elements.length ) {
											_date.startDate = d.content.elements[i-1].posted_at;
										} else {
											if (d.content.elements[i+2].type == "text" && d.content.elements[i+2].permalink.match("storify")) {
												if ( (i+3) >= d.content.elements.length ) {
													_date.startDate = d.content.elements[i-1].posted_at;
												} else {
													if (d.content.elements[i+3].type == "text" && d.content.elements[i+3].permalink.match("storify")) {
														_date.startDate = d.content.elements[i-1].posted_at;
													} else {
														trace("LEVEL 3");
														_date.startDate = d.content.elements[i+3].posted_at;
													}
												}
											} else {
												trace("LEVEL 2");
												_date.startDate = d.content.elements[i+2].posted_at;
											}
										}
									} else {
										trace("LEVEL 1");
										_date.startDate = d.content.elements[i+1].posted_at;
									}
									
								}
								_date.endDate = _date.startDate
							}
							
							
						} else if (dd.type == "video") {
							_date.headline		=	dd.data.video.title;
							_date.asset.caption	=	dd.data.video.description;
							_date.asset.caption	=	dd.source.username;
							_date.asset.media	=	dd.data.video.src;
						} else {
							trace("NO MATCH ");
							trace(dd);
						}
						
						if (is_text) {
							_date.slug = VMM.Util.untagify(dd.data.text);
						}
						
						_data_obj.timeline.date.push(_date);
						
						
					};
				
					VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, _data_obj);
				}
				
			},
			
			tweets: {
				
				type: "twitter",
			
				buildData: function(raw_data) {
					VMM.bindEvent(global, VMM.Timeline.DataObj.model.tweets.onTwitterDataReady, "TWEETSLOADED");
					VMM.ExternalAPI.twitter.getTweets(raw_data.timeline.tweets);
				},
			
				getData: function(raw_data) {
					VMM.bindEvent(global, VMM.Timeline.DataObj.model.tweets.onTwitterDataReady, "TWEETSLOADED");
					VMM.ExternalAPI.twitter.getTweetSearch(raw_data);
				},
			
				onTwitterDataReady: function(e, d) {
					var _data_obj = VMM.Timeline.DataObj.data_template_obj;

					for(var i = 0; i < d.tweetdata.length; i++) {

						var _date = {
							"type":"tweets",
							"startDate":"",
				            "headline":"",
				            "text":"",
				            "asset":
				            {
				                "media":"",
				                "credit":"",
				                "caption":""
				            },
				            "tags":"Optional"
						};
						// pass in the 'created_at' string returned from twitter //
						// stamp arrives formatted as Tue Apr 07 22:52:51 +0000 2009 //
					
						//var twit_date = VMM.ExternalAPI.twitter.parseTwitterDate(d.tweetdata[i].raw.created_at);
						//trace(twit_date);
					
						_date.startDate = d.tweetdata[i].raw.created_at;
					
						if (type.of(d.tweetdata[i].raw.from_user_name)) {
							_date.headline = d.tweetdata[i].raw.from_user_name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.from_user + "'>" + "@" + d.tweetdata[i].raw.from_user + "</a>)" ;						
						} else {
							_date.headline = d.tweetdata[i].raw.user.name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.user.screen_name + "'>" + "@" + d.tweetdata[i].raw.user.screen_name + "</a>)" ;
						}
					
						_date.asset.media = d.tweetdata[i].content;
						_data_obj.timeline.date.push(_date);
					
					};
				
					VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, _data_obj);
				}
				
			}
		},
		
		
		/*	TEMPLATE OBJECTS
		================================================== */
		data_template_obj: {  "timeline": { "headline":"", "description":"", "asset": { "media":"", "credit":"", "caption":"" }, "date": [], "era":[] } },
		date_obj: {"startDate":"2012,2,2,11,30", "headline":"", "text":"", "asset": {"media":"http://youtu.be/vjVfu8-Wp6s", "credit":"", "caption":"" }, "tags":"Optional"}
	
	};
	
}

/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* **********************************************
     Begin VMM.js
********************************************** *//**
	* VéritéCo JS Core
	* Designed and built by Zach Wise at VéritéCo zach@verite.co

	* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/.

*//*	Simple JavaScript Inheritance
	By John Resig http://ejohn.org/
	MIT Licensed.
================================================== */function trace(e){VMM.debug&&(window.console?console.log(e):typeof jsTrace!="undefined"&&jsTrace.send(e))}function onYouTubePlayerAPIReady(){trace("GLOBAL YOUTUBE API CALLED");VMM.ExternalAPI.youtube.onAPIReady()}(function(){var e=!1,t=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(n){function o(){!e&&this.init&&this.init.apply(this,arguments)}var r=this.prototype;e=!0;var i=new this;e=!1;for(var s in n)i[s]=typeof n[s]=="function"&&typeof r[s]=="function"&&t.test(n[s])?function(e,t){return function(){var n=this._super;this._super=r[e];var i=t.apply(this,arguments);this._super=n;return i}}(s,n[s]):n[s];o.prototype=i;o.prototype.constructor=o;o.extend=arguments.callee;return o}})();var global=function(){return this||(1,eval)("this")}();if(typeof VMM=="undefined"){var VMM=Class.extend({});VMM.debug=!0;VMM.master_config={init:function(){return this},sizes:{api:{width:0,height:0}},vp:"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",api_keys_master:{flickr:"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",google:"uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U=",twitter:""},timers:{api:7e3},api:{pushques:[]},twitter:{active:!1,array:[],api_loaded:!1,que:[]},flickr:{active:!1,array:[],api_loaded:!1,que:[]},youtube:{active:!1,array:[],api_loaded:!1,que:[]},vimeo:{active:!1,array:[],api_loaded:!1,que:[]},vine:{active:!1,array:[],api_loaded:!1,que:[]},webthumb:{active:!1,array:[],api_loaded:!1,que:[]},googlemaps:{active:!1,map_active:!1,places_active:!1,array:[],api_loaded:!1,que:[]},googledocs:{active:!1,array:[],api_loaded:!1,que:[]},googleplus:{active:!1,array:[],api_loaded:!1,que:[]},wikipedia:{active:!1,array:[],api_loaded:!1,que:[],tries:0},soundcloud:{active:!1,array:[],api_loaded:!1,que:[]}}.init();VMM.createElement=function(e,t,n,r,i){var s="";if(e!=null&&e!=""){s+="<"+e;n!=null&&n!=""&&(s+=" class='"+n+"'");r!=null&&r!=""&&(s+=" "+r);i!=null&&i!=""&&(s+=" style='"+i+"'");s+=">";t!=null&&t!=""&&(s+=t);s=s+"</"+e+">"}return s};VMM.createMediaElement=function(e,t,n){var r="",i=!1;r+="<div class='media'>";if(e!=null&&e!=""){valid=!0;r+="<img src='"+e+"'>";n!=null&&n!=""&&(r+=VMM.createElement("div",n,"credit"));t!=null&&t!=""&&(r+=VMM.createElement("div",t,"caption"))}r+="</div>";return r};VMM.hideUrlBar=function(){var e=window,t=e.document;if(!location.hash||!e.addEventListener){window.scrollTo(0,1);var n=1,r=setInterval(function(){if(t.body){clearInterval(r);n="scrollTop"in t.body?t.body.scrollTop:1;e.scrollTo(0,n===1?0:1)}},15);e.addEventListener("load",function(){setTimeout(function(){e.scrollTo(0,n===1?0:1)},0)},!1)}}}Date.prototype.getWeek=function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)};Date.prototype.getDayOfYear=function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)};var is={Null:function(e){return e===null},Undefined:function(e){return e===undefined},nt:function(e){return e===null||e===undefined},Function:function(e){return typeof e=="function"?e.constructor.toString().match(/Function/)!==null:!1},String:function(e){return typeof e=="string"?!0:typeof e=="object"?e.constructor.toString().match(/string/i)!==null:!1},Array:function(e){return typeof e=="object"?e.constructor.toString().match(/array/i)!==null||e.length!==undefined:!1},Boolean:function(e){return typeof e=="boolean"?!0:typeof e=="object"?e.constructor.toString().match(/boolean/i)!==null:!1},Date:function(e){return typeof e=="date"?!0:typeof e=="object"?e.constructor.toString().match(/date/i)!==null:!1},HTML:function(e){return typeof e=="object"?e.constructor.toString().match(/html/i)!==null:!1},Number:function(e){return typeof e=="number"?!0:typeof e=="object"?e.constructor.toString().match(/Number/)!==null:!1},Object:function(e){return typeof e=="object"?e.constructor.toString().match(/object/i)!==null:!1},RegExp:function(e){return typeof e=="function"?e.constructor.toString().match(/regexp/i)!==null:!1}},type={of:function(e){for(var t in is)if(is[t](e))return t.toLowerCase()}};if(typeof VMM!="undefined"){VMM.smoothScrollTo=function(e,t,n){if(typeof jQuery!="undefined"){var r="easein",i=1e3;t!=null&&(t<1?i=1:i=Math.round(t));n!=null&&n!=""&&(r=n);jQuery(window).scrollTop()!=VMM.Lib.offset(e).top&&VMM.Lib.animate("html,body",i,r,{scrollTop:VMM.Lib.offset(e).top})}};VMM.attachElement=function(e,t){typeof jQuery!="undefined"&&jQuery(e).html(t)};VMM.appendElement=function(e,t){typeof jQuery!="undefined"&&jQuery(e).append(t)};VMM.getHTML=function(e){var t;if(typeof jQuery!="undefined"){t=jQuery(e).html();return t}};VMM.getElement=function(e,t){var n;if(typeof jQuery!="undefined"){t?n=jQuery(e).parent().get(0):n=jQuery(e).get(0);return n}};VMM.bindEvent=function(e,t,n,r){var i,s="click",o={};n!=null&&n!=""&&(s=n);o!=null&&o!=""&&(o=r);typeof jQuery!="undefined"&&jQuery(e).bind(s,o,t)};VMM.unbindEvent=function(e,t,n){var r,i="click",s={};n!=null&&n!=""&&(i=n);typeof jQuery!="undefined"&&jQuery(e).unbind(i,t)};VMM.fireEvent=function(e,t,n){var r,i="click",s=[];t!=null&&t!=""&&(i=t);n!=null&&n!=""&&(s=n);typeof jQuery!="undefined"&&jQuery(e).trigger(i,s)};VMM.getJSON=function(e,t,n){if(typeof jQuery!="undefined"){jQuery.ajaxSetup({timeout:3e3});if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7&&window.XDomainRequest){trace("IE JSON");var r=e;if(r.match("^http://"))return jQuery.getJSON(r,t,n);if(r.match("^https://")){r=r.replace("https://","http://");return jQuery.getJSON(r,t,n)}return jQuery.getJSON(e,t,n)}return jQuery.getJSON(e,t,n)}};VMM.parseJSON=function(e){if(typeof jQuery!="undefined")return jQuery.parseJSON(e)};VMM.appendAndGetElement=function(e,t,n,r){var i,s="<div>",o="",u="",a="";t!=null&&t!=""&&(s=t);n!=null&&n!=""&&(o=n);r!=null&&r!=""&&(u=r);if(typeof jQuery!="undefined"){i=jQuery(t);i.addClass(o);i.html(u);jQuery(e).append(i)}return i};VMM.Lib={init:function(){return this},hide:function(e,t){t!=null&&t!=""?typeof jQuery!="undefined"&&jQuery(e).hide(t):typeof jQuery!="undefined"&&jQuery(e).hide()},remove:function(e){typeof jQuery!="undefined"&&jQuery(e).remove()},detach:function(e){typeof jQuery!="undefined"&&jQuery(e).detach()},append:function(e,t){typeof jQuery!="undefined"&&jQuery(e).append(t)},prepend:function(e,t){typeof jQuery!="undefined"&&jQuery(e).prepend(t)},show:function(e,t){t!=null&&t!=""?typeof jQuery!="undefined"&&jQuery(e).show(t):typeof jQuery!="undefined"&&jQuery(e).show()},load:function(e,t,n){var r={elem:e};r!=null&&r!=""&&(r=n);typeof jQuery!="undefined"&&jQuery(e).load(r,t)},addClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).addClass(t)},removeClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).removeClass(t)},attr:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).attr(t,n);else if(typeof jQuery!="undefined")return jQuery(e).attr(t)},prop:function(e,t,n){typeof jQuery=="undefined"||!/[1-9]\.[3-9].[1-9]/.test(jQuery.fn.jquery)?VMM.Lib.attribute(e,t,n):jQuery(e).prop(t,n)},attribute:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).attr(t,n);else if(typeof jQuery!="undefined")return jQuery(e).attr(t)},visible:function(e,t){if(t!=null)typeof jQuery!="undefined"&&(t?jQuery(e).show(0):jQuery(e).hide(0));else if(typeof jQuery!="undefined")return jQuery(e).is(":visible")?!0:!1},css:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).css(t,n);else if(typeof jQuery!="undefined")return jQuery(e).css(t)},cssmultiple:function(e,t){if(typeof jQuery!="undefined")return jQuery(e).css(t)},offset:function(e){var t;typeof jQuery!="undefined"&&(t=jQuery(e).offset());return t},position:function(e){var t;typeof jQuery!="undefined"&&(t=jQuery(e).position());return t},width:function(e,t){if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).width(t);else if(typeof jQuery!="undefined")return jQuery(e).width()},height:function(e,t){if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).height(t);else if(typeof jQuery!="undefined")return jQuery(e).height()},toggleClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).toggleClass(t)},each:function(e,t){typeof jQuery!="undefined"&&jQuery(e).each(t)},html:function(e,t){var n;if(typeof jQuery!="undefined"){n=jQuery(e).html();return n}if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).html(t);else{var n;if(typeof jQuery!="undefined"){n=jQuery(e).html();return n}}},find:function(e,t){if(typeof jQuery!="undefined")return jQuery(e).find(t)},stop:function(e){typeof jQuery!="undefined"&&jQuery(e).stop()},delay_animate:function(e,t,n,r,i,s){if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet"){var o=Math.round(n/1500*10)/10,u=o+"s";VMM.Lib.css(t,"-webkit-transition","all "+u+" ease");VMM.Lib.css(t,"-moz-transition","all "+u+" ease");VMM.Lib.css(t,"-o-transition","all "+u+" ease");VMM.Lib.css(t,"-ms-transition","all "+u+" ease");VMM.Lib.css(t,"transition","all "+u+" ease");VMM.Lib.cssmultiple(t,_att)}else typeof jQuery!="undefined"&&jQuery(t).delay(e).animate(i,{duration:n,easing:r})},animate:function(e,t,n,r,i,s){var o="easein",u=!1,a=1e3,f={};t!=null&&(t<1?a=1:a=Math.round(t));n!=null&&n!=""&&(o=n);i!=null&&i!=""&&(u=i);r!=null?f=r:f={opacity:0};if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet"){var l=Math.round(a/1500*10)/10,c=l+"s";o=" cubic-bezier(0.33, 0.66, 0.66, 1)";for(x in f)if(Object.prototype.hasOwnProperty.call(f,x)){trace(x+" to "+f[x]);VMM.Lib.css(e,"-webkit-transition",x+" "+c+o);VMM.Lib.css(e,"-moz-transition",x+" "+c+o);VMM.Lib.css(e,"-o-transition",x+" "+c+o);VMM.Lib.css(e,"-ms-transition",x+" "+c+o);VMM.Lib.css(e,"transition",x+" "+c+o)}VMM.Lib.cssmultiple(e,f)}else typeof jQuery!="undefined"&&(s!=null&&s!=""?jQuery(e).animate(f,{queue:u,duration:a,easing:o,complete:s}):jQuery(e).animate(f,{queue:u,duration:a,easing:o}))}}}if(typeof jQuery!="undefined"){(function(e){window.XDomainRequest&&e.ajaxTransport(function(t){if(t.crossDomain&&t.async){if(t.timeout){t.xdrTimeout=t.timeout;delete t.timeout}var n;return{send:function(r,i){function o(t,r,s,o){n.onload=n.onerror=n.ontimeout=e.noop;n=undefined;i(t,r,s,o)}n=new XDomainRequest;n.open(t.type,t.url);n.onload=function(){o(200,"OK",{text:n.responseText},"Content-Type: "+n.contentType)};n.onerror=function(){o(404,"Not Found")};if(t.xdrTimeout){n.ontimeout=function(){o(0,"timeout")};n.timeout=t.xdrTimeout}n.send(t.hasContent&&t.data||null)},abort:function(){if(n){n.onerror=e.noop();n.abort()}}}}})})(jQuery);jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,t,n,r,i){return jQuery.easing[jQuery.easing.def](e,t,n,r,i)},easeInExpo:function(e,t,n,r,i){return t==0?n:r*Math.pow(2,10*(t/i-1))+n},easeOutExpo:function(e,t,n,r,i){return t==i?n+r:r*(-Math.pow(2,-10*t/i)+1)+n},easeInOutExpo:function(e,t,n,r,i){return t==0?n:t==i?n+r:(t/=i/2)<1?r/2*Math.pow(2,10*(t-1))+n:r/2*(-Math.pow(2,-10*--t)+2)+n},easeInQuad:function(e,t,n,r,i){return r*(t/=i)*t+n},easeOutQuad:function(e,t,n,r,i){return-r*(t/=i)*(t-2)+n},easeInOutQuad:function(e,t,n,r,i){return(t/=i/2)<1?r/2*t*t+n:-r/2*(--t*(t-2)-1)+n}})}if(typeof VMM!="undefined"&&typeof VMM.Browser=="undefined"){VMM.Browser={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS";this.device=this.searchDevice(navigator.userAgent);this.orientation=this.searchOrientation(window.orientation)},searchOrientation:function(e){var t="";e==0||e==180?t="portrait":e==90||e==-90?t="landscape":t="normal";return t},searchDevice:function(e){var t="";e.match(/Android/i)||e.match(/iPhone|iPod/i)?t="mobile":e.match(/iPad/i)?t="tablet":e.match(/BlackBerry/i)||e.match(/IEMobile/i)?t="other mobile":t="desktop";return t},searchString:function(e){for(var t=0;t<e.length;t++){var n=e[t].string,r=e[t].prop;this.versionSearchString=e[t].versionSearch||e[t].identity;if(n){if(n.indexOf(e[t].subString)!=-1)return e[t].identity}else if(r)return e[t].identity}},searchVersion:function(e){var t=e.indexOf(this.versionSearchString);if(t==-1)return;return parseFloat(e.substring(t+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.userAgent,subString:"iPad",identity:"iPad"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};VMM.Browser.init()}typeof VMM!="undefined"&&typeof VMM.FileExtention=="undefined"&&(VMM.FileExtention={googleDocType:function(e){var t=e.replace(/\s\s*$/,""),n="",r=["DOC","DOCX","XLS","XLSX","PPT","PPTX","PDF","PAGES","AI","PSD","TIFF","DXF","SVG","EPS","PS","TTF","XPS","ZIP","RAR"],i=!1;n=t.substr(t.length-5,5);for(var s=0;s<r.length;s++)if(n.toLowerCase().match(r[s].toString().toLowerCase())||t.match("docs.google.com"))i=!0;return i}});if(typeof VMM!="undefined"&&typeof VMM.Date=="undefined"){VMM.Date={init:function(){return this},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."],hour:[1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12],hour_suffix:["am"],bc_format:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"dddd',' mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'"},setLanguage:function(e){trace("SET DATE LANGUAGE");VMM.Date.dateformats=e.dateformats;VMM.Date.month=e.date.month;VMM.Date.month_abbr=e.date.month_abbr;VMM.Date.day=e.date.day;VMM.Date.day_abbr=e.date.day_abbr;dateFormat.i18n.dayNames=e.date.day_abbr.concat(e.date.day);dateFormat.i18n.monthNames=e.date.month_abbr.concat(e.date.month)},parse:function(e,t){"use strict";var n,r,i,s,o={year:!1,month:!1,day:!1,hour:!1,minute:!1,second:!1,millisecond:!1};if(type.of(e)=="date"){trace("DEBUG THIS, ITs A DATE");n=e}else{n=new Date(0,0,1,0,0,0,0);if(e.match(/,/gi)){r=e.split(",");for(var u=0;u<r.length;u++)r[u]=parseInt(r[u],10);if(r[0]){n.setFullYear(r[0]);o.year=!0}if(r[1]){n.setMonth(r[1]-1);o.month=!0}if(r[2]){n.setDate(r[2]);o.day=!0}if(r[3]){n.setHours(r[3]);o.hour=!0}if(r[4]){n.setMinutes(r[4]);o.minute=!0}if(r[5]){n.setSeconds(r[5]);r[5]>=1&&(o.second=!0)}if(r[6]){n.setMilliseconds(r[6]);r[6]>=1&&(o.millisecond=!0)}}else if(e.match("/")){if(e.match(" ")){s=e.split(" ");if(e.match(":")){i=s[1].split(":");if(i[0]>=0){n.setHours(i[0]);o.hour=!0}if(i[1]>=0){n.setMinutes(i[1]);o.minute=!0}if(i[2]>=0){n.setSeconds(i[2]);o.second=!0}if(i[3]>=0){n.setMilliseconds(i[3]);o.millisecond=!0}}r=s[0].split("/")}else r=e.split("/");if(r[2]){n.setFullYear(r[2]);o.year=!0}if(r[0]>=0){n.setMonth(r[0]-1);o.month=!0}if(r[1]>=0)if(r[1].length>2){n.setFullYear(r[1]);o.year=!0}else{n.setDate(r[1]);o.day=!0}}else if(e.match("now")){var a=new Date;n.setFullYear(a.getFullYear());o.year=!0;n.setMonth(a.getMonth());o.month=!0;n.setDate(a.getDate());o.day=!0;if(e.match("hours")){n.setHours(a.getHours());o.hour=!0}if(e.match("minutes")){n.setHours(a.getHours());n.setMinutes(a.getMinutes());o.hour=!0;o.minute=!0}if(e.match("seconds")){n.setHours(a.getHours());n.setMinutes(a.getMinutes());n.setSeconds(a.getSeconds());o.hour=!0;o.minute=!0;o.second=!0}if(e.match("milliseconds")){n.setHours(a.getHours());n.setMinutes(a.getMinutes());n.setSeconds(a.getSeconds());n.setMilliseconds(a.getMilliseconds());o.hour=!0;o.minute=!0;o.second=!0;o.millisecond=!0}}else if(e.length<=8){o.year=!0;n.setFullYear(parseInt(e,10));n.setMonth(0);n.setDate(1);n.setHours(0);n.setMinutes(0);n.setSeconds(0);n.setMilliseconds(0)}else if(e.match("T"))if(navigator.userAgent.match(/MSIE\s(?!9.0)/)){s=e.split("T");if(e.match(":")){i=s[1].split(":");if(i[0]>=1){n.setHours(i[0]);o.hour=!0}if(i[1]>=1){n.setMinutes(i[1]);o.minute=!0}if(i[2]>=1){n.setSeconds(i[2]);i[2]>=1&&(o.second=!0)}if(i[3]>=1){n.setMilliseconds(i[3]);i[3]>=1&&(o.millisecond=!0)}}r=s[0].split("-");if(r[0]){n.setFullYear(r[0]);o.year=!0}if(r[1]>=0){n.setMonth(r[1]-1);o.month=!0}if(r[2]>=0){n.setDate(r[2]);o.day=!0}}else{n=new Date(Date.parse(e));o.year=!0;o.month=!0;o.day=!0;o.hour=!0;o.minute=!0;n.getSeconds()>=1&&(o.second=!0);n.getMilliseconds()>=1&&(o.millisecond=!0)}else{n=new Date(parseInt(e.slice(0,4),10),parseInt(e.slice(4,6),10)-1,parseInt(e.slice(6,8),10),parseInt(e.slice(8,10),10),parseInt(e.slice(10,12),10));o.year=!0;o.month=!0;o.day=!0;o.hour=!0;o.minute=!0;n.getSeconds()>=1&&(o.second=!0);n.getMilliseconds()>=1&&(o.millisecond=!0)}}return t!=null&&t!=""?{date:n,precision:o}:n},prettyDate:function(e,t,n,r){var i,s,o,u,a=!1,f,l,c;if(r!=null&&r!=""&&typeof r!="undefined"){a=!0;trace("D2 "+r)}if(type.of(e)=="date"){type.of(n)=="object"?n.millisecond||n.second&&e.getSeconds()>=1?t?o=VMM.Date.dateformats.time_short:o=VMM.Date.dateformats.time_short:n.minute?t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.time_no_seconds_small_date:n.hour?t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.time_no_seconds_small_date:n.day?t?o=VMM.Date.dateformats.full_short:o=VMM.Date.dateformats.full:n.month?t?o=VMM.Date.dateformats.month_short:o=VMM.Date.dateformats.month:n.year?o=VMM.Date.dateformats.year:o=VMM.Date.dateformats.year:e.getMonth()===0&&e.getDate()==1&&e.getHours()===0&&e.getMinutes()===0?o=VMM.Date.dateformats.year:e.getDate()<=1&&e.getHours()===0&&e.getMinutes()===0?t?o=VMM.Date.dateformats.month_short:o=VMM.Date.dateformats.month:e.getHours()===0&&e.getMinutes()===0?t?o=VMM.Date.dateformats.full_short:o=VMM.Date.dateformats.full:e.getMinutes()===0?t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.time_no_seconds_small_date:t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.full_long;i=dateFormat(e,o,!1);u=i.split(" ");for(var h=0;h<u.length;h++)if(parseInt(u[h],10)<0){trace("YEAR IS BC");f=u[h];l=Math.abs(parseInt(u[h],10));c=l.toString()+" B.C.";i=i.replace(f,c)}if(a){s=dateFormat(r,o,!1);u=s.split(" ");for(var p=0;p<u.length;p++)if(parseInt(u[p],10)<0){trace("YEAR IS BC");f=u[p];l=Math.abs(parseInt(u[p],10));c=l.toString()+" B.C.";s=s.replace(f,c)}}}else{trace("NOT A VALID DATE?");trace(e)}return a?i+" &mdash; "+s:i}}.init();var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,r=function(e,t){e=String(e);t=t||2;while(e.length<t)e="0"+e;return e};return function(i,s,o){var u=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(i)=="[object String]"&&!/\d/.test(i)){s=i;i=undefined}isNaN(i)&&trace("invalid date "+i);s=String(u.masks[s]||s||u.masks["default"]);if(s.slice(0,4)=="UTC:"){s=s.slice(4);o=!0}var a=o?"getUTC":"get",f=i[a+"Date"](),l=i[a+"Day"](),c=i[a+"Month"](),h=i[a+"FullYear"](),p=i[a+"Hours"](),d=i[a+"Minutes"](),v=i[a+"Seconds"](),m=i[a+"Milliseconds"](),g=o?0:i.getTimezoneOffset(),y={d:f,dd:r(f),ddd:u.i18n.dayNames[l],dddd:u.i18n.dayNames[l+7],m:c+1,mm:r(c+1),mmm:u.i18n.monthNames[c],mmmm:u.i18n.monthNames[c+12],yy:String(h).slice(2),yyyy:h,h:p%12||12,hh:r(p%12||12),H:p,HH:r(p),M:d,MM:r(d),s:v,ss:r(v),l:r(m,3),L:r(m>99?Math.round(m/10):m),t:p<12?"a":"p",tt:p<12?"am":"pm",T:p<12?"A":"P",TT:p<12?"AM":"PM",Z:o?"UTC":(String(i).match(t)||[""]).pop().replace(n,""),o:(g>0?"-":"+")+r(Math.floor(Math.abs(g)/60)*100+Math.abs(g)%60,4),S:["th","st","nd","rd"][f%10>3?0:(f%100-f%10!=10)*f%10]};return s.replace(e,function(e){return e in y?y[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};Date.prototype.format=function(e,t){return dateFormat(this,e,t)}}typeof VMM!="undefined"&&typeof VMM.Util=="undefined"&&(VMM.Util={init:function(){return this},removeRange:function(e,t,n){var r=e.slice((n||t)+1||e.length);e.length=t<0?e.length+t:t;return e.push.apply(e,r)},correctProtocol:function(e){var t=window.parent.location.protocol.toString(),n="",r=e.split("://",2);t.match("http")?n=t:n="https";return n+"://"+r[1]},mergeConfig:function(e,t){var n;for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},getObjectAttributeByIndex:function(e,t){if(typeof e!="undefined"){var n=0;for(var r in e){if(t===n)return e[r];n++}return""}return""},ordinal:function(e){return["th","st","nd","rd"][!(e%10>3||Math.floor(e%100/10)==1)*(e%10)]},randomBetween:function(e,t){return Math.floor(Math.random()*(t-e+1)+e)},average:function(e){var t={mean:0,variance:0,deviation:0},n=e.length;for(var r,i=0,s=n;s--;i+=e[s]);for(r=t.mean=i/n,s=n,i=0;s--;i+=Math.pow(e[s]-r,2));return t.deviation=Math.sqrt(t.variance=i/n),t},customSort:function(e,t){var n=e,r=t;return n==r?0:n>r?1:-1},deDupeArray:function(e){var t,n=e.length,r=[],i={};for(t=0;t<n;t++)i[e[t]]=0;for(t in i)r.push(t);return r},number2money:function(e,t,n){var t=t!==null?t:!0,n=n!==null?n:!1,r=VMM.Math2.floatPrecision(e,2),i=this.niceNumber(r);!i.split(/\./g)[1]&&n&&(i+=".00");t&&(i="$"+i);return i},wordCount:function(e){var t=e+" ",n=/^[^A-Za-z0-9\'\-]+/gi,r=t.replace(n,""),i=/[^A-Za-z0-9\'\-]+/gi,s=r.replace(i," "),o=s.split(" "),u=o.length-1;t.length<2&&(u=0);return u},ratio:{fit:function(e,t,n,r){var i={width:0,height:0};i.width=e;i.height=Math.round(e/n*r);if(i.height>t){i.height=t;i.width=Math.round(t/r*n);i.width>e&&trace("FIT: DIDN'T FIT!!! ")}return i},r16_9:function(e,t){if(e!==null&&e!=="")return Math.round(t/16*9);if(t!==null&&t!=="")return Math.round(e/9*16)},r4_3:function(e,t){if(e!==null&&e!=="")return Math.round(t/4*3);if(t!==null&&t!=="")return Math.round(e/3*4)}},doubledigit:function(e){return(e<10?"0":"")+e},truncateWords:function(e,t,n){t||(t=30);n||(n=t);var r=/^[^A-Za-z0-9\'\-]+/gi,i=e.replace(r,""),s=i.split(" "),o=[];t=Math.min(s.length,t);n=Math.min(s.length,n);for(var u=0;u<t;u++)o.push(s[u]);for(var a=t;u<n;u++){var f=s[u];o.push(f);if(f.charAt(f.length-1)==".")break}return o.join(" ")},linkify:function(e,t,n){var r=/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,i=/(^|[^\/])(www\.[\S]+(\b|$))/gim,s=/(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;return e.replace(r,"<a target='_blank' href='$&' onclick='void(0)'>$&</a>").replace(i,"$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>").replace(s,"<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>")},linkify_with_twitter:function(e,t,n){function u(e){var t=/(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;return e.replace(t,"<a href='$1' target='_blank'>$3</a>")}var r=/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,i=/(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img,s='$1$4$7$10$13<a href="$2$5$8$11$14" target="_blank" class="hyphenate">$2$5$8$11$14</a>$3$6$9$12',o=/(^|[^\/])(www\.[\S]+(\b|$))/gim,a=/(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,f=/\B@([\w-]+)/gm,l=/(#([\w]+))/g;return e.replace(i,s).replace(o,"$1<a target='_blank' class='hyphenate' onclick='void(0)' href='http://$2'>$2</a>").replace(a,"<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>").replace(f,"<a href='http://twitter.com/$1' target='_blank' onclick='void(0)'>@$1</a>")},linkify_wikipedia:function(e){var t=/<i[^>]*>(.*?)<\/i>/gim;return e.replace(t,"<a target='_blank' href='http://en.wikipedia.org/wiki/$&' onclick='void(0)'>$&</a>").replace(/<i\b[^>]*>/gim,"").replace(/<\/i>/gim,"").replace(/<b\b[^>]*>/gim,"").replace(/<\/b>/gim,"")},unlinkify:function(e){if(!e)return e;e=e.replace(/<a\b[^>]*>/i,"");e=e.replace(/<\/a>/i,"");return e},untagify:function(e){if(!e)return e;e=e.replace(/<\s*\w.*?>/g,"");return e},nl2br:function(e){return e.replace(/(\r\n|[\r\n]|\\n|\\r)/g,"<br/>")},unique_ID:function(e){var t=function(e){return Math.floor(Math.random()*e)},n=function(){var e="abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";return e.substr(t(62),1)},r=function(e){var t="";for(var r=0;r<e;r++)t+=n();return t};return r(e)},isEven:function(e){return e%2===0?!0:!1},getUrlVars:function(e){var t=e.toString();t.match("&#038;")?t=t.replace("&#038;","&"):t.match("&#38;")?t=t.replace("&#38;","&"):t.match("&amp;")&&(t=t.replace("&amp;","&"));var n=[],r,i=t.slice(t.indexOf("?")+1).split("&");for(var s=0;s<i.length;s++){r=i[s].split("=");n.push(r[0]);n[r[0]]=r[1]}return n},toHTML:function(e){e=this.nl2br(e);e=this.linkify(e);return e.replace(/\s\s/g,"&nbsp;&nbsp;")},toCamelCase:function(e,t){t!==!1&&(t=!0);var n=(t?e.toLowerCase():e).split(" ");for(var r=0;r<n.length;r++)n[r]=n[r].substr(0,1).toUpperCase()+n[r].substr(1);return n.join(" ")},properQuotes:function(e){return e.replace(/\"([^\"]*)\"/gi,"&#8220;$1&#8221;")},niceNumber:function(e){e+="";x=e.split(".");x1=x[0];x2=x.length>1?"."+x[1]:"";var t=/(\d+)(\d{3})/;while(t.test(x1))x1=x1.replace(t,"$1,$2");return x1+x2},toTitleCase:function(e){if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7)return e.replace("_","%20");var t={__smallWords:["a","an","and","as","at","but","by","en","for","if","in","of","on","or","the","to","v[.]?","via","vs[.]?"],init:function(){this.__smallRE=this.__smallWords.join("|");this.__lowerCaseWordsRE=new RegExp("\\b("+this.__smallRE+")\\b","gi");this.__firstWordRE=new RegExp("^([^a-zA-Z0-9 \\r\\n\\t]*)("+this.__smallRE+")\\b","gi");this.__lastWordRE=new RegExp("\\b("+this.__smallRE+")([^a-zA-Z0-9 \\r\\n\\t]*)$","gi")},toTitleCase:function(e){var t="",n=e.split(/([:.;?!][ ]|(?:[ ]|^)["“])/);for(var r=0;r<n.length;++r){var i=n[r];i=i.replace(/\b([a-zA-Z][a-z.'’]*)\b/g,this.__titleCaseDottedWordReplacer);i=i.replace(this.__lowerCaseWordsRE,this.__lowerReplacer);i=i.replace(this.__firstWordRE,this.__firstToUpperCase);i=i.replace(this.__lastWordRE,this.__firstToUpperCase);t+=i}t=t.replace(/ V(s?)\. /g," v$1. ");t=t.replace(/(['’])S\b/g,"$1s");t=t.replace(/\b(AT&T|Q&A)\b/ig,this.__upperReplacer);return t},__titleCaseDottedWordReplacer:function(e){return e.match(/[a-zA-Z][.][a-zA-Z]/)?e:t.__firstToUpperCase(e)},__lowerReplacer:function(e){return e.toLowerCase()},__upperReplacer:function(e){return e.toUpperCase()},__firstToUpperCase:function(e){var t=e.split(/(^[^a-zA-Z0-9]*[a-zA-Z0-9])(.*)$/);t[1]&&(t[1]=t[1].toUpperCase());return t.join("")}};t.init();e=e.replace(/_/g," ");e=t.toTitleCase(e);return e}}.init());LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);typeof VMM!="undefined"&&typeof VMM.Language=="undefined"&&(VMM.Language={lang:"en",api:{wikipedia:"en"},date:{month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Loading Timeline... ",return_to_title:"Return to Title",expand_timeline:"Expand Timeline",contract_timeline:"Contract Timeline"
,wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Loading Content",loading:"Loading"}});typeof VMM!="undefined"&&typeof VMM.ExternalAPI=="undefined"&&(VMM.ExternalAPI={keys:{google:"",flickr:"",twitter:""},keys_master:{vp:"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",flickr:"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",google:"jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",twitter:""},init:function(){return this},setKeys:function(e){VMM.ExternalAPI.keys=e},pushQues:function(){VMM.master_config.googlemaps.active&&VMM.ExternalAPI.googlemaps.pushQue();VMM.master_config.youtube.active&&VMM.ExternalAPI.youtube.pushQue();VMM.master_config.soundcloud.active&&VMM.ExternalAPI.soundcloud.pushQue();VMM.master_config.googledocs.active&&VMM.ExternalAPI.googledocs.pushQue();VMM.master_config.googleplus.active&&VMM.ExternalAPI.googleplus.pushQue();VMM.master_config.wikipedia.active&&VMM.ExternalAPI.wikipedia.pushQue();VMM.master_config.vimeo.active&&VMM.ExternalAPI.vimeo.pushQue();VMM.master_config.vine.active&&VMM.ExternalAPI.vine.pushQue();VMM.master_config.twitter.active&&VMM.ExternalAPI.twitter.pushQue();VMM.master_config.flickr.active&&VMM.ExternalAPI.flickr.pushQue();VMM.master_config.webthumb.active&&VMM.ExternalAPI.webthumb.pushQue()},twitter:{tweetArray:[],get:function(e){var t={mid:e.id,id:e.uid};VMM.master_config.twitter.que.push(t);VMM.master_config.twitter.active=!0},create:function(e,t){var n=e.mid.toString(),r={twitterid:e.mid},i="//api.twitter.com/1/statuses/show.json?id="+e.mid+"&include_entities=true&callback=?";VMM.ExternalAPI.twitter.getOEmbed(e,t)},errorTimeOut:function(e){trace("TWITTER JSON ERROR TIMEOUT "+e.mid);VMM.attachElement("#"+e.id.toString(),VMM.MediaElement.loadingmessage("Still waiting on Twitter: "+e.mid));VMM.getJSON("//api.twitter.com/1/account/rate_limit_status.json",function(t){trace("REMAINING TWITTER API CALLS "+t.remaining_hits);trace("TWITTER RATE LIMIT WILL RESET AT "+t.reset_time);var n="";if(t.remaining_hits==0){n="<p>You've reached the maximum number of tweets you can load in an hour.</p>";n+="<p>You can view tweets again starting at: <br/>"+t.reset_time+"</p>"}else n="<p>Still waiting on Twitter. "+e.mid+"</p>";VMM.attachElement("#"+e.id.toString(),VMM.MediaElement.loadingmessage(n))})},errorTimeOutOembed:function(e){trace("TWITTER JSON ERROR TIMEOUT "+e.mid);VMM.attachElement("#"+e.id.toString(),VMM.MediaElement.loadingmessage("Still waiting on Twitter: "+e.mid))},pushQue:function(){if(VMM.master_config.twitter.que.length>0){VMM.ExternalAPI.twitter.create(VMM.master_config.twitter.que[0],VMM.ExternalAPI.twitter.pushQue);VMM.Util.removeRange(VMM.master_config.twitter.que,0)}},getOEmbed:function(e,t){var n="//api.twitter.com/1/statuses/oembed.json?id="+e.mid+"&omit_script=true&include_entities=true&callback=?",r=setTimeout(VMM.ExternalAPI.twitter.errorTimeOutOembed,VMM.master_config.timers.api,e);VMM.getJSON(n,function(t){var n="",r="";n+=t.html.split("</p>&mdash;")[0]+"</p></blockquote>";r=t.author_url.split("twitter.com/")[1];n+="<div class='vcard author'>";n+="<a class='screen-name url' href='"+t.author_url+"' target='_blank'>";n+="<span class='avatar'></span>";n+="<span class='fn'>"+t.author_name+"</span>";n+="<span class='nickname'>@"+r+"<span class='thumbnail-inline'></span></span>";n+="</a>";n+="</div>";VMM.attachElement("#"+e.id.toString(),n);VMM.attachElement("#text_thumb_"+e.id.toString(),t.html);VMM.attachElement("#marker_content_"+e.id.toString(),t.html)}).error(function(t,n,i){trace("TWITTER error");trace("TWITTER ERROR: "+n+" "+t.responseText);clearTimeout(r);VMM.attachElement("#"+e.id,VMM.MediaElement.loadingmessage("ERROR LOADING TWEET "+e.mid))}).success(function(e){clearTimeout(r);t()})},getHTML:function(e){var t="//api.twitter.com/1/statuses/oembed.json?id="+e+"&omit_script=true&include_entities=true&callback=?";VMM.getJSON(t,VMM.ExternalAPI.twitter.onJSONLoaded)},onJSONLoaded:function(e){trace("TWITTER JSON LOADED");var t=e.id;VMM.attachElement("#"+t,VMM.Util.linkify_with_twitter(e.html))},parseTwitterDate:function(e){var t=new Date(Date.parse(e));return t},prettyParseTwitterDate:function(e){var t=new Date(Date.parse(e));return VMM.Date.prettyDate(t,!0)},getTweets:function(e){var t=[],n=e.length;for(var r=0;r<e.length;r++){var i="";e[r].tweet.match("status/")?i=e[r].tweet.split("status/")[1]:e[r].tweet.match("statuses/")?i=e[r].tweet.split("statuses/")[1]:i="";var s="//api.twitter.com/1/statuses/show.json?id="+i+"&include_entities=true&callback=?";VMM.getJSON(s,function(e){var r={},i="<div class='twitter'><blockquote><p>",s=VMM.Util.linkify_with_twitter(e.text,"_blank");i+=s;i+="</p>";i+="— "+e.user.name+" (<a href='https://twitter.com/"+e.user.screen_name+"'>@"+e.user.screen_name+"</a>) <a href='https://twitter.com/"+e.user.screen_name+"/status/"+e.id+"'>"+VMM.ExternalAPI.twitter.prettyParseTwitterDate(e.created_at)+" </a></blockquote></div>";r.content=i;r.raw=e;t.push(r);if(t.length==n){var o={tweetdata:t};VMM.fireEvent(global,"TWEETSLOADED",o)}}).success(function(){trace("second success")}).error(function(){trace("error")}).complete(function(){trace("complete")})}},getTweetSearch:function(e,t){var n=40;t!=null&&t!=""&&(n=t);var r="//search.twitter.com/search.json?q="+e+"&rpp="+n+"&include_entities=true&result_type=mixed",i=[];VMM.getJSON(r,function(e){for(var t=0;t<e.results.length;t++){var n={},r="<div class='twitter'><blockquote><p>",s=VMM.Util.linkify_with_twitter(e.results[t].text,"_blank");r+=s;r+="</p>";r+="— "+e.results[t].from_user_name+" (<a href='https://twitter.com/"+e.results[t].from_user+"'>@"+e.results[t].from_user+"</a>) <a href='https://twitter.com/"+e.results[t].from_user+"/status/"+e.id+"'>"+VMM.ExternalAPI.twitter.prettyParseTwitterDate(e.results[t].created_at)+" </a></blockquote></div>";n.content=r;n.raw=e.results[t];i.push(n)}var o={tweetdata:i};VMM.fireEvent(global,"TWEETSLOADED",o)})},prettyHTML:function(e,t){var e=e.toString(),n={twitterid:e},r="//api.twitter.com/1/statuses/show.json?id="+e+"&include_entities=true&callback=?",i=setTimeout(VMM.ExternalAPI.twitter.errorTimeOut,VMM.master_config.timers.api,e);VMM.getJSON(r,VMM.ExternalAPI.twitter.formatJSON).error(function(t,n,r){trace("TWITTER error");trace("TWITTER ERROR: "+n+" "+t.responseText);VMM.attachElement("#twitter_"+e,"<p>ERROR LOADING TWEET "+e+"</p>")}).success(function(e){clearTimeout(i);t&&VMM.ExternalAPI.twitter.secondaryMedia(e)})},formatJSON:function(e){var t=e.id_str,n="<blockquote><p>",r=VMM.Util.linkify_with_twitter(e.text,"_blank");n+=r;n+="</p></blockquote>";n+="<div class='vcard author'>";n+="<a class='screen-name url' href='https://twitter.com/"+e.user.screen_name+"' data-screen-name='"+e.user.screen_name+"' target='_blank'>";n+="<span class='avatar'><img src=' "+e.user.profile_image_url+"'  alt=''></span>";n+="<span class='fn'>"+e.user.name+"</span>";n+="<span class='nickname'>@"+e.user.screen_name+"<span class='thumbnail-inline'></span></span>";n+="</a>";n+="</div>";typeof e.entities.media!="undefined"&&e.entities.media[0].type=="photo"&&(n+="<img src=' "+e.entities.media[0].media_url+"'  alt=''>");VMM.attachElement("#twitter_"+t.toString(),n);VMM.attachElement("#text_thumb_"+t.toString(),e.text)}},googlemaps:{maptype:"TERRAIN",setMapType:function(e){e!=""&&(VMM.ExternalAPI.googlemaps.maptype=e)},get:function(e){var t,n,r;e.vars=VMM.Util.getUrlVars(e.id);VMM.ExternalAPI.keys.google!=""?n=VMM.ExternalAPI.keys.google:n=Aes.Ctr.decrypt(VMM.ExternalAPI.keys_master.google,VMM.ExternalAPI.keys_master.vp,256);r="//maps.googleapis.com/maps/api/js?key="+n+"&v=3.9&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";if(VMM.master_config.googlemaps.active)VMM.master_config.googlemaps.que.push(e);else{VMM.master_config.googlemaps.que.push(e);VMM.master_config.googlemaps.api_loaded||LoadLib.js(r,function(){trace("Google Maps API Library Loaded")})}},create:function(e){VMM.ExternalAPI.googlemaps.createAPIMap(e)},createiFrameMap:function(e){var t=e.id+"&output=embed",n="",r=e.uid.toString()+"_gmap";n+="<div class='google-map' id='"+r+"' style='width=100%;height=100%;'>";n+="<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+t+"'></iframe>";n+="</div>";VMM.attachElement("#"+e.uid,n)},createAPIMap:function(e){function d(e){if(e in VMM.ExternalAPI.googlemaps.map_providers){t=VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[e].attribution];return VMM.ExternalAPI.googlemaps.map_providers[e]}if(VMM.ExternalAPI.googlemaps.defaultType(e)){trace("GOOGLE MAP DEFAULT TYPE");return google.maps.MapTypeId[e.toUpperCase()]}trace("Not a maptype: "+e)}function v(){var t=new google.maps.Geocoder,n=VMM.Util.getUrlVars(e.id).q,i;if(n.match("loc:")){var s=n.split(":")[1].split("+");u=new google.maps.LatLng(parseFloat(s[0]),parseFloat(s[1]));l=!0}t.geocode({address:n},function(e,t){if(t==google.maps.GeocoderStatus.OK){i=new google.maps.Marker({map:r,position:e[0].geometry.location});typeof e[0].geometry.viewport!="undefined"?r.fitBounds(e[0].geometry.viewport):typeof e[0].geometry.bounds!="undefined"?r.fitBounds(e[0].geometry.bounds):r.setCenter(e[0].geometry.location);l&&r.panTo(u);c&&r.setZoom(f)}else{trace("Geocode for "+n+" was not successful for the following reason: "+t);trace("TRYING PLACES SEARCH");l&&r.panTo(u);c&&r.setZoom(f);m()}})}function m(){function h(t,i){if(i==google.maps.places.PlacesServiceStatus.OK){for(var s=0;s<t.length;s++);if(l)r.panTo(u);else if(t.length>=1){r.panTo(t[0].geometry.location);c&&r.setZoom(f)}}else{trace("Place search for "+n.query+" was not successful for the following reason: "+i);trace("YOU MAY NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("USING SIMPLE IFRAME MAP EMBED");e.id[0].match("https")&&(e.id=e.url[0].replace("https","http"));VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}}function p(e){var t,n;n=e.geometry.location;t=new google.maps.Marker({map:r,position:e.geometry.location});google.maps.event.addListener(t,"click",function(){i.setContent(e.name);i.open(r,this)})}var t,n,i,s,o,a;place_search=new google.maps.places.PlacesService(r);i=new google.maps.InfoWindow;n={query:"",types:["country","neighborhood","political","locality","geocode"]};type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&(n.query=VMM.Util.getUrlVars(e.id).q);if(l){n.location=u;n.radius="15000"}else{o=new google.maps.LatLng(-89.999999,-179.999999);a=new google.maps.LatLng(89.999999,179.999999);s=new google.maps.LatLngBounds(o,a)}place_search.textSearch(n,h)}function g(){var t,n,i=!1;trace("LOADING PLACES API FOR GOOGLE MAPS");if(VMM.ExternalAPI.keys.google!=""){t=VMM.ExternalAPI.keys.google;i=!0}else{trace("YOU NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication")}n="https://maps.googleapis.com/maps/api/place/textsearch/json?key="+t+"&sensor=false&language="+e.lang+"&";type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&(n+="query="+VMM.Util.getUrlVars(e.id).q);l&&(n+="&location="+u);if(i)VMM.getJSON(n,function(t){trace("PLACES JSON");var n="",i="",s="",o="";trace(t);if(t.status=="OVER_QUERY_LIMIT"){trace("OVER_QUERY_LIMIT");if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("DOING TRADITIONAL MAP IFRAME EMBED UNTIL QUERY LIMIT RESTORED");h=!0;VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}else{if(t.results.length>=1){s=new google.maps.LatLng(parseFloat(t.results[0].geometry.viewport.northeast.lat),parseFloat(t.results[0].geometry.viewport.northeast.lng));o=new google.maps.LatLng(parseFloat(t.results[0].geometry.viewport.southwest.lat),parseFloat(t.results[0].geometry.viewport.southwest.lng));i=new google.maps.LatLngBounds(o,s);r.fitBounds(i)}else trace("NO RESULTS");l&&r.panTo(u);c&&r.setZoom(f)}}).error(function(e,t,n){trace("PLACES JSON ERROR");trace("PLACES JSON ERROR: "+t+" "+e.responseText)}).success(function(e){trace("PLACES JSON SUCCESS")});else if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("DOING TRADITIONAL MAP IFRAME EMBED BECAUSE NO GOOGLE MAP API KEY WAS PROVIDED");VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}function y(){var t,n,i,s;t=e.id+"&output=kml";t=t.replace("&output=embed","");n=new google.maps.KmlLayer(t,{preserveViewport:!0});i=new google.maps.InfoWindow;n.setMap(r);google.maps.event.addListenerOnce(n,"defaultviewport_changed",function(){l?r.panTo(u):r.fitBounds(n.getDefaultViewport());c&&r.setZoom(f)});google.maps.event.addListener(n,"click",function(e){function t(e){i.setContent(e);i.open(r)}s=e.featureData.description;t(s)})}var t="",n,r,i,s=e.uid.toString()+"_gmap",o="",u=new google.maps.LatLng(41.875696,-87.624207),a,f=11,l=!1,c=!1,h=!1,p;google.maps.VeriteMapType=function(e){if(VMM.ExternalAPI.googlemaps.defaultType(e))return google.maps.MapTypeId[e.toUpperCase()];var t=d(e);return google.maps.ImageMapType.call(this,{getTileUrl:function(e,n){var r=(n+e.x+e.y)%VMM.ExternalAPI.googlemaps.map_subdomains.length,i=t.url.replace("{S}",VMM.ExternalAPI.googlemaps.map_subdomains[r]).replace("{Z}",n).replace("{X}",e.x).replace("{Y}",e.y).replace("{z}",n).replace("{x}",e.x).replace("{y}",e.y);return i},tileSize:new google.maps.Size(256,256),name:e,minZoom:t.minZoom,maxZoom:t.maxZoom})};google.maps.VeriteMapType.prototype=new google.maps.ImageMapType("_");VMM.ExternalAPI.googlemaps.maptype!=""?VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)?n=google.maps.MapTypeId[VMM.ExternalAPI.googlemaps.maptype.toUpperCase()]:n=VMM.ExternalAPI.googlemaps.maptype:n=google.maps.MapTypeId.TERRAIN;if(type.of(VMM.Util.getUrlVars(e.id)["ll"])=="string"){l=!0;a=VMM.Util.getUrlVars(e.id).ll.split(",");u=new google.maps.LatLng(parseFloat(a[0]),parseFloat(a[1]))}else if(type.of(VMM.Util.getUrlVars(e.id)["sll"])=="string"){a=VMM.Util.getUrlVars(e.id).sll.split(",");u=new google.maps.LatLng(parseFloat(a[0]),parseFloat(a[1]))}if(type.of(VMM.Util.getUrlVars(e.id)["z"])=="string"){c=!0;f=parseFloat(VMM.Util.getUrlVars(e.id).z)}i={zoom:f,draggable:!1,disableDefaultUI:!0,mapTypeControl:!1,zoomControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.TOP_RIGHT},center:u,mapTypeId:n,mapTypeControlOptions:{mapTypeIds:[n]}};VMM.attachElement("#"+e.uid,"<div class='google-map' id='"+s+"' style='width=100%;height=100%;'></div>");r=new google.maps.Map(document.getElementById(s),i);if(!VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)){r.mapTypes.set(n,new google.maps.VeriteMapType(n));o="<div class='map-attribution'><div class='attribution-text'>"+t+"</div></div>";VMM.appendElement("#"+s,o)}type.of(VMM.Util.getUrlVars(e.id)["msid"])=="string"?y():type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&v()},pushQue:function(){for(var e=0;e<VMM.master_config.googlemaps.que.length;e++)VMM.ExternalAPI.googlemaps.create(VMM.master_config.googlemaps.que[e]);VMM.master_config.googlemaps.que=[]},onMapAPIReady:function(){VMM.master_config.googlemaps.map_active=!0;VMM.master_config.googlemaps.places_active=!0;VMM.ExternalAPI.googlemaps.onAPIReady()},onPlacesAPIReady:function(){VMM.master_config.googlemaps.places_active=!0;VMM.ExternalAPI.googlemaps.onAPIReady()},onAPIReady:function(){if(!VMM.master_config.googlemaps.active&&VMM.master_config.googlemaps.map_active&&VMM.master_config.googlemaps.places_active){VMM.master_config.googlemaps.active=!0;VMM.ExternalAPI.googlemaps.pushQue()}},defaultType:function(e){return e.toLowerCase()=="satellite"||e.toLowerCase()=="hybrid"||e.toLowerCase()=="terrain"||e.toLowerCase()=="roadmap"?!0:!1},map_subdomains:["","a.","b.","c.","d."],map_attribution:{stamen:"Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",apple:"Map data &copy; 2012  Apple, Imagery &copy; 2012 Apple",osm:"&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"},map_providers:{toner:{url:"//{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},"toner-lines":{url:"//{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},"toner-labels":{url:"//{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},sterrain:{url:"//{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",minZoom:4,maxZoom:20,attribution:"stamen"},apple:{url:"//gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",minZoom:4,maxZoom:14,attribution:"apple"},watercolor:{url:"//{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",minZoom:3,maxZoom:16,attribution:"stamen"},osm:{url:"//tile.openstreetmap.org/{z}/{x}/{y}.png",minZoom:3,maxZoom:18,attribution:"osm"}}},googleplus:{get:function(e){var t,n={user:e.user,activity:e.id,id:e.uid};VMM.master_config.googleplus.que.push(n);VMM.master_config.googleplus.active=!0},create:function(e,t){var n="",r="",i="",s="",o="",u,a;googleplus_timeout=setTimeout(VMM.ExternalAPI.googleplus.errorTimeOut,VMM.master_config.timers.api,e),callback_timeout=setTimeout(t,VMM.master_config.timers.api,e);VMM.master_config.Timeline.api_keys.google!=""?r=VMM.master_config.Timeline.api_keys.google:r=Aes.Ctr.decrypt(VMM.master_config.api_keys_master.google,VMM.master_config.vp,256);u="https://www.googleapis.com/plus/v1/people/"+e.user+"/activities/public?alt=json&maxResults=100&fields=items(id,url)&key="+r;n="GOOGLE PLUS API CALL";VMM.getJSON(u,function(t){for(var u=0;u<t.items.length;u++){trace("loop");if(t.items[u].url.split("posts/")[1]==e.activity){trace("FOUND IT!!");i=t.items[u].id;a="https://www.googleapis.com/plus/v1/activities/"+i+"?alt=json&key="+r;VMM.getJSON(a,function(t){trace(t);if(typeof t.annotation!="undefined"){s+="<div class='googleplus-annotation'>'"+t.annotation+"</div>";s+=t.object.content}else s+=t.object.content;if(typeof t.object.attachments!="undefined"){for(var r=0;r<t.object.attachments.length;r++){if(t.object.attachments[r].objectType=="photo")o="<a href='"+t.object.url+"' target='_blank'>"+"<img src='"+t.object.attachments[r].image.url+"' class='article-thumb'></a>"+o;else if(t.object.attachments[r].objectType=="video"){o="<img src='"+t.object.attachments[r].image.url+"' class='article-thumb'>"+o;o+="<div>";o+="<a href='"+t.object.attachments[r].url+"' target='_blank'>";o+="<h5>"+t.object.attachments[r].displayName+"</h5>";o+="</a>";o+="</div>"}else if(t.object.attachments[r].objectType=="article"){o+="<div>";o+="<a href='"+t.object.attachments[r].url+"' target='_blank'>";o+="<h5>"+t.object.attachments[r].displayName+"</h5>";o+="<p>"+t.object.attachments[r].content+"</p>";o+="</a>";o+="</div>"}trace(t.object.attachments[r])}o="<div class='googleplus-attachments'>"+o+"</div>"}n="<div class='googleplus-content'>"+s+o+"</div>";n+="<div class='vcard author'><a class='screen-name url' href='"+t.url+"' target='_blank'>";n+="<span class='avatar'><img src='"+t.actor.image.url+"' style='max-width: 32px; max-height: 32px;'></span>";n+="<span class='fn'>"+t.actor.displayName+"</span>";n+="<span class='nickname'><span class='thumbnail-inline'></span></span>";n+="</a></div>";VMM.attachElement("#googleplus_"+e.activity,n)});break}}}).error(function(t,n,r){var i=VMM.parseJSON(t.responseText);trace(i.error.message);VMM.attachElement("#googleplus_"+e.activity,VMM.MediaElement.loadingmessage("<p>ERROR LOADING GOOGLE+ </p><p>"+i.error.message+"</p>"))}).success(function(e){clearTimeout(googleplus_timeout);clearTimeout(callback_timeout);t()})},pushQue:function(){if(VMM.master_config.googleplus.que.length>0){VMM.ExternalAPI.googleplus.create(VMM.master_config.googleplus.que[0],VMM.ExternalAPI.googleplus.pushQue);VMM.Util.removeRange(VMM.master_config.googleplus.que,0)}},errorTimeOut:function(e){trace("GOOGLE+ JSON ERROR TIMEOUT "+e.activity);VMM.attachElement("#googleplus_"+e.activity,VMM.MediaElement.loadingmessage("<p>Still waiting on GOOGLE+ </p><p>"+e.activity+"</p>"))}},googledocs:{get:function(e){VMM.master_config.googledocs.que.push(e);VMM.master_config.googledocs.active=!0},create:function(e){var t="";e.id.match(/docs.google.com/i)?t="<iframe class='doc' frameborder='0' width='100%' height='100%' src='"+e.id+"&amp;embedded=true'></iframe>":t="<iframe class='doc' frameborder='0' width='100%' height='100%' src='//docs.google.com/viewer?url="+e.id+"&amp;embedded=true'></iframe>";VMM.attachElement("#"+e.uid,t)},pushQue:function(){for(var e=0;e<VMM.master_config.googledocs.que.length;e++)VMM.ExternalAPI.googledocs.create(VMM.master_config.googledocs.que[e]);VMM.master_config.googledocs.que=[]}},flickr:{get:function(e){VMM.master_config.flickr.que.push(e);VMM.master_config.flickr.active=!0},create:function(e,t){var n,r=setTimeout(t,VMM.master_config.timers.api,e);typeof VMM.master_config.Timeline!="undefined"&&VMM.master_config.Timeline.api_keys.flickr!=""?n=VMM.master_config.Timeline.api_keys.flickr:n=Aes.Ctr.decrypt(VMM.master_config.api_keys_master.flickr,VMM.master_config.vp,256);var i="//api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+n+"&photo_id="+e.id+"&format=json&jsoncallback=?";VMM.getJSON(i,function(t){var n=VMM.ExternalAPI.flickr.getFlickrIdFromUrl(t.sizes.size[0].url),r="#"+e.uid,i="#"+e.uid+"_thumb",s,o,u=!1,a="Large";a=VMM.ExternalAPI.flickr.sizes(VMM.master_config.sizes.api.height);for(var f=0;f<t.sizes.size.length;f++)if(t.sizes.size[f].label==a){u=!0;s=t.sizes.size[f].source}u||(s=t.sizes.size[t.sizes.size.length-2].source);o=t.sizes.size[0].source;VMM.Lib.attr(r,"src",s);VMM.attachElement(i,"<img src='"+o+"'>")}).error(function(e,t,n){trace("FLICKR error");trace("FLICKR ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(r);t()})},pushQue:function(){if(VMM.master_config.flickr.que.length>0){VMM.ExternalAPI.flickr.create(VMM.master_config.flickr.que[0],VMM.ExternalAPI.flickr.pushQue);VMM.Util.removeRange(VMM.master_config.flickr.que,0)}},sizes:function(e){var t="";e<=75?t="Thumbnail":e<=180?t="Small":e<=240?t="Small 320":e<=375?t="Medium":e<=480?t="Medium 640":e<=600?t="Large":t="Large";return t},getFlickrIdFromUrl:function(e){var t=e.indexOf("flickr.com/photos/");if(t==-1)return null;var n=t+"flickr.com/photos/".length,r=e.substr(n);if(r.indexOf("/")==-1)return null;r.indexOf("/")==0&&(r=r.substr(1));return r.split("/")[1]}},instagram:{get:function(e,t){return t?"//instagr.am/p/"+e.id+"/media/?size=t":"//instagr.am/p/"+e.id+"/media/?size="+VMM.ExternalAPI.instagram.sizes(VMM.master_config.sizes.api.height)},sizes:function(e){var t="";e<=150?t="t":e<=306?t="m":t="l";return t},isInstagramUrl:function(e){return e.match("instagr.am/p/")||e.match("instagram.com/p/")},getInstagramIdFromUrl:function(e){try{return e.split("/p/")[1].split("/")[0]}catch(t){trace("Invalid Instagram url: "+e);return null}}},soundcloud:{get:function(e){VMM.master_config.soundcloud.que.push(e);VMM.master_config.soundcloud.active=!0},create:function(e,t){var n="//soundcloud.com/oembed?url="+e.id+"&format=js&callback=?";VMM.getJSON(n,function(n){VMM.attachElement("#"+e.uid,n.html);t()})},pushQue:function(){if(VMM.master_config.soundcloud.que.length>0){VMM.ExternalAPI.soundcloud.create(VMM.master_config.soundcloud.que[0],VMM.ExternalAPI.soundcloud.pushQue);VMM.Util.removeRange(VMM.master_config.soundcloud.que,0)}}},wikipedia:{get:function(e){VMM.master_config.wikipedia.que.push(e);VMM.master_config.wikipedia.active=!0},create:function(e,t){var n="//"+e.lang+".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles="+e.id+"&exintro=1&format=json&callback=?";callback_timeout=setTimeout(t,VMM.master_config.timers.api,e);if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7&&window.XDomainRequest){var r="<h4><a href='http://"+VMM.master_config.language.api.wikipedia+".wikipedia.org/wiki/"+e.id+"' target='_blank'>"+e.url+"</a></h4>";r+="<span class='wiki-source'>"+VMM.master_config.language.messages.wikipedia+"</span>";r+="<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>";VMM.attachElement("#"+e.uid,r)}VMM.getJSON(n,function(t){if(t.query){var n,r,i="",s="",o=1,u=[];n=VMM.Util.getObjectAttributeByIndex(t.query.pages,0).extract;r=VMM.Util.getObjectAttributeByIndex(t.query.pages,0).title;n.match("<p>")?u=n.split("<p>"):u.push(n);for(var a=0;a<u.length;a++)a+1<=o&&a+1<u.length&&(s+="<p>"+u[a+1]);i="<h4><a href='http://"+VMM.master_config.language.api.wikipedia+".wikipedia.org/wiki/"+r+"' target='_blank'>"+r+"</a></h4>";i+="<span class='wiki-source'>"+VMM.master_config.language.messages.wikipedia+"</span>";i+=VMM.Util.linkify_wikipedia(s);n.match("REDIRECT")||VMM.attachElement("#"+e.uid,i)}}).error(function(n,r,i){trace("WIKIPEDIA error");trace("WIKIPEDIA ERROR: "+r+" "+n.responseText);trace(i);VMM.attachElement("#"+e.uid,VMM.MediaElement.loadingmessage("<p>Wikipedia is not responding</p>"));clearTimeout(callback_timeout);if(VMM.master_config.wikipedia.tries<4){trace("WIKIPEDIA ATTEMPT "+VMM.master_config.wikipedia.tries);trace(e);VMM.master_config.wikipedia.tries++;VMM.ExternalAPI.wikipedia.create(e,t)}else t()}).success(function(e){VMM.master_config.wikipedia.tries=0;clearTimeout(callback_timeout);t()})},pushQue:function(){if(VMM.master_config.wikipedia.que.length>0){trace("WIKIPEDIA PUSH QUE "+VMM.master_config.wikipedia.que.length);VMM.ExternalAPI.wikipedia.create(VMM.master_config.wikipedia.que[0],VMM.ExternalAPI.wikipedia.pushQue);VMM.Util.removeRange(VMM.master_config.wikipedia.que,0)}}},youtube:{get:function(e){var t="//gdata.youtube.com/feeds/api/videos/"+e.id+"?v=2&alt=jsonc&callback=?";VMM.master_config.youtube.que.push(e);VMM.master_config.youtube.active||VMM.master_config.youtube.api_loaded||LoadLib.js("//www.youtube.com/player_api",function(){trace("YouTube API Library Loaded")});VMM.getJSON(t,function(t){VMM.ExternalAPI.youtube.createThumb(t,e)})},create:function(e){if(typeof e.start!="undefined"){var t=e.start.toString(),n=0,r=0;if(t.match("m")){n=parseInt(t.split("m")[0],10);r=parseInt(t.split("m")[1].split("s")[0],10);e.start=n*60+r}else e.start=0}else e.start=0;var i={active:!1,player:{},name:e.uid,playing:!1,hd:!1};typeof e.hd!="undefined"&&(i.hd=!0);i.player[e.id]=new YT.Player(e.uid,{height:"390",width:"640",playerVars:{enablejsapi:1,color:"white",showinfo:0,theme:"light",start:e.start,rel:0},videoId:e.id,events:{onReady:VMM.ExternalAPI.youtube.onPlayerReady,onStateChange:VMM.ExternalAPI.youtube.onStateChange}});VMM.master_config.youtube.array.push(i)},createThumb:function(e,t){trace("CREATE THUMB");trace(e);trace(t);if(typeof e.data!="undefined"){var n="#"+t.uid+"_thumb";VMM.attachElement(n,"<img src='"+e.data.thumbnail.sqDefault+"'>")}},pushQue:function(){for(var e=0;e<VMM.master_config.youtube.que.length;e++)VMM.ExternalAPI.youtube.create(VMM.master_config.youtube.que[e]);VMM.master_config.youtube.que=[]},onAPIReady:function(){VMM.master_config.youtube.active=!0;VMM.ExternalAPI.youtube.pushQue()},stopPlayers:function(){for(var e=0;e<VMM.master_config.youtube.array.length;e++)VMM.master_config.youtube.array[e].playing&&typeof VMM.master_config.youtube.array[e].player.the_name!="undefined"&&VMM.master_config.youtube.array[e].player.the_name.stopVideo()},onStateChange:function(e){for(var t=0;t<VMM.master_config.youtube.array.length;t++){for(var n in VMM.master_config.youtube.array[t].player)VMM.master_config.youtube.array[t].player[n]==e.target&&(VMM.master_config.youtube.array[t].player.the_name=VMM.master_config.youtube.array[t].player[n]);if(VMM.master_config.youtube.array[t].player.the_name==e.target&&e.data==YT.PlayerState.PLAYING){VMM.master_config.youtube.array[t].playing=!0;if(VMM.master_config.youtube.array[t].hd===!1){VMM.master_config.youtube.array[t].hd=!0;VMM.master_config.youtube.array[t].player.the_name.setPlaybackQuality("hd720")}}}},onPlayerReady:function(e){}},vimeo:{get:function(e){VMM.master_config.vimeo.que.push(e);VMM.master_config.vimeo.active=!0},create:function(e,t){trace("VIMEO CREATE");var n="//vimeo.com/api/v2/video/"+e.id+".json",r="//player.vimeo.com/video/"+e.id+"?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";VMM.getJSON(n,function(n){VMM.ExternalAPI.vimeo.createThumb(n,e);t()});VMM.attachElement("#"+e.uid,"<iframe autostart='false' frameborder='0' width='100%' height='100%' src='"+r+"'></iframe>")},createThumb:function(e,t){trace("VIMEO CREATE THUMB");var n="#"+t.uid+"_thumb";VMM.attachElement(n,"<img src='"+e[0].thumbnail_small+"'>")},pushQue:function(){if(VMM.master_config.vimeo.que.length>0){VMM.ExternalAPI.vimeo.create(VMM.master_config.vimeo.que[0],VMM.ExternalAPI.vimeo.pushQue);VMM.Util.removeRange(VMM.master_config.vimeo.que,0)}}},vine:{get:function(e){VMM.master_config.vine.que.push(e);VMM.master_config.vine.active=!0},create:function(e,t){trace("VINE CREATE");var n="https://vine.co/v/"+e.id+"/embed/simple";VMM.attachElement("#"+e.uid,"<iframe frameborder='0' width='100%' height='100%' src='"+n+"'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>")},pushQue:function(){if(VMM.master_config.vine.que.length>0){VMM.ExternalAPI.vine.create(VMM.master_config.vine.que[0],VMM.ExternalAPI.vine.pushQue);VMM.Util.removeRange(VMM.master_config.vine.que,0)}}},webthumb:{get:function(e,t){VMM.master_config.webthumb.que.push(e);VMM.master_config.webthumb.active=!0},sizes:function(e){var t="";e<=150?t="t":e<=306?t="m":t="l";return t},create:function(e){trace("WEB THUMB CREATE");var t="//api.pagepeeker.com/v2/thumbs.php?";url=e.id.replace("http://","");VMM.attachElement("#"+e.uid,"<a href='"+e.id+"' target='_blank'><img src='"+t+"size=x&url="+url+"'></a>");VMM.attachElement("#"+e.uid+"_thumb","<img src='"+t+"size=t&url="+url+"'>")},pushQue:function(){for(var e=0;e<VMM.master_config.webthumb.que.length;e++)VMM.ExternalAPI.webthumb.create(VMM.master_config.webthumb.que[e]);VMM.master_config.webthumb.que=[]}}}.init());typeof VMM!="undefined"&&typeof VMM.MediaElement=="undefined"&&(VMM.MediaElement={init:function(){return this},loadingmessage:function(e){return"<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div><div class='vco-message'><p>"+e+"</p></div></div></div>"},thumbnail:function(e,t,n,r){var i=16,s=24,o="";t!=null&&t!=""&&(i=t);n!=null&&n!=""&&(s=n);r!=null&&r!=""&&(o=r);if(e.thumbnail!=null&&e.thumbnail!=""){trace("CUSTOM THUMB");a="<div class='thumbnail thumb-custom' id='"+r+"_custom_thumb'><img src='"+e.thumbnail+"'></div>";return a}if(e.media!=null&&e.media!=""){var u=!0,a="",f=VMM.MediaType(e.media);if(f.type=="image"){a="<div class='thumbnail thumb-photo'></div>";return a}if(f.type=="flickr"){a="<div class='thumbnail thumb-photo' id='"+r+"_thumb'></div>";return a}if(f.type=="instagram"){a="<div class='thumbnail thumb-instagram' id='"+r+"_thumb'><img src='"+VMM.ExternalAPI.instagram.get(f,!0)+"'></div>";return a}if(f.type=="youtube"){a="<div class='thumbnail thumb-youtube' id='"+r+"_thumb'></div>";return a}if(f.type=="googledoc"){a="<div class='thumbnail thumb-document'></div>";return a}if(f.type=="vimeo"){a="<div class='thumbnail thumb-vimeo' id='"+r+"_thumb'></div>";return a}if(f.type=="vine"){a="<div class='thumbnail thumb-vine'></div>";return a}if(f.type=="dailymotion"){a="<div class='thumbnail thumb-video'></div>";return a}if(f.type=="twitter"){a="<div class='thumbnail thumb-twitter'></div>";return a}if(f.type=="twitter-ready"){a="<div class='thumbnail thumb-twitter'></div>";return a}if(f.type=="soundcloud"){a="<div class='thumbnail thumb-audio'></div>";return a}if(f.type=="google-map"){a="<div class='thumbnail thumb-map'></div>";return a}if(f.type=="googleplus"){a="<div class='thumbnail thumb-googleplus'></div>";return a}if(f.type=="wikipedia"){a="<div class='thumbnail thumb-wikipedia'></div>";return a}if(f.type=="storify"){a="<div class='thumbnail thumb-storify'></div>";return a}if(f.type=="quote"){a="<div class='thumbnail thumb-quote'></div>";return a}if(f.type=="iframe"){a="<div class='thumbnail thumb-video'></div>";return a}if(f.type=="unknown"){f.id.match("blockquote")?a="<div class='thumbnail thumb-quote'></div>":a="<div class='thumbnail thumb-plaintext'></div>";return a}if(f.type=="website"){a="<div class='thumbnail thumb-website' id='"+r+"_thumb'></div>";return a}a="<div class='thumbnail thumb-plaintext'></div>";return a}},create:function(e,t){var n=!1,r=VMM.MediaElement.loadingmessage(VMM.master_config.language.messages.loading+"...");if(e.media!=
null&&e.media!=""){var i="",s="",o="",u="",a=!1,f;f=VMM.MediaType(e.media);f.uid=t;n=!0;e.credit!=null&&e.credit!=""&&(o="<div class='credit'>"+VMM.Util.linkify_with_twitter(e.credit,"_blank")+"</div>");e.caption!=null&&e.caption!=""&&(s="<div class='caption'>"+VMM.Util.linkify_with_twitter(e.caption,"_blank")+"</div>");if(f.type=="image"){f.id.match("https://")&&(f.id=f.id.replace("https://","http://"));i="<div class='media-image media-shadow'><img src='"+f.id+"' class='media-image'></div>"}else if(f.type=="flickr"){i="<div class='media-image media-shadow'><a href='"+f.link+"' target='_blank'><img id='"+t+"'></a></div>";VMM.ExternalAPI.flickr.get(f)}else if(f.type=="instagram")i="<div class='media-image media-shadow'><a href='"+f.link+"' target='_blank'><img src='"+VMM.ExternalAPI.instagram.get(f)+"'></a></div>";else if(f.type=="googledoc"){i="<div class='media-frame media-shadow doc' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.googledocs.get(f)}else if(f.type=="youtube"){i="<div class='media-shadow'><div class='media-frame video youtube' id='"+f.uid+"'>"+r+"</div></div>";VMM.ExternalAPI.youtube.get(f)}else if(f.type=="vimeo"){i="<div class='media-shadow media-frame video vimeo' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.vimeo.get(f)}else if(f.type=="dailymotion")i="<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/"+f.id+"'></iframe></div>";else if(f.type=="vine"){i="<div class='media-shadow media-frame video vine' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.vine.get(f)}else if(f.type=="twitter"){i="<div class='twitter' id='"+f.uid+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.twitter.get(f)}else if(f.type=="twitter-ready"){a=!0;i=f.id}else if(f.type=="soundcloud"){i="<div class='media-frame media-shadow soundcloud' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.soundcloud.get(f)}else if(f.type=="google-map"){i="<div class='media-frame media-shadow map' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.googlemaps.get(f)}else if(f.type=="googleplus"){u="googleplus_"+f.id;i="<div class='googleplus' id='"+u+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.googleplus.get(f)}else if(f.type=="wikipedia"){i="<div class='wikipedia' id='"+f.uid+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.wikipedia.get(f)}else if(f.type=="storify"){a=!0;i="<div class='plain-text-quote'>"+f.id+"</div>"}else if(f.type=="iframe"){a=!0;i="<div class='media-shadow'><iframe class='media-frame video' autostart='false' frameborder='0' width='100%' height='100%' src='"+f.id+"'></iframe></div>"}else if(f.type=="quote"){a=!0;i="<div class='plain-text-quote'>"+f.id+"</div>"}else if(f.type=="unknown"){trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML");a=!0;i="<div class='plain-text'><div class='container'>"+VMM.Util.properQuotes(f.id)+"</div></div>"}else if(f.type=="website"){i="<div class='media-shadow website' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.webthumb.get(f)}else{trace("NO KNOWN MEDIA TYPE FOUND");trace(f.type)}i="<div class='media-container' >"+i+o+s+"</div>";return a?"<div class='text-media'><div class='media-wrapper'>"+i+"</div></div>":"<div class='media-wrapper'>"+i+"</div>"}}}.init());typeof VMM!="undefined"&&typeof VMM.MediaType=="undefined"&&(VMM.MediaType=function(e){var t=e.replace(/^\s\s*/,"").replace(/\s\s*$/,""),n=!1,r={type:"unknown",id:"",start:0,hd:!1,link:"",lang:VMM.Language.lang,uniqueid:VMM.Util.unique_ID(6)};if(t.match("div class='twitter'")){r.type="twitter-ready";r.id=t;n=!0}else if(t.match("<blockquote")){r.type="quote";r.id=t;n=!0}else if(t.match("<iframe")){r.type="iframe";trace("IFRAME");regex=/src=['"](\S+?)['"]\s/;group=t.match(regex);group&&(r.id=group[1]);trace("iframe url: "+r.id);n=Boolean(r.id)}else if(t.match("(www.)?youtube|youtu.be")){t.match("v=")?r.id=VMM.Util.getUrlVars(t).v:t.match("/embed/")?r.id=t.split("embed/")[1].split(/[?&]/)[0]:t.match(/v\/|v=|youtu\.be\//)?r.id=t.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]:trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");r.start=VMM.Util.getUrlVars(t).t;r.hd=VMM.Util.getUrlVars(t).hd;r.type="youtube";n=!0}else if(t.match("(player.)?vimeo.com")){r.type="vimeo";r.id=t.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];n=!0}else if(t.match("(www.)?dailymotion.com")){r.id=t.split(/video\/|\/\/dailymotion\.com\//)[1];r.type="dailymotion";n=!0}else if(t.match("(www.)?vine.co")){trace("VINE");if(t.match("vine.co/v/")){r.id=t.split("vine.co/v/")[1];trace(r.id)}trace(t);r.type="vine";n=!0}else if(t.match("(player.)?soundcloud.com")){r.type="soundcloud";r.id=t;n=!0}else if(t.match("(www.)?twitter.com")&&t.match("status")){t.match("status/")?r.id=t.split("status/")[1]:t.match("statuses/")?r.id=t.split("statuses/")[1]:r.id="";r.type="twitter";n=!0}else if(t.match("maps.google")&&!t.match("staticmap")){r.type="google-map";r.id=t.split(/src=['|"][^'|"]*?['|"]/gi);n=!0}else if(t.match("plus.google")){r.type="googleplus";r.id=t.split("/posts/")[1];t.split("/posts/")[0].match("u/0/")?r.user=t.split("u/0/")[1].split("/posts")[0]:r.user=t.split("google.com/")[1].split("/posts/")[0];n=!0}else if(t.match("flickr.com/photos/")){r.type="flickr";r.id=VMM.ExternalAPI.flickr.getFlickrIdFromUrl(t);r.link=t;n=Boolean(r.id)}else if(VMM.ExternalAPI.instagram.isInstagramUrl(t)){r.type="instagram";r.link=t;r.id=VMM.ExternalAPI.instagram.getInstagramIdFromUrl(t);n=Boolean(r.id)}else if(t.match(/jpg|jpeg|png|gif|svg/i)||t.match("staticmap")||t.match("yfrog.com")||t.match("twitpic.com")){r.type="image";r.id=t;n=!0}else if(VMM.FileExtention.googleDocType(t)){r.type="googledoc";r.id=t;n=!0}else if(t.match("(www.)?wikipedia.org")){r.type="wikipedia";var i=t.split("wiki/")[1].split("#")[0].replace("_"," ");r.id=i.replace(" ","%20");r.lang=t.split("//")[1].split(".wikipedia")[0];n=!0}else if(t.indexOf("http://")==0){r.type="website";r.id=t;n=!0}else if(t.match("storify")){r.type="storify";r.id=t;n=!0}else{trace("unknown media");r.type="unknown";r.id=t;n=!0}if(n)return r;trace("No valid media id detected");trace(t);return!1});typeof VMM!="undefined"&&typeof VMM.TextElement=="undefined"&&(VMM.TextElement={init:function(){return this},create:function(e){return e}}.init());typeof VMM!="undefined"&&typeof VMM.DragSlider=="undefined"&&(VMM.DragSlider=function(){function o(e,n){VMM.bindEvent(e,a,t.down,{element:n,delement:e});VMM.bindEvent(e,f,t.up,{element:n,delement:e});VMM.bindEvent(e,u,t.leave,{element:n,delement:e})}function u(n){VMM.unbindEvent(n.data.delement,l,t.move);e.touch||n.preventDefault();n.stopPropagation();if(e.sliding){e.sliding=!1;h(n.data.element,n.data.delement,n);return!1}return!0}function a(t){c(t.data.element,t.data.delement,t);e.touch||t.preventDefault();return!0}function f(t){e.touch||t.preventDefault();if(e.sliding){e.sliding=!1;h(t.data.element,t.data.delement,t);return!1}return!0}function l(e){p(e.data.element,e)}function c(n,r,i){if(e.touch){trace("IS TOUCH");VMM.Lib.css(n,"-webkit-transition-duration","0");e.pagex.start=i.originalEvent.touches[0].screenX;e.pagey.start=i.originalEvent.touches[0].screenY}else{e.pagex.start=i.pageX;e.pagey.start=i.pageY}e.left.start=v(n);e.time.start=(new Date).getTime();VMM.Lib.stop(n);VMM.bindEvent(r,l,t.move,{element:n})}function h(e,n,r){VMM.unbindEvent(n,l,t.move);d(e,r)}function p(t,n){var r,i;e.sliding=!0;if(e.touch){e.pagex.end=n.originalEvent.touches[0].screenX;e.pagey.end=n.originalEvent.touches[0].screenY}else{e.pagex.end=n.pageX;e.pagey.end=n.pageY}e.left.end=v(t);r=-(e.pagex.start-e.pagex.end-e.left.start);if(Math.abs(e.pagey.start)-Math.abs(e.pagey.end)>10){trace("SCROLLING Y");trace(Math.abs(e.pagey.start)-Math.abs(e.pagey.end))}if(Math.abs(r-e.left.start)>10){VMM.Lib.css(t,"left",r);n.preventDefault();n.stopPropagation()}}function d(t,n){var r={left:e.left.end,left_adjust:0,change:{x:0},time:((new Date).getTime()-e.time.start)*10,time_adjust:((new Date).getTime()-e.time.start)*10},o=3e3;e.touch&&(o=6e3);r.change.x=o*(Math.abs(e.pagex.end)-Math.abs(e.pagex.start));r.left_adjust=Math.round(r.change.x/r.time);r.left=Math.min(r.left+r.left_adjust);if(e.constraint)if(r.left>e.constraint.left){r.left=e.constraint.left;r.time>5e3&&(r.time=5e3)}else if(r.left<e.constraint.right){r.left=e.constraint.right;r.time>5e3&&(r.time=5e3)}VMM.fireEvent(i,"DRAGUPDATE",[r]);s||r.time>0&&(e.touch?VMM.Lib.animate(t,r.time,"easeOutCirc",{left:r.left}):VMM.Lib.animate(t,r.time,e.ease,{left:r.left}))}function v(e){return parseInt(VMM.Lib.css(e,"left").substring(0,VMM.Lib.css(e,"left").length-2),10)}var e={element:"",element_move:"",constraint:"",sliding:!1,pagex:{start:0,end:0},pagey:{start:0,end:0},left:{start:0,end:0},time:{start:0,end:0},touch:!1,ease:"easeOutExpo"},t={down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},n={down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},r={down:"touchstart",up:"touchend",leave:"mouseleave",move:"touchmove"},i=this,s=!1;this.createPanel=function(i,u,a,f,l){e.element=i;e.element_move=u;l!=null&&l!=""&&(s=l);a!=null&&a!=""?e.constraint=a:e.constraint=!1;f?e.touch=f:e.touch=!1;trace("TOUCH"+e.touch);e.touch?t=r:t=n;o(e.element,e.element_move)};this.updateConstraint=function(t){trace("updateConstraint");e.constraint=t};this.cancelSlide=function(n){VMM.unbindEvent(e.element,l,t.move);return!0}});typeof VMM!="undefined"&&typeof VMM.Slider=="undefined"&&(VMM.Slider=function(e,t){function S(){trace("onConfigSet")}function x(e,t){var r=!0,i=!1;e!=null&&(r=e);t!=null&&(i=t);m=n.slider.width;n.slider.nav.height=VMM.Lib.height(E.prevBtnContainer);VMM.Browser.device=="mobile"||m<=640?n.slider.content.padding=10:n.slider.content.padding=n.slider.content.padding_default;n.slider.content.width=m-n.slider.content.padding*2;VMM.Lib.width(u,h.length*n.slider.content.width);i&&VMM.Lib.css(o,"left",h[v].leftpos());B();j();VMM.Lib.css(E.nextBtn,"left",m-n.slider.nav.width);VMM.Lib.height(E.prevBtn,n.slider.height);VMM.Lib.height(E.nextBtn,n.slider.height);VMM.Lib.css(E.nextBtnContainer,"top",n.slider.height/2-n.slider.nav.height/2+10);VMM.Lib.css(E.prevBtnContainer,"top",n.slider.height/2-n.slider.nav.height/2+10);VMM.Lib.height(s,n.slider.height);VMM.Lib.width(s,m);r&&I(v,"linear",1);v==0&&VMM.Lib.visible(E.prevBtn,!1)}function T(e,t){trace("DRAG FINISH");trace(t.left_adjust);trace(n.slider.width/2);if(t.left_adjust<0)if(Math.abs(t.left_adjust)>n.slider.width/2)if(v==h.length-1)q();else{I(v+1,"easeOutExpo");O()}else q();else if(Math.abs(t.left_adjust)>n.slider.width/2)if(v==0)q();else{I(v-1,"easeOutExpo");O()}else q()}function N(e){if(v==h.length-1)q();else{I(v+1);O()}}function C(e){if(v==0)q();else{I(v-1);O()}}function k(e){switch(e.keyCode){case 39:N(e);break;case 37:C(e)}}function L(e,t){if(p.length==0)for(var r=0;r<h.length;r++)p.push(h[r].leftpos());if(typeof t.left=="number"){var i=t.left,s=-h[v].leftpos();i<s-n.slider_width/3?N():i>s+n.slider_width/3?C():VMM.Lib.animate(o,n.duration,n.ease,{left:s})}else VMM.Lib.animate(o,n.duration,n.ease,{left:s});typeof t.top=="number"&&VMM.Lib.animate(o,n.duration,n.ease,{top:-t.top})}function A(e){z()}function O(){n.current_slide=v;VMM.fireEvent(w,"UPDATE")}function M(e){c=e}function _(e){var t=0;VMM.attachElement(u,"");h=[];for(t=0;t<e.length;t++){var n=new VMM.Slider.Slide(e[t],u);h.push(n)}}function D(e){var t=0;if(e)P();else{for(t=0;t<h.length;t++)h[t].clearTimers();r=setTimeout(P,n.duration)}}function P(){var e=0;for(e=0;e<h.length;e++)h[e].enqueue=!0;for(e=0;e<n.preload;e++){if(!(v+e>h.length-1)){h[v+e].show();h[v+e].enqueue=!1}if(!(v-e<0)){h[v-e].show();h[v-e].enqueue=!1}}if(h.length>50)for(e=0;e<h.length;e++)h[e].enqueue&&h[e].hide();B()}function H(e){}function B(){var e=0,t=".slider-item .layout-text-media .media .media-container ",r=".slider-item .layout-media .media .media-container ",i=".slider-item .media .media-container",s=".slider-item .media .media-container .media-shadow .caption",o=!1,u={text_media:{width:n.slider.content.width/100*60,height:n.slider.height-60,video:{width:0,height:0},text:{width:n.slider.content.width/100*40-30,height:n.slider.height}},media:{width:n.slider.content.width,height:n.slider.height-110,video:{width:0,height:0}}};if(VMM.Browser.device=="mobile"||m<641)o=!0;VMM.master_config.sizes.api.width=u.media.width;VMM.master_config.sizes.api.height=u.media.height;u.text_media.video=VMM.Util.ratio.fit(u.text_media.width,u.text_media.height,16,9);u.media.video=VMM.Util.ratio.fit(u.media.width,u.media.height,16,9);VMM.Lib.css(".slider-item","width",n.slider.content.width);VMM.Lib.height(".slider-item",n.slider.height);if(o){u.text_media.width=n.slider.content.width-n.slider.content.padding*2;u.media.width=n.slider.content.width-n.slider.content.padding*2;u.text_media.height=n.slider.height/100*50-50;u.media.height=n.slider.height/100*70-40;u.text_media.video=VMM.Util.ratio.fit(u.text_media.width,u.text_media.height,16,9);u.media.video=VMM.Util.ratio.fit(u.media.width,u.media.height,16,9);VMM.Lib.css(".slider-item .layout-text-media .text","width","100%");VMM.Lib.css(".slider-item .layout-text-media .text","display","block");VMM.Lib.css(".slider-item .layout-text-media .text .container","display","block");VMM.Lib.css(".slider-item .layout-text-media .text .container","width",u.media.width);VMM.Lib.css(".slider-item .layout-text-media .text .container .start","width","auto");VMM.Lib.css(".slider-item .layout-text-media .media","float","none");VMM.Lib.addClass(".slider-item .content-container","pad-top");VMM.Lib.css(".slider-item .media blockquote p","line-height","18px");VMM.Lib.css(".slider-item .media blockquote p","font-size","16px");VMM.Lib.css(".slider-item","overflow-y","auto")}else{VMM.Lib.css(".slider-item .layout-text-media .text","width","40%");VMM.Lib.css(".slider-item .layout-text-media .text","display","table-cell");VMM.Lib.css(".slider-item .layout-text-media .text .container","display","table-cell");VMM.Lib.css(".slider-item .layout-text-media .text .container","width","auto");VMM.Lib.css(".slider-item .layout-text-media .text .container .start","width",u.text_media.text.width);VMM.Lib.removeClass(".slider-item .content-container","pad-top");VMM.Lib.css(".slider-item .layout-text-media .media","float","left");VMM.Lib.css(".slider-item .layout-text-media","display","table");VMM.Lib.css(".slider-item .media blockquote p","line-height","36px");VMM.Lib.css(".slider-item .media blockquote p","font-size","28px");VMM.Lib.css(".slider-item","display","table");VMM.Lib.css(".slider-item","overflow-y","auto")}VMM.Lib.css(t+".media-frame","max-width",u.text_media.width);VMM.Lib.height(t+".media-frame",u.text_media.height);VMM.Lib.width(t+".media-frame",u.text_media.width);VMM.Lib.css(t+"img","max-height",u.text_media.height);VMM.Lib.css(r+"img","max-height",u.media.height);VMM.Lib.css(t+"img","max-width",u.text_media.width);VMM.Lib.css(t+".avatar img","max-width",32);VMM.Lib.css(t+".avatar img","max-height",32);VMM.Lib.css(r+".avatar img","max-width",32);VMM.Lib.css(r+".avatar img","max-height",32);VMM.Lib.css(t+".article-thumb","max-width","50%");VMM.Lib.css(r+".article-thumb","max-width",200);VMM.Lib.width(t+".media-frame",u.text_media.video.width);VMM.Lib.height(t+".media-frame",u.text_media.video.height);VMM.Lib.width(r+".media-frame",u.media.video.width);VMM.Lib.height(r+".media-frame",u.media.video.height);VMM.Lib.css(r+".media-frame","max-height",u.media.video.height);VMM.Lib.css(r+".media-frame","max-width",u.media.video.width);VMM.Lib.height(r+".soundcloud",168);VMM.Lib.height(t+".soundcloud",168);VMM.Lib.width(r+".soundcloud",u.media.width);VMM.Lib.width(t+".soundcloud",u.text_media.width);VMM.Lib.css(i+".soundcloud","max-height",168);VMM.Lib.height(t+".map",u.text_media.height);VMM.Lib.width(t+".map",u.text_media.width);VMM.Lib.css(r+".map","max-height",u.media.height);VMM.Lib.width(r+".map",u.media.width);VMM.Lib.height(t+".doc",u.text_media.height);VMM.Lib.width(t+".doc",u.text_media.width);VMM.Lib.height(r+".doc",u.media.height);VMM.Lib.width(r+".doc",u.media.width);VMM.Lib.width(r+".wikipedia",u.media.width);VMM.Lib.width(r+".twitter",u.media.width);VMM.Lib.width(r+".plain-text-quote",u.media.width);VMM.Lib.width(r+".plain-text",u.media.width);VMM.Lib.css(i,"max-width",u.media.width);VMM.Lib.css(t+".caption","max-width",u.text_media.video.width);VMM.Lib.css(r+".caption","max-width",u.media.video.width);for(e=0;e<h.length;e++){h[e].layout(o);h[e].content_height()>n.slider.height+20?h[e].css("display","block"):h[e].css("display","table")}}function j(){var e=0,t=0;for(t=0;t<h.length;t++){e=t*(n.slider.width+n.spacing);h[t].leftpos(e)}}function F(e){var t="linear",r=0;for(r=0;r<h.length;r++)r==v?h[r].animate(n.duration,t,{opacity:1}):r==v-1||r==v+1?h[r].animate(n.duration,t,{opacity:.1}):h[r].opacity(e)}function I(e,t,r,s,u){var a=n.ease,f=n.duration,l=!1,p=!1,d="",m;VMM.ExternalAPI.youtube.stopPlayers();v=e;m=h[v].leftpos();v==0&&(p=!0);v+1>=h.length&&(l=!0);t!=null&&t!=""&&(a=t);r!=null&&r!=""&&(f=r);if(VMM.Browser.device=="mobile"){VMM.Lib.visible(E.prevBtn,!1);VMM.Lib.visible(E.nextBtn,!1)}else{if(p)VMM.Lib.visible(E.prevBtn,!1);else{VMM.Lib.visible(E.prevBtn,!0);d=VMM.Util.unlinkify(c[v-1].title);if(n.type=="timeline")if(typeof c[v-1].date=="undefined"){VMM.attachElement(E.prevDate,d);VMM.attachElement(E.prevTitle,"")}else{VMM.attachElement(E.prevDate,VMM.Date.prettyDate(c[v-1].startdate,!1,c[v-1].precisiondate));VMM.attachElement(E.prevTitle,d)}else VMM.attachElement(E.prevTitle,d)}if(l)VMM.Lib.visible(E.nextBtn,!1);else{VMM.Lib.visible(E.nextBtn,!0);d=VMM.Util.unlinkify(c[v+1].title);if(n.type=="timeline")if(typeof c[v+1].date=="undefined"){VMM.attachElement(E.nextDate,d);VMM.attachElement(E.nextTitle,"")}else{VMM.attachElement(E.nextDate,VMM.Date.prettyDate(c[v+1].startdate,!1,c[v+1].precisiondate));VMM.attachElement(E.nextTitle,d)}else VMM.attachElement(E.nextTitle,d)}}if(s)VMM.Lib.css(o,"left",-(m-n.slider.content.padding));else{VMM.Lib.stop(o);VMM.Lib.animate(o,f,a,{left:-(m-n.slider.content.padding)})}u&&VMM.fireEvent(w,"LOADED");if(h[v].height()>n.slider_height)VMM.Lib.css(".slider","overflow-y","scroll");else{VMM.Lib.css(w,"overflow-y","hidden");var g=0;try{g=VMM.Lib.prop(w,"scrollHeight");VMM.Lib.animate(w,f,a,{scrollTop:g-VMM.Lib.height(w)})}catch(y){g=VMM.Lib.height(w)}}D();VMM.fireEvent(i,"MESSAGE","TEST")}function q(){VMM.Lib.stop(o);VMM.Lib.animate(o,n.duration,"easeOutExpo",{left:-h[v].leftpos()+n.slider.content.padding})}function R(e,t,n){trace("showMessege "+t);VMM.attachElement(f,"<div class='vco-explainer'><div class='vco-explainer-container'><div class='vco-bezel'><div class='vco-gesture-icon'></div><div class='vco-message'><p>"+t+"</p></div></div></div></div>")}function U(){VMM.Lib.animate(f,n.duration,n.ease,{opacity:0},z)}function z(){VMM.Lib.detach(f)}function W(){var e="<div class='icon'>&nbsp;</div>";E.nextBtn=VMM.appendAndGetElement(i,"<div>","nav-next");E.prevBtn=VMM.appendAndGetElement(i,"<div>","nav-previous");E.nextBtnContainer=VMM.appendAndGetElement(E.nextBtn,"<div>","nav-container",e);E.prevBtnContainer=VMM.appendAndGetElement(E.prevBtn,"<div>","nav-container",e);if(n.type=="timeline"){E.nextDate=VMM.appendAndGetElement(E.nextBtnContainer,"<div>","date","");E.prevDate=VMM.appendAndGetElement(E.prevBtnContainer,"<div>","date","")}E.nextTitle=VMM.appendAndGetElement(E.nextBtnContainer,"<div>","title","");E.prevTitle=VMM.appendAndGetElement(E.prevBtnContainer,"<div>","title","");VMM.bindEvent(".nav-next",N);VMM.bindEvent(".nav-previous",C);VMM.bindEvent(window,k,"keydown")}function X(){var e=3e3;VMM.attachElement(w,"");i=VMM.getElement(w);s=VMM.appendAndGetElement(i,"<div>","slider-container-mask");o=VMM.appendAndGetElement(s,"<div>","slider-container");u=VMM.appendAndGetElement(o,"<div>","slider-item-container");W();_(c);if(VMM.Browser.device=="tablet"||VMM.Browser.device=="mobile"){n.duration=500;e=1e3;a=new VMM.DragSlider;a.createPanel(i,o,"",n.touch,!0);VMM.bindEvent(a,T,"DRAGUPDATE");f=VMM.appendAndGetElement(s,"<div>","vco-feedback","");R(null,"Swipe to Navigate");VMM.Lib.height(f,n.slider.height);VMM.bindEvent(f,A);VMM.bindEvent(f,A,"touchend")}x(!1,!0);VMM.Lib.visible(E.prevBtn,!1);I(n.current_slide,"easeOutExpo",e,!0,!0);b=!0}var n,r,i,s,o,u,a,f,l={},c=[],h=[],p=[],d="",v=0,m=960,g={move:!1,x:10,y:0,off:0,dampen:48},y="",b=!1,w=e,E={nextBtn:"",prevBtn:"",nextDate:"",prevDate:"",nextTitle:"",prevTitle:""};typeof t!="undefined"?n=t:n={preload:4,current_slide:0,interval:10,something:0,width:720,height:400,ease:"easeInOutExpo",duration:1e3,timeline:!1,spacing:15,slider:{width:720,height:400,content:{width:720,height:400,padding:120,padding_default:120},nav:{width:100,height:200}}};this.ver="0.6";n.slider.width=n.width;n.slider.height=n.height;this.init=function(e){h=[];p=[];typeof e!="undefined"?this.setData(e):trace("WAITING ON DATA")};this.width=function(e){if(e==null||e=="")return n.slider.width;n.slider.width=e;x()};this.height=function(e){if(e==null||e=="")return n.slider.height;n.slider.height=e;x()};this.setData=function(e){if(typeof e!="undefined"){c=e;X()}else trace("NO DATA")};this.getData=function(){return c};this.setConfig=function(e){typeof e!="undefined"?n=e:trace("NO CONFIG DATA")};this.getConfig=function(){return n};this.setSize=function(e,t){e!=null&&(n.slider.width=e);t!=null&&(n.slider.height=t);b&&x()};this.active=function(){return b};this.getCurrentNumber=function(){return v};this.setSlide=function(e){I(e)}});typeof VMM.Slider!="undefined"&&(VMM.Slider.Slide=function(e,t){var n,r,i,s,o,u,a=e,f={},o="",l="",c=!1,h=!1,p=!1,d=!0,v=!1,m="slide_",g=0,y={pushque:"",render:"",relayout:"",remove:"",skinny:!1},b={pushque:500,render:100,relayout:100,remove:3e4};m+=a.uniqueid;this.enqueue=d;this.id=m;o=VMM.appendAndGetElement(t,"<div>","slider-item");if(typeof a.classname!="undefined"){trace("HAS CLASSNAME");VMM.Lib.addClass(o,a.classname)}else{trace("NO CLASSNAME");trace(a)}u={slide:"",text:"",media:"",media_element:"",layout:"content-container layout",has:{headline:!1,text:!1,media:!1}};this.show=function(e){d=!1;y.skinny=e;v=!1;clearTimeout(y.remove);if(!c)if(h){clearTimeout(y.relayout);y.relayout=setTimeout(S,b.relayout)}else w(e)};this.hide=function(){if(c&&!v){v=!0;clearTimeout(y.remove);y.remove=setTimeout(E,b.remove)}};this.clearTimers=function(){clearTimeout(y.relayout);clearTimeout(y.pushque);clearTimeout(y.render)};this.layout=function(e){c&&h&&x(e)};this.elem=function(){return o};this.position=function(){return VMM.Lib.position(o)};this.leftpos=function(e){if(typeof e=="undefined")return VMM.Lib.position(o).left;VMM.Lib.css(o,"left",e)};this.animate=function(e,t,n){VMM.Lib.animate(o,e,t,n)};this.css=function(e,t){VMM.Lib.css(o,e,t)};this.opacity=function(e){VMM.Lib.css(o,"opacity",e)};this.width=function(){return VMM.Lib.width(o)};this.height=function(){return VMM.Lib.height(o)};this.content_height=function(){var e=VMM.Lib.find(o,".content")[0];return e!="undefined"&&e!=null?VMM.Lib.height(e):0};var w=function(e){trace("RENDER "+m);c=!0;h=!0;y.skinny=e;T();clearTimeout(y.pushque);clearTimeout(y.render);y.pushque=setTimeout(VMM.ExternalAPI.pushQues,b.pushque)},E=function(){trace("REMOVE SLIDE TIMER FINISHED");c=!1;VMM.Lib.detach(r);VMM.Lib.detach(n)},S=function(){c=!0;x(y.skinny,!0)},x=function(e,t){if(u.has.text){if(e){if(!p||t){VMM.Lib.removeClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.detach(n);VMM.Lib.append(i,r);VMM.Lib.append(i,n);p=!0}}else if(p||t){VMM.Lib.addClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.detach(n);VMM.Lib.append(i,n);VMM.Lib.append(i,r);p=!1}}else if(t){if(u.has.headline){VMM.Lib.detach(r);VMM.Lib.append(i,r)}VMM.Lib.detach(n);VMM.Lib.append(i,n)}},T=function(){trace("BUILDSLIDE");s=VMM.appendAndGetElement(o,"<div>","content");i=VMM.appendAndGetElement(s,"<div>");if(a.startdate!=null&&a.startdate!=""&&type.of(a.startdate)=="date"&&a.type!="start"){var e=VMM.Date.prettyDate(a.startdate,!1,a.precisiondate),t=VMM.Date.prettyDate(a.enddate,!1,a.precisiondate),f="";a.tag!=null&&a.tag!=""&&(f=VMM.createElement("span",a.tag,"slide-tag"));e!=t?u.text+=VMM.createElement("h2",e+" &mdash; "+t+f,"date"):u.text+=VMM.createElement("h2",e+f,"date")}if(a.headline!=null&&a.headline!=""){u.has.headline=!0;a.type=="start"?u.text+=VMM.createElement("h2",VMM.Util.linkify_with_twitter(a.headline,"_blank"),"start"):u.text+=VMM.createElement("h3",VMM.Util.linkify_with_twitter(a.headline,"_blank"))}if(a.text!=null&&a.text!=""){u.has.text=!0;u.text+=VMM.createElement("p",VMM.Util.linkify_with_twitter(a.text,"_blank"))}if(u.has.text||u.has.headline){u.text=VMM.createElement("div",u.text,"container");r=VMM.appendAndGetElement(i,"<div>","text",VMM.TextElement.create(u.text))}a.needs_slug;if(a.asset!=null&&a.asset!=""&&a.asset.media!=null&&a.asset.media!=""){u.has.media=!0;n=VMM.appendAndGetElement(i,"<div>","media",VMM.MediaElement.create(a.asset,a.uniqueid))}u.has.text&&(u.layout+="-text");u.has.media&&(u.layout+="-media");if(u.has.text)if(y.skinny){VMM.Lib.addClass(i,u.layout);p=!0}else{VMM.Lib.addClass(i,u.layout);VMM.Lib.addClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.append(i,r)}else VMM.Lib.addClass(i,u.layout)}});var Aes={};Aes.cipher=function(e,t){var n=4,r=t.length/n-1,i=[[],[],[],[]];for(var s=0;s<4*n;s++)i[s%4][Math.floor(s/4)]=e[s];i=Aes.addRoundKey(i,t,0,n);for(var o=1;o<r;o++){i=Aes.subBytes(i,n);i=Aes.shiftRows(i,n);i=Aes.mixColumns(i,n);i=Aes.addRoundKey(i,t,o,n)}i=Aes.subBytes(i,n);i=Aes.shiftRows(i,n);i=Aes.addRoundKey(i,t,r,n);var u=new Array(4*n);for(var s=0;s<4*n;s++)u[s]=i[s%4][Math.floor(s/4)];return u};Aes.keyExpansion=function(e){var t=4,n=e.length/4,r=n+6,i=new Array(t*(r+1)),s=new Array(4);for(var o=0;o<n;o++){var u=[e[4*o],e[4*o+1],e[4*o+2],e[4*o+3]];i[o]=u}for(var o=n;o<t*(r+1);o++){i[o]=new Array(4);for(var a=0;a<4;a++)s[a]=i[o-1][a];if(o%n==0){s=Aes.subWord(Aes.rotWord(s));for(var a=0;a<4;a++)s[a]^=Aes.rCon[o/n][a]}else n>6&&o%n==4&&(s=Aes.subWord(s));for(var a=0;a<4;a++)i[o][a]=i[o-n][a]^s[a]}return i};Aes.subBytes=function(e,t){for(var n=0;n<4;n++)for(var r=0;r<t;r++)e[n][r]=Aes.sBox[e[n][r]];return e};Aes.shiftRows=function(e,t){var n=new Array(4);for(var r=1;r<4;r++){for(var i=0;i<4;i++)n[i]=e[r][(i+r)%t];for(var i=0;i<4;i++)e[r][i]=n[i]}return e};Aes.mixColumns=function(e,t){for(var n=0;n<4;n++){var r=new Array(4),i=new Array(4);for(var s=0;s<4;s++){r[s]=e[s][n];i[s]=e[s][n]&128?e[s][n]<<1^283:e[s][n]<<1}e[0][n]=i[0]^r[1]^i[1]^r[2]^r[3];e[1][n]=r[0]^i[1]^r[2]^i[2]^r[3];e[2][n]=r[0]^r[1]^i[2]^r[3]^i[3];e[3][n]=r[0]^i[0]^r[1]^r[2]^i[3]}return e};Aes.addRoundKey=function(e,t,n,r){for(var i=0;i<4;i++)for(var s=0;s<r;s++)e[i][s]^=t[n*4+s][i];return e};Aes.subWord=function(e){for(var t=0;t<4;t++)e[t]=Aes.sBox[e[t]];return e};Aes.rotWord=function(e){var t=e[0];for(var n=0;n<3;n++)e[n]=e[n+1];e[3]=t;return e};Aes.sBox=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22];Aes.rCon=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]];Aes.Ctr={};Aes.Ctr.encrypt=function(e,t,n){var r=16;if(n!=128&&n!=192&&n!=256)return"";e=Utf8.encode(e);t=Utf8.encode(t);var i=n/8,s=new Array(i);for(var o=0;o<i;o++)s[o]=isNaN(t.charCodeAt(o))?0:t.charCodeAt(o);var u=Aes.cipher(s,Aes.keyExpansion(s));u=u.concat(u.slice(0,i-16));var a=new Array(r),f=(new Date).getTime(),l=f%1e3,c=Math.floor(f/1e3),h=Math.floor(Math.random()*65535);for(var o=0;o<2;o++)a[o]=l>>>o*8&255;for(var o=0;o<2;o++)a[o+2]=h>>>o*8&255;for(var o=0;o<4;o++)a[o+4]=c>>>o*8&255;var p="";for(var o=0;o<8;o++)p+=String.fromCharCode(a[o]);var d=Aes.keyExpansion(u),v=Math.ceil(e.length/r),m=new Array(v);for(var g=0;g<v;g++){for(var y=0;y<4;y++)a[15-y]=g>>>y*8&255;for(var y=0;y<4;y++)a[15-y-4]=g/4294967296>>>y*8;var b=Aes.cipher(a,d),w=g<v-1?r:(e.length-1)%r+1,E=new Array(w);for(var o=0;o<w;o++){E[o]=b[o]^e.charCodeAt(g*r+o);E[o]=String.fromCharCode(E[o])}m[g]=E.join("")}var S=p+m.join("");S=Base64.encode(S);return S};Aes.Ctr.decrypt=function(e,t,n){var r=16;if(n!=128&&n!=192&&n!=256)return"";e=Base64.decode(e);t=Utf8.encode(t);var i=n/8,s=new Array(i);for(var o=0;o<i;o++)s[o]=isNaN(t.charCodeAt(o))?0:t.charCodeAt(o);var u=Aes.cipher(s,Aes.keyExpansion(s));u=u.concat(u.slice(0,i-16));var a=new Array(8);ctrTxt=e.slice(0,8);for(var o=0;o<8;o++)a[o]=ctrTxt.charCodeAt(o);var f=Aes.keyExpansion(u),l=Math.ceil((e.length-8)/r),c=new Array(l);for(var h=0;h<l;h++)c[h]=e.slice(8+h*r,8+h*r+r);e=c;var p=new Array(e.length);for(var h=0;h<l;h++){for(var d=0;d<4;d++)a[15-d]=h>>>d*8&255;for(var d=0;d<4;d++)a[15-d-4]=(h+1)/4294967296-1>>>d*8&255;var v=Aes.cipher(a,f),m=new Array(e[h].length);for(var o=0;o<e[h].length;o++){m[o]=v[o]^e[h].charCodeAt(o);m[o]=String.fromCharCode(m[o])}p[h]=m.join("")}var g=p.join("");g=Utf8.decode(g);return g};var Base64={};Base64.code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";Base64.encode=function(e,t){t=typeof t=="undefined"?!1:t;var n,r,i,s,o,u,a,f,l=[],c="",h,p,d,v=Base64.code;p=t?e.encodeUTF8():e;h=p.length%3;if(h>0)while(h++<3){c+="=";p+="\0"}for(h=0;h<p.length;h+=3){n=p.charCodeAt(h);r=p.charCodeAt(h+1);i=p.charCodeAt(h+2);s=n<<16|r<<8|i;o=s>>18&63;u=s>>12&63;a=s>>6&63;f=s&63;l[h/3]=v.charAt(o)+v.charAt(u)+v.charAt(a)+v.charAt(f)}d=l.join("");d=d.slice(0,d.length-c.length)+c;return d};Base64.decode=function(e,t){t=typeof t=="undefined"?!1:t;var n,r,i,s,o,u,a,f,l=[],c,h,p=Base64.code;h=t?e.decodeUTF8():e;for(var d=0;d<h.length;d+=4){s=p.indexOf(h.charAt(d));o=p.indexOf(h.charAt(d+1));u=p.indexOf(h.charAt(d+2));a=p.indexOf(h.charAt(d+3));f=s<<18|o<<12|u<<6|a;n=f>>>16&255;r=f>>>8&255;i=f&255;l[d/4]=String.fromCharCode(n,r,i);a==64&&(l[d/4]=String.fromCharCode(n,r));u==64&&(l[d/4]=String.fromCharCode(n))}c=l.join("");return t?c.decodeUTF8():c};var Utf8={};Utf8.encode=function(e){var t=e.replace(/[\u0080-\u07ff]/g,function(e){var t=e.charCodeAt(0);return String.fromCharCode(192|t>>6,128|t&63)});t=t.replace(/[\u0800-\uffff]/g,function(e){var t=e.charCodeAt(0);return String.fromCharCode(224|t>>12,128|t>>6&63,128|t&63)});return t};Utf8.decode=function(e){var t=e.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(e){var t=(e.charCodeAt(0)&15)<<12|(e.charCodeAt(1)&63)<<6|e.charCodeAt(2)&63;return String.fromCharCode(t)});t=t.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(e){var t=(e.charCodeAt(0)&31)<<6|e.charCodeAt(1)&63;return String.fromCharCode(t)});return t};!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t;this.$element=e(n);this.options=this.getOptions(r);this.enabled=!0;if(this.options.trigger!="manual"){i=this.options.trigger=="hover"?"mouseenter":"focus";s=this.options.trigger=="hover"?"mouseleave":"blur";this.$element.on(i,this.options.selector,e.proxy(this.enter,this));this.$element.on(s,this.options.selector,e.proxy(this.leave,this))}this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){t=e.extend({},e.fn[this.type].defaults,t,this.$element.data());t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay});return t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)n.show();else{n.hoverState="in";setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)}},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.hide)n.hide();else{n.hoverState="out";setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)}},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip();this.setContent();this.options.animation&&e.addClass("fade");s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement;t=/in/.test(s);e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body);
n=this.getPosition(t);r=e[0].offsetWidth;i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},setContent:function(){var e=this.tip();e.find(".timeline-tooltip-inner").html(this.getTitle());e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t);n.remove()})}var t=this,n=this.tip();n.removeClass("in");e.support.transition&&this.$tip.hasClass("fade")?r():n.remove()},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title);e=e.toString().replace(/(^\s*|\s*$)/,"");return e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}};e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s));typeof n=="string"&&i[n]()})};e.fn.tooltip.Constructor=t;e.fn.tooltip.defaults={animation:!0,delay:0,selector:!1,placement:"top",trigger:"hover",title:"",template:'<div class="timeline-tooltip"><div class="timeline-tooltip-arrow"></div><div class="timeline-tooltip-inner"></div></div>'}}(window.jQuery);typeof VMM!="undefined"&&typeof VMM.StoryJS=="undefined"&&(VMM.StoryJS=function(){this.init=function(e){}});if(typeof VMM!="undefined"&&typeof VMM.Timeline=="undefined"){VMM.Timeline=function(e,t,n){function S(e){typeof embed_config=="object"&&(timeline_config=embed_config);if(typeof timeline_config=="object"){trace("HAS TIMELINE CONFIG");m=VMM.Util.mergeConfig(m,timeline_config)}else typeof e=="object"&&(m=VMM.Util.mergeConfig(m,e));if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet")m.touch=!0;m.nav.width=m.width;m.nav.height=200;m.feature.width=m.width;m.feature.height=m.height-m.nav.height;m.nav.zoom.adjust=parseInt(m.start_zoom_adjust,10);VMM.Timeline.Config=m;VMM.master_config.Timeline=VMM.Timeline.Config;this.events=m.events;m.gmap_key!=""&&(m.api_keys.google=m.gmap_key);trace("VERSION "+m.version);c=m.version}function x(){r=VMM.getElement(h);VMM.Lib.addClass(r,"vco-timeline");VMM.Lib.addClass(r,"vco-storyjs");i=VMM.appendAndGetElement(r,"<div>","vco-container vco-main");s=VMM.appendAndGetElement(i,"<div>","vco-feature");u=VMM.appendAndGetElement(s,"<div>","vco-slider");a=VMM.appendAndGetElement(i,"<div>","vco-navigation");o=VMM.appendAndGetElement(r,"<div>","vco-feedback","");typeof m.language.right_to_left!="undefined"&&VMM.Lib.addClass(r,"vco-right-to-left");f=new VMM.Slider(u,m);l=new VMM.Timeline.TimeNav(a);g?VMM.Lib.width(r,m.width):m.width=VMM.Lib.width(r);y?VMM.Lib.height(r,m.height):m.height=VMM.Lib.height(r);m.touch?VMM.Lib.addClass(r,"vco-touch"):VMM.Lib.addClass(r,"vco-notouch")}function T(e,t){trace("onDataReady");d=t.timeline;type.of(d.era)!="array"&&(d.era=[]);W()}function N(){U()}function C(){z();f.setSize(m.feature.width,m.feature.height);l.setSize(m.width,m.height);j()&&H()}function k(e){m.loaded.slider=!0;L()}function L(e){m.loaded.percentloaded=m.loaded.percentloaded+25;m.loaded.slider&&m.loaded.timenav&&q()}function A(e){m.loaded.timenav=!0;L()}function O(e){w=!0;m.current_slide=f.getCurrentNumber();D(m.current_slide);l.setMarker(m.current_slide,m.ease,m.duration)}function M(e){w=!0;m.current_slide=l.getCurrentNumber();D(m.current_slide);f.setSlide(m.current_slide)}function _(e){if(e<=v.length-1&&e>=0){m.current_slide=e;f.setSlide(m.current_slide);l.setMarker(m.current_slide,m.ease,m.duration)}}function D(e){m.hash_bookmark&&(window.location.hash="#"+e.toString())}function P(){}function H(){var e="",t=B(window.orientation);VMM.Browser.device=="mobile"?t=="portrait"?e="width=device-width; initial-scale=0.5, maximum-scale=0.5":t=="landscape"?e="width=device-width; initial-scale=0.5, maximum-scale=0.5":e="width=device-width, initial-scale=1, maximum-scale=1.0":VMM.Browser.device=="tablet";document.getElementById("viewport")}function B(e){var t="";e==0||e==180?t="portrait":e==90||e==-90?t="landscape":t="normal";return t}function j(){var e=B(window.orientation);if(e==m.orientation)return!1;m.orientation=e;return!0}function F(e){VMM.getJSON(e,function(e){d=VMM.Timeline.DataObj.getData(e);VMM.fireEvent(global,m.events.data_ready)})}function I(e,t,n){trace("showMessege "+t);n?VMM.attachElement(o,t):VMM.attachElement(o,VMM.MediaElement.loadingmessage(t))}function q(){VMM.Lib.animate(o,m.duration,m.ease*4,{opacity:0},R)}function R(){VMM.Lib.detach(o)}function U(){parseInt(m.start_at_slide)>0&&m.current_slide==0&&(m.current_slide=parseInt(m.start_at_slide));m.start_at_end&&m.current_slide==0&&(m.current_slide=v.length-1);if(b){b=!0;VMM.fireEvent(global,m.events.messege,"Internet Explorer "+VMM.Browser.version+" is not supported by TimelineJS. Please update your browser to version 8 or higher. If you are using a recent version of Internet Explorer you may need to disable compatibility mode in your browser.")}else{R();C();VMM.bindEvent(u,k,"LOADED");VMM.bindEvent(a,A,"LOADED");VMM.bindEvent(u,O,"UPDATE");VMM.bindEvent(a,M,"UPDATE");f.init(v);l.init(v,d.era);VMM.bindEvent(global,C,m.events.resize)}}function z(){trace("UPDATE SIZE");m.width=VMM.Lib.width(r);m.height=VMM.Lib.height(r);m.nav.width=m.width;m.feature.width=m.width;m.feature.height=m.height-m.nav.height-3;VMM.Browser.device=="mobile";m.width<641?VMM.Lib.addClass(r,"vco-skinny"):VMM.Lib.removeClass(r,"vco-skinny")}function W(){v=[];VMM.fireEvent(global,m.events.messege,"Building Dates");z();for(var e=0;e<d.date.length;e++)if(d.date[e].startDate!=null&&d.date[e].startDate!=""){var t={},n=VMM.Date.parse(d.date[e].startDate,!0),r;t.startdate=n.date;t.precisiondate=n.precision;if(!isNaN(t.startdate)){d.date[e].endDate!=null&&d.date[e].endDate!=""?t.enddate=VMM.Date.parse(d.date[e].endDate):t.enddate=t.startdate;t.needs_slug=!1;d.date[e].headline==""&&d.date[e].slug!=null&&d.date[e].slug!=""&&(t.needs_slug=!0);t.title=d.date[e].headline;t.headline=d.date[e].headline;t.type=d.date[e].type;t.date=VMM.Date.prettyDate(t.startdate,!1,t.precisiondate);t.asset=d.date[e].asset;t.fulldate=t.startdate.getTime();t.text=d.date[e].text;t.content="";t.tag=d.date[e].tag;t.slug=d.date[e].slug;t.uniqueid=VMM.Util.unique_ID(7);t.classname=d.date[e].classname;v.push(t)}}d.type!="storify"&&v.sort(function(e,t){return e.fulldate-t.fulldate});if(d.headline!=null&&d.headline!=""&&d.text!=null&&d.text!=""){var i,n,t={},s=0,o;if(typeof d.startDate!="undefined"){n=VMM.Date.parse(d.startDate,!0);i=n.date}else i=!1;trace("HAS STARTPAGE");trace(i);if(i&&i<v[0].startdate)t.startdate=new Date(i);else{o=v[0].startdate;t.startdate=new Date(v[0].startdate);o.getMonth()===0&&o.getDate()==1&&o.getHours()===0&&o.getMinutes()===0?t.startdate.setFullYear(o.getFullYear()-1):o.getDate()<=1&&o.getHours()===0&&o.getMinutes()===0?t.startdate.setMonth(o.getMonth()-1):o.getHours()===0&&o.getMinutes()===0?t.startdate.setDate(o.getDate()-1):o.getMinutes()===0?t.startdate.setHours(o.getHours()-1):t.startdate.setMinutes(o.getMinutes()-1)}t.uniqueid=VMM.Util.unique_ID(7);t.enddate=t.startdate;t.precisiondate=n.precision;t.title=d.headline;t.headline=d.headline;t.text=d.text;t.type="start";t.date=VMM.Date.prettyDate(d.startDate,!1,t.precisiondate);t.asset=d.asset;t.slug=!1;t.needs_slug=!1;t.fulldate=t.startdate.getTime();m.embed&&VMM.fireEvent(global,m.events.headline,t.headline);v.unshift(t)}d.type!="storify"&&v.sort(function(e,t){return e.fulldate-t.fulldate});N()}var r,i,s,o,u,a,f,l,c="2.x",h="#timelinejs",p={},d={},v=[],m={},g=!1,y=!1,b=!1,w=!1;type.of(e)=="string"?e.match("#")?h=e:h="#"+e:h="#timelinejs";m={embed:!1,events:{data_ready:"DATAREADY",messege:"MESSEGE",headline:"HEADLINE",slide_change:"SLIDE_CHANGE",resize:"resize"},id:h,source:"nothing",type:"timeline",touch:!1,orientation:"normal",maptype:"",version:"2.x",preload:4,current_slide:0,hash_bookmark:!1,start_at_end:!1,start_at_slide:0,start_zoom_adjust:0,start_page:!1,api_keys:{google:"",flickr:"",twitter:""},interval:10,something:0,width:960,height:540,spacing:15,loaded:{slider:!1,timenav:!1,percentloaded:0},nav:{start_page:!1,interval_width:200,density:4,minor_width:0,minor_left:0,constraint:{left:0,right:0,right_min:0,right_max:0},zoom:{adjust:0},multiplier:{current:6,min:.1,max:50},rows:[1,1,1],width:960,height:200,marker:{width:150,height:50}},feature:{width:960,height:540},slider:{width:720,height:400,content:{width:720,height:400,padding:130,padding_default:130},nav:{width:100,height:200}},ease:"easeInOutExpo",duration:1e3,gmap_key:"",language:VMM.Language};if(t!=null&&t!=""){m.width=t;g=!0}if(n!=null&&n!=""){m.height=n;y=!0}if(window.location.hash){var E=window.location.hash.substring(1);isNaN(E)||(m.current_slide=parseInt(E))}window.onhashchange=function(){var e=window.location.hash.substring(1);m.hash_bookmark?w?_(parseInt(e)):w=!1:_(parseInt(e))};this.init=function(e,t){trace("INIT");H();S(e);x();type.of(t)=="string"&&(m.source=t);VMM.Date.setLanguage(m.language);VMM.master_config.language=m.language;VMM.ExternalAPI.setKeys(m.api_keys);VMM.ExternalAPI.googlemaps.setMapType(m.maptype);VMM.bindEvent(global,T,m.events.data_ready);VMM.bindEvent(global,I,m.events.messege);VMM.fireEvent(global,m.events.messege,m.language.messages.loading_timeline);(VMM.Browser.browser=="Explorer"||VMM.Browser.browser=="MSIE")&&parseInt(VMM.Browser.version,10)<=7&&(b=!0);type.of(m.source)=="string"||type.of(m.source)=="object"?VMM.Timeline.DataObj.getData(m.source):VMM.fireEvent(global,m.events.messege,"No data source provided")};this.iframeLoaded=function(){trace("iframeLoaded")};this.reload=function(e){trace("Load new timeline data"+e);VMM.fireEvent(global,m.events.messege,m.language.messages.loading_timeline);d={};VMM.Timeline.DataObj.getData(e);m.current_slide=0;f.setSlide(0);l.setMarker(0,m.ease,m.duration)}};VMM.Timeline.Config={}}typeof VMM.Timeline!="undefined"&&typeof VMM.Timeline.TimeNav=="undefined"&&(VMM.Timeline.TimeNav=function(e,t,n){function U(){trace("onConfigSet")}function z(e){b.nav.constraint.left=b.width/2;b.nav.constraint.right=b.nav.constraint.right_min-b.width/2;y.updateConstraint(b.nav.constraint);VMM.Lib.css(h,"left",Math.round(b.width/2)+2);VMM.Lib.css(p,"left",Math.round(b.width/2)-8);Y(b.current_slide,b.ease,b.duration,!0,e)}function W(){VMM.fireEvent(x,"UPDATE")}function X(){y.cancelSlide();if(b.nav.multiplier.current>b.nav.multiplier.min){b.nav.multiplier.current<=1?b.nav.multiplier.current=b.nav.multiplier.current-.25:b.nav.multiplier.current>5?b.nav.multiplier.current>16?b.nav.multiplier.current=Math.round(b.nav.multiplier.current-10):b.nav.multiplier.current=Math.round(b.nav.multiplier.current-4):b.nav.multiplier.current=Math.round(b.nav.multiplier.current-1);b.nav.multiplier.current<=0&&(b.nav.multiplier.current=b.nav.multiplier.min);K()}}function V(){y.cancelSlide();if(b.nav.multiplier.current<b.nav.multiplier.max){b.nav.multiplier.current>4?b.nav.multiplier.current>16?b.nav.multiplier.current=Math.round(b.nav.multiplier.current+10):b.nav.multiplier.current=Math.round(b.nav.multiplier.current+4):b.nav.multiplier.current=Math.round(b.nav.multiplier.current+1);b.nav.multiplier.current>=b.nav.multiplier.max&&(b.nav.multiplier.current=b.nav.multiplier.max);K()}}function $(e){y.cancelSlide();Y(0);W()}function J(e){var t=0,n=0;e||(e=window.event);e.originalEvent&&(e=e.originalEvent);if(typeof e.wheelDeltaX!="undefined"){t=e.wheelDeltaY/6;Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)?t=e.wheelDeltaX/6:t=0}if(t){e.preventDefault&&e.preventDefault();e.returnValue=!1}n=VMM.Lib.position(r).left+t;n>b.nav.constraint.left?n=b.width/2:n<b.nav.constraint.right&&(n=b.nav.constraint.right);VMM.Lib.css(r,"left",n)}function K(){trace("config.nav.multiplier "+b.nav.multiplier.current);ut(!0);at(!0);ft(a,k,!0,!0);ft(f,L,!0);b.nav.constraint.left=b.width/2;b.nav.constraint.right=b.nav.constraint.right_min-b.width/2;y.updateConstraint(b.nav.constraint)}function Q(e){y.cancelSlide();Y(e.data.number);W()}function G(e){VMM.Lib.toggleClass(e.data.elem,"zFront")}function Y(e,t,n,i,s){trace("GO TO MARKER");var o=b.ease,u=b.duration,a=!1,f=!1;O=e;H.left=b.width/2-C[O].pos_left;H.visible.left=Math.abs(H.left)-100;H.visible.right=Math.abs(H.left)+b.width+100;O==0&&(f=!0);O+1==C.length&&(a=!0);t!=null&&t!=""&&(o=t);n!=null&&n!=""&&(u=n);for(var l=0;l<C.length;l++)VMM.Lib.removeClass(C[l].marker,"active");if(b.start_page&&C[0].type=="start"){VMM.Lib.visible(C[0].marker,!1);VMM.Lib.addClass(C[0].marker,"start")}VMM.Lib.addClass(C[O].marker,"active");VMM.Lib.stop(r);VMM.Lib.animate(r,u,o,{left:H.left})}function Z(e,t){VMM.Lib.animate(r,t.time/2,b.ease,{left:t.left})}function et(){var e=0,t=0,n=0,r=[],i=0;for(i=0;i<C.length;i++)if(T[i].type!="start"){var s=ot(F,C[i].relative_pos),e=t;t=s.begin;n=t-e;r.push(n)}return VMM.Util.average(r).mean}function tt(){var e=0,t=0,n="",r=0,i=[],s=!0,o=0;for(o=0;o<T.length;o++)if(T[o].type=="start")trace("DATA DATE IS START");else{n=T[o].startdate;e=t;t=n;r=t-e;i.push(r)}return VMM.Util.average(i)}function nt(){var e=b.nav.multiplier.current,t=0;for(t=0;t<e;t++)et()<75&&b.nav.multiplier.current>1&&(b.nav.multiplier.current=b.nav.multiplier.current-1)}function rt(){var e=it(T[0].startdate),t=it(T[T.length-1].enddate);R.eon.type="eon";R.eon.first=e.eons;R.eon.base=Math.floor(e.eons);R.eon.last=t.eons;R.eon.number=S.eons;R.eon.multiplier=B.eons;R.eon.minor=B.eons;R.era.type="era";R.era.first=e.eras;R.era.base=Math.floor(e.eras);R.era.last=t.eras;R.era.number=S.eras;R.era.multiplier=B.eras;R.era.minor=B.eras;R.epoch.type="epoch";R.epoch.first=e.epochs;R.epoch.base=Math.floor(e.epochs);R.epoch.last=t.epochs;R.epoch.number=S.epochs;R.epoch.multiplier=B.epochs;R.epoch.minor=B.epochs;R.age.type="age";R.age.first=e.ages;R.age.base=Math.floor(e.ages);R.age.last=t.ages;R.age.number=S.ages;R.age.multiplier=B.ages;R.age.minor=B.ages;R.millenium.type="millenium";R.millenium.first=e.milleniums;R.millenium.base=Math.floor(e.milleniums);R.millenium.last=t.milleniums;R.millenium.number=S.milleniums;R.millenium.multiplier=B.millenium;R.millenium.minor=B.millenium;R.century.type="century";R.century.first=e.centuries;R.century.base=Math.floor(e.centuries);R.century.last=t.centuries;R.century.number=S.centuries;R.century.multiplier=B.century;R.century.minor=B.century;R.decade.type="decade";R.decade.first=e.decades;R.decade.base=Math.floor(e.decades);R.decade.last=t.decades;R.decade.number=S.decades;R.decade.multiplier=B.decade;R.decade.minor=B.decade;R.year.type="year";R.year.first=e.years;R.year.base=Math.floor(e.years);R.year.last=t.years;R.year.number=S.years;R.year.multiplier=1;R.year.minor=B.month;R.month.type="month";R.month.first=e.months;R.month.base=Math.floor(e.months);R.month.last=t.months;R.month.number=S.months;R.month.multiplier=1;R.month.minor=Math.round(B.week);R.week.type="week";R.week.first=e.weeks;R.week.base=Math.floor(e.weeks);R.week.last=t.weeks;R.week.number=S.weeks;R.week.multiplier=1;R.week.minor=7;R.day.type="day";R.day.first=e.days;R.day.base=Math.floor(e.days);R.day.last=t.days;R.day.number=S.days;R.day.multiplier=1;R.day.minor=24;R.hour.type="hour";R.hour.first=e.hours;R.hour.base=Math.floor(e.hours);R.hour.last=t.hours;R.hour.number=S.hours;R.hour.multiplier=1;R.hour.minor=60;R.minute.type="minute";R.minute.first=e.minutes;R.minute.base=Math.floor(e.minutes);R.minute.last=t.minutes;R.minute.number=S.minutes;R.minute.multiplier=1;R.minute.minor=60;R.second.type="decade";R.second.first=e.seconds;R.second.base=Math.floor(e.seconds);R.second.last=t.seconds;R.second.number=S.seconds;R.second.multiplier=1;R.second.minor=10}function it(e,t){var n={};n.days=e/j.day;n.weeks=n.days/j.week;n.months=n.days/j.month;n.years=n.months/j.year;n.hours=n.days*j.hour;n.minutes=n.days*j.minute;n.seconds=n.days*j.second;n.decades=n.years/j.decade;n.centuries=n.years/j.century;n.milleniums=n.years/j.millenium;n.ages=n.years/j.age;n.epochs=n.years/j.epoch;n.eras=n.years/j.era;n.eons=n.years/j.eon;return n}function st(e,t,n){var r,i,s=e.type,o={start:"",end:"",type:s};r=it(t);o.start=t.months;s=="eon"?o.start=r.eons:s=="era"?o.start=r.eras:s=="epoch"?o.start=r.epochs:s=="age"?o.start=r.ages:s=="millenium"?o.start=t.milleniums:s=="century"?o.start=r.centuries:s=="decade"?o.start=r.decades:s=="year"?o.start=r.years:s=="month"?o.start=r.months:s=="week"?o.start=r.weeks:s=="day"?o.start=r.days:s=="hour"?o.start=r.hours:s=="minute"&&(o.start=r.minutes);if(type.of(n)=="date"){i=it(n);o.end=n.months;s=="eon"?o.end=i.eons:s=="era"?o.end=i.eras:s=="epoch"?o.end=i.epochs:s=="age"?o.end=i.ages:s=="millenium"?o.end=n.milleniums:s=="century"?o.end=i.centuries:s=="decade"?o.end=i.decades:s=="year"?o.end=i.years:s=="month"?o.end=i.months:s=="week"?o.end=i.weeks:s=="day"?o.end=i.days:s=="hour"?o.end=i.hours:s=="minute"&&(o.end=i.minutes)}else o.end=o.start;return o}function ot(e,t){return{begin:(t.start-F.base)*(b.nav.interval_width/b.nav.multiplier.current),end:(t.end-F.base)*(b.nav.interval_width/b.nav.multiplier.current)}}function ut(e){var t=2,n=0,i=-2,s=0,o=0,u=150,a=6,f=0,l=b.width,c=[],h=6,p={left:H.visible.left-l,right:H.visible.right+l},d=0,v=0;b.nav.minor_width=b.width;VMM.Lib.removeClass(".flag","row1");VMM.Lib.removeClass(".flag","row2");VMM.Lib.removeClass(".flag","row3");for(d=0;d<C.length;d++){var m,g=C[d],y=ot(F,C[d].relative_pos),w=0,E=!1,S={id:d,pos:0,row:0},x=0;y.begin=Math.round(y.begin+i);y.end=Math.round(y.end+i);m=Math.round(y.end-y.begin);g.pos_left=y.begin;if(O==d){H.left=b.width/2-y;H.visible.left=Math.abs(H.left);H.visible.right=Math.abs(H.left)+b.width;p.left=H.visible.left-l;p.right=H.visible.right+l}Math.abs(y.begin)>=p.left&&Math.abs(y.begin)<=p.right&&(E=!0);if(e){VMM.Lib.stop(g.marker);VMM.Lib.animate(g.marker,b.duration/2,b.ease,{left:y.begin})}else{VMM.Lib.stop(g.marker);VMM.Lib.css(g.marker,"left",y.begin)}d==O&&(f=y.begin);if(m>5){VMM.Lib.css(g.lineevent,"height",a);VMM.Lib.css(g.lineevent,"top",u);e?VMM.Lib.animate(g.lineevent,b.duration/2,b.ease,{width:m}):VMM.Lib.css(g.lineevent,"width",m)}if(A.length>0){for(v=0;v<A.length;v++)if(v<b.nav.rows.current.length&&g.tag==A[v]){t=v;if(v==b.nav.rows.current.length-1){trace("ON LAST ROW");VMM.Lib.addClass(g.flag,"flag-small-last")}}w=b.nav.rows.current[t]}else{if(y.begin-n.begin<b.nav.marker.width+b.spacing)if(t<b.nav.rows.current.length-1)t++;else{t=0;s++}else{s=1;t=1}w=b.nav.rows.current[t]}n=y;S.pos=y;S.row=t;c.push(S);c.length>h&&VMM.Util.removeRange(c,0);if(e){VMM.Lib.stop(g.flag);VMM.Lib.animate(g.flag,b.duration,b.ease,{top:w})}else{VMM.Lib.stop(g.flag);VMM.Lib.css(g.flag,"top",w)}b.start_page&&C[d].type=="start"&&VMM.Lib.visible(g.marker,!1);y>b.nav.minor_width&&(b.nav.minor_width=y);y<b.nav.minor_left&&(b.nav.minor_left=y)}if(e){VMM.Lib.stop(r);VMM.Lib.animate(r,b.duration/2,b.ease,{left:b.width/2-f})}}function at(e){var t=0,n=0;for(t=0;t<N.length;t++){var r=N[t],i=ot(F,r.relative_pos),s=0,o=0,u=b.nav.marker.height*b.nav.rows.full.length,a=i.end-i.begin;if(r.tag!=""){u=b.nav.marker.height*b.nav.rows.full.length/b.nav.rows.current.length;for(n=0;n<A.length;n++)n<b.nav.rows.current.length&&r.tag==A[n]&&(o=n);s=b.nav.rows.current[o]}else s=-1;if(e){VMM.Lib.stop(r.content);VMM.Lib.stop(r.text_content);VMM.Lib.animate(r.content,b.duration/2,b.ease,{top:s,left:i.begin,width:a,height:u});VMM.Lib.animate(r.text_content,b.duration/2,b.ease,{left:i.begin})}else{VMM.Lib.stop(r.content);VMM.Lib.stop(r.text_content);VMM.Lib.css(r.content,"left",i.begin);VMM.Lib.css(r.content,"width",a);VMM.Lib.css(r.content,"height",u);VMM.Lib.css(r.content,"top",s);VMM.Lib.css(r.text_content,"left",i.begin)}}}function ft(e,t,n,r){var s=0,o=0,u=b.width,a={left:H.visible.left-u,right:H.visible.right+u};not_too_many=!0,i=0;b.nav.minor_left=0;if(t.length>100){not_too_many=!1;trace("TOO MANY "+t.length)}for(i=0;i<t.length;i++){var f=t[i].element,l=t[i].date,c=t[i].visible,h=ot(F,t[i].relative_pos),p=h.begin,v=t[i].animation,m=!0,g=!1,y=50;v.pos=p;v.animate=!1;Math.abs(p)>=a.left&&Math.abs(p)<=a.right&&(g=!0);b.nav.multiplier.current>16&&r?m=!1:p-s<65&&(p-s<35?i%4==0?p==0&&(m=!1):m=!1:VMM.Util.isEven(i)||(m=!1));if(m){if(t[i].is_detached){VMM.Lib.append(e,f);t[i].is_detached=!1}}else{t[i].is_detached=!0;VMM.Lib.detach(f)}if(c)if(!m){v.opacity="0";n&&not_too_many&&(v.animate=!0);t[i].interval_visible=!1}else{v.opacity="100";n&&g&&(v.animate=!0)}else{v.opacity="100";if(m){n&&not_too_many?v.animate=!0:n&&g&&(v.animate=!0);t[i].interval_visible=!0}else n&&not_too_many&&(v.animate=!0)}s=p;p>b.nav.minor_width&&(b.nav.minor_width=p);p<b.nav.minor_left&&(b.nav.minor_left=p);if(v.animate)VMM.Lib.animate(f,b.duration/2,b.ease,{opacity:v.opacity,left:v.pos});else{VMM.Lib.css(f,"opacity",v.opacity);VMM.Lib.css(f,"left",p)}}b.nav.constraint.right_min=-b.nav.minor_width+b.width;b.nav.constraint.right=b.nav.constraint.right_min+b.width/2;VMM.Lib.css(d,"left",b.nav.minor_left-b.width/2);VMM.Lib.width(d,b.nav.minor_width+b.width+Math.abs(b.nav.minor_left))}function lt(e,t,n){var r=0,i=!0,s=0,o=0,u,a,f,l=Math.ceil(e.number)+2,c={flag:!1,offset:0},h=0;VMM.attachElement(n,"");e.date=new Date(T[0].startdate.getFullYear(),0,1,0,0,0);u=e.date.getTimezoneOffset();for(h=0;h<l;h++){trace(e.type);var p=!1,v={element:VMM.appendAndGetElement(n,"<div>",e.classname),date:new Date(T[0].startdate.getFullYear(),0,1,0,0,0),visible:!1,date_string:"",type:e.interval_type,relative_pos:0,is_detached:!1,animation:{animate:!1,pos:"",opacity:"100"}};if(e.type=="eon"){i&&(a=Math.floor(T[0].startdate.getFullYear()/5e8)*5e8);v.date.setFullYear(a+r*5e8);p=!0}else if(e.type=="era"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e8)*1e8);v.date.setFullYear(a+r*1e8);p=!0}else if(e.type=="epoch"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e7)*1e7);v.date.setFullYear(a+r*1e7);p=!0}else if(e.type=="age"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e6)*1e6);v.date.setFullYear(a+r*1e6);p=!0}else if(e.type=="millenium"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e3)*1e3);v.date.setFullYear(a+r*1e3);p=!0}else if(e.type=="century"){i&&(a=Math.floor(T[0].startdate.getFullYear()/100)*100);v.date.setFullYear(a+r*100);p=!0}else if(e.type=="decade"){i&&(a=Math.floor(T[0].startdate.getFullYear()/10)*10);v.date.setFullYear(a+r*10);p=!0}else if(e.type=="year"){i&&(a=T[0].startdate.getFullYear());v.date.setFullYear(a+r);p=!0}else if(e.type=="month"){i&&(a=T[0].startdate.getMonth());v.date.setMonth(a+r)}else if(e.type=="week"){i&&(a=T[0].startdate.getMonth());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(a+r*7)}else if(e.type=="day"){i&&(a=T[0].startdate.getDate());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(a+r)}else if(e.type=="hour"){i&&(a=T[0].startdate.getHours());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(a+r)}else if(e.type=="minute"){i&&(a=T[0].startdate.getMinutes());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(a+r)}else if(e.type=="second"){i&&(a=T[0].startdate.getSeconds());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(T[0].startdate.getMinutes());v.date.setSeconds(a+r)}else if(e.type=="millisecond"){i&&(a=T[0].startdate.getMilliseconds());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(T[0].startdate.getMinutes());v.date.setSeconds(T[0].startdate.getSeconds());v.date.setMilliseconds(a+r)}if(VMM.Browser.browser=="Firefox")if(v.date.getFullYear()=="1970"&&v.date.getTimezoneOffset()!=u){trace("FIREFOX 1970 TIMEZONE OFFSET "+v.date.getTimezoneOffset()+" SHOULD BE "+u);trace(e.type+" "+e.date);c.offset=v.date.getTimezoneOffset()/60;c.flag=!0;v.date.setHours(v.date.getHours()+c.offset)}else if(c.flag){c.flag=!1;v.date.setHours(v.date.getHours()+c.offset);p&&(c.flag=!0)}p?v.date.getFullYear()<0?v.date_string=Math.abs(v.date.getFullYear()).toString()+" B.C.":v.date_string=v.date.getFullYear():v.date_string=VMM.Date.prettyDate(v.date,!0);r+=1;i=!1;v.relative_pos=st(F,v.date);s=v.relative_pos.begin;v.relative_pos.begin>o&&(o=v.relative_pos.begin);VMM.appendElement(v.element,v.date_string);VMM.Lib.css(v.element,"text-indent",-(VMM.Lib.width(v.element)/2));VMM.Lib.css(v.element,"opacity","0");t.push(v)}VMM.Lib.width(d,o);ft(n,t)}function ct(){var e=0,t=0;VMM.attachElement(x,"");r=VMM.appendAndGetElement(x,"<div>","timenav");s=VMM.appendAndGetElement(r,"<div>","content");o=VMM.appendAndGetElement(r,"<div>","time");u=VMM.appendAndGetElement(o,"<div>","time-interval-minor");d=VMM.appendAndGetElement(u,"<div>","minor");f=VMM.appendAndGetElement(o,"<div>","time-interval-major");a=VMM.appendAndGetElement(o,"<div>","time-interval");l=VMM.appendAndGetElement(x,"<div>","timenav-background");h=VMM.appendAndGetElement(l,"<div>","timenav-line");p=VMM.appendAndGetElement(l,"<div>","timenav-indicator");c=VMM.appendAndGetElement(l,"<div>","timenav-interval-background","<div class='top-highlight'></div>");v=VMM.appendAndGetElement(x,"<div>","vco-toolbar");ht();pt();dt();nt();ut(!1);at();ft(a,k,!1,!0);ft(f,L);if(b.start_page){$backhome=VMM.appendAndGetElement(v,"<div>","back-home","<div class='icon'></div>");VMM.bindEvent(".back-home",$,"click");VMM.Lib.attribute($backhome,"title",VMM.master_config.language.messages.return_to_title);VMM.Lib.attribute($backhome,"rel","timeline-tooltip")}y=new VMM.DragSlider;y.createPanel(x,r,b.nav.constraint,b.touch);if(b.touch&&b.start_page){VMM.Lib.addClass(v,"touch");VMM.Lib.css(v,"top",55);VMM.Lib.css(v,"left",10)}else{b.start_page&&VMM.Lib.css(v,"top",27);m=VMM.appendAndGetElement(v,"<div>","zoom-in","<div class='icon'></div>");g=VMM.appendAndGetElement(v,"<div>","zoom-out","<div class='icon'></div>");VMM.bindEvent(m,X,"click");VMM.bindEvent(g,V,"click");VMM.Lib.attribute(m,"title",VMM.master_config.language.messages.expand_timeline);VMM.Lib.attribute(m,"rel","timeline-tooltip");VMM.Lib.attribute(g,"title",VMM.master_config.language.messages.contract_timeline);VMM.Lib.attribute(g,"rel","timeline-tooltip");v.tooltip({selector:"div[rel=timeline-tooltip]",placement:"right"});VMM.bindEvent(x,J,"DOMMouseScroll");VMM.bindEvent(x,J,"mousewheel")}if(b.nav.zoom.adjust!=0)if(b.nav.zoom.adjust<0)for(e=0;e<Math.abs(b.nav.zoom.adjust);e++)V();else for(t=0;t<b.nav.zoom.adjust;t++)X();M=!0;z(!0);VMM.fireEvent(x,"LOADED")}function ht(){var e=0,t=0;S=it(T[T.length-1].enddate-T[0].startdate,!0);trace(S);rt();if(S.centuries>T.length/b.nav.density){F=R.century;I=R.millenium;q=R.decade}else if(S.decades>T.length/b.nav.density){F=R.decade;I=R.century;q=R.year}else if(S.years>T.length/b.nav.density){F=R.year;I=R.decade;q=R.month}else if(S.months>T.length/b.nav.density){F=R.month;I=R.year;q=R.day}else if(S.days>T.length/b.nav.density){F=R.day;I=R.month;q=R.hour}else if(S.hours>T.length/b.nav.density){F=R.hour;I=R.day;q=R.minute}else if(S.minutes>T.length/b.nav.density){F=R.minute;I=R.hour;q=R.second}else if(S.seconds>T.length/b.nav.density){F=R.second;I=R.minute;q=R.second}else{trace("NO IDEA WHAT THE TYPE SHOULD BE");F=R.day;I=R.month;q=R.hour}trace("INTERVAL TYPE: "+F.type);trace("INTERVAL MAJOR TYPE: "+I.type);lt(F,k,a);lt(I,L,f);for(e=0;e<k.length;e++)for(t=0;t<L.length;t++)k[e].date_string==L[t].date_string&&VMM.attachElement(k[e].element,"")}function pt(){var e=2,t=0,n=0,r=0,i=0,o=0;C=[];N=[];for(r=0;r<T.length;r++){var u,a,f,c,h,p,d,v="",m=!1;u=VMM.appendAndGetElement(s,"<div>","marker");a=VMM.appendAndGetElement(u,"<div>","flag");f=VMM.appendAndGetElement(a,"<div>","flag-content");c=VMM.appendAndGetElement(u,"<div>","dot");h=VMM.appendAndGetElement(u,"<div>","line");p=VMM.appendAndGetElement(h,"<div>","event-line");_marker_relative_pos=st(F,T[r].startdate,T[r].enddate);_marker_thumb="";T[r].asset!=null&&T[r].asset!=""?VMM.appendElement(f,VMM.MediaElement.thumbnail(T[r].asset,24,24,T[r].uniqueid)):VMM.appendElement(f,"<div style='margin-right:7px;height:50px;width:2px;float:left;'></div>");if(T[r].title==""||T[r].title==" "){trace("TITLE NOTHING");if(typeof T[r].slug!="undefined"&&T[r].slug!=""){trace("SLUG");v=VMM.Util.untagify(T[r].slug);m=!0}else{var g=VMM.MediaType(T[r].asset.media);if(g.type=="quote"||g.type=="unknown"){v=VMM.Util.untagify(g.id);m=!0}else m=!1}}else if(T[r].title!=""||T[r].title!=" "){trace(T[r].title);v=VMM.Util.untagify(T[r].title);m=!0}else trace("TITLE SLUG NOT FOUND "+T[r].slug);if(m)VMM.appendElement(f,"<h3>"+v+"</h3>");else{VMM.appendElement(f,"<h3>"+v+"</h3>");VMM.appendElement(f,"<h3 id='marker_content_"+T[r].uniqueid+"'>"+v+"</h3>")}VMM.Lib.attr(u,"id",("marker_"+T[r].uniqueid).toString());VMM.bindEvent(a,Q,"",{number:r});VMM.bindEvent(a,G,"mouseenter mouseleave",{number:r,elem:a});d={marker:u,flag:a,lineevent:p,type:"marker",full:!0,relative_pos:_marker_relative_pos,tag:T[r].tag,pos_left:0};if(T[r].type=="start"){trace("BUILD MARKER HAS START PAGE");b.start_page=!0;d.type="start"}T[r].type=="storify"&&(d.type="storify");T[r].tag&&A.push(T[r].tag);C.push(d)}A=VMM.Util.deDupeArray(A);A.length>3?b.nav.rows.current=b.nav.rows.half:b.nav.rows.current=b.nav.rows.full;for(i=0;i<A.length;i++)if(i<b.nav.rows.current.length){var y=VMM.appendAndGetElement(l,"<div>","timenav-tag");VMM.Lib.addClass(y,"timenav-tag-row-"+(i+1));A.length>3?VMM.Lib.addClass(y,"timenav-tag-size-half"):VMM.Lib.addClass(y,"timenav-tag-size-full");VMM.appendElement(y,"<div><h3>"+A[i]+"</h3></div>")}if(A.length>3)for(o=0;o<C.length;o++){VMM.Lib.addClass(C[o].flag,"flag-small");C[o].full=!1}}function dt(){var e=6,t=0,n=0;for(n=0;n<_.length;n++){var r={content:VMM.appendAndGetElement(s,"<div>","era"),text_content:VMM.appendAndGetElement(a,"<div>","era"),startdate:VMM.Date.parse(_[n].startDate),enddate:VMM.Date.parse(_[n].endDate),title:_[n].headline,uniqueid:VMM.Util.unique_ID(6),tag:"",relative_pos:""},i=VMM.Date.prettyDate(r.startdate),o=VMM.Date.prettyDate(r.enddate),u="<div>&nbsp;</div>";typeof _[n].tag!="undefined"&&(r.tag=_[n].tag);r.relative_pos=st(F,r.startdate,r.enddate);VMM.Lib.attr(r.content,"id",r.uniqueid);VMM.Lib.attr(r.text_content,"id",r.uniqueid+"_text");VMM.Lib.addClass(r.content,"era"+(t+1));VMM.Lib.addClass(r.text_content,"era"+(t+1));t<e?t++:t=0;VMM.appendElement(r.content,u);VMM.appendElement(r.text_content,VMM.Util.unlinkify(r.title));N.push(r)}}trace("VMM.Timeline.TimeNav");var r,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b=VMM.Timeline.Config,w,E={},S={},x=e,T=[],N=[],C=[],k=[],L=[],A=[],O=0,M=!1,_,D,P={interval_position:""},H={left:"",visible:{left:"",right:""}},B={day:24,month:12,year:10,hour:60,minute:60,second:1e3,decade:10,century:100,millenium:1e3,age:1e6,epoch:1e7,era:1e8,eon:5e8,week:4.34812141,days_in_month:30.4368499,days_in_week:7,weeks_in_month:4.34812141,weeks_in_year:52.177457,days_in_year:365.242199,hours_in_day:24},j={day:864e5,week:7,month:30.4166666667,year:12,hour:24,minute:1440,second:86400,decade:10,century:100,millenium:1e3,age:1e6,epoch:1e7,era:1e8,eon:5e8},F={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"_idd",interval_type:"interval"},I={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"major",interval_type:"interval major"},q={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"_dd_minor",interval_type:"interval minor"},R={day:{},month:{},year:{},hour:{},minute:{},second:{},decade:{},century:{},millenium:{},week:{},age:{},epoch:{},era:{},eon:{}};w=b.nav.marker.height/2;b.nav.rows={full:[1,w*2,w*4],half:[1,w,w*2,w*3,w*4,w*5],current:[]};t!=null&&t!=""&&(b.nav.width=t);n!=null&&n!=""&&(b.nav.height=n);this.init=function(e,t){trace("VMM.Timeline.TimeNav init");typeof e!="undefined"?this.setData(e,t):trace("WAITING ON DATA")};this.setData=function(e,t){if(typeof e!="undefined"){T={};T=e;_=t;ct()}else trace("NO DATA")};this.setSize=function(
e,t){e!=null&&(b.width=e);t!=null&&(b.height=t);M&&z()};this.setMarker=function(e,t,n,r){Y(e,t,n)};this.getCurrentNumber=function(){return O}});typeof VMM.Timeline!="undefined"&&typeof VMM.Timeline.DataObj=="undefined"&&(VMM.Timeline.DataObj={data_obj:{},model_array:[],getData:function(e){VMM.Timeline.DataObj.data_obj={};VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Timeline.Config.language.messages.loading_timeline);if(type.of(e)=="object"){trace("DATA SOURCE: JSON OBJECT");VMM.Timeline.DataObj.parseJSON(e)}else if(type.of(e)=="string")if(e.match("%23")){trace("DATA SOURCE: TWITTER SEARCH");VMM.Timeline.DataObj.model.tweets.getData("%23medill")}else if(e.match("spreadsheet")){trace("DATA SOURCE: GOOGLE SPREADSHEET");VMM.Timeline.DataObj.model.googlespreadsheet.getData(e)}else if(e.match("storify.com")){trace("DATA SOURCE: STORIFY");VMM.Timeline.DataObj.model.storify.getData(e)}else if(e.match(".jsonp")){trace("DATA SOURCE: JSONP");LoadLib.js(e,VMM.Timeline.DataObj.onJSONPLoaded)}else{trace("DATA SOURCE: JSON");var t="";e.indexOf("?")>-1?t=e+"&callback=onJSONP_Data":t=e+"?callback=onJSONP_Data";VMM.getJSON(t,VMM.Timeline.DataObj.parseJSON)}else if(type.of(e)=="html"){trace("DATA SOURCE: HTML");VMM.Timeline.DataObj.parseHTML(e)}else trace("DATA SOURCE: UNKNOWN")},onJSONPLoaded:function(){trace("JSONP IS LOADED");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,storyjs_jsonp_data)},parseHTML:function(e){trace("parseHTML");trace("WARNING: THIS IS STILL ALPHA AND WILL NOT WORK WITH ID's other than #timeline");var t=VMM.Timeline.DataObj.data_template_obj;if(VMM.Lib.find("#timeline section","time")[0]){t.timeline.startDate=VMM.Lib.html(VMM.Lib.find("#timeline section","time")[0]);t.timeline.headline=VMM.Lib.html(VMM.Lib.find("#timeline section","h2"));t.timeline.text=VMM.Lib.html(VMM.Lib.find("#timeline section","article"));var n=!1;if(VMM.Lib.find("#timeline section","figure img").length!=0){n=!0;t.timeline.asset.media=VMM.Lib.attr(VMM.Lib.find("#timeline section","figure img"),"src")}else if(VMM.Lib.find("#timeline section","figure a").length!=0){n=!0;t.timeline.asset.media=VMM.Lib.attr(VMM.Lib.find("#timeline section","figure a"),"href")}if(n){VMM.Lib.find("#timeline section","cite").length!=0&&(t.timeline.asset.credit=VMM.Lib.html(VMM.Lib.find("#timeline section","cite")));VMM.Lib.find(this,"figcaption").length!=0&&(t.timeline.asset.caption=VMM.Lib.html(VMM.Lib.find("#timeline section","figcaption")))}}VMM.Lib.each("#timeline li",function(e,n){var r=!1,i={type:"default",startDate:"",headline:"",text:"",asset:{media:"",credit:"",caption:""},tags:"Optional"};if(VMM.Lib.find(this,"time")!=0){r=!0;i.startDate=VMM.Lib.html(VMM.Lib.find(this,"time")[0]);VMM.Lib.find(this,"time")[1]&&(i.endDate=VMM.Lib.html(VMM.Lib.find(this,"time")[1]));i.headline=VMM.Lib.html(VMM.Lib.find(this,"h3"));i.text=VMM.Lib.html(VMM.Lib.find(this,"article"));var s=!1;if(VMM.Lib.find(this,"figure img").length!=0){s=!0;i.asset.media=VMM.Lib.attr(VMM.Lib.find(this,"figure img"),"src")}else if(VMM.Lib.find(this,"figure a").length!=0){s=!0;i.asset.media=VMM.Lib.attr(VMM.Lib.find(this,"figure a"),"href")}if(s){VMM.Lib.find(this,"cite").length!=0&&(i.asset.credit=VMM.Lib.html(VMM.Lib.find(this,"cite")));VMM.Lib.find(this,"figcaption").length!=0&&(i.asset.caption=VMM.Lib.html(VMM.Lib.find(this,"figcaption")))}trace(i);t.timeline.date.push(i)}});VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)},parseJSON:function(e){trace("parseJSON");if(e.timeline.type=="default"){trace("DATA SOURCE: JSON STANDARD TIMELINE");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,e)}else if(e.timeline.type=="twitter"){trace("DATA SOURCE: JSON TWEETS");VMM.Timeline.DataObj.model_Tweets.buildData(e)}else{trace("DATA SOURCE: UNKNOWN JSON");trace(type.of(e.timeline))}},model:{googlespreadsheet:{getData:function(e){function u(){t=VMM.getJSON(i,function(e){clearTimeout(s);VMM.Timeline.DataObj.model.googlespreadsheet.buildData(e)}).error(function(e,t,n){if(e.status==400){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Error reading Google spreadsheet. Check the URL and make sure it's published to the web.");clearTimeout(s);return}trace("Google Docs ERROR");trace("Google Docs ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(s)})}var t,n,r,i,s,o=0;n=VMM.Util.getUrlVars(e).key;r=VMM.Util.getUrlVars(e).worksheet;typeof r=="undefined"&&(r="od6");i="https://spreadsheets.google.com/feeds/list/"+n+"/"+r+"/public/values?alt=json";s=setTimeout(function(){trace("Google Docs timeout "+i);trace(i);if(o<3){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Still waiting on Google Docs, trying again "+o);o++;t.abort();u()}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Google Docs is not responding")},16e3);u()},buildData:function(e){function r(e){return typeof e!="undefined"?e.$t:""}var t=VMM.Timeline.DataObj.data_template_obj,n=!1;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Parsing Google Doc Data");if(typeof e.feed.entry=="undefined")VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Error parsing spreadsheet. Make sure you have no blank rows and that the headers have not been changed.");else{n=!0;for(var i=0;i<e.feed.entry.length;i++){var s=e.feed.entry[i],o="";typeof s.gsx$type!="undefined"?o=s.gsx$type.$t:typeof s.gsx$titleslide!="undefined"&&(o=s.gsx$titleslide.$t);if(o.match("start")||o.match("title")){t.timeline.startDate=r(s.gsx$startdate);t.timeline.headline=r(s.gsx$headline);t.timeline.asset.media=r(s.gsx$media);t.timeline.asset.caption=r(s.gsx$mediacaption);t.timeline.asset.credit=r(s.gsx$mediacredit);t.timeline.text=r(s.gsx$text);t.timeline.type="google spreadsheet"}else if(o.match("era")){var u={startDate:r(s.gsx$startdate),endDate:r(s.gsx$enddate),headline:r(s.gsx$headline),text:r(s.gsx$text),tag:r(s.gsx$tag)};t.timeline.era.push(u)}else{var a={type:"google spreadsheet",startDate:r(s.gsx$startdate),endDate:r(s.gsx$enddate),headline:r(s.gsx$headline),text:r(s.gsx$text),tag:r(s.gsx$tag),asset:{media:r(s.gsx$media),credit:r(s.gsx$mediacredit),caption:r(s.gsx$mediacaption),thumbnail:r(s.gsx$mediathumbnail)}};t.timeline.date.push(a)}}}if(n){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Finished Parsing Data");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}else{VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Language.messages.loading+" Google Doc Data (cells)");trace("There may be too many entries. Still trying to load data. Now trying to load cells to avoid Googles limitation on cells");VMM.Timeline.DataObj.model.googlespreadsheet.getDataCells(e.feed.link[0].href)}},getDataCells:function(e){function o(){t=VMM.getJSON(r,function(e){clearTimeout(i);VMM.Timeline.DataObj.model.googlespreadsheet.buildDataCells(e)}).error(function(e,t,n){trace("Google Docs ERROR");trace("Google Docs ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(i)})}var t,n,r,i,s=0;n=VMM.Util.getUrlVars(e).key;r="https://spreadsheets.google.com/feeds/cells/"+n+"/od6/public/values?alt=json";i=setTimeout(function(){trace("Google Docs timeout "+r);trace(r);if(s<3){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Still waiting on Google Docs, trying again "+s);s++;t.abort();o()}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Google Docs is not responding")},16e3);o()},buildDataCells:function(e){function a(e){return typeof e!="undefined"?e.$t:""}var t=VMM.Timeline.DataObj.data_template_obj,n=!1,r=["timeline"],i=[],s=0,o=0,u=0;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Language.messages.loading_timeline+" Parsing Google Doc Data (cells)");if(typeof e.feed.entry!="undefined"){n=!0;for(o=0;o<e.feed.entry.length;o++){var f=e.feed.entry[o];parseInt(f.gs$cell.row)>s&&(s=parseInt(f.gs$cell.row))}for(var o=0;o<s+1;o++){var l={type:"",startDate:"",endDate:"",headline:"",text:"",tag:"",asset:{media:"",credit:"",caption:"",thumbnail:""}};i.push(l)}for(o=0;o<e.feed.entry.length;o++){var f=e.feed.entry[o],c="",h="",p={content:a(f.gs$cell),col:f.gs$cell.col,row:f.gs$cell.row,name:""};if(p.row==1){p.content=="Start Date"?h="startDate":p.content=="End Date"?h="endDate":p.content=="Headline"?h="headline":p.content=="Text"?h="text":p.content=="Media"?h="media":p.content=="Media Credit"?h="credit":p.content=="Media Caption"?h="caption":p.content=="Media Thumbnail"?h="thumbnail":p.content=="Type"?h="type":p.content=="Tag"&&(h="tag");r.push(h)}else{p.name=r[p.col];i[p.row][p.name]=p.content}}for(o=0;o<i.length;o++){var l=i[o];if(l.type.match("start")||l.type.match("title")){t.timeline.startDate=l.startDate;t.timeline.headline=l.headline;t.timeline.asset.media=l.media;t.timeline.asset.caption=l.caption;t.timeline.asset.credit=l.credit;t.timeline.text=l.text;t.timeline.type="google spreadsheet"}else if(l.type.match("era")){var d={startDate:l.startDate,endDate:l.endDate,headline:l.headline,text:l.text,tag:l.tag};t.timeline.era.push(d)}else if(l.startDate){var l={type:"google spreadsheet",startDate:l.startDate,endDate:l.endDate,headline:l.headline,text:l.text,tag:l.tag,asset:{media:l.media,credit:l.credit,caption:l.caption,thumbnail:l.thumbnail}};t.timeline.date.push(l)}else trace("Skipping item "+o+" in list: no start date.")}}n=t.timeline.date.length>0;if(n){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Finished Parsing Data");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Unable to load Google Doc data source. Make sure you have no blank rows and that the headers have not been changed.")}},storify:{getData:function(e){var t,n,r;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Loading Storify...");t=e.split("storify.com/")[1];n="//api.storify.com/v1/stories/"+t+"?per_page=300&callback=?";r=setTimeout(function(){trace("STORIFY timeout");VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Storify is not responding")},6e3);VMM.getJSON(n,VMM.Timeline.DataObj.model.storify.buildData).error(function(e,t,n){trace("STORIFY error");trace("STORIFY ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(r)})},buildData:function(e){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Parsing Data");var t=VMM.Timeline.DataObj.data_template_obj;t.timeline.startDate=new Date(e.content.date.created);t.timeline.headline=e.content.title;trace(e);var n="",r=e.content.author.username,i="";if(typeof e.content.author.name!="undefined"){r=e.content.author.name;i=e.content.author.username+"&nbsp;"}typeof e.content.description!="undefined"&&e.content.description!=null&&(n+=e.content.description);n+="<div class='storify'>";n+="<div class='vcard author'><a class='screen-name url' href='"+e.content.author.permalink+"' target='_blank'>";n+="<span class='avatar'><img src='"+e.content.author.avatar+"' style='max-width: 32px; max-height: 32px;'></span>";n+="<span class='fn'>"+r+"</span>";n+="<span class='nickname'>"+i+"<span class='thumbnail-inline'></span></span>";n+="</a>";n+="</div>";n+="</div>";t.timeline.text=n;t.timeline.asset.media=e.content.thumbnail;t.timeline.type="storify";for(var s=0;s<e.content.elements.length;s++){var o=e.content.elements[s],u=!1,a=new Date(o.posted_at);trace(o.type);var f={type:"storify",startDate:o.posted_at,endDate:o.posted_at,headline:" ",slug:"",text:"",asset:{media:"",credit:"",caption:""}};if(o.type=="image"){if(typeof o.source.name!="undefined")if(o.source.name=="flickr"){f.asset.media="//flickr.com/photos/"+o.meta.pathalias+"/"+o.meta.id+"/";f.asset.credit="<a href='"+f.asset.media+"'>"+o.attribution.name+"</a>";f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>"}else if(o.source.name=="instagram"){f.asset.media=o.permalink;f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>"}else{f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";typeof o.source.href!="undefined"&&(f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>");f.asset.media=o.data.image.src}else{f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";f.asset.media=o.data.image.src}f.slug=o.attribution.name;if(typeof o.data.image.caption!="undefined"&&o.data.image.caption!="undefined"){f.asset.caption=o.data.image.caption;f.slug=o.data.image.caption}}else if(o.type=="quote"){if(o.permalink.match("twitter")){f.asset.media=o.permalink;f.slug=VMM.Util.untagify(o.data.quote.text)}else if(o.permalink.match("storify")){u=!0;f.asset.media="<blockquote>"+o.data.quote.text.replace(/<\s*\/?\s*b\s*.*?>/g,"")+"</blockquote>"}}else if(o.type=="link"){f.headline=o.data.link.title;f.text=o.data.link.description;o.data.link.thumbnail!="undefined"&&o.data.link.thumbnail!=""?f.asset.media=o.data.link.thumbnail:f.asset.media=o.permalink;f.asset.caption="<a href='"+o.permalink+"' target='_blank'>"+o.data.link.title+"</a>";f.slug=o.data.link.title}else if(o.type=="text"){if(o.permalink.match("storify")){u=!0;var l=e.content.author.username,c="";if(typeof o.attribution.name!="undefined"){r=o.attribution.name;i=o.attribution.username+"&nbsp;"}var h="<div class='storify'>";h+="<blockquote><p>"+o.data.text.replace(/<\s*\/?\s*b\s*.*?>/g,"")+"</p></blockquote>";h+="<div class='vcard author'><a class='screen-name url' href='"+o.attribution.href+"' target='_blank'>";h+="<span class='avatar'><img src='"+o.attribution.thumbnail+"' style='max-width: 32px; max-height: 32px;'></span>";h+="<span class='fn'>"+r+"</span>";h+="<span class='nickname'>"+i+"<span class='thumbnail-inline'></span></span>";h+="</a></div></div>";f.text=h;if(s+1>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+1].type=="text"&&e.content.elements[s+1].permalink.match("storify"))if(s+2>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+2].type=="text"&&e.content.elements[s+2].permalink.match("storify"))if(s+3>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+3].type=="text"&&e.content.elements[s+3].permalink.match("storify"))f.startDate=e.content.elements[s-1].posted_at;else{trace("LEVEL 3");f.startDate=e.content.elements[s+3].posted_at}else{trace("LEVEL 2");f.startDate=e.content.elements[s+2].posted_at}else{trace("LEVEL 1");f.startDate=e.content.elements[s+1].posted_at}f.endDate=f.startDate}}else if(o.type=="video"){f.headline=o.data.video.title;f.asset.caption=o.data.video.description;f.asset.caption=o.source.username;f.asset.media=o.data.video.src}else{trace("NO MATCH ");trace(o)}u&&(f.slug=VMM.Util.untagify(o.data.text));t.timeline.date.push(f)}VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}},tweets:{type:"twitter",buildData:function(e){VMM.bindEvent(global,VMM.Timeline.DataObj.model.tweets.onTwitterDataReady,"TWEETSLOADED");VMM.ExternalAPI.twitter.getTweets(e.timeline.tweets)},getData:function(e){VMM.bindEvent(global,VMM.Timeline.DataObj.model.tweets.onTwitterDataReady,"TWEETSLOADED");VMM.ExternalAPI.twitter.getTweetSearch(e)},onTwitterDataReady:function(e,t){var n=VMM.Timeline.DataObj.data_template_obj;for(var r=0;r<t.tweetdata.length;r++){var i={type:"tweets",startDate:"",headline:"",text:"",asset:{media:"",credit:"",caption:""},tags:"Optional"};i.startDate=t.tweetdata[r].raw.created_at;type.of(t.tweetdata[r].raw.from_user_name)?i.headline=t.tweetdata[r].raw.from_user_name+" (<a href='https://twitter.com/"+t.tweetdata[r].raw.from_user+"'>"+"@"+t.tweetdata[r].raw.from_user+"</a>)":i.headline=t.tweetdata[r].raw.user.name+" (<a href='https://twitter.com/"+t.tweetdata[r].raw.user.screen_name+"'>"+"@"+t.tweetdata[r].raw.user.screen_name+"</a>)";i.asset.media=t.tweetdata[r].content;n.timeline.date.push(i)}VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,n)}}},data_template_obj:{timeline:{headline:"",description:"",asset:{media:"",credit:"",caption:""},date:[],era:[]}},date_obj:{startDate:"2012,2,2,11,30",headline:"",text:"",asset:{media:"http://youtu.be/vjVfu8-Wp6s",credit:"",caption:""},tags:"Optional"}});VMM.debug=!1;
/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* **********************************************
     Begin LazyLoad.js
********************************************** *//*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false *//*
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/function getEmbedScriptPath(e){var t=document.getElementsByTagName("script"),n="",r="";for(var i=0;i<t.length;i++)t[i].src.match(e)&&(n=t[i].src);n!=""&&(r="/");return n.split("?")[0].split("/").slice(0,-1).join("/")+r}function createStoryJS(e,t){function g(){LoadLib.js(h.js,y)}function y(){l.js=!0;h.lang!="en"?LazyLoad.js(c.locale,b):l.language=!0;x()}function b(){l.language=!0;x()}function w(){l.css=!0;x()}function E(){l.font.css=!0;x()}function S(){l.font.js=!0;x()}function x(){if(l.checks>40)return;l.checks++;if(l.js&&l.css&&l.font.css&&l.font.js&&l.language){if(!l.finished){l.finished=!0;N()}}else l.timeout=setTimeout("onloaded_check_again();",250)}function T(){var e="storyjs-embed";r=document.createElement("div");h.embed_id!=""?i=document.getElementById(h.embed_id):i=document.getElementById("timeline-embed");i.appendChild(r);r.setAttribute("id",h.id);if(h.width.toString().match("%"))i.style.width=h.width.split("%")[0]+"%";else{h.width=h.width-2;i.style.width=h.width+"px"}if(h.height.toString().match("%")){i.style.height=h.height;e+=" full-embed";i.style.height=h.height.split("%")[0]+"%"}else if(h.width.toString().match("%")){e+=" full-embed";h.height=h.height-16;i.style.height=h.height+"px"}else{e+=" sized-embed";h.height=h.height-16;i.style.height=h.height+"px"}i.setAttribute("class",e);i.setAttribute("className",e);r.style.position="relative"}function N(){VMM.debug=h.debug;n=new VMM.Timeline(h.id);n.init(h);o&&VMM.bindEvent(global,onHeadline,"HEADLINE")}var n,r,i,s,o=!1,u="2.24",a="1.7.1",f="",l={timeout:"",checks:0,finished:!1,js:!1,css:!1,jquery:!1,has_jquery:!1,language:!1,font:{css:!1,js:!1}},c={base:embed_path,css:embed_path+"css/",js:embed_path+"js/",locale:embed_path+"js/locale/",jquery:"//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",font:{google:!1,css:embed_path+"css/themes/font/",js:"//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"}},h={version:u,debug:!1,type:"timeline",id:"storyjs",embed_id:"timeline-embed",embed:!0,width:"100%",height:"100%",source:"https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html",lang:"en",font:"default",css:c.css+"timeline.css?"+u,js:"",api_keys:{google:"",flickr:"",twitter:""},gmap_key:""},p=[{name:"Merriweather-NewsCycle",google:["News+Cycle:400,700:latin","Merriweather:400,700,900:latin"]},{name:"NewsCycle-Merriweather",google:["News+Cycle:400,700:latin","Merriweather:300,400,700:latin"]},{name:"PoiretOne-Molengo",google:["Poiret+One::latin","Molengo::latin"]},{name:"Arvo-PTSans",google:["Arvo:400,700,400italic:latin","PT+Sans:400,700,400italic:latin"]},{name:"PTSerif-PTSans",google:["PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"PT",google:["PT+Sans+Narrow:400,700:latin","PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"DroidSerif-DroidSans",google:["Droid+Sans:400,700:latin","Droid+Serif:400,700,400italic:latin"]},{name:"Lekton-Molengo",google:["Lekton:400,700,400italic:latin","Molengo::latin"]},{name:"NixieOne-Ledger",google:["Nixie+One::latin","Ledger::latin"]},{name:"AbrilFatface-Average",google:["Average::latin","Abril+Fatface::latin"]},{name:"PlayfairDisplay-Muli",google:["Playfair+Display:400,400italic:latin","Muli:300,400,300italic,400italic:latin"]},{name:"Rancho-Gudea",google:["Rancho::latin","Gudea:400,700,400italic:latin"]},{name:"Bevan-PotanoSans",google:["Bevan::latin","Pontano+Sans::latin"]},{name:"BreeSerif-OpenSans",google:["Bree+Serif::latin","Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin"]},{name:"SansitaOne-Kameron",google:["Sansita+One::latin","Kameron:400,700:latin"]},{name:"Lora-Istok",google:["Lora:400,700,400italic,700italic:latin","Istok+Web:400,700,400italic,700italic:latin"]},{name:"Pacifico-Arimo",google:["Pacifico::latin","Arimo:400,700,400italic,700italic:latin"]}];if(typeof e=="object")for(s in e)Object.prototype.hasOwnProperty.call(e,s)&&(h[s]=e[s]);typeof t!="undefined"&&(h.source=t);if(typeof url_config=="object"){o=!0;h.source.match("docs.google.com")||h.source.match("json")||h.source.match("storify")||(h.source="https://docs.google.com/spreadsheet/pub?key="+h.source+"&output=html")}if(h.js.match("locale")){h.lang=h.js.split("locale/")[1].replace(".js","");h.js=c.js+"timeline-min.js?"+u}if(!h.js.match("/")){h.css=c.css+h.type+".css?"+u;h.js=c.js+h.type;h.debug?h.js+=".js?"+u:h.js+="-min.js?"+u;h.id="storyjs-"+h.type}h.lang.match("/")?c.locale=h.lang:c.locale=c.locale+h.lang+".js?"+u;T();LoadLib.css(h.css,w);if(h.font=="default"){l.font.js=!0;l.font.css=!0}else{var d;if(h.font.match("/")){d=h.font.split(".css")[0].split("/");c.font.name=d[d.length-1];c.font.css=h.font}else{c.font.name=h.font;c.font.css=c.font.css+h.font+".css?"+u}LoadLib.css(c.font.css,E);for(var v=0;v<p.length;v++)if(c.font.name==p[v].name){c.font.google=!0;WebFontConfig={google:{families:p[v].google}}}c.font.google?LoadLib.js(c.font.js,S):l.font.js=!0}try{l.has_jquery=jQuery;l.has_jquery=!0;if(l.has_jquery){var f=parseFloat(jQuery.fn.jquery);f<parseFloat(a)?l.jquery=!1:l.jquery=!0}}catch(m){l.jquery=!1}l.jquery?g():LoadLib.js(c.jquery,g);this.onloaded_check_again=function(){x()}}LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);var WebFontConfig;if(typeof embed_path=="undefined")var _tmp_script_path=getEmbedScriptPath("storyjs-embed.js"),embed_path=_tmp_script_path.substr(0,_tmp_script_path.lastIndexOf("js/"));(function(){typeof url_config=="object"?createStoryJS(url_config):typeof timeline_config=="object"?createStoryJS(timeline_config):typeof storyjs_config=="object"?createStoryJS(storyjs_config):typeof config=="object"&&createStoryJS(config)})();
  /*
      TimelineJS - ver. 2.32.0 - 2014-05-08
      Copyright (c) 2012-2013 Northwestern University
      a project of the Northwestern University Knight Lab, originally created by Zach Wise
      https://github.com/NUKnightLab/TimelineJS
      This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
      If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
  */
  /* **********************************************
       Begin Embed.CDN.Generator.js
  ********************************************** */ /* Support Timeline Embed Generator web form (becomes storyjs-embed-generator.js) */function getScriptPath (e) {var t = document.getElementsByTagName('script'),n = ''
  for (var r = 0;r < t.length;r++)t[r].src.match(e) && (n = t[r].src);return n.split('?')[0].split('/').slice(0, -1).join('/') + '/'}function getUrlVars (e) {var t = [],n,r,i = e.toString()
  i.match('&#038;') ? i = i.replace('&#038;', '&') : i.match('&#38;') ? i = i.replace('&#38;', '&') : i.match('&amp;') && (i = i.replace('&amp;', '&'));i.match('#') && (i = i.split('#')[0]);r = i.slice(i.indexOf('?') + 1).split('&'); for (var s = 0;s < r.length;s++) {n = r[s].split('=');t.push(n[0]);t[n[0]] = n[1]}return t}function getLinkAndIframe () {var e = {},t = document.getElementById('embed-source-url'),n = document.getElementById('embed-width'),r = document.getElementById('embed-height'),i = document.getElementById('embed-maptype'),s = document.getElementById('embed-language'),o = document.getElementById('embed_code'),u = document.getElementById('embed-font'),a = document.getElementById('embed-wordpressplugin'),f = document.getElementById('embed-startatend'),l = document.getElementById('embed-hashbookmark'),c = document.getElementById('embed-startzoomadjust'),h = document.getElementById('embed-startatslide'),p = document.getElementById('embed-debug'),d = document.getElementById('embed-googlemapkey'),v = !1,m = !1,g = !1,y,b,w,E,S
  t.value.match('docs.google.com') ? S = getUrlVars(t.value).key : t.value == '' ? S = '0Agl_Dv6iEbDadHdKcHlHcTB5bzhvbF9iTWwyMmJHdkE' : S = t.value;f.checked && (v = !0);l.checked && (m = !0);p.checked && (g = !0);E = '[timeline ';n.value > 0 && (E += "width='" + n.value + "' ");r.value > 0 && (E += "height='" + n.value + "' ");E += "font='" + u.value + "' ";E += "maptype='" + i.value + "' ";E += "lang='" + s.value + "' ";E += "src='" + t.value + "' ";v && (E += "start_at_end='" + v + "' ");m && (E += "hash_bookmark='" + m + "' ");g && (E += "debug='" + g + "' ");d.value != '' && (E += "gmap_key='" + d.value + "' ");parseInt(h.value, 10) > 0 && (E += "start_at_slide='" + parseInt(h.value, 10) + "' ");parseInt(c.value, 10) > 0 && (E += "start_zoom_adjust='" + parseInt(c.value, 10) + "' ");E += ']';e.wordpress = E;w = generator_embed_path + '?source=' + S;w += '&font=' + u.value;w += '&maptype=' + i.value;w += '&lang=' + s.value;v && (w += '&start_at_end=' + v);m && (w += '&hash_bookmark=' + m);g && (w += '&debug=' + g);parseInt(h.value, 10) > 0 && (w += '&start_at_slide=' + parseInt(h.value, 10));parseInt(c.value, 10) > 0 && (w += '&start_zoom_adjust=' + parseInt(c.value, 10));d.value != '' && (w += '&gmap_key=' + d.value);n.value > 0 && (w += '&width=' + n.value);r.value > 0 && (w += '&height=' + r.value);y = "<iframe src='" + w + "'";if (n.value > 0 || n.value.match('%'))y += " width='" + n.value + "'";if (r.value > 0 || r.value.match('%'))y += " height='" + r.value + "'";y += " frameborder='0'></iframe>";e.iframe = y;e.link = w
  a.checked ? e.copybox = E : e.copybox = y;return e}function updateEmbedCode (e, t) {var n = document.getElementById('embed_code'),r = getLinkAndIframe()
  n.value = r.copybox;jQuery('#preview-embed-link').attr('href', r.link);jQuery('#preview-embed-iframe').html(r.iframe);jQuery('#preview-embed').css('display', 'block')}if (typeof generator_embed_path == 'undefined' || typeof generator_embed_path == 'undefined') {var generator_embed_path = getScriptPath('storyjs-embed-generator.js').split('js/')[0]
  generator_embed_path.match('http') ? generator_embed_path = generator_embed_path : generator_embed_path == '/' ? generator_embed_path = 'index.html' : generator_embed_path += 'index.html'}

/*
    TimelineJS - ver. 2.32.0 - 2014-05-08
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
/* **********************************************
     Begin Embed.CDN.js
********************************************** *//* Embed.CDN
	Extend the basic 'embed' functionality with Google Analytics tracking and url parsing to support URLs created with the Timeline generator form.
*//* 	CodeKit Import
	http://incident57.com/codekit/
================================================== */// @codekit-append "Embed.js";
/* REPLACE THIS WITH YOUR GOOGLE ANALYTICS ACCOUNT
================================================== */function getEmbedScriptPath(e){var t=document.getElementsByTagName("script"),n="",r="";for(var i=0;i<t.length;i++)t[i].src.match(e)&&(n=t[i].src);n!=""&&(r="/");return n.split("?")[0].split("/").slice(0,-1).join("/")+r}function createStoryJS(e,t){function g(){LoadLib.js(h.js,y)}function y(){l.js=!0;h.lang!="en"?LazyLoad.js(c.locale,b):l.language=!0;x()}function b(){l.language=!0;x()}function w(){l.css=!0;x()}function E(){l.font.css=!0;x()}function S(){l.font.js=!0;x()}function x(){if(l.checks>40)return;l.checks++;if(l.js&&l.css&&l.font.css&&l.font.js&&l.language){if(!l.finished){l.finished=!0;N()}}else l.timeout=setTimeout("onloaded_check_again();",250)}function T(){var e="storyjs-embed";r=document.createElement("div");h.embed_id!=""?i=document.getElementById(h.embed_id):i=document.getElementById("timeline-embed");i.appendChild(r);r.setAttribute("id",h.id);if(h.width.toString().match("%"))i.style.width=h.width.split("%")[0]+"%";else{h.width=h.width-2;i.style.width=h.width+"px"}if(h.height.toString().match("%")){i.style.height=h.height;e+=" full-embed";i.style.height=h.height.split("%")[0]+"%"}else if(h.width.toString().match("%")){e+=" full-embed";h.height=h.height-16;i.style.height=h.height+"px"}else{e+=" sized-embed";h.height=h.height-16;i.style.height=h.height+"px"}i.setAttribute("class",e);i.setAttribute("className",e);r.style.position="relative"}function N(){VMM.debug=h.debug;n=new VMM.Timeline(h.id);n.init(h);o&&VMM.bindEvent(global,onHeadline,"HEADLINE")}var n,r,i,s,o=!1,u="2.24",a="1.7.1",f="",l={timeout:"",checks:0,finished:!1,js:!1,css:!1,jquery:!1,has_jquery:!1,language:!1,font:{css:!1,js:!1}},c={base:embed_path,css:embed_path+"css/",js:embed_path+"js/",locale:embed_path+"js/locale/",jquery:"//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",font:{google:!1,css:embed_path+"css/themes/font/",js:"//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"}},h={version:u,debug:!1,type:"timeline",id:"storyjs",embed_id:"timeline-embed",embed:!0,width:"100%",height:"100%",source:"https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html",lang:"en",font:"default",css:c.css+"timeline.css?"+u,js:"",api_keys:{google:"",flickr:"",twitter:""},gmap_key:""},p=[{name:"Merriweather-NewsCycle",google:["News+Cycle:400,700:latin","Merriweather:400,700,900:latin"]},{name:"NewsCycle-Merriweather",google:["News+Cycle:400,700:latin","Merriweather:300,400,700:latin"]},{name:"PoiretOne-Molengo",google:["Poiret+One::latin","Molengo::latin"]},{name:"Arvo-PTSans",google:["Arvo:400,700,400italic:latin","PT+Sans:400,700,400italic:latin"]},{name:"PTSerif-PTSans",google:["PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"PT",google:["PT+Sans+Narrow:400,700:latin","PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"DroidSerif-DroidSans",google:["Droid+Sans:400,700:latin","Droid+Serif:400,700,400italic:latin"]},{name:"Lekton-Molengo",google:["Lekton:400,700,400italic:latin","Molengo::latin"]},{name:"NixieOne-Ledger",google:["Nixie+One::latin","Ledger::latin"]},{name:"AbrilFatface-Average",google:["Average::latin","Abril+Fatface::latin"]},{name:"PlayfairDisplay-Muli",google:["Playfair+Display:400,400italic:latin","Muli:300,400,300italic,400italic:latin"]},{name:"Rancho-Gudea",google:["Rancho::latin","Gudea:400,700,400italic:latin"]},{name:"Bevan-PotanoSans",google:["Bevan::latin","Pontano+Sans::latin"]},{name:"BreeSerif-OpenSans",google:["Bree+Serif::latin","Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin"]},{name:"SansitaOne-Kameron",google:["Sansita+One::latin","Kameron:400,700:latin"]},{name:"Lora-Istok",google:["Lora:400,700,400italic,700italic:latin","Istok+Web:400,700,400italic,700italic:latin"]},{name:"Pacifico-Arimo",google:["Pacifico::latin","Arimo:400,700,400italic,700italic:latin"]}];if(typeof e=="object")for(s in e)Object.prototype.hasOwnProperty.call(e,s)&&(h[s]=e[s]);typeof t!="undefined"&&(h.source=t);if(typeof url_config=="object"){o=!0;h.source.match("docs.google.com")||h.source.match("json")||h.source.match("storify")||(h.source="https://docs.google.com/spreadsheet/pub?key="+h.source+"&output=html")}if(h.js.match("locale")){h.lang=h.js.split("locale/")[1].replace(".js","");h.js=c.js+"timeline-min.js?"+u}if(!h.js.match("/")){h.css=c.css+h.type+".css?"+u;h.js=c.js+h.type;h.debug?h.js+=".js?"+u:h.js+="-min.js?"+u;h.id="storyjs-"+h.type}h.lang.match("/")?c.locale=h.lang:c.locale=c.locale+h.lang+".js?"+u;T();LoadLib.css(h.css,w);if(h.font=="default"){l.font.js=!0;l.font.css=!0}else{var d;if(h.font.match("/")){d=h.font.split(".css")[0].split("/");c.font.name=d[d.length-1];c.font.css=h.font}else{c.font.name=h.font;c.font.css=c.font.css+h.font+".css?"+u}LoadLib.css(c.font.css,E);for(var v=0;v<p.length;v++)if(c.font.name==p[v].name){c.font.google=!0;WebFontConfig={google:{families:p[v].google}}}c.font.google?LoadLib.js(c.font.js,S):l.font.js=!0}try{l.has_jquery=jQuery;l.has_jquery=!0;if(l.has_jquery){var f=parseFloat(jQuery.fn.jquery);f<parseFloat(a)?l.jquery=!1:l.jquery=!0}}catch(m){l.jquery=!1}l.jquery?g():LoadLib.js(c.jquery,g);this.onloaded_check_again=function(){x()}}var embed_analytics="UA-537357-20",load_time_start=(new Date).getTime(),the_load_time=0,_gaq=_gaq||[];(function(){var e=document.createElement("script"),t=document.getElementsByTagName("script")[0];e.type="text/javascript";e.async=!0;e.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";t.parentNode.insertBefore(e,t);_gaq.push(["_setAccount",embed_analytics]);_gaq.push(["_trackPageview"])})();var getUrlVars=function(){var e={},t=[],n;t=window.location.href.slice(window.location.href.indexOf("?")+1);t.match("#")&&(t=t.split("#")[0]);t=t.split("&");for(var r=0;r<t.length;r++){n=t[r].split("=");e[n[0]]=n[1]}return e},onHeadline=function(e,t){var n="/"+t,r=location.href;document.title=t;the_load_time=Math.floor(((new Date).getTime()-load_time_start)/100)/10;_gaq.push(["_trackEvent","Timeline",t,r,the_load_time])},url_config=getUrlVars();LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);var WebFontConfig;if(typeof embed_path=="undefined")var _tmp_script_path=getEmbedScriptPath("storyjs-embed.js"),embed_path=_tmp_script_path.substr(0,_tmp_script_path.lastIndexOf("js/"));(function(){typeof url_config=="object"?createStoryJS(url_config):typeof timeline_config=="object"?createStoryJS(timeline_config):typeof storyjs_config=="object"?createStoryJS(storyjs_config):typeof config=="object"&&createStoryJS(config)})();

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

angular.module('adf.widget.treewidget').directive('treeChartWidget', ['bus','d3Service', function(bus, d3Service) {
    

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

angular.module('adf.widget.treewidget').controller('panelCtrl', ['$scope', '$timeout', '$window', 'data', 'bus', function($scope, $timeout, $window, data, bus) {
    

    var container = angular.element(document.querySelector('#panel')),
        graph = document.querySelector('#graph');

    bus.on('updateData', function(data) {
        var clonedData = angular.copy(data);
        $scope.data = formatData(clonedData);
    });

    function formatData(data) {

        var addParent = function(node) {
            if (node.children) {
                node.children.forEach(function(childNode) {
                    childNode.parent = node;
                    addParent(childNode);
                });
            }
        };

        var addDependents = function(node) {
            if (node.dependsOn) {
                node.dependsOn.forEach(function(dependsOn) {
                    var dependency = getNodeByName(dependsOn, data);
                    if (!dependency) {
                        console.log('Dependency', dependsOn, 'not found for node', node);
                        return;
                    }
                    if (!dependency.dependents) {
                        dependency.dependents = [];
                    }
                    dependency.dependents.push(node.name);
                });
            }
            if (node.children) {
                node.children.map(addDependents);
            }
        };

        var addDetails = function(node) {
            addDetailsForNode(node);
            if (node.children) {
                node.children.map(addDetails);
            }
        };

        /**
         * Add details to a node, including inherited ones (shown between parentheses).
         *
         * Mutates the given node.
         *
         * Example added properties:
         * {
         *   details: {
         *     Dependencies: ["Foo", "Bar (Babar)"],
         *     Dependents: ["Baz", "Buzz"];
         *     Technos: ["Foo", "Bar (Babar)" }
         *     Host: ["OVH", "fo (Foo)"]
         *   }
         * }
         */
        var addDetailsForNode = function(node) {
            node.details = {};
            var dependsOn = getDetailCascade(node, 'dependsOn');
            if (dependsOn.length > 0) {
                node.details.Dependencies = dependsOn.map(getValueAndAncestor);
            }
            if (node.dependents) {
                node.details.Dependents = node.dependents;
            }
            var technos = getDetailCascade(node, 'technos');
            if (technos.length > 0) {
                node.details.Technos = technos.map(getValueAndAncestor);
            }
            if (node.host) {
                node.details.Host = [];
                for (var i in node.host) {
                    node.details.Host.push(i);
                }
            }

            return node;
        };

        var getDetailCascade = function(node, detailName, via) {
            var values = [];
            if (node[detailName]) {
                node[detailName].forEach(function(value) {
                    values.push({
                        value: value,
                        via: via
                    });
                });
            }
            if (node.parent) {
                values = values.concat(getDetailCascade(node.parent, detailName, node.parent.name));
            }
            return values;
        };

        var getValueAndAncestor = function(detail) {
            return detail.via ? detail.value + ' (' + detail.via + ')' : detail.value;
        };

        addParent(data);
        addDependents(data);
        addDetails(data);

        return data;
    }


    /**
     * Returns the node path
     * @param {Object} d
     * @returns {Array}
     */
    var getNodePath = function(node) {
        var path = [],
            current = node;

        do {
            path.push(current.name);
            current = current.parent;
        } while (typeof(current) !== 'undefined');

        return path.reverse();
    };

    var getNodeByName = function(name, data) {
        if (data.name === name) {
            return data;
        }
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            var matchingNode = getNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    // Events
    container
        .on('hoverNode', function(event) {
            $scope.node = getNodeByName(event.detail, $scope.data);
            $scope.detail = true;
            $scope.edit = false;
            $scope.$digest();
        })
        .on('selectNode', function(event) {
            $scope.enterEdit(event.detail);
            $scope.$digest();
        })
        .on('unSelectNode', function(event) {
            if ($scope.edit) {
                $scope.leaveEdit();
                $scope.$digest();
            }
        });

    $scope.enterEdit = function(name) {
        $scope.originalNode = getNodeByName(name, $scope.data);
        $scope.node = angular.copy($scope.originalNode);
        $scope.detail = false;
        $scope.edit = true;

        // have to keep the host keys in an array to manage edition
        $scope.hostKeys = {};
        angular.forEach($scope.node.host, function(value, key) {
            $scope.hostKeys[key] = key;
        });
    };

    $scope.leaveEdit = function() {
        $scope.node = angular.copy($scope.originalNode);
        $scope.detail = true;
        $scope.edit = false;
        bus.emit('unselect');
    };

    $scope.editNode = function(form, $event) {
        $event.preventDefault();

        angular.forEach($scope.hostKeys, function(value, key) {
            if (value !== key) {
                $scope.node.host[value] = angular.copy($scope.node.host[key]);
                delete $scope.node.host[key];
            }
        });

        data.updateNode($scope.originalNode.name, $scope.node);
        data.emitRefresh();

        $scope.node = getNodeByName($scope.node.name, $scope.data);
        $scope.detail = true;
        $scope.edit = false;
    };

    $scope.deleteNode = function() {
        if (!$window.confirm('Are you sure you want to delete that node?')) return;
        data.removeNode($scope.originalNode.name);
        data.emitRefresh();

        $scope.detail = false;
        $scope.edit = false;
    };

    $scope.moveNode = function() {
        var dest = $window.prompt('Please type the name of the parent node to move to');
        data.moveNode($scope.originalNode.name, dest);
        data.emitRefresh();

        $timeout(function() {
            bus.emit('select', $scope.originalNode.name);
        });
    };

    $scope.addNode = function() {
        data.addNode($scope.originalNode.name);
        data.emitRefresh();

        $timeout(function() {
            bus.emit('select', 'New node');
        });
    };

    $scope.addDependency = function() {
        if (typeof($scope.node.dependsOn) === 'undefined') {
            $scope.node.dependsOn = [];
        }
        $scope.node.dependsOn.push('');
    };

    $scope.deleteDependency = function(index) {
        $scope.node.dependsOn.splice(index, 1);
    };

    $scope.addTechno = function() {
        if (typeof($scope.node.technos) === 'undefined') {
            $scope.node.technos = [];
        }
        $scope.node.technos.push('');
    };

    $scope.deleteTechno = function(index) {
        $scope.node.technos.splice(index, 1);
    };

    $scope.addHost = function(key) {
        if (typeof($scope.node.host[key]) === 'undefined') {
            $scope.node.host[key] = [];
        }
        $scope.node.host[key].push('');
    };

    $scope.deleteHost = function(key, index) {
        $scope.node.host[key].splice(index, 1);
    };

    $scope.addHostCategory = function() {
        if (typeof($scope.node.host) === 'undefined') {
            $scope.node.host = {};
        }
        $scope.node.host[''] = [];
        $scope.hostKeys[''] = '';
    };

    $scope.deleteHostCategory = function(key) {
        delete $scope.hostKeys[key];
        delete $scope.node.host[key];
    };
}]);

angular.module('adf.widget.treewidget').controller('jsonDataCtrl', ['$scope', 'bus', 'data', function($scope, bus, data) {
    

    var previousData;

    bus.on('updateData', function(data) {
        previousData = data;
        $scope.data = JSON.stringify(data, undefined, 2);
    });

    $scope.updateData = function() {
        var newData = JSON.parse($scope.data);
        if (!angular.equals(newData, previousData)) {
            data.setJsonData(newData);
        }
    };

}]);

angular.module('adf.widget.treewidget').directive('initFocus', function() {
    var timer;

    return function(scope, elm, attr) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
            elm[0].focus();
        }, 0);
    };
});

angular.module('adf.widget.treewidget').controller('filterCtrl', ['$scope', 'bus', function($scope, bus) {
    

    bus.on('updateData', function(data) {
        $scope.technos = computeTechnos(data);
        $scope.hosts = computeHosts(data);
    });

    $scope.nameFilter = '';

    var technosFilter = [];
    var hostsFilter = [];

    $scope.$watch('nameFilter', function(name) {
        bus.emit('nameFilterChange', name);
    });

    $scope.toggleTechnoFilter = function(techno) {
        if ($scope.isTechnoInFilter(techno)) {
            technosFilter.splice(technosFilter.indexOf(techno), 1);
        } else {
            technosFilter.push(techno);
        }
        bus.emit('technosFilterChange', technosFilter);
    };

    $scope.isTechnoInFilter = function(techno) {
        return technosFilter.indexOf(techno) !== -1;
    };

    $scope.toggleHostFilter = function(host) {
        if ($scope.isHostInFilter(host)) {
            hostsFilter.splice(hostsFilter.indexOf(host), 1);
        } else {
            hostsFilter.push(host);
        }
        bus.emit('hostsFilterChange', hostsFilter);
    };

    $scope.isHostInFilter = function(host) {
        return hostsFilter.indexOf(host) !== -1;
    };

    function computeTechnos(rootNode) {
        var technos = [];

        function addNodeTechnos(node) {
            if (node.technos) {
                node.technos.forEach(function(techno) {
                    technos[techno] = true;
                });
            }
            if (node.children) {
                node.children.forEach(function(childNode) {
                    addNodeTechnos(childNode);
                });
            }
        }

        addNodeTechnos(rootNode);

        return Object.keys(technos).sort();
    }

    function computeHosts(rootNode) {
        var hosts = {};

        function addNodeHosts(node) {
            if (node.host) {
                for (var i in node.host) {
                    hosts[i] = true;
                }
            }
            if (node.children) {
                node.children.forEach(function(childNode) {
                    addNodeHosts(childNode);
                });
            }
        }

        addNodeHosts(rootNode);

        return Object.keys(hosts).sort();
    }

}]);

angular.module('adf.widget.treewidget').service('data', ['$http', '$q', 'bus', 'config', function($http, $q, bus, config) {
    

    var jsonData;

    /**
     * Get the tree object from json file
     * @returns {Promise}
     */
    var fetchJsonData = function() {
        if (typeof(jsonData) !== 'undefined') {
            return $q.when(jsonData);
        } else if (!config.url) {
            return $http.get('/llp_core/data.json').success(function(data) {
                setJsonData(data);
                return data;
            })
        } else {
            return $http.get(config.url).success(function(data) {
                setJsonData(data);
                return data;
            });
        }
    };

    var emitRefresh = function() {
        bus.emit('updateData', jsonData);
    };

    /**
     * Get the tree object
     */
    var getJsonData = function() {
        return jsonData;
    };

    /**
     * Set the tree object
     */
    var setJsonData = function(data) {
        jsonData = data;
        emitRefresh();
    };

    var getNodeByName = function(name, data) {
        data = data || jsonData;
        if (data.name === name) {
            return data;
        }
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            var matchingNode = getNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    var getParentNodeByName = function(name, data) {
        data = data || jsonData;
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            if (data.children[i].name === name) return data;
            var matchingNode = getParentNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    /**
     * Update a node using another node data
     *
     * @param {Array}  path e.g. ['foo', 'bar', 'baz']
     * @param {Object} updatedNode New node data to use
     * @param {Object} cursor
     */
    var updateNode = function(name, updatedNode) {
        var node = getNodeByName(name);
        updateDependencies(node.name, updatedNode.name);
        for (var i in updatedNode) {
            if (updatedNode.hasOwnProperty(i) && i !== 'children' && i !== 'parent' && i !== 'details') {
                node[i] = updatedNode[i];
            }
        }
    };

    /**
     * Updates a name in the tree dependencies
     * @param {String} name
     * @param {String} newName
     * @param {Object} cursor
     */
    var updateDependencies = function(name, newName, cursor) {
        cursor = cursor || jsonData;

        updateNodeDependency(name, newName, cursor);

        if (typeof(cursor.children) !== 'undefined' && cursor.children.length) {
            cursor.children.forEach(function(child) {
                updateDependencies(name, newName, child);
            });
        }
    };

    /**
     * Function destined to be used in array.map()
     */
    var removeDependencies = function(name) {
        updateDependencies(name);
    };

    /**
     * Update or remove one element in a node's dependencies
     *
     * @param {String} name
     * @param {String} newName
     * @param {Object} node
     */
    var updateNodeDependency = function(name, newName, node) {
        if (typeof(node.dependsOn) === 'undefined') {
            return;
        }
        var pos = node.dependsOn.indexOf(name);
        if (pos === -1) return;
        if (newName) {
            // rename dependency
            node.dependsOn[pos] = newName;
        } else {
            // remove dependency
            node.dependsOn.splice(pos, 1);
        }
    };

    /**
     * Adds a child node to the specified node name
     */
    var addNode = function(name, newNode) {
        newNode = newNode || {
            name: 'New node'
        };
        var node = getNodeByName(name);
        if (!node.children) {
            node.children = [];
        }
        node.children.push(newNode);
    };

    /**
     * Removes a node in the tree
     */
    var removeNode = function(name) {
        var parentNode = getParentNodeByName(name);
        if (!parentNode) return false;
        for (var i = 0, length = parentNode.children.length; i < length; i++) {
            var child = parentNode.children[i];
            if (child.name === name) {
                // we're in the final Node
                // remove the node (and children) from dependencies
                getBranchNames(child).map(removeDependencies);
                // remove the node
                return parentNode.children.splice(i, 1);
            }
        }
    };

    /**
     * Move anode under another parent
     */
    var moveNode = function(nodeName, newParentNodeName) {
        var removedNodes = removeNode(nodeName);
        if (!removedNodes || removedNodes.length === 0) return false;
        addNode(newParentNodeName, removedNodes[0]);
    };

    /**
     * Get an array of all the names in the branch
     * Including branch root name, and all descendents names
     */
    var getBranchNames = function(node) {
        var names = [node.name];
        if (node.children) {
            node.children.forEach(function(child) {
                names = names.concat(getBranchNames(child));
            });
        }
        return names;
    };

    return {
        fetchJsonData: fetchJsonData,
        getJsonData: getJsonData,
        setJsonData: setJsonData,
        emitRefresh: emitRefresh,
        getNodeByName: getNodeByName,
        updateNode: updateNode,
        addNode: addNode,
        removeNode: removeNode,
        moveNode: moveNode
    };
}]);



d3.chart = d3.chart || {};

d3.chart.architectureTree = function() {

    var svg, tree, treeData, diameter, activeNode;

    /**
     * Build the chart
     */
    function chart() {
        if (typeof(tree) === 'undefined') {
            tree = d3.layout.tree()
                .size([360, diameter / 2 - 120])
                .separation(function(a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });

            svg = d3.select("#graph").append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .append("g")
                .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
        }

        var nodes = tree.nodes(treeData),
            links = tree.links(nodes);

        activeNode = null;

        svg.call(updateData, nodes, links);
    }

    /**
     * Update the chart data
     * @param {Object} container
     * @param {Array}  nodes
     */
    var updateData = function(container, nodes, links) {

        // Enrich data
        addDependents(nodes);
        nodes.map(function(node) {
            addIndex(node);
        });

        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) {
                return [d.y, d.x / 180 * Math.PI];
            });

        var linkSelection = svg.selectAll(".link").data(links, function(d) {
            return d.source.name + d.target.name + Math.random();
        });
        linkSelection.exit().remove();

        linkSelection.enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var nodeSelection = container.selectAll(".node").data(nodes, function(d) {
            return d.name + Math.random(); // always update node
        });
        nodeSelection.exit().remove();

        var node = nodeSelection.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
            })
            .on('mouseover', function(d) {
                if (activeNode !== null) {
                    return;
                }
                fade(0.1)(d);
                document.querySelector('#panel').dispatchEvent(
                    new CustomEvent("hoverNode", {
                        "detail": d.name
                    })
                );
            })
            .on('mouseout', function(d) {
                if (activeNode !== null) {
                    return;
                }
                fade(1)(d);
            })
            .on('click', function(d) {
                select(d.name);
            });

        node.append("circle")
            .attr("r", function(d) {
                return 4.5 * (d.size || 1);
            })
            .style('stroke', function(d) {
                return d3.scale.linear()
                    .domain([1, 0])
                    .range(["steelblue", "red"])(typeof d.satisfaction !== "undefined" ? d.satisfaction : 1);
            })
            .style('fill', function(d) {
                if (typeof d.satisfaction === "undefined") return '#fff';
                return d3.scale.linear()
                    .domain([1, 0])
                    .range(["white", "#f66"])(typeof d.satisfaction !== "undefined" ? d.satisfaction : 1);
            });

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) {
                return d.x < 180 ? "start" : "end";
            })
            .attr("transform", function(d) {
                return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
            })
            .text(function(d) {
                return d.name;
            });
    };

    /**
     * Add the node dependents in the tree
     * @param {Array} nodes
     */
    var addDependents = function(nodes) {
        var dependents = [];
        nodes.forEach(function(node) {
            if (node.dependsOn) {
                node.dependsOn.forEach(function(dependsOn) {
                    if (!dependents[dependsOn]) {
                        dependents[dependsOn] = [];
                    }
                    dependents[dependsOn].push(node.name);
                });
            }
        });
        nodes.forEach(function(node, index) {
            if (dependents[node.name]) {
                nodes[index].dependents = dependents[node.name];
            }
        });
    };

    /**
     * Add indices to a node, including inherited ones.
     *
     * Mutates the given node (datum).
     *
     * Example added properties:
     * {
     *   index: {
     *     relatedNodes: ["Foo", "Bar", "Baz", "Buzz"],
     *     technos: ["Foo", "Bar"],
     *     host: ["OVH", "fo"] 
     *   }
     * }
     */
    var addIndex = function(node) {
        node.index = {
            relatedNodes: [],
            technos: [],
            hosts: []
        };
        var dependsOn = getDetailCascade(node, 'dependsOn');
        if (dependsOn.length > 0) {
            node.index.relatedNodes = node.index.relatedNodes.concat(dependsOn);
        }
        if (node.dependents) {
            node.index.relatedNodes = node.index.relatedNodes.concat(node.dependents);
        }
        var technos = getDetailCascade(node, 'technos');
        if (technos.length > 0) {
            node.index.technos = technos;
        }
        var hosts = getHostsCascade(node);
        if (hosts.length > 0) {
            node.index.hosts = hosts;
        }
    };

    var getDetailCascade = function(node, detailName) {
        var values = [];
        if (node[detailName]) {
            node[detailName].forEach(function(value) {
                values.push(value);
            });
        }
        if (node.parent) {
            values = values.concat(getDetailCascade(node.parent, detailName));
        }
        return values;
    };

    var getHostsCascade = function(node) {
        var values = [];
        if (node.host) {
            for (var i in node.host) {
                values.push(i);
            }
        }
        if (node.parent) {
            values = values.concat(getHostsCascade(node.parent));
        }
        return values;
    };

    var fade = function(opacity) {
        return function(node) {
            //if (!node.dependsOn || !(node.parent && node.parent.dependsOn)) return;
            svg.selectAll(".node")
                .filter(function(d) {
                    if (d.name === node.name) return false;
                    return node.index.relatedNodes.indexOf(d.name) === -1;
                })
                .transition()
                .style("opacity", opacity);
        };
    };

    var filters = {
        name: '',
        technos: [],
        hosts: []
    };

    var isFoundByFilter = function(d) {
        var i;
        if (!filters.name && !filters.technos.length && !filters.hosts.length) {
            // nothing selected
            return true;
        }
        if (filters.name) {
            if (d.name.toLowerCase().indexOf(filters.name) === -1) return false;
        }
        var technosCount = filters.technos.length;
        if (technosCount) {
            if (d.index.technos.length === 0) return false;
            for (i = 0; i < technosCount; i++) {
                if (d.index.technos.indexOf(filters.technos[i]) === -1) return false;
            }
        }
        var hostCount = filters.hosts.length;
        if (hostCount) {
            if (d.index.hosts.length === 0) return false;
            for (i = 0; i < hostCount; i++) {
                if (d.index.hosts.indexOf(filters.hosts[i]) === -1) return false;
            }
        }
        return true;
    };

    var refreshFilters = function() {
        d3.selectAll('.node').classed('notFound', function(d) {
            return !isFoundByFilter(d);
        });
    };

    var select = function(name) {
        if (activeNode && activeNode.name == name) {
            unselect();
            return;
        }
        unselect();
        svg.selectAll(".node")
            .filter(function(d) {
                if (d.name === name) return true;
            })
            .each(function(d) {
                document.querySelector('#panel').dispatchEvent(
                    new CustomEvent("selectNode", {
                        "detail": d.name
                    })
                );
                d3.select(this).attr("id", "node-active");
                activeNode = d;
                fade(0.1)(d);
            });
    };

    var unselect = function() {
        if (activeNode == null) return;
        fade(1)(activeNode);
        d3.select('#node-active').attr("id", null);
        activeNode = null;
        document.querySelector('#panel').dispatchEvent(
            new CustomEvent("unSelectNode")
        );
    };

    chart.select = select;
    chart.unselect = unselect;

    chart.data = function(value) {
        if (!arguments.length) return treeData;
        treeData = value;
        return chart;
    };

    chart.diameter = function(value) {
        if (!arguments.length) return diameter;
        diameter = value;
        return chart;
    };

    chart.nameFilter = function(nameFilter) {
        filters.name = nameFilter;
        refreshFilters();
    };

    chart.technosFilter = function(technosFilter) {
        filters.technos = technosFilter;
        refreshFilters();
    };

    chart.hostsFilter = function(hostsFilter) {
        filters.hosts = hostsFilter;
        refreshFilters();
    };

    return chart;
};

angular.module('adf.widget.treewidget').controller('chartCtrl', ['$scope', 'bus', function($scope, bus) {
    

    bus.on('updateData', function(data) {
        $scope.data = angular.copy(data);
    });
}]);

/*services/bus.js*/

angular.module('adf.widget.treewidget').service('bus', ['$http', '$q', function($http, $q) {
    

    // Simple message bus to event the overhead of angular emit / broadcast

    var subscribers = {};

    var on = function(eventName, callback) {
        if (!subscribers[eventName]) {
            subscribers[eventName] = [];
        }
        subscribers[eventName].push(callback);
    };

    var emit = function(eventName, body) {
        if (!subscribers[eventName]) {
            return false;
        }
        subscribers[eventName].forEach(function(callback) {
            callback(body);
        });
        return true;
    };

    return {
        on: on,
        emit: emit
    };
}]);

angular.module('adf.widget.treewidget')
    .run(['data', function(data) {
        data.fetchJsonData().then(function(response) {
            console.log('data loaded');
        }, console.error);
    }]);
})(window);