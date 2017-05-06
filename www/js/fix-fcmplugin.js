/*
I found the problem, its simple really, the FCMPlugin is not loaded even if you include
it at run or controller, the best way to correctly run the onNotification or getToken 
or other functions of fcm plugin is to put an interval only at your init contoller or at
 run() since i'm using ionic, in my example this interval gets clear making the script 
 run only once on each app run:
*/
if(typeof check_fcm_loaded==='undefined'){
        var check_fcm_loaded = setInterval(function(){
            if(typeof FCMPlugin!=='undefined'){
                var regToken = function(registeredToken){
                    setTimeout(function(){
                        // alert(registeredToken);
                        // console.log(registeredToken);
                        // new token received
                        if( localStorage.token && localStorage.token != registeredToken // its a new token
                          && localStorage.instance ){
                              var newToken = {token: registeredToken, instance: localStorage.instance};
                              $http.post($rootScope.srv + '?newToken=1', newToken, $rootScope.httpConfig).then(function successCallback(response) {
                                // response.data
                              }, function errorCallback(response) {
                                // alert('no internet connecton probably!')
                              });
                        }
                        localStorage.token = registeredToken;
                    }, 4000);
                };
                var errRegToken = function(err){
                    console.log('error retrieving token: ' + err);
                }

                FCMPlugin.getToken(regToken, errRegToken);
                FCMPlugin.onTokenRefresh(regToken, errRegToken);

                FCMPlugin.onNotification(function(data){
                    alert('notification clicked YAYYY');
                    if(data.wasTapped){
                        alert('notification clicked YAYYY #2');
                      //Notification was received on device tray and tapped by the user.
                      // alert( JSON.stringify(data) );
                    }else{
                      //Notification was received in foreground. Maybe the user needs to be notified.
                      // alert( JSON.stringify(data) );
                    }
                    // open the search filtered by topic
                    if(localStorage.interes){
                        // localStorage.interes
                        localStorage.interesNotification=true;
                        $state.go('app.search');
                    }
                }, function(msg){ // function registered successfuly
                    // alert(msg); // typically msg='OK'
                }, function(err){
                    console.log(err);
                });
                clearInterval(check_fcm_loaded);
            }
        }, 2000);
    }