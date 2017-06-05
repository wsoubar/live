(function () {
    'use strict';

    var app = angular.module('perfil', []);

    /**
     * PERFIL/Personagem CONTROLLER
     */
    app.controller('perfilCtrl', function ($scope, $stateParams, $localStorage, $state, $firebaseObject, clans, seitas) {
        console.log("perfilCtrl");
        $scope.seitas = seitas;
        $scope.clans = clans;
        $scope.p = {};

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

            obj.$save().then(function (ref) {
                ref.key === obj.$id; // true
                console.log('Salvo');
                delete $localStorage.userid;
                delete $localStorage.jogador;
                $state.go("login");
            }, function (error) {
                console.log("Error:", error);
                alert('Aconteceu um erro. Tente mais tarde.');
            });
        };
    });

})();