describe('worldApp', function() {
	beforeEach(module('worldApp'));

	describe("/ route", function() {
		it("should load the home template", inject(function($location, $rootScope, $route) {
			$rootScope.$apply(function() {
				$location.path('/');
			});
			expect($route.current.loadedTemplateUrl).toBe('home.html');
		}));
	});
});