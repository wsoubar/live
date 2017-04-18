(function () {
  'use strict';

  var app = angular.module('login', []);

  app.controller('menuCtrl', function ($scope, $localStorage, $state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

      console.log("personagem", $localStorage.personagem);
      $scope.personagem = $localStorage.personagem;

      $scope.logout = function () {
          var r = confirm("Deseja sair??");
          if (r == true) {
              firebase.auth().signOut().then(function() {
                  console.log('signed out!');
                  delete $localStorage.user; 
                  delete $localStorage.personagem;
                  //alert('Logout realizado com sucesso');
                  $state.go('login');
              }, function(error) {
                  console.error('Sign Out Error', error);
                  alert('Ocorreu algum erro ao tentar sair!!!');
              });
          } 
      };


  });

  app.controller('autologinCtrl', function ($scope, $localStorage, $state) {
    if ($localStorage.user && $localStorage.personagem) {
      $state.go('app.home');
    } else if ($localStorage.userid && $localStorage.jogador) {
      $state.go('perfil');
    } else {
      $state.go('login');
    }
  });

  /**
   * LOGIN CONTROLLER
   */
  app.controller('loginCtrl', function ($scope, $stateParams, $localStorage, Auth, $state, personagemService, $ionicLoading) {
    // $localStorage.signin = 'no';
    console.log('login? ');

    $scope.emailLogin = function (user) {
      console.log('emailLogin');

      $ionicLoading.show({
        template: 'aguarde...',
        duration: 10000
      }).then(function(){
        console.log("The loading indicator is now displayed");
      });

      Auth.$signInWithEmailAndPassword(user.email, user.password).then(function(firebaseUser) {
        console.log("Signed in as:" + firebaseUser.uid);
        $localStorage.user = firebaseUser;

        var personagem = personagemService.personagemByUserID(firebaseUser.uid);
        personagem.$loaded().then(function () {
          console.log(personagem[0]);
          $localStorage.personagem = personagem[0];
          $ionicLoading.hide().then(function(){
            console.log("The loading indicator is now hidden");
          });
          $state.go("app.home");
        });

      }).catch(function(error) {
        console.error("Authentication failed:", error);
        $ionicLoading.hide().then(function(){
          console.log("The loading indicator is now hidden");
        });
        alert('Login falhou!' + error.message);
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

        $localStorage.userid = firebaseUser.uid;
        $localStorage.jogador = user.nome;
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
  app.controller('perfilCtrl', function ($scope, $stateParams, $localStorage, $state, $firebaseObject, clans, seitas) {
    console.log("perfilCtrl");
    $scope.seitas = seitas;
    $scope.clans = clans;
    $scope.p = {};
    
    console.log(clans);

    $scope.registrar = function (personagem) {
      console.log("personagem: " + JSON.stringify(personagem));
      //var idRef = personagemRef.child("wsoubar@gmail.com");
      var ref = firebase.database().ref().child("personagens").push();
      var obj = $firebaseObject(ref);
      obj.nome = personagem.nome;
      obj.seita = personagem.seita;
      obj.clan = personagem.clan;
      obj.geracao = 13;
      obj.status = 0;
      obj.userid = $localStorage.userid;
      obj.dataCriacao = Date.now();
      obj.aprovado = 'N';
      obj.jogador = $localStorage.jogador;
      obj.narrador = 'N';
      
      obj.$save().then(function(ref) {
        ref.key === obj.$id; // true
        console.log('Salvo');
        delete $localStorage.userid;
        delete $localStorage.jogador;
        $state.go("login");
      }, function(error) {
        console.log("Error:", error);
        alert('Aconteceu um erro. Tente mais tarde.');
      });      
    };
  });


  /**
   * PERFIL/Personagem CONTROLLER
   */
  app.controller('dadosCtrl', function ($scope, $stateParams, $localStorage, $state, $firebaseObject, clans, seitas) {
    console.log("dadosCtrl");
    $scope.params = {modificador: 0, sucessos: 1, dificuldade: 7, paradadedados: 7};

    $scope.rolar = function (params) {
      //console.log('rolar');
      var resultadodados = '';
      var sucessos = 0;
      var falhasCriticas = 0;
      //console.log(params);
      for (var i = 0; i < parseInt(params.paradadedados); i++) {
        //console.log('no for');
        var r = Math.floor(Math.random() * 10) + 1;
        var df = parseInt(params.dificuldade);
        // console.log('dificuldade ' + df)
        if (r >= df) {
          sucessos++;
          //console.log('add sucesso ' + r);
        //} else {
          //console.log('sem sucesso sucesso ' + r);
        }
        if (r == 1) {
          falhasCriticas++;
        }
        if (i==0) {
          resultadodados = resultadodados + r;
        } else {
          resultadodados = resultadodados + '-' + r ;
        }
      }
      //console.log('sucessos '+sucessos);

      $scope.mostraresultado = true;
      $scope.resultadodados = resultadodados;
      var totalSucessos = sucessos - falhasCriticas;
      if (totalSucessos >= parseInt(params.sucessos) ) {
        $scope.sucesso = true;
        $scope.resultado = 'SUCESSO';
      } else {
        $scope.sucesso = false;
        $scope.resultado = 'FALHA';
        
      }
    };
  });

  // let's create a re-usable factory that generates the $firebaseAuth instance
  app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
      return $firebaseAuth();
    }
  ]);


  app.factory("clans", ["$firebaseArray", 
    function($firebaseArray) {
      var ref = firebase.database().ref().child("clanlist");
      var query = ref.orderByChild("clan");
      return $firebaseArray(query);
    }
  ]);

  app.factory("seitas", ["$firebaseArray", 
    function($firebaseArray) {
      var ref = firebase.database().ref().child("seita");
      // var query = clanlist.limitToLast(40);
      return $firebaseArray(ref);
    }
  ]);

/*
  app.factory("citacoes", ["$firebaseArray", 
    function($firebaseArray) {
      var ref = firebase.database().ref().child("citacoes");
      return $firebaseArray(ref);
    }
  ]);
*/
  app.factory("personagemService", ["$firebaseArray", "$firebaseObject",
    function($firebaseArray, $firebaseObject) {

      var factory = {
        personagemByUserID : personagemByUserID,
        personagens : personagens
      };
      
      return factory;

      function personagens() {
          var ref = firebase.database().ref().child("personagens").orderByChild("nome");
          var personagens = $firebaseArray(ref);
          console.log('personagemService::personagens');
          return personagens;
      }

      function personagemByUserID(userid) {
          var ref = firebase.database().ref().child("personagens").orderByChild("userid").equalTo(userid);
          //var query = ref.feedsRef.limitToLast(50);
          var personagem = $firebaseArray(ref);
          return personagem;
      }
    }
  ]);

  

})();