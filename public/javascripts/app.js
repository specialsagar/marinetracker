angular.module('mainapp', ['ngRoute','angularUtils.directives.dirPagination', 'ngMap', 'chart.js'])

.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when("/dashboard", {
      templateUrl: "templates/dashboard.html",
      controller: "mainCtrl"
    })
    .when("/analytics", {
      templateUrl: "templates/analytics.html",
      controller: "analyticsCtrl"
    })
    .otherwise({redirectTo: '/dashboard'});
}]).run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function(next, current) {
    if($location.path() == '/dashboard') {
      $rootScope.is_dash = true;
      $rootScope.is_analytics = false;
    }
    if($location.path() == '/analytics') {
      $rootScope.is_dash = false;
      $rootScope.is_analytics = true;
    }
  });
})

.controller('mainCtrl',function($http, $scope, NgMap, $filter) {
  $scope.search = {};
  $scope.showing = 'table';
  $scope.ships = []; //declare an empty array
  $scope.data = {};
  $scope.itemsPerPage = 15; // can be dynamic wrt server
  $http.get("javascripts/data/data1.json").then(function(response){ 
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
    $http.get("javascripts/data/data" + page_number + '.json').then(function(response){ 
      $scope.ships = response.data;  //ajax request to fetch data into $scope.data
      for (var i = 0; i < response.data.length; i++) {
        $scope.ships[i]['date'] = new Date(response.data[i]['date']);
      }
    });
  }
})

.controller('analyticsCtrl',function($http, $scope, $filter, ) {
  $scope.scope1 = 'country';
  $scope.scope2 = 'origin';
  $scope.scope3 = 'China';

  $http.get("javascripts/data/alldata.json").then(function(response){ 
    $scope.ships = response.data;  //ajax request to fetch data into $scope.data
    $scope.typeAnalytics();
    $scope.portAnalytics();
    $scope.containerAnalytics();
  });

  $scope.typeAnalytics = function(){
    $scope.country_category_data = [];
    if ($scope.scope1 == 'country') {
      $scope.country_category_labels = ['China', 'India', 'Singapore', 'UAE'];
      for (var i = 0; i < $scope.country_category_labels.length; i++) {
        $scope.country_category_data.push($filter('filter')($scope.ships, {country: $scope.country_category_labels[i]}).length);
      }
    } else {
      $scope.country_category_labels = ['Chemicals', 'Consumer Goods', 'Food Products', 'Metals'];
      var contentArr = [];
      for (var i = 0; i < $scope.ships.length; i++) {
        contentArr.push($scope.ships[i]['content']);
      }
      contentArr = [].concat.apply([], contentArr);
      console.log(contentArr);
      for (var i = 0; i < $scope.country_category_labels.length; i++) {
        $scope.country_category_data.push($filter('filter')(contentArr, {category: $scope.country_category_labels[i]}).length);
      }
    }
  }

  $scope.portAnalytics = function(){
    $scope.origin_dest_labels = ['Dubai', 'Mumbai', 'Kochi', 'Chennai', 'Karachi'];
    $scope.origin_dest_data = [];
    if ($scope.scope2 == 'origin') {
      for (var i = 0; i < $scope.origin_dest_labels.length; i++) {
        $scope.origin_dest_data.push($filter('filter')($scope.ships, {origin: $scope.origin_dest_labels[i]}).length);
      }
    } else {
      for (var i = 0; i < $scope.origin_dest_labels.length; i++) {
        $scope.origin_dest_data.push($filter('filter')($scope.ships, {destination: $scope.origin_dest_labels[i]}).length);
      }
    }
  }

  $scope.containerAnalytics = function(){
    $scope.series = [];
    if ($scope.scope3 == '') {
      $scope.series = ['China', 'India', 'Singapore', 'UAE'];
    } else {
      $scope.series = [$scope.scope3];
      $scope.bardata = [[]];
      $scope.barlabels = [];
      var filteredData =  $filter('filter')($scope.ships, {country: $scope.scope3});
      for (var i = 0; i < filteredData.length; i++) {
        $scope.bardata[0].push(filteredData[i]['content'].length);
        $scope.barlabels.push(filteredData[i]['name']);
      }
    }
  }

  $scope.pieDataSetOverride = [{
          label: 'Dataset 1'
        }];

  $scope.datasetOverride = [{ yAxisID: 'y-axis-1', steppedLine: true, backgroundColor: '#3c8dbc'}];
  $scope.options = {
    scales: {
      responsive: true,
      xAxes: [{
        id: 'x-axis-1',
        display: true,
        scaleLabel: {
          display: true
        }
      }],
      yAxes: [
        {
          id: 'y-axis-1',
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Number of containers'
          },
          ticks:{
              min: 0,
              suggestedMax: 10
          },
          position: 'left'
        }
      ]
    }
  };
});
