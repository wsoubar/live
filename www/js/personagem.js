(function () {
    'use strict';

    var app = angular.module('personagem', []);

    app.controller('editPersonagemCtrl', function ($scope, $localStorage, $state, $firebaseObject, $ionicLoading) {
        $scope.tab = 0;
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

            var ct = [
{
     citacao: "O palco nada mais faz senão ecoar a voz do público.\nAs leis do drama são redigidas pelos pagantes\nPois nós que vivemos de agradar, precisamos agradar pra viver.",
    autor: "Samuel Clemens"
}

];

            angular.forEach(ct, function (ct) {
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
        //var personagem = $localStorage.admPersonagem;
        $scope.shPlanilha = false;
       // $scope.shHistoria = false;

        $scope.admPersonagem = {};

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


        $scope.aprovar = function () {
            var z = confirm('Confirma aprovação do personagem?');
            if (z) {
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
        }

        $scope.reprovar = function () {
            var z = confirm('Confirma reprovação do personagem?');
            if (z) {
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
        }

    });

app.directive('expandingTextarea', function () {
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs, $timeout) {
            $element.css('min-height', '0');
            $element.css('resize', 'none');
            $element.css('overflow-y', 'hidden');
            setHeight(0);
            $timeout(setHeightToScrollHeight);

            function setHeight(height) {
                $element.css('height', height + 'px');
                $element.css('max-height', height + 'px');
            }

            function setHeightToScrollHeight() {
                setHeight(0);
                var scrollHeight = angular.element($element)[0]
                  .scrollHeight;
                if (scrollHeight !== undefined) {
                    setHeight(scrollHeight);
                }
            }

            $scope.$watch(function () {
                return angular.element($element)[0].value;
            }, setHeightToScrollHeight);
        }
    };
});

})();