(function () {
    'use strict';

    var app = angular.module('admin', []);


    app.controller('adminCtrl', function ($scope, $localStorage, $ionicLoading, personagemService, $state) {
        $scope.personagens = [];
        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });

        $scope.personagens = personagemService.personagens();

        $scope.personagens.$loaded().then(function () {
            console.log('array de personagens carregado');
            $ionicLoading.hide();
        })
        .catch(function (error) {
            console.log("erro ao tentar carregar personagens", error);
            $ionicLoading.hide();
            alert('Ocorreu erro ao carregar os dados dos personagens.');
        });

        $scope.selecionaPersonagem = function (p) {
            console.log('Personagem', p);
            //$localStorage.admPersonagem = p;
            $state.go("app.edit-personagem", {pid: p.$id});
        }
    });

    app.controller('adminPersonagemCtrl', function ($scope, $localStorage, $ionicLoading, 
        $firebaseObject, personagemService, $firebaseArray, $parse, dialogService) {
        //var personagem = $localStorage.admPersonagem;
        $scope.shPlanilha = false;
       // $scope.shHistoria = false;
        $scope.vm = {};
        $scope.admPersonagem = {};
        $scope.xpArray = [];
        $scope.xpData = {};

        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });


        console.log('admPersonagem 1', $localStorage.admPersonagem);
        $scope.admPersonagem = angular.copy($localStorage.admPersonagem);
        //delete $localStorage.admPersonagem;

        var pid = $localStorage.admPersonagem.$id;
        console.log('personagem.$id', pid);
        var ref = firebase.database().ref().child("personagens").child(pid);
        var personagem = $firebaseObject(ref);
        personagem.$loaded().then(function () {
            $scope.admPersonagem = personagem;
            console.log('personagem carregado');
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            $scope.admPersonagem = angular.copy($localStorage.admPersonagem);
            $ionicLoading.hide();
        });

        var xpref = firebase.database().ref().child("xps").child(pid);
        var xps = $firebaseArray(xpref);
        xps.$loaded().then(function () {
            $scope.xpArray = xps;
            console.log('xps carregados');
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            $ionicLoading.hide();
        });


        $scope.aprovar = function () {
            var confirm = dialogService.confirm({template: 'Aprovar personagem?'});  
            confirm.then(function (sucesso) {
                if (sucesso) {
                    $scope.admPersonagem.aprovado = 'S';
                    $scope.admPersonagem.$save().then(function (ref) {
                        var ok = (ref.key === $scope.admPersonagem.$id); // true
                        console.log('aprovado com sucesso? ' + ok);
                        $localStorage.admPersonagem = angular.copy($scope.admPersonagem);

                        $ionicLoading.show({
                            template: 'Informações atualizadas com sucesso.',
                            duration: 1500
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });
                        
                    }, function (error) {
                        console.log("Error:", error);
                        $ionicLoading.show({
                            template: 'Erro ao tentar atualizar informações.',
                            duration: 1500
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });
                    });
                }
            });
        }

        $scope.reprovar = function () {
            var confirm = dialogService.confirm({template: 'Reprovar personagem?'});  
            confirm.then(function (sucesso) {
                if (sucesso) {
                    $scope.admPersonagem.aprovado = 'N';
                    $scope.admPersonagem.$save().then(function (ref) {
                        var ok = (ref.key === $scope.admPersonagem.$id); // true
                        console.log('reprovado com sucesso? ' + ok);
                        $localStorage.admPersonagem = angular.copy($scope.admPersonagem);

                        $ionicLoading.show({
                            template: 'Informações atualizadas com sucesso.',
                            duration: 1500
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });
                        
                    }, function (error) {
                        console.log("Error:", error);
                        $ionicLoading.show({
                            template: 'Erro ao tentar atualizar informações.',
                            duration: 1500
                        }).then(function(){
                            console.log("The loading indicator is now displayed");
                        });
                    });
                }
            });
        };

        $scope.addXP = function () {
            console.log("data: " + Date.parse($scope.xpData.data));
            console.log(JSON.stringify($scope.xpData));

            var itemxp = {
                data :  Date.parse($scope.xpData.data),
                descricao : $scope.xpData.descricao,
                valor : $scope.xpData.valor
            };

            $scope.xpArray.$add(itemxp)
            .then(function (r) {
                console.log("foi?" + r.key);
                console.log("xp adicionado");
                $scope.xpData.data = null;
                $scope.xpData.descricao = '';
                $scope.xpData.valor = 0;
                $scope.vm.xpform.$setPristine(true);
                $scope.vm = {};

            });
        };

        $scope.delXP = function (item) {
            var confirm = dialogService.confirm({template: 'Remover XP?'});  
            confirm.then(function (sucesso) {
                if (sucesso) {
                    $scope.xpArray.$remove(item)
                    .then(function (r) {
                        $scope.xpData = {};
                        console.log(r.key === item.$id);
                        console.log("xp removido");
                    });
                }
            });
        };

        $scope.getTotalXP = function () {
            var totalxp = 0
            for (var i = 0; i < $scope.xpArray.length; i++) {
                var xpelement = $scope.xpArray[i];
                totalxp += xpelement.valor;
            }
            return totalxp;
        };


    });

    app.controller('adminMenuCtrl', function ($scope, $localStorage, $ionicLoading, personagemService, $state) {
    });

})();