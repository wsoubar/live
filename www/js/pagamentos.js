(function () {
    'use strict';

    var app = angular.module('pagamentos', []);

    app.controller('pagtoAdmCtrl', function ($scope, dialogService, $ionicLoading, pagtoServices) {
        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });
        $scope.pagtos = pagtoServices.pagtoEventos(); 
        $scope.pagtos.$loaded().then(function () {
            console.log('pagtos carregado');
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            $ionicLoading.hide();
        });
    });


    app.controller('pagtoAdmEventoCtrl', function ($scope, dialogService, $ionicLoading, pagtoServices, personagemService) {
        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });
        
        $scope.pcs = personagemService.personagens(); 
        $scope.pcs.$loaded().then(function () {
            console.log('pcs carregados');
            //console.log('pc ', $scope.pc);
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            //$scope.p = $localStorage.personagem;
            $ionicLoading.hide();
        });
        
    });

})();