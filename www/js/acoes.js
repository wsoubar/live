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

        var acaoCtrl = acoesServices.acoesAbertasPorJogador({idPersonagem: pid});
        acaoCtrl.$loaded(function (obj) {
            console.log('carregou acoesAbertas');
            console.log('acoes abertas', obj)
            $scope.permiteacao = (obj.acoesAbertas != 1);
        });

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
                    jogador: personagem.jogador,
                    acao: acao,
                    respondido: 'N',
                    resposta: '',
                    narrador: '',
                    dataResposta: ''
                }

                $scope.acoes.$add(minhaAcao).then(function (ref) {
                    $scope.formData.acao = '';
                    $scope.permiteacao = false;
                    $scope.enviarMsg = false;
                    acaoCtrl.acoesAbertas = 1;
                    acaoCtrl.$save().then(function (obj) {
                        console.log('acao ctrl salvo');
                    });
                    $ionicLoading.show({
                        template: 'Ação criada com sucesso',
                        duration: 1500
                    }).then(function(){
                        console.log("The loading indicator is now displayed");
                    });
                });
            }
        }

        $scope.apagarAcao = function (acao) {
            var confirm = dialogService.confirm({template: 'Remover ação?'});  
            confirm.then(function (sucesso) {
                if (sucesso) {
                    $scope.acoes.$remove(acao)
                    .then(function (r) {
                        acaoCtrl.acoesAbertas = 0;
                        acaoCtrl.$save().then(function (obj) {
                            $scope.permiteacao = true;
                            $scope.enviarMsg = false;
                            console.log('acao ctrl salvo');
                        });
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

    app.controller('acoesAdmJogadorCtrl', function ($scope, dialogService, acoesServices, $state, 
        $ionicLoading, $localStorage) {
        //console.log ('acao chegou?', $state.params.acao);
        $scope.acao = acoesServices.acaoByID($state.params.acao.$id);
        //$scope.acao = $state.params.acao;
        //console.log ('sim, chegou', $scope.acao);

        $scope.responder = function () {
            var confirm = dialogService.confirm({template: "Confirma a resposta?"});
            confirm.then(function name(ok) {
                if (ok) {
                    $scope.acao.narrador = $localStorage.personagem.jogador;
                    $scope.acao.respondido = 'S';
                    $scope.acao.dataResposta = Date.now();

                    $scope.acao.$save().then(function (ref) {
                        var ok = (ref.key === $scope.acao.$id); // true
                        console.log('sucesso? ' + ok);

                        $ionicLoading.show({
                            template: 'Informações atualizadas com sucesso.',
                            duration: 1500
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });
                        $state.go("app.acoes-adm");
                    }, function (error) {
                        console.log("Error:", error);
                        $ionicLoading.show({
                            template: 'Erro ao tentar responder a ação.',
                            duration: 1500
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });
                    });
                }
            });
        }
    });


})();