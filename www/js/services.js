(function () {
    'use strict';

    var app = angular.module('services', []);

    // let's create a re-usable factory that generates the $firebaseAuth instance
    app.factory("Auth", ["$firebaseAuth",
        function ($firebaseAuth) {
            return $firebaseAuth();
        }
    ]);


    app.factory("clans", ["$firebaseArray",
        function ($firebaseArray) {
            var ref = firebase.database().ref().child("clanlist");
            var query = ref.orderByChild("clan");
            return $firebaseArray(query);
        }
    ]);

    app.factory("seitas", ["$firebaseArray",
        function ($firebaseArray) {
            var ref = firebase.database().ref().child("seita");
            // var query = clanlist.limitToLast(40);
            return $firebaseArray(ref);
        }
    ]);


    app.factory('dialogService', ["$ionicPopup", function ($ionicPopup) {
        var factory = {
            confirm: confirmDialog
        };

        return factory;

        function confirmDialog(options) {
            if (!options.title || options.title === null) {
                options.title = "Live";
            }
            return $ionicPopup.confirm(options);
        }

    }]);

    /*
      app.factory("citacoes", ["$firebaseArray", 
        function($firebaseArray) {
          var ref = firebase.database().ref().child("citacoes");
          return $firebaseArray(ref);
        }
      ]);
    */
    app.factory("personagemService", ["$firebaseArray", "$firebaseObject",
        function ($firebaseArray, $firebaseObject) {

            var factory = {
                personagemByUserID: personagemByUserID,
                personagens: personagens,
                personagemByID : personagemByID
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

            function personagemByID(pid) {
                var ref = firebase.database().ref().child("personagens").child(pid);
                return $firebaseObject(ref);
            }
        }
    ]);

})();