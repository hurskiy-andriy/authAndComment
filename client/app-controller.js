app.controller(
        "AppController",
        [   "$cookies",
            appController]);
        
function appController($cookies) {
    
    this.auth = false;
    
    var checkAuth = 
            function() {
                
                var usrMail = $cookies.get("usr-mail"),
                    usrName = $cookies.get("usr-name"),
                    usrToken = $cookies.get("usr-token");
            
                if( !usrMail || !usrName || !usrToken)
                        window.location = "/auth/google";

                this.auth = true;
            };

    checkAuth.call(this);
}