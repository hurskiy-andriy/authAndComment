var app = 
        angular
            .module(
                "authAndComment",
                [   "ngMaterial"
                    ,"ngAnimate"
                    ,"ngCookies"])
            .config(
                [   "$mdThemingProvider",
                    function($mdThemingProvider) {
                        $mdThemingProvider
                            .theme('default')
                            .primaryPalette('blue')
                            .accentPalette('orange');
                    }]);