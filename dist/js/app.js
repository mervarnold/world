'use strict';

angular.module('worldApp', ['ngAnimate', 'ngRoute'])

.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html'
	})
	.when('/countries', {
		templateUrl: 'templates/countries.html',
		controller: 'countryListCtrl'
	})
	.when('/countries/:countryCode/:countryCapital', {
		templateUrl: 'templates/country.html',
		controller: 'countryCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
})

.run(function($http, $rootScope) {
	$http({
		method: 'POST',
		url: 'http://api.geonames.org/countryInfoJSON',
		cache: true,
		params: {
			username: 'merf64'
		}
	})
	.success(function(data, status) {
		$rootScope.countriesList = [];
		for (var i = 0; i < data.geonames.length; i++) {
			$rootScope.countriesList[i] = data.geonames[i];
		}
		$rootScope.$broadcast('countriesLoaded');
	});
})

.controller('countryCtrl', function($scope, $routeParams, $http, $rootScope, $location, $timeout) {
	$scope.loading = true;
	$scope.countryCode = $routeParams.countryCode;
	$scope.countryCapital = $routeParams.countryCapital;

	$scope.$on('countriesLoaded', function() {
		if (!$rootScope.countriesList) return;

		//Reload specific country info
		$http({
			method: 'POST',
			url: 'http://api.geonames.org/countryInfoJSON',
			cache: true,
			params: {
				username: 'merf64',
				country: $scope.countryCode
			}
		})
		.success(function(data, status) {
			if (data.geonames[0]) {
				$scope.countryName = data.geonames[0].countryName;
				$scope.countryPop = data.geonames[0].population;
				$scope.areaInSqKm = data.geonames[0].areaInSqKm;
				$scope.countryCapital = data.geonames[0].capital;
			}

			//Get capital details
			$http({
				method: 'POST',
				url: 'http://api.geonames.org/searchJSON',
				params: {
					username: 'merf64',
					country: $scope.countryCode,
					name_equals: $scope.countryCapital
				}
			})
			.success(function(data, status) {
				if (data.geonames[0]) {
					$scope.capitalPop = data.geonames[0].population;
				}
				else {
					$scope.capitalPop = "Unknown";
				}
			});
		});

		//Get country neighbors
		$http({
			method: 'POST',
			url: 'http://api.geonames.org/neighboursJSON',
			params: {
				username: 'merf64',
				country: $scope.countryCode
			}
		})
		.success(function(data, status) {
			$scope.neighborsList = [];
			if (data.geonames) {
				for (var i = 0; i < data.geonames.length; i++) {
					$scope.neighborsList[i] = data.geonames[i];
				}
			}
		});

		$timeout(function() {
			$scope.loading = false;
		}, 1000);
	});

	//Make sure country load runs if view is called & it has already run before.
	$rootScope.$broadcast('countriesLoaded');

	$scope.loadNeighbor = function(code) {
		$location.url('/countries/' + code + '/unknown');
	}
})

.controller('countryListCtrl', function($location, $scope) {
	$scope.loadCountry = function(code, capital) {
		$location.url('/countries/' + code + '/' + capital);
	}
});





