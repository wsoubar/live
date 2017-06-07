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

    app.factory('utilServices', [function name() {
        var factory = {
            diff : diff
        };
        return factory;

        function diff(dataini, datafim) {
            var diff = (datafim - dataini)/1000/60;
            return Math.abs(Math.round(diff));
        }


    }]);

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


    app.factory("acoesServices", ["$firebaseArray", "$firebaseObject", function($firebaseArray, $firebaseObject) {
        var factory = {
            acoesPorIdPersonagem: acoesPorIdPersonagem,
            todasAcoes : todasAcoes,
            acoesSemResposta : acoesSemResposta,
            acaoByID : acaoByID,
            acoesAbertasPorJogador : acoesAbertasPorJogador
        };
        
        return factory;

        //var rootRef = firebase.database().ref();

        function acoesAbertasPorJogador(params) {
            console.log("id ", params);
            var ref = firebase.database().ref("acoesCtrl").child(params.idPersonagem);
            //ref.orderByChild('idPersonagem').equalTo(params.idPersonagem);
            return $firebaseObject(ref);
        }

        function todasAcoes() {
            var ref = firebase.database().ref().child("acoes");
            return $firebaseArray(ref);
        }

        function acoesPorIdPersonagem(idPersonagem) {
            console.log("id ", idPersonagem);
            var ref = firebase.database().ref("acoes").orderByChild("idPersonagem").equalTo(idPersonagem);
            return $firebaseArray(ref);
        }

        function acoesSemResposta() {
            var ref = firebase.database().ref("acoes").orderByChild("respondido").equalTo("N");
            return $firebaseArray(ref);
        }

        function acaoByID(id) {
            var ref = firebase.database().ref("acoes").child(id);
            return $firebaseObject(ref);
        }

    }]);

    app.factory("personagemService", ["$firebaseArray", "$firebaseObject",
        function ($firebaseArray, $firebaseObject) {

            var factory = {
                personagemByUserID: personagemByUserID,
                personagens: personagens,
                personagemByID : personagemByID,
                XPsByPersonagem : XPsByPersonagem
            };

            return factory;

            function personagens() {
                var ref = firebase.database().ref().child("personagens").orderByChild("nome");
                return $firebaseArray(ref);
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

            function XPsByPersonagem(pid) {
                var xpref = firebase.database().ref().child("xps").child(pid);
                return $firebaseArray(xpref);
            }

        }
    ]);

})();