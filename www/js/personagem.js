(function () {
    'use strict';

    var app = angular.module('personagem', []);

    app.controller('editPersonagemCtrl', function ($scope, $localStorage, $state, $firebaseObject, $ionicLoading) {
        $scope.tab = 1;
        $scope.p = {};

        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });
        
        var pid = $localStorage.personagem.$id;
        console.log('personagem.$id', pid);
        var ref = firebase.database().ref().child("personagens").child(pid);

        var personagem = $firebaseObject(ref);
        personagem.$loaded().then(function () {
            $scope.p = personagem;
            console.log('personagem carregado');
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            $scope.p = $localStorage.personagem;
            $ionicLoading.hide();
        });


        $scope.salvar = function () {
            $scope.p.$save().then(function (ref) {
                var ok = (ref.key === $scope.p.$id); // true
                console.log('sucesso? ' + ok);
                console.log('p ', $scope.p);
                $localStorage.personagem = $scope.p;

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

    app.controller('homeCtrl', function ($scope, $localStorage, $ionicLoading, $firebaseObject, $firebaseArray) {
        /*
        var citacoes = [
            {
                citacao: "Portanto, com a mesma certeza pela qual a pedra cai para a terra, o lobo faminto enterra suas presas na carne de sua vítima, alheio ao fato de que ele próprio é tanto o destruidor como o destruído.",
                autor: "Schopenhauer"
            }
        ];
*/
        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });
        
        var ref = firebase.database().ref().child("citacoes");
        var citacoes = $firebaseArray(ref);
        citacoes.$loaded().then(function (lista) {
            console.log('Home-citacoes ', lista.length);
            var aleatorio = Math.floor(Math.random() * lista.length);
            console.log('ale ' + aleatorio);
            $scope.q = lista[aleatorio];
            $ionicLoading.hide();
            
        }).catch(function (error) {
            console.log('erro carregando citacoes ', error);
        });


        if (false) {
            angular.forEach(citacoes, function (ct) {
                var ref = firebase.database().ref().child("citacoes").push();
                var obj = $firebaseObject(ref);
                obj.citacao = ct.citacao;
                obj.autor = ct.autor;

                obj.$save().then(function(ref) {
                    ref.key === obj.$id; // true
                    console.log('citacao salva');
                }, function(error) {
                    console.log("Error:", error);
                });      
                
            });
        }


    });


    app.controller('timelineCtrl', function ($scope, $localStorage, $state) {
        // in controller
        $scope.events = [{
            badgeClass: 'info',
            badgeIconClass: 'glyphicon-check',
            title: 'First heading',
            content: 'Some awesome content.'
        }, {
            badgeClass: 'warning',
            badgeIconClass: 'glyphicon-credit-card',
            title: 'Second heading',
            content: 'More awesome content.'
        }];
    });

    app.controller('personagensCtrl', function ($scope, $localStorage, $state, personagemService, $ionicLoading) {
        $scope.filtro = {aprovado: 'S'};
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
        });

        $scope.limite = 5;

        $scope.loadMore = function() {
            var increamented = vm.limit + 5;
            $scope.limite = incremented > $scope.personagens.length ?$scope.personagens.length : increamented;
        };

    });

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
            $localStorage.admPersonagem = p;
            $state.go("app.adminPersonagem");
        }
    });

    app.controller('adminPersonagemCtrl', function ($scope, $localStorage, $ionicLoading, $firebaseObject, personagemService) {
/*
        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });
            $ionicLoading.hide();
*/
        //var personagem = $localStorage.admPersonagem;
        $scope.shPlanilha = false;
       // $scope.shHistoria = false;

        $scope.admPersonagem = {};
        console.log('admPersonagem 1', $localStorage.admPersonagem);
        angular.copy($localStorage.admPersonagem, $scope.admPersonagem);
        //delete $localStorage.admPersonagem;

    });

})();