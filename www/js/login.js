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

  /**
   * 
   */
  app.controller('loginCtrl', function ($scope, $stateParams, $localStorage, Auth, $state) {
    // $localStorage.signin = 'no';
    console.log('login? ');
/*
    Auth.$onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {
        console.log("Signed in as:", firebaseUser.uid);
        $state.go("app.home");
      } else {
        console.log("Signed out");
      }
    });
*/
    $scope.emailLogin = function (user) {
      console.log('emailLogin');
      Auth.$signInWithEmailAndPassword(user.email, user.password).then(function(firebaseUser) {
        console.log("Signed in as:" + JSON.stringify(firebaseUser));
      }).catch(function(error) {
        console.error("Authentication failed:", error);
        alert('Login falhou!');
      });
    };

  });


  /**
   * SIGNUP controller
   */
  app.controller('signupCtrl', function ($scope, $stateParams, $localStorage, Auth, $state, $ionicPopup) {
    console.log('signupCtrl');
    var user = {};

    // registra novo usuario
    $scope.signup = function (user) {

      Auth.$createUserWithEmailAndPassword(user.email, user.pass)
      .then(function(firebaseUser) {
        //console.log(JSON.stringify(firebaseUser));
        console.log("conta criada com sucesso");
        
        firebaseUser.updateProfile({
          displayName: user.nome
          // ,  photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(function() {
          console.log("Perfil atualizado com sucesso.");
        }, function(error) {
          console.log("Erro ao atualizar perfil", error);
        });

        //$localStorage.firebaseUser = firebaseUser;
        // firebaseUser.sendEmailVerification();
        //alert("Seu email foi regsitrado com sucesso. Agora cadastre os dados do seu personagem. ");
        $scope.showAlert();
        //$state.go("perfil");
      }).catch(function(error) {
        console.error("Error: ", error);
        alert("Erro ao criar usuário. "+ error.message);
      });
    }

    // An alert dialog
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Sucesso',
        template: 'Sua conta foi criada com <b>sucesso</b>. Agora cadastre os dados do seu personagem.'
      });

      alertPopup.then(function(res) {
        $state.go('perfil');
      });
    };
    
      
  });

  app.controller('resetPassCtrl', function ($scope, $stateParams, $localStorage, Auth, $state) {

    $scope.resetPassword = function() {
      Auth.$sendPasswordResetEmail("my@email.com").then(function() {
        console.log("Password reset email sent successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    }
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

  // let's create a re-usable factory that generates the $firebaseAuth instance
  app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
      return $firebaseAuth();
    }
  ]);

})();