(function () {
    'use strict';

    var app = angular.module('login', []);

    app.controller('menuCtrl', function ($rootScope, $scope, $localStorage, $state, $ionicLoading, dialogService, personagemService) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $ionicLoading.show({
            template: 'carregando os dados do seu personagem...',
            duration: 20000
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });

        var pid = $localStorage.personagem.$id;
        //      var ref = firebase.database().ref().child("personagens").child(pid);
        var personagem = personagemService.personagemByID(pid);
        personagem.$loaded().then(function () {
            $scope.personagem = personagem;
            $rootScope.personagem = personagem;
            $localStorage.personagem = personagem;
            // $scope.personagem = angular.copy($localStorage.personagem);
            console.log("personagem logado: ", personagem);
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            $scope.personagem = $localStorage.personagem;
            $ionicLoading.hide();
        });


        $scope.logout = function () {
            var confirm = dialogService.confirm({ template: "Deseja sair?" });
            //var r = confirm("Deseja sair??");
            //if (r == true) {
            confirm.then(function (sucesso) {
                if (sucesso) {
                    firebase.auth().signOut().then(function () {
                        console.log('signed out!');
                        delete $localStorage.user;
                        delete $localStorage.personagem;
                        //alert('Logout realizado com sucesso');
                        $state.go('login');
                    }, function (error) {
                        console.error('Sign Out Error', error);
                        alert('Ocorreu algum erro ao tentar sair!!!');
                    });
                }
            })
                .catch(function (err) {
                    console.log('deu erro no confirm: ', err);
                });
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
            }).then(function () {
                console.log("The loading indicator is now displayed");
            });

            Auth.$signInWithEmailAndPassword(user.email, user.password).then(function (firebaseUser) {
                console.log("Signed in as:" + firebaseUser.uid);
                $localStorage.user = firebaseUser;

                var personagem = personagemService.personagemByUserID(firebaseUser.uid);
                personagem.$loaded().then(function () {
                    console.log(personagem[0]);
                    $localStorage.personagem = personagem[0];
                    $ionicLoading.hide().then(function () {
                        console.log("The loading indicator is now hidden");
                    });
                    $state.go("app.home");
                });

            }).catch(function (error) {
                console.error("Authentication failed:", error);
                $ionicLoading.hide().then(function () {
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
                .then(function (firebaseUser) {
                    //console.log(JSON.stringify(firebaseUser));
                    console.log("conta criada com sucesso");

                    firebaseUser.updateProfile({
                        displayName: user.nome
                        // ,  photoURL: "https://example.com/jane-q-user/profile.jpg"
                    }).then(function () {
                        console.log("Perfil atualizado com sucesso.");
                    }, function (error) {
                        console.log("Erro ao atualizar perfil", error);
                    });

                    $localStorage.userid = firebaseUser.uid;
                    $localStorage.jogador = user.nome;
                    // firebaseUser.sendEmailVerification();
                    //alert("Seu email foi regsitrado com sucesso. Agora cadastre os dados do seu personagem. ");
                    $scope.showAlert();
                    //$state.go("perfil");
                }).catch(function (error) {
                    console.error("Error: ", error);
                    alert("Erro ao criar usuário. " + error.message);
                });
        }

        // An alert dialog
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Sucesso',
                template: 'Sua conta foi criada com <b>sucesso</b>. Agora cadastre os dados do seu personagem.'
            });

            alertPopup.then(function (res) {
                $state.go('perfil');
            });
        };


    });


    /**
     * FORGETPASS CONTROLLER
     */
    app.controller('forgetpassCtrl', function ($scope, $stateParams, $localStorage, Auth, $state, $ionicPopup) {

        $scope.resetPassword = function (param) {
            Auth.$sendPasswordResetEmail(param.email).then(function () {
                console.log("Password reset email sent successfully!");
                $scope.showAlert({
                    titulo: 'Sucesso',
                    mensagem: 'Em instantes você receberá um email para resetar sua senha.',
                    acao: 'login'
                });
            }).catch(function (error) {
                console.error("Error: ", error);
                $scope.showAlert({
                    titulo: 'Atenção',
                    mensagem: 'Ocorreu um erro ao realizar a solicitação de reset de senha. <br/><b>Operação não realizada</b>.'
                });
            });
        }

        // An alert dialog
        $scope.showAlert = function (param) {
            var alertPopup = $ionicPopup.alert({
                title: param.titulo,
                template: param.mensagem
            });

            alertPopup.then(function (res) {
                if (param.acao) {
                    $state.go(param.acao);
                }
            });
        };


    });


})();