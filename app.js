'use strict';

(function(){

    // Module de services
    var ExampleAppServices = angular.module('ExampleAppServices', ['ngResource']);

    ExampleAppServices.factory('ServiceGetList',
        function ($resource){
            return $resource('http://localhost/angular/data.json',
                {},
                {get: {method:'GET'}}
            );
        }
    );

	// charger le module ngRoute et ExampleAppServices
	var ExampleApp = angular.module('ExampleApp', ['ngRoute','ExampleAppServices']);

   // utilisation du service routeProvider
   ExampleApp.config(function routeProvider ($routeProvider){
		$routeProvider.
            when('/list',{
                templateUrl: 'partials/list.html',
                controller: 'RoutingController'
            }).
            when('/rest/list',{
                templateUrl: 'partials/rest.html',
                controller: 'RestController'
            }).
            otherwise({
                redirectTo: ''
            });
    });

    // Déclaration du controller RoutingController pour le module ExampleApp, routing pris en compte,
    // on ne peut l'utiliser en dehors du routing
    ExampleApp.controller('RestController', function RestController ($scope, $http, ServiceGetList) {
        var promise = ServiceGetList.get().$promise; //{name:'data'}
        promise.then(function(res) {$scope.data = res; console.log(res);});
        promise.catch(function(res,exception) {$scope.data = res; console.log(res);console.log(exception);});
        console.log(promise);
    });


    // Déclaration du controller RoutingController pour le module ExampleApp, routing pris en compte,
    // on ne peut l'utiliser en dehors du routing
	ExampleApp.controller('RoutingController', function RoutingController ($scope, $http) {
		$scope.List = [];

		// Requete http 
		$http.get('data.json').success(function(data){
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



})();