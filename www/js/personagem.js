(function () {
  'use strict';

  var app = angular.module('personagem', []);

  app.controller('editPersonagemCtrl', function ($scope, $localStorage, $state) {
      $scope.tab = 1;
  });   


  app.controller('personagensCtrl', function ($scope, $localStorage, $state) {

  });   

})();