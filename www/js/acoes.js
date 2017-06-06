(function () {
    'use strict';

    var app = angular.module('acoes', []);


    /*

    acoes = {
        data : 1496646317252,
        idPersonagem : '-KgSQM9KwDzOYFKBn4bh',
        nomePersonagem : 'Sebastian',
        acao: 'Posso usar dominação?',
        respondido: 'N',
        resposta: 'não pode.',
        dataResposta: 1496646317252
    }

    */

    app.controller('acoesCtrl', function ($scope, $localStorage, acoesServices, dialogService, $ionicLoading) {
        $scope.enviarMsg = false;
        $scope.permiteacao = true;
        $scope.formData = {};
        var personagem = $localStorage.personagem;
        var pid = $localStorage.personagem.$id;

        console.log("acoes: " + pid);

        //var acoesRef = firebase.database().ref().child("acoes").child($localStorage.personagem.nome);
        //$scope.acoes = acoesServices.acoesPorIdPersonagem(pid);
        $scope.acoes = acoesServices.acoesPorIdPersonagem(pid);
        $scope.acoes.$loaded().then(function (data) {
            console.log("carregado array..");
            console.log('acoes', data);
        });

        $scope.add = function (acao) {
            if (acao) {
                var minhaAcao = {
                    data : Date.now(),
                    idPersonagem : pid,
                    nomePersonagem : personagem.nome,
                    acao: acao,
                    respondido: 'N',
                    resposta: '',
                    narrador: '',
                    dataResposta: ''
                }

                $scope.acoes.$add(minhaAcao).then(function (ref) {
                    $scope.formData.acao = '';
                });
            }
        }

        $scope.apagarAcao = function (acao) {
            var confirm = dialogService.confirm({template: 'Remover ação?'});  
            confirm.then(function (sucesso) {
                if (sucesso) {
                    $scope.acoes.$remove(acao)
                    .then(function (r) {
                        $ionicLoading.show({
                            template: 'Ação removida com sucesso',
                            duration: 1500
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });
                        console.log("acao removida");
                    });
                }
            });
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

    app.controller('acoesAdmCtrl', function ($scope, acoesServices, $state) {
        $scope.acoes = acoesServices.acoesSemResposta();
        $scope.acoes.$loaded().then(function (data) {
            console.log("carregado array..");
        });

        $scope.responder = function (acao) {
            console.log('go responder', acao);
            $state.go('app.acoes-adm-jogador', {acao: acao});
        }

    });

    app.controller('acoesAdmJogadorCtrl', function ($scope, acoesServices, $state) {

        console.log ('acao chegou?', $state.params.acao);
        $scope.acao = $state.params.acao;

    });


})();