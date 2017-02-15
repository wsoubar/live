angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })


  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  })

  .controller('signinCtrl', function ($scope, $stateParams, $localStorage, $firebaseAuth, $state) {
    // $localStorage.signin = 'no';
    console.log('SignIn? ');

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
    }

  })
  ;
