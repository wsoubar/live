(function () {
    'use strict';

    var app = angular.module('personagem', []);

    app.controller('editPersonagemCtrl', function ($scope, $localStorage, $state, $firebaseObject, $ionicLoading) {
        $scope.tab = 1;
        var pid = $localStorage.personagem.$id;
        console.log('personagem.$id', pid);
        var ref = firebase.database().ref().child("personagem").child(pid);

        var personagem = $firebaseObject(ref);
        personagem.$loaded().then(function () {
            $scope.p = personagem;
            console.log('personagem carregado');
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


    app.controller('personagensCtrl', function ($scope, $localStorage, $state) {

    });

})();