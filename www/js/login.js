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
   * LOGIN CONTROLLER
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
        $state.go("app.home");
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


  /**
   * FORGETPASS CONTROLLER
   */
  app.controller('forgetpassCtrl', function ($scope, $stateParams, $localStorage, Auth, $state, $ionicPopup) {

    $scope.resetPassword = function(param) {
      Auth.$sendPasswordResetEmail(param.email).then(function() {
        console.log("Password reset email sent successfully!");
        $scope.showAlert({titulo: 'Sucesso', 
            mensagem: 'Em instantes você receberá um email para resetar sua senha.',
            acao: 'login'});
      }).catch(function(error) {
        console.error("Error: ", error);
        $scope.showAlert({titulo: 'Atenção', 
            mensagem: 'Ocorreu um erro ao realizar a solicitação de reset de senha. <br/><b>Operação não realizada</b>.'});
      });
    }

    // An alert dialog
    $scope.showAlert = function(param) {
      var alertPopup = $ionicPopup.alert({
        title: param.titulo,
        template: param.mensagem
      });

      alertPopup.then(function(res) {
        if (param.acao) {
            $state.go(param.acao);
        }
      });
    };


  });


  /**
   * PERFIL/Personagem CONTROLLER
   */
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