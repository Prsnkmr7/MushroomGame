quintBuild = angular.module('quintDiamond-app', ['ui.router']);

// Route Provider Starts

quintBuild.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('Rules', {
            url: '/',
            templateUrl: 'Templates/rules.html'
        })
        .state('Easy', {
            url: '/Easy',
            templateUrl: 'Templates/home.html'
        })

});

// Info Controller Logic

quintBuild.controller('infoController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
    $scope.user = {};
    $scope.submitForm = function (val) {
        if (val) {
            $rootScope.userDetails = $scope.user;
            $state.go('Easy');
        }
    }
}]);


// Home Controller logic

quintBuild.controller('homeController', ['$scope', '$rootScope', '$timeout', '$state', function ($scope, $rootScope, $timeout, $state) {
    $scope.listItems = [];
    $scope.transactionTimeOut = false;
    var count = 0;
    var columnIndex = 0;
    var rowIndex = 0;
    var key = 'Right';
    $scope.numberOfStep = 0;

    //Random Values for Rows and Columns
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    //Random Mushroom Generator
    var randomGenerateMushroom = function (val) {
        while (count < $scope.user.row) {
            var row = getRandomInt(0, $scope.user.row - 1);
            var columnData = getRandomInt(0, $scope.user.column - 1);
            var data = $scope.listItems[row].column[columnData];
            if (!data.isMushroom) {
                data.isMushroom = true;
                count++;
            }
        }
        count = 0;
    };

    //Check for Mushroom
    var checkForMushroom = function ( data ) {
        $scope.numberOfStep++;
        if (data.isUser && data.isMushroom ) {
            data.isMushroom = false;
            count++;
        }
        if(count == $scope.user.row) {
            $scope.transactionTimeOut = true;
        }
        return $scope.transactionTimeOut
    };

    //Compare so that values don't get out of bound
    var checkForIndex = function (key) {
        if(key === 'Right' || key === 'Left'){
            if(rowIndex >= $scope.user.row) {
                rowIndex = $scope.user.row - 1;
            }
            if(rowIndex < 0) {
                rowIndex = 0;
            }
        } else {
            if(columnIndex >= $scope.user.column) {
                columnIndex = $scope.user.column - 1;
            }
            if(columnIndex < 0) {
                columnIndex = 0;
            }
        }
    };

    //Check for user moves
    var makeUserMove = function ( data) {
        data.isUser = true;
        if (checkForMushroom(data)){
            return;
        }
        $timeout(function () {
            data.isUser = false; 
            traverse();
        }, 300);
    };

    //Traverse with key value
    var traverse = function () {
        checkForIndex(key);
        if (key === 'Right') {
            if (columnIndex < $scope.user.row) {
                var data = $scope.listItems[rowIndex].column[columnIndex];
                makeUserMove (data);
                columnIndex = columnIndex + 1;
            }else {
                columnIndex = columnIndex - 1;
                key = 'Left';
                traverse();
            }
        }
        else if (key === 'Left') {
            if (columnIndex >= 0) {
                var data = $scope.listItems[rowIndex].column[columnIndex];
                data.isUser = true;
                makeUserMove (data);
                columnIndex = columnIndex - 1;
            }else {
                columnIndex = columnIndex + 1;
                key = 'Right';
                traverse();
            }
        }
        else if (key === 'Up') {
            if (rowIndex >= 0) {
                var data = $scope.listItems[rowIndex].column[columnIndex];
                makeUserMove (data);
                rowIndex = rowIndex - 1;
            }else {
                rowIndex = rowIndex + 1;
                key = 'Down';
                traverse();
            }
        }
        else {
            if (rowIndex < $scope.user.column) {
                var data = $scope.listItems[rowIndex].column[columnIndex];
                data.isUser = true;
                makeUserMove (data);
                rowIndex = rowIndex + 1;
            }else {
                rowIndex = rowIndex - 1;
                key = 'Up';
                traverse();
            }
        }
    };

    //Initialising the start
    $scope.init = function () {
        $scope.user = $rootScope.userDetails;
        gridGenerator($scope.user);
    };

    //Check for the keyevents
    $scope.key = function ( $event ) {
        if ($event.keyCode == 38)
            key = 'Up';
        else if ($event.keyCode == 39)
            key = 'Right';
        else if ($event.keyCode == 40)
            key = 'Down';
        else if ($event.keyCode == 37)
            key = 'Left';
    };

    //Starting the Game
    $scope.startGame = function () {
        traverse();
    };

    //Generating the grid for the maze
    var gridGenerator = function (val) {
        for (var i = 0; i < val.row; i++) {
            var gridStructure = {
                'name': '',
                'column': []
            };
            gridStructure.name = i + 'Row';
            for (var j = 0; j < val.column; j++) {
                var column = {
                    'index': '',
                    'isMushroom': false,
                    'isUser': false
                };
                column.index = j;
                gridStructure.column.push(column);
            }
            $scope.listItems.push(gridStructure);
        };
        randomGenerateMushroom($scope.listItems);
    };

    //Reseting the value
    $scope.resetValue = function () {
        $state.go('Rules');
    };

    $scope.init();

}]);
