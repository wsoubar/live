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
            //console.log('Personagem', p);
            //$localStorage.admPersonagem = p;
            $state.go("app.edit-personagem", {pid: p.$id});
        }
    });

    app.controller('adminMenuCtrl', function ($scope, $localStorage, $ionicLoading, personagemService, $state) {
    });

})();