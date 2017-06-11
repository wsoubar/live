(function () {
    'use strict';

    var app = angular.module('personagem', []);

    app.controller('editPersonagemCtrl', function ($scope, $localStorage, $state, 
        $ionicLoading, personagemService, utilServices) {
        $scope.tab = 0;
        $scope.p = {};
        $scope.xpArray = []
        $scope.totalXP = 0;
        $ionicLoading.show({
            template: 'carregando...',
            duration: 20000
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });

        var pid = $localStorage.personagem.$id;
        console.log('personagem.$id', pid);
        //var ref = firebase.database().ref().child("personagens").child(pid);

        var personagem = personagemService.personagemByID(pid); // $firebaseObject(ref);
        personagem.$loaded().then(function () {
            $scope.p = personagem;
            console.log('personagem carregado');
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            $scope.p = $localStorage.personagem;
            $ionicLoading.hide();
        });

        //var xpref = firebase.database().ref().child("xps").child(pid);
        var xps = personagemService.XPsByPersonagem(pid);
        xps.$loaded().then(function () {
            $scope.xpArray = xps;
            $scope.totalXP = utilServices.getTotalXP($scope.xpArray);
            console.log('xps carregados');
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
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
                }).then(function () {
                    console.log("The loading indicator is now displayed");
                });

            }, function (error) {
                console.log("Error:", error);
                $ionicLoading.show({
                    template: 'Erro ao tentar atualizar informações.',
                    duration: 1500
                }).then(function () {
                    console.log("The loading indicator is now displayed");
                });
            });
        }

        $scope.exibeXP = function () {
            $state.go("app.edit-personagem-xp", {xpArray: $scope.xpArray});
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

    app.controller('personagensCtrl', function ($scope, $localStorage, $state, personagemService, $ionicLoading, utilServices) {
        $scope.filtro = { aprovado: 'S' };
        $scope.personagens = [];
        $ionicLoading.show({
            template: 'carregando personagens...',
            duration: 20000
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });

        var agora = Date.now();
        if ($localStorage.personagensData) {
            var dif = utilServices.diff($localStorage.personagensData, agora);
            console.log(dif);
            if (dif >= 1440) { // 720 minutos 12h, 1440 - 24h; 2
                delete $localStorage.personagens;
            }
        }
        if (!$localStorage.personagens) {

            console.log("carregando personages online");
            $scope.personagens = personagemService.personagens();

            $scope.personagens.$loaded().then(function () {
                $localStorage.personagens = $scope.personagens;
                $localStorage.personagensData = agora;
                console.log('array de personagens carregado');
                $ionicLoading.hide();
            });
        } else {
            console.log("carregando personages do localStorage");
            $scope.personagens = $localStorage.personagens;
            $ionicLoading.hide();
        }
        $scope.limite = 5;

        $scope.loadMore = function () {
            var increamented = vm.limit + 5;
            $scope.limite = incremented > $scope.personagens.length ? $scope.personagens.length : increamented;
        };

        $scope.doRefresh = function () {
            $ionicLoading.show({
                template: 'carregando personagens...',
                duration: 20000
            }).then(function () {
                console.log("The loading indicator is now displayed");
            });
            console.log("carregando personages online");
            $scope.personagens = personagemService.personagens();

            $scope.personagens.$loaded().then(function () {
                $localStorage.personagens = $scope.personagens;
                $localStorage.personagensData = Date.now();
                console.log('array de personagens carregado');
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
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

    app.controller('editPersonagemXPCtrl', function ($scope, $localStorage, $state, utilServices) {
        console.log("xpArray", $state.params.xpArray);
        $scope.xpArray = $state.params.xpArray;
    
        $scope.totalXP = utilServices.getTotalXP($scope.xpArray);

    });

    app.controller('editPersonagemCampoCtrl', function ($scope, $localStorage, $state, 
        $stateParams, utilServices, personagemService, $ionicLoading) {
        console.log("editPersonagemCampoCtrl ::", $stateParams.pid);
        var campos = {
            historia: {
                titulo: "História",
                placeholder: "Escreva aqui a sua história real."
            },
            planilha: {
                titulo: "Planilha",
                placeholder: "Preencha com a planilha de seu personagem para aprovação dos naradores."
            },
            rumores: {
                titulo: "Rumores",
                placeholder: "Seus rumores. O que ouviram dizer sobre você, verdade ou não."
            },
            antecedentes: {
                titulo: "Antecedentes",
                placeholder: "Detalhe seus antecedentes."
            }
        };
        $scope.info = {};
        $scope.aprovado = $stateParams.aprovado;

        var campo = personagemService.personagemInfo($stateParams.pid, $stateParams.campo)
        campo.$loaded().then(function (h) {
            //console.log("h>", h.$value);
            $scope.campo = campo;
            $scope.info = campos[$stateParams.campo];
            console.log('info', $scope.info);
        });

        $scope.salvar = function () {
            $scope.campo.$save().then(function (ref) {
                var ok = (ref.key === $scope.campo.$id); // true
                console.log('sucesso? ' + ok);
                //console.log('value ', $scope.historia.$value);
                // $localStorage.personagem = $scope.p;

                $ionicLoading.show({
                    template: 'Informações atualizadas com sucesso.',
                    duration: 1500
                }).then(function () {
                    console.log("The loading indicator is now displayed");
                });

            }, function (error) {
                console.log("Error:", error);
                $ionicLoading.show({
                    template: 'Erro ao tentar atualizar informações.',
                    duration: 1500
                }).then(function () {
                    console.log("The loading indicator is now displayed");
                });
            });
        }
        
    });


})();