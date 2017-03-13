(function () {
  'use strict';

  var app = angular.module('clanchat', []);

  app.controller('clanChatCtrl', function ($rootScope, $scope, $stateParams, $localStorage, $firebaseArray, $state) {
        console.log("clanChatCtrl...");
        var messagesRef = firebase.database().ref().child("chat").child("setita");
        // download the data from a Firebase reference into a (pseudo read-only) array
        // all server changes are applied in realtime
        $scope.messages = $firebaseArray(messagesRef);
        // create a query for the most recent 25 messages on the server
        
        /*
        var query = messagesRef.orderByChild("timestamp").limitToLast(25);
        // the $firebaseArray service properly handles database queries as well
        $scope.filteredMessages = $firebaseArray(query);
        $scope.filteredMessages.$loaded().then(function(data){
            console.log("carregado array..");
        });
        */

  //    var list = $firebaseArray(ref);
      $scope.messages.$add({ mensagem: "minha mensagem teste", data: Date.now() }).then(function(ref) {
        var id = ref.key;
        console.log("added record with id " + id);
        $scope.messages.$indexFor(id); // returns location in the array
      });

  });

})();