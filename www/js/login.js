(function () {
  'use strict';

  var app = angular.module('login', []);

  app.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

  });


  app.controller('loginCtrl', function ($scope, $stateParams, $localStorage, $firebaseAuth, $state) {
    // $localStorage.signin = 'no';
    console.log('login? ');

    $scope.doLogin = function() {
      $state.go('app.home');
    };

    $scope.fbSignin = function () {
      console.log('123');
      var auth = $firebaseAuth();
      //var provider = new firebase.auth.FacebookAuthProvider();

      auth.$signInWithPopup("facebook").then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(token);
        console.log(user.displayName);
        console.log(user.email);
        console.log(user.photoURL);
        console.log(user);

        $state.go('app.perfil');
      }).catch(function (error) {
        console.log(JSON.stringify(error));
      });
    };

  });

  app.controller('signupCtrl', function ($scope, $stateParams, $localStorage, $firebaseAuth, $state) {
    console.log('signupCtrl');
    $scope.registrar = function (params) {
        $state.go("perfil");
    };
  });

  app.controller('perfilCtrl', function ($scope, $stateParams, $localStorage, $firebaseAuth, $state) {
    console.log("perfilCtrl");
    $scope.seitas = ["Camarilla", "Sabbat", "Independente"];
    $scope.clans = ["Brujah", "Gangrel", "Malkaviano", "Nosferatu", "Toreador", "Tremere", "Ventrue"];
    
    $scope.registrar = function (params) {
      console.log("registrar perfil");
        $state.go("app.home");
    };
  });

})();