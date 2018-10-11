angular.module('mainapp', ['ngRoute'])

.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl: "templates/first.html",
      controller: "mainCtrl"
    })
    .otherwise({redirectTo: '/'});
}])

.controller('mainCtrl',function() {

});