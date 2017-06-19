(function () {
    'use strict';

    var app = angular.module('menu', []);

    app.controller('menuCtrl', function ($rootScope, $scope, $localStorage, $state, $ionicLoading, 
    dialogService, personagemService, $firebaseArray, $firebaseStorage) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $ionicLoading.show({
            template: 'carregando os dados do seu personagem...',
            duration: 20000
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });

        var pid = $localStorage.personagem.$id;
        //      var ref = firebase.database().ref().child("personagens").child(pid);
        var personagem = personagemService.personagemByID(pid);
        personagem.$loaded().then(function () {
            $scope.personagem = personagem;
            $rootScope.personagem = personagem;
            $localStorage.personagem = personagem;
            // $scope.personagem = angular.copy($localStorage.personagem);
            console.log("personagem logado: ", personagem);
            $ionicLoading.hide();
        }).catch(function (error) {
            console.error("Error:", error);
            $scope.personagem = $localStorage.personagem;
            $ionicLoading.hide();
        });


        $scope.logout = function () {
            var confirm = dialogService.confirm({ template: "Deseja sair?" });
            //var r = confirm("Deseja sair??");
            //if (r == true) {
            confirm.then(function (sucesso) {
                if (sucesso) {
                    firebase.auth().signOut().then(function () {
                        console.log('signed out!');
                        delete $localStorage.user;
                        delete $localStorage.personagem;
                        //alert('Logout realizado com sucesso');
                        $state.go('login');
                    }, function (error) {
                        console.error('Sign Out Error', error);
                        alert('Ocorreu algum erro ao tentar sair!!!');
                    });
                }
            }).catch(function (err) {
                console.log('deu erro no confirm: ', err);
            });
        };

        $scope.setup = function (option) {
            if (option == 'fixchats') {
                fixchat();
            }
        }

        //personagemInfo();

        function personagemInfo(options) {
            // apaga todos os dados em PersonagensInfo para poder carregar tudo de novo
            firebase.database().ref().child("personagensInfo").remove();
            // carrega todos os personagens 
            var pRef = firebase.database().ref().child("personagens").orderByChild("nome");
            pRef.once('value', function (snap) {
                //console.log('snap', snap.val());
                // faz loop nos personagens
                snap.forEach(function (personagem) {
                    console.log('key', personagem.key);
                    // console.log('personagem', personagem.val());
                    var p = personagem.val();
                    // add chave unica em personagensInfo
                    var piRef = firebase.database().ref().child("personagensInfo").push();
                    // salva as infos nessa chave unica nova
                    piRef.set({
                        pid: personagem.key,
                        historia: p.historia || "em Construção",
                        planilha : p.planilha  || "em construção",
                        rumores : p.rumores || "em construção",
                        antecedentes : p.antecedentes || "em construção"
                    });
                    // grava a chave unica em personagem
                    firebase.database().ref().child("personagens").child(personagem.key).update({personagensInfoKey: piRef.key});
                    //return true;
                });
            });

        }



        function distXP(options) {
            var total = 0;
            var personagens = personagemService.personagens();
            personagens.$loaded().then(function () {
                console.log('total: ' +personagens.length);
                angular.forEach(personagens, function (personagem) {
                    //console.log('personagem: ' + personagem.nome);

                    var xps = personagemService.XPsByPersonagem(personagem.$id);
                    xps.$loaded().then(function () {
                        console.log('Salva XP para ' + personagem.$id)
                        var itemxp = {
                            data :  Date.parse('May 31, 2017'),
                            descricao : 'Evento e participação',
                            valor : 15
                        };
                        // console.log('Data: ' + JSON.stringify(itemxp));
                        // console.log(new Date(itemxp.data));
/*
                        xps.$add(itemxp)
                        .then(function (r) {
                            console.log("XP atribuído com sucesso!");
                        });
*/

                    }).catch(function (error) {
                        console.error("Error:", error);
                    });
                    
                });
            });
        }

        function fixChat(options) {
            var total = 0;
            var personagens = personagemService.personagens();
            //var personagem = personagemService.personagemByID('-KgSQM9KwDzOYFKBn4bh');
            personagens.$loaded().then(function () {
                angular.forEach(personagens, function (personagem) {
                    //console.log('personagem: ' + personagem.nome);
                    var ref = firebase.database().ref().child("personagens").child(personagem.$id).child('chats');
                    console.log('personagem: ' + personagem.$id);
                    ref.remove().then(function (r) {
                        console.log('chats removidos');
                    });

                    var chats = $firebaseArray(ref);
                    chats.$loaded().then(function (chats) {
                        /*
                        chats.$add({sala: personagem.seita}).then(function (ref) {
                            console.log('chat room adicionado');
                        });
                        chats.$add({sala: personagem.clan}).then(function (ref) {
                            console.log('chat room adicionado');
                        });
                        */
                    }).catch(function (error) {
                        console.error("Error:", error);
                    });
                     
                    
                });
            });
        }

  var options = {
   maximumImagesCount: 1,
   width: 800,
   height: 800,
   quality: 80
  };

$scope.claImage = undefined;
  $scope.escolherImagem = function () {

imagePicker.getPictures(function(result) { 
    console.log(JSON.stringify(result))
    $scope.claImage = "data:image/png;base64," +result; 

    //    var storageRef = firebase.storage().ref();
    var storageRef = firebase.storage().ref("images/avatar-"+pid);
    $scope.storage = $firebaseStorage(storageRef);

    // File or Blob, assume the file is called rivers.jpg
    //var file = result;

    // Upload the file to the path 'images/rivers.jpg'
    // We can use the 'name' property on the File API to get our file name
   // var uploadTask = storageRef.child('images/' + 'file.teste').put(file);
    var uploadTask = $scope.storage.$put(new Blob(result, { type: "image/jpeg" }));
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // See below for more detail
    console.log('aqqui');
    }, function(error) {
    // Handle unsuccessful uploads
    }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    $scope.storage.$getDownloadURL().then(function(url) {
        $scope.url = url;
        console.log('url');
        console.log(url);
    });
    console.log('dwlUrl ' + downloadURL);
    });



}, function(errmsg) { 
    console.log("ohoh.. " + errmsg) }, // error handler
  { // options object, all optional
    maximumImagesCount: 2, // Android only since plugin version 2.1.1, default no limit
    quality: 90, // 0-100, default 100 which is highest quality
    width: 400,  // proportionally rescale image to this width, default no rescale
    height: 400, // same for height
    outputType: imagePicker.OutputType.BASE64_STRING // default .FILE_URI // BASE64_STRING
  }
);
/*
    $cordovaImagePicker.getPictures(options)
        .then(function (results) {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
        }
        }, function(error) {
        // error getting photos
        });
*/        
  }
    });

    app.controller('homeCtrl', function ($scope, $sce, $localStorage, $ionicLoading, $firebaseObject, $firebaseArray, utilServices) {
        /*
        var citacoes = [
            {
                citacao: "Portanto, com a mesma certeza pela qual a pedra cai para a terra, o lobo faminto enterra suas presas na carne de sua vítima, alheio ao fato de que ele próprio é tanto o destruidor como o destruído.",
                autor: "Schopenhauer"
            }
        ];
*/

        $ionicLoading.show({
            template: 'carregando citação...',
            duration: 20000
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });

        var agora = Date.now();
        if ($localStorage.citacoesData) {
            var dif = utilServices.diff($localStorage.citacoesData, agora);
            console.log(dif);
            if (dif >= 1440) { // 720 minutos 12h, 1440 - 24h; 2
                delete $localStorage.citacoes;
            }
        }
        if (!$localStorage.citacoes) {
            console.log('carregando citacoes online');
            var ref = firebase.database().ref().child("citacoes");
            var citacoes = $firebaseArray(ref);
            citacoes.$loaded().then(function (lista) {
                $localStorage.citacoes = lista;
                $localStorage.citacoesData = agora;
                console.log('data citacao', $localStorage.citacoesData);
                var aleatorio = Math.floor(Math.random() * lista.length);
                $scope.q = lista[aleatorio];
                $ionicLoading.hide();
            }).catch(function (error) {
                console.log('erro carregando citacoes ', error);
            });
        } else {
            console.log('carregando citacoes do localStorage');
            var lista = $localStorage.citacoes;
            var aleatorio = Math.floor(Math.random() * lista.length);
            $scope.q = lista[aleatorio];
            $ionicLoading.hide();
        }


/*
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
*/

    });

})();