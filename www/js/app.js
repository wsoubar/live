// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'ngCordova', 'ngStorage', 'services',
    'menu', 'login', 'personagem', 'acoes', 'dados', 'perfil', 'chat', 'admin', 'pagamentos'])

    .run(function ($ionicPlatform, $rootScope, $localStorage, $state, $firebaseArray, dialogService, $ionicHistory) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            console.log('user stored: ', $localStorage.user);
            //stateChange event
            $ionicPlatform.registerBackButtonAction(function (event) {
                if ($state.current.name == "app.home") {
                    //var sair = confirm("Sair?");
                    //$ionicHistory.clearHistory();
                    var confirm = dialogService.confirm({template: "Sair do app?"});
                    confirm.then(function (sair) {
                        if (sair) {
                            navigator.app.exitApp(); //<-- remove this line to disable the exit
                        }
                    });
                } else {
                    //navigator.app.backHistory();
                    $ionicHistory.goBack();
                }
            }, 100);

        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {


/* 
   $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'http://www.geocities.ws/hpkbrasil/**'
   ]);
*/
        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })

            .state('autologin', {
                url: '/autologin',
                controller: 'autologinCtrl'
            })

            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller: 'signupCtrl'
            })

            .state('forgetpass', {
                url: '/forgetpass',
                templateUrl: 'templates/forgetpass.html',
                controller: 'forgetpassCtrl'
            })

            .state('perfil', {
                url: '/perfil',
                templateUrl: 'templates/perfil.html',
                controller: 'perfilCtrl'
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'menuCtrl'
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'homeCtrl'
                    }
                }
            })

            .state('app.edit-personagem', {
                cache: false,
                url: '/edit-personagem/:pid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-personagem.html',
                        controller: 'editPersonagemCtrl'
                    }
                }
            })

            .state('app.edit-personagem-xp', {
                url: '/edit-personagem-xp/:pid/:narrador',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-personagem-xp.html',
                        controller: 'editPersonagemXPCtrl'
                    }
                }

            })

            .state('app.edit-personagem-campo', {
                url: '/edit-personagem-campo/:campo/:pid/:aprovado',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-personagem-campo.html',
                        controller: 'editPersonagemCampoCtrl'
                    }
                }

            })

            .state('app.personagens', {
                url: '/personagens',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/personagens.html',
                        controller: 'personagensCtrl'
                    }
                }
            })

            .state('app.dados', {
                url: '/dados',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dados.html',
                        controller: 'dadosCtrl'
                    }
                }
            })

            .state('app.admin', {
                url: '/admin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/admin.html',
                        controller: 'adminCtrl'
                    }
                }
            })

            .state('app.adminMenu', {
                url: '/admin-menu',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/admin-menu.html',
                        controller: 'adminMenuCtrl'
                    }
                }
            })

            .state('app.adminPersonagem', {
                url: '/admin-personagem',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/admin-personagem.html',
                        controller: 'adminPersonagemCtrl'
                    }
                }
            })

            .state('app.rooms', {
                url: '/rooms',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rooms.html',
                        controller: 'roomsCtrl'
                    }
                }

            })

            .state('app.chat', {
                url: '/chat/:chatid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chat.html',
                        controller: 'chatCtrl'
                    }
                }

            })

            .state('app.acoes', {
                url: '/acao',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/acoes.html',
                        controller: 'acoesCtrl'
                    }
                }

            })

            .state('app.acoes-adm', {
                url: '/acao-adm',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/acoes-adm.html',
                        controller: 'acoesAdmCtrl'
                    }
                }

            })

            .state('app.acoes-adm-jogador', {
                url: '/acao-adm-jogador',
                params: {
                    acao: null
                },                
                views: {
                    'menuContent': {
                        templateUrl: 'templates/acoes-adm-jogador.html',
                        controller: 'acoesAdmJogadorCtrl'
                    }
                }

            })

            .state('app.pagto-adm', {
                url: '/pagto-adm',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pagto-adm.html',
                        controller: 'pagtoAdmCtrl'
                    }
                }

            })

            .state('app.pagto-adm-evento', {
                url: '/pagto-adm-evento/:eventoID',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pagto-adm-evento.html',
                        controller: 'pagtoAdmEventoCtrl'
                    }
                }

            })

            .state('app.chats-adm', {
                url: '/chats-adm',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chats-adm.html',
                        controller: 'chatsAdmCtrl'
                    }
                }

            })

            ;

        $urlRouterProvider.otherwise('/autologin');
    });