// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'ngCordova', 'ngStorage', 
'login', 'chat', 'personagem'])

.run(function($ionicPlatform, $rootScope, $localStorage, $state) {
  $ionicPlatform.ready(function() {
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
      if($state.current.name=="app.home"){
        var sair = confirm("Sair?");
        if (sair) {
          navigator.app.exitApp(); //<-- remove this line to disable the exit
        }
     
      } else {
        navigator.app.backHistory();
      }
    }, 100);

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

.config(function($stateProvider, $urlRouterProvider) {
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
    cache : false,
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

  .state('app.chat', {
    url: '/chat/:chatid',
    views: {
      'menuContent': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      }
    }
    
  })

  ;
  
$urlRouterProvider.otherwise('/autologin');
});