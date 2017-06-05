// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'ngCordova', 'ngStorage', 'services',
    'menu', 'login', 'personagem', 'acoes', 'dados', 'perfil', 'chat'])

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

            /*
            //    FCMPlugin.subscribeToTopic('MeusTestes');
            setTimeout(function() {
                console.log('carregando onNotification');
                var messaging = firebase.messaging();
            
                messaging.onMessage(function(payload) {
                    console.log("Message received. ", payload);
                    // ...
                });
            
                //FCMPlugin.getToken( successCallback(token), errorCallback(err) );
                //Keep in mind the function will return null if the token has not been established yet.
                FCMPlugin.getToken(function(token){
                    alert(token);
                    if (token) {
                        fcmNotification();
                    }
                });
            
                var fcmNotification = function () {
                  //FCMPlugin.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
                  //Here you define your application behaviour based on the notification data.
                  FCMPlugin.onNotification(function(data){
                      if(data.wasTapped){
                        //Notification was received on device tray and tapped by the user.
                        console.log( JSON.stringify(data) );
                        alert( JSON.stringify(data) );
                      }else{
                        //Notification was received in foreground. Maybe the user needs to be notified.
                        console.log( JSON.stringify(data) );
                        alert( JSON.stringify(data) );
                      }
                  }, function (sucesso) {
                      console.log(JSON.stringify(sucesso));
                  }, function (erro) {
                      console.log(JSON.stringify(erro));
                  });    
                }
              
            }, 3000);
            */

            /*
                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                  console.log('on $stateChangeStart');
                  var user = firebase.auth().currentUser;
                  if (toState.authRequired && !user){ //Assuming the AuthService holds authentication logic
                    // User isn’t authenticated
                    $state.transitionTo("login");
                    event.preventDefault(); 
                  }
                });
            */
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
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

            .state('app.editPersonagem', {
                cache: false,
                url: '/editPersonagem',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/editPersonagem.html',
                        controller: 'editPersonagemCtrl'
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

            .state('app.timeline', {
                url: '/timeline',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/timeline.html',
                        controller: 'timelineCtrl'
                    }
                }
            })

            .state('app.admin', {
                url: '/amin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/admin.html',
                        controller: 'adminCtrl'
                    }
                }
            })

            .state('app.adminPersonagem', {
                url: '/adminPersonagem',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminPersonagem.html',
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

            ;

        $urlRouterProvider.otherwise('/autologin');
    });