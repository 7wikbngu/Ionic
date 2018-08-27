// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('splash', {
      url: '/splash',
      templateUrl: '../template/splash.html',
      controller: 'splashCtrl'
    })
    .state('main', {
      url: '/main',
      templateUrl: '../template/main.html',
      controller: 'mainCtrl'
    })
    .state('info', {
      url: '/info',
      templateUrl: '../template/info.html',
      controller: 'infoCtrl'
    });
  $urlRouterProvider.otherwise('/splash');
}])

.controller('mainCtrl',['$scope', '$http', '$state', function($scope, $http, $state){
  $scope.get = function () {
    city = $scope.cityName;
    $http.get('http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=279b9caa6884de71bd56f55d055cc2b4')
      .then(function (res) {
        $scope.datas = res.data;
        temp = $scope.datas.main.temp;
        $scope.temperature = temp - 273.15;
        console.log("Data reveived in 'res'");
        window.localStorage.setItem('res', JSON.stringify(res));
      },
        function (err) {
          console.log("ERROR: ", err);
        });
  }

  // Toggle between Celsius and fahrenheit 
  
  $scope.changeTemp = function(){
    console.log($scope.cToF)
    if($scope.cToF === true){
      $scope.temperature = temp - 273.15;
    } else{
      $scope.temperature = (temp * 1.8) - 459.67;
    }
    $scope.cToF = !$scope.cToF;
  }
  // Change screens when swipe up
  $scope.changeInfo = function(){
    console.log('main page --> info page');
    $state.go('info');
  }
  // Change background based on the temperature
  $scope.colorValue = 'red';
}])

.controller('splashCtrl', ['$state', '$timeout', function($state, $timeout){
  console.log('Changing in 5 secs...');
  $timeout(function(){
    $state.go('main');
  },5000);
}])

.controller('infoCtrl', ['$scope', '$state', function($scope, $state){
  $scope.changeMain = function(){
    console.log('info page --> main page');
    $state.go('main');
  }
  $scope.datas = JSON.parse(window.localStorage.getItem('res')).data;
  console.log($scope.datas);
}])
