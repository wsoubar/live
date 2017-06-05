(function () {
    'use strict';

    var app = angular.module('chat', []);

    app.controller('chatCtrl', function ($rootScope, $scope, $stateParams, $localStorage, $firebaseArray, $state) {
        $scope.enviarMsg = false;
        $scope.formData = {};
        var personagem = $localStorage.personagem;
        var chatid = $stateParams.chatid;
        $scope.chatid = chatid;

        console.log("chat: " + chatid);

        var messagesRef = firebase.database().ref().child("chats").child(chatid);
        $scope.mensagens = $firebaseArray(messagesRef);
        $scope.mensagens.$loaded().then(function (data) {
            console.log("carregado array..");
        });

        $scope.add = function (mensagem) {
            if (mensagem) {
                $scope.mensagens.$add({
                    mensagem: mensagem,
                    data: Date.now(),
                    nome: personagem.nome,
                    userid: personagem.userid
                }).then(function (ref) {
                    $scope.formData.mensagem = '';
                });
            }
        }

        $scope.mostraEnvio = function () {
            $scope.enviarMsg = !$scope.enviarMsg;
        }

    });


    app.controller('roomsCtrl', function ($rootScope, $scope, personagemService, $localStorage) {
        console.log('########################### rooms I ################');
        $scope.rooms = $rootScope.personagem.chats;
        //$scope.personagem = personagemService.personagemByID($localStorage.personagem.$id);
    });

})();