'use strict';
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
}])
.controller('RevealCtrl', ['$scope', '$stateParams', 'revealjs', '$document', '$window', '$css', 'toastr','config','$compile','Collection','$filter',
function ($scope, $stateParams, revealjs, $document, $window, $css, toastr, config, $compile, Collection,$filter){
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
         thishtml = thishtml + '  <section>  ' +colly.slice(colly.indexOf('<body')-1, colly.indexOf('<script>')) + '  </section>  ';
      //          thishtml = thishtml + '  <section data-background-image="url('+slide.media+')">  ' + '<h2>' +slide.title +'</h2><hr/>'+ slide.slide.slice(slide.slide.indexOf('<body'),slide.slide.indexOf('<script')) + '  </section>  ';

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
        'media': 'https://lexlab.io/files/public/uspto/patents/8382656/8382656.png',
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
      },{
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
            }],
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
          'text':  rvent.description || '&nbsp;',
          'classname': rvent.styleClass || 'btn-dark',
          'asset': {
            'media': rvent.media || '&nbsp;',
            'credit': rvent.styleClass || '&nbsp;',
            'caption': rvent.description || '&nbsp;',
            'thumbnail': rvent.thumnail || '/llp_core/apple-touch-icon.png',
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
          }
        }]
      }
    };
    iteratey(collection);
    });


      };
      vm.remove = function(obj){
        vm.data.timeline.date.splice(vm.data.timeline.date.indexOf(obj),1);
      }
      vm.initialize = function(datasource){

        storyjs.createStoryJS().then(function (createStoryJS) {
          vm.options = {
            type: 'timeline',
            width: 950,
            height: 650,
            source: angular.isObject(datasource) ? datasource : 'https://lexlab.io/files/public/timelines/'+datasource+'.json',
            embed_id: 'timeline',
            hash_bookmark: true,
            debug: true,
            theme: 'dark',
            font: 'Georgia-Helvetica'
          };
          createStoryJS(vm.options); });

      };
      vm.save = function(){
        $http.post('/timeline/'+config.id, angular.toJson(vm.data));
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

}]).directive('timelinejs',function(Collection){
  return {
    restrict: 'E',
    template: '<section id="timeline" ></section>',
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
