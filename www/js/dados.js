(function () {
  'use strict';

  var app = angular.module('dados', []);

  /**
   * PERFIL/Personagem CONTROLLER
   */
  app.controller('dadosCtrl', function ($scope, $stateParams, $localStorage, $state, $firebaseObject, clans, seitas) {
    console.log("dadosCtrl");
    $scope.params = {modificador: 0, sucessos: 1, dificuldade: 7, paradadedados: 7};

    $scope.rolar = function (params) {
      //console.log('rolar');
      var resultadodados = '';
      var sucessos = 0;
      var falhasCriticas = 0;
      //console.log(params);
      for (var i = 0; i < parseInt(params.paradadedados); i++) {
        //console.log('no for');
        var r = Math.floor(Math.random() * 10) + 1;
        var df = parseInt(params.dificuldade);
        // console.log('dificuldade ' + df)
        if (r >= df) {
          sucessos++;
          //console.log('add sucesso ' + r);
        //} else {
          //console.log('sem sucesso sucesso ' + r);
        }
        if (r == 1) {
          falhasCriticas++;
        }
        if (i==0) {
          resultadodados = resultadodados + r;
        } else {
          resultadodados = resultadodados + '-' + r ;
        }
      }
      //console.log('sucessos '+sucessos);

      $scope.mostraresultado = true;
      $scope.resultadodados = resultadodados;
      var totalSucessos = sucessos - falhasCriticas;
      if (totalSucessos >= parseInt(params.sucessos) ) {
        $scope.sucesso = true;
        $scope.resultado = 'SUCESSO';
      } else {
        $scope.sucesso = false;
        $scope.resultado = 'FALHA';
        
      }
    };
  });

})();