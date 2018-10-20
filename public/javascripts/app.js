angular.module('mainapp', ['ngRoute','angularUtils.directives.dirPagination', 'ngMap'])

.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl: "templates/first.html",
      controller: "mainCtrl"
    })
    .otherwise({redirectTo: '/'});
}])

.controller('mainCtrl',function($http, $scope, NgMap, $filter) {
  $scope.search = {};
  $scope.ships = []; //declare an empty array
  $scope.data = {};
  $scope.itemsPerPage = 15; // can be dynamic wrt server
  $http.get("javascripts/data1.json").then(function(response){ 
      $scope.ships = response.data;  //ajax request to fetch data into $scope.data
      // convert timestamp to dateobj
      for (var i = 0; i < response.data.length; i++) {
        $scope.ships[i]['date'] = new Date(response.data[i]['date']).toLocaleString().split(',')[0];
      }
      $scope.data.total_count = 36;  // total data counts from server. currently hardcoded
  });
  
  $scope.sort = function(keyname){
      $scope.sortBy = keyname;   //set the sortBy to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
  }

  $scope.view_details = function(ship){
    $scope.selected_ship = ship;
    $('#shipDetails').modal('show');
  }

  $scope.filterDate = function() {
    $scope.search.date = new Date($scope.search_date).toLocaleString().split(',')[0];;
    console.log($scope.search.date);
  }

  $scope.getData = function(page_number){
    $http.get("javascripts/data" + page_number + '.json').then(function(response){ 
      $scope.ships = response.data;  //ajax request to fetch data into $scope.data
      for (var i = 0; i < response.data.length; i++) {
        $scope.ships[i]['date'] = new Date(response.data[i]['date']);
      }
    });
  }
});