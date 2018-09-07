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
  $urlRouterProvider.otherwise('/main');
}])

.controller('mainCtrl',['$scope', '$http', '$state', '$ionicPopup', function($scope, $http, $state, $ionicPopup){
  // 'content' will show if true
  $scope.content = false;
  // Geolocation function will be called on "loaded" event of lifecycle
  $scope.lat = "";
  $scope.long = "";
  $scope.getDataByCoords = getDataByCoords;
  $scope.cityName = " ";
  $scope.$on('$ionicView.loaded', function(){
    console.log("Loaded.");
    navigator.geolocation.getCurrentPosition( (pos) => {
      console.log(pos);
      $scope.lat = pos.coords.latitude;
      $scope.long = pos.coords.longitude;
      getDataByCoords($scope.lat, $scope.long);
    }, (err) => {
      console.log("ERROR: ", err);
    }, { enableHighAccuracy: false });
  })
  // Lat and long API call
  function getDataByCoords(lat, long) {
    console.log(lat, long);
    $http.get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid=279b9caa6884de71bd56f55d055cc2b4').then( function (resp) {
        console.log(resp);
        $scope.datas = resp.data;
        temp = $scope.datas.main.temp;
        temp_min = $scope.datas.main.temp_min;
        temp_max = $scope.datas.main.temp_max;
        weather = $scope.datas.weather[0].main;
        changeImage(weather);
        $scope.temperature = temp - 273.15;
        $scope.temperatureMin = temp_min - 273.15;
        $scope.temperatureMax = temp_max - 273.15;
        sunriseUnix = $scope.datas.sys.sunrise;
        sunsetUnix = $scope.datas.sys.sunset;
        convertTime(sunriseUnix, sunsetUnix);
        console.log("Data reveived in 'resp'");
        $scope.content = true;
        $scope.swipe = false;
        $scope.cityName = $scope.datas.name;
        window.localStorage.setItem('Coords', JSON.stringify(resp));
      }, function (err) {
        console.log("ERROR: ", err);
        $ionicPopup.alert({
          cssClass: "alert",
          templateUrl: '../template/alert.html',
          okType: 'button-assertive'
        });
        $scope.content = false;
      });
  }

  // Openweather API call with cityName
  $scope.getData = function () {
    city = $scope.cityName;
    $http.get('http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=279b9caa6884de71bd56f55d055cc2b4').then( function (res) {
        $scope.datas = res.data;
        temp = $scope.datas.main.temp;
        temp_min = $scope.datas.main.temp_min;
        temp_max = $scope.datas.main.temp_max;
        weather = $scope.datas.weather[0].main;
        changeImage(weather);
        $scope.temperature = temp - 273.15;
        $scope.temperatureMin = temp_min - 273.15;
        $scope.temperatureMax = temp_max - 273.15;
        sunriseUnix = $scope.datas.sys.sunrise;
        sunsetUnix = $scope.datas.sys.sunset;
        convertTime(sunriseUnix,sunsetUnix);
        console.log("Data reveived in 'res'");
        $scope.content = true;
        $scope.swipe = false;
        $scope.cityName = "";
        window.localStorage.setItem('res', JSON.stringify(res));
      }, function (err) {
          console.log("ERROR: ", err);
          $ionicPopup.alert({
            cssClass: "alert",
            templateUrl: '../template/alert.html',
            okType: 'button-assertive'
          });
          $scope.content = false;
      });
  }
  
  // Display Weather Icon according to climate
  var changeImage = function (weather){
    console.log(weather);
    $scope.imgUrl = '../img/clear.png';
    if (weather === "Clouds") {
      $scope.imgUrl = '../img/cloudy.png';
    } else if (weather === "Clear") {
      $scope.imgUrl = '../img/clear.png';
    } else if (weather === "Rain") {
      $scope.imgUrl = '../img/chance of rain.png';
    }
  }
  

  // convert UNIX time to UTC time
  function convertTime(sunriseUnix,sunsetUnix){
    sunriseTime = new Date(sunriseUnix * 1000);
    sunsetTime = new Date(sunsetUnix * 1000);
    $scope.sunrise = sunriseTime.toLocaleTimeString();
    $scope.sunset = sunsetTime.toLocaleTimeString();
  }
  $scope.showInfo = function(){
    $scope.swipe = true;
  }

  $scope.showOther = function(){
    $scope.swipe = false;
  }
  // Toggle between Celsius and fahrenheit 
  $scope.cToF = false;
  $scope.changeTemp = function(){
    console.log($scope.cToF)
    if($scope.cToF === true){
      $scope.temperature = temp - 273.15;
      $scope.temperatureMin = temp_min - 273.15;
      $scope.temperatureMax = temp_max - 273.15;
    } else{
      $scope.temperature = (temp * 1.8) - 459.67;
      $scope.temperatureMin = (temp_min * 1.8) - 459.67;
      $scope.temperatureMax = (temp_max * 1.8) - 459.67;
    }
    $scope.cToF = !$scope.cToF;
  }
  // Change screens when swipe up
  // $scope.changeInfo = function(){
  //   console.log('main page --> info page');
  //   $state.go('info');
  // }
}])

.controller('splashCtrl', ['$state', '$timeout', function($state, $timeout){
  console.log('Changing in 5 secs...');
  // $timeout(function(){
  //   $state.go('main');
  // },5000);
}])

.controller('infoCtrl', ['$scope', '$state', function($scope, $state){
  $scope.changeMain = function(){
    console.log('info page --> main page');
    $state.go('main');
  }
  $scope.datas = JSON.parse(window.localStorage.getItem('res')).data;
  console.log($scope.datas);
}])
