(function () {
    'use strict';

    var app = angular.module('acoes', []);

    app.controller('acoesCtrl', function ($rootScope, $scope, $localStorage, $firebaseArray, $state) {
        $scope.enviarMsg = false;
        $scope.permiteacao = true;
        $scope.formData = {};
        var personagem = $localStorage.personagem;
        var pid = $localStorage.personagem.$id;

        console.log("acoes: " + pid);

        var acoesRef = firebase.database().ref().child("acoes").child($localStorage.personagem.nome);
        $scope.acoes = $firebaseArray(acoesRef);
        $scope.acoes.$loaded().then(function (data) {
            console.log("carregado array..");
        });


        $scope.add = function (acao) {
            if (acao) {
                var tipo = (personagem.narrador == 'S' ? 'N' : 'J');
                $scope.acoes.$add({
                    acao: acao,
                    data: Date.now(),
                    nome: personagem.nome,
                    tipo: tipo
                })
                    .then(function (ref) {
                        $scope.formData.mensagem = '';
                    });
            }
        }

        /*
            $scope.permiteAcao = function (index, tipo) {
                if (index==0 && tipo == 'N') {
                    $scope.permiteacao == false;
                }
            };
        */

        $scope.mostraEnvio = function () {
            $scope.enviarMsg = !$scope.enviarMsg;
        }

    });

})();