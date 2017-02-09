(function() {
  var app = angular.module('app', []);

  app.controller('mainCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){

    $scope.contacts = [];
    $http.get('assets/Contacts.json').success(function(data){
      $scope.contacts = data;
    });

    $scope.outlets = [];
    var request =  $http.get('assets/Outlets.json').success(function(data){
      $scope.outlets = data;

      // This function is performed to add to each contact its corresponding outlet name
      // and to create for each outlet a list of all contacts that belongs to it
      $scope.contacts.forEach(function(contact, index, contactArr){

        // filter current contact outlet
        var outlet = $filter('filter')($scope.outlets, {id: contact.outletId});

        // get current contact parent outlet and define in it contactList if doesn't exist
        var currentOutlet = $scope.outlets[$scope.outlets.indexOf(outlet[0])];
        if (!currentOutlet.contactList){ currentOutlet.contactList = [] };

        // adds current contact to its parent outlet contactList in $scope.outlets array
        currentOutlet.contactList.push(contact);

        // adds outlet name to current contact in $scope.contacts array
        contact.outletName = outlet[0].name;
      });
      // console.log($scope.contacts);
      return $scope.contacts;
    });

    request.then(function(data){
      //set behavior after loaded json elements
      $scope.propertyName = 'title';
      $scope.reverse = false;
      $scope.currentPage = 1;

      $filter('orderBy')($scope.contacts, $scope.propertyName, $scope.reverse);
      var totalContacts = $scope.contacts.length;
      $scope.pages = Array.from(new Array($scope.contacts.length / 25),(val,index)=>index+1);
      $scope.contacsToShow = $scope.contacts.slice(0,25);

      //Updates the list of contacts to show accordding to requested page
      $scope.changePage = function(nextpage){
        var lowerLimit = (nextpage-1)*25;
        var upperLimit = nextpage*25 > totalContacts ? undefined : nextpage*25;
        $scope.contacsToShow = $scope.contacts.slice(lowerLimit,upperLimit);
        $scope.currentPage = nextpage;
      };

      //Sort all contacts accordding to param received - TODO: firstName sort not working properly
      $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
        $scope.contacts = $filter('orderBy')($scope.contacts, $scope.propertyName, $scope.reverse);
        $scope.changePage($scope.currentPage);
      };

    });

  }]);

})();
