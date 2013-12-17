'use strict';

(function(){

    // Module de services
    var ExampleAppServices = angular.module('ExampleAppServices', ['ngResource']);

    ExampleAppServices.factory('ServiceGetList',
        function ($resource){
            return $resource('data.json',
                {},
                {
                    get: {method:'GET', isArray: true}
                }
            );
        }
    );

	// charger le module ngRoute et ExampleAppServices
	var ExampleApp = angular.module('ExampleApp', ['ngRoute','ngAnimate','ExampleAppServices']);

   // utilisation du service routeProvider
   ExampleApp.config(function routeProvider ($routeProvider){
		$routeProvider.
            when('/list',{
                templateUrl: 'partials/list.html',
                controller: 'BasicController'
            }).
            when('/rest/list',{
                templateUrl: 'partials/rest.html',
                controller: 'RestController'
            }).
            otherwise({
                redirectTo: ''
            });
    });

    // Déclaration du controller BasicController pour le module ExampleApp
	ExampleApp.controller('BasicController', function BasicController ($scope, $http) {
		$scope.List = [];

		// Requete http 
		$http.get('http://localhost/angular/data.json').success(function(data){
			$scope.List = data;
            $scope.picture = data[0].picture;
		});

        // Gestion evenement click
        $scope.setImage = function(picture) {
            $scope.picture = picture;
        }
	});

    // Déclaration du controller ExampleController pour le module ExampleApp, controller basic sans routing
    ExampleApp.controller('SampleController', function SampleController ($scope, $http) {
        $scope.List = [];

        // Requete http
        $http.get('data.json').success(function(data){
            $scope.List = data;
        });
    });

    // Définition du filtre perso
    ExampleApp.filter('filtrePerso',function filtrePerso (){
        return function(items,criteria){
            if (criteria == null)
                criteria = ''
            var out = [];
            
            for (var i in items){
                if (items[i].name.match(new RegExp(criteria)) != null )
                    out.push(items[i]);
            }
            return out;
        };
    });

    // Déclaration du controller RestController pour le module ExampleApp
    ExampleApp.controller('RestController', function RestController ($scope, $http, ServiceGetList) {
        ServiceGetList.get({},function(data) {
            $scope.data = data;
        },function(response){
            $scope.data = response;
        });
    });


})();