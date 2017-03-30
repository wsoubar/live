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
        var ref = firebase.database().ref().child("personagem").child(pid);

        var personagem = $firebaseObject(ref);
        personagem.$loaded().then(function () {
            $scope.p = personagem;
            console.log('personagem carregado');
            $ionicLoading.hide();
        });


        $scope.salvar = function () {
            $scope.p.$save().then(function (ref) {
                var ok = (ref.key === $scope.p.$id); // true
                console.log('sucesso? ' + ok);

                $ionicLoading.show({
                    template: 'Informações atualizadas com sucesso.',
                    duration: 1500
                }).then(function(){
                    console.log("The loading indicator is now displayed");
                });
                
            }, function (error) {
                console.log("Error:", error);
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

})();