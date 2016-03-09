console.log('Angular app started !!!');

// main module which starts angular app
var UserApp = angular.module('UserApp', ['ngRoute']);

// routes config
UserApp.config(function($routeProvider) {
    $routeProvider
        .when('/signup', {
            templateUrl: 'signup',
            controller: 'signupController'
        })
        .when('/userlist', {
            templateUrl: 'userslist',
            controller: 'userlistController'
        })
        .when('/profile/:username', {
            templateUrl: 'viewprofile',
            controller: 'profileController'
        })
        .otherwise({
            redirectTo: '/signup'
        });
});

// signup controller
UserApp.controller('signupController', function($scope, $rootScope, Users, $location) {
    $rootScope.header = "signup"; // header title
    $scope.isnotvalid = false;
    // form submit action
    $scope.signupUser = function() {
        $scope.isnotvalid = false;
        // check if none of the fields are empty
        if (count($scope.user) == 5) {
            // insert form data
            Users.create($scope.user);
            // redirect to userlist after form submission
            $location.path('/userlist');
        } else {
            $scope.isnotvalid = true;
        };
    };

    // count no of empty values in an object
    function count(obj) {
        var count = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                ++count;
            }
        }
        return count;
    };
});

// userlist controller
UserApp.controller('userlistController', function($scope, $rootScope, Users) {
    $rootScope.header = "users list"; // header title
    $scope.users = Users.findAll(); // get all users
    // check if atleast there is one user
    $scope.users = $scope.users.length == 0 ? false : $scope.users; 
});

// profile controller
UserApp.controller('profileController', function($scope, $rootScope, Users, $routeParams) {
    $rootScope.header = "profile"; // header title
    $scope.user = Users.find($routeParams.username);// get a user with the requested user name
    // check if the user obj is not empty
    $scope.user = JSON.stringify($scope.user) == "{}" ? false : $scope.user;
});

// main controller
UserApp.controller('mainController', function($scope, $rootScope, Users) {
    $rootScope.header = ""; // header title
    // if users not present then insert users
    if (Users.findAll().length == 0) {
        Users.create({
            first_name: 'pavan',
            last_name: 'singh',
            email: 'pavan@gmail.com',
            username: 'pavan',
            password: '123456'
        });
        Users.create({
            first_name: 'siva',
            last_name: 'raheja',
            email: 'siva@gmail.com',
            username: 'siva',
            password: '123456'
        });

        Users.create({
            first_name: 'madhu',
            last_name: 'shliini',
            email: 'madhu@gmail.com',
            username: 'madhu',
            password: '123456'
        });
    };
    // assign inserted users to users scope variable
    $scope.users = Users.findAll();
});

// users service that takes care of C*RD operations on user DB
UserApp.factory('Users', function() {
    return {
        // get all users from localstorage
        fetch: function() {
            var _users = JSON.parse(localStorage.getItem('UserApp'));
            return _users || [];
        },
        // save user to localstorage
        save: function(user) {
            // fetch existing users
            var _users = this.fetch();
            // push new user to exsisting user array
            _users.push(user);
            // stringify user object and save it to localstorage
            localStorage.setItem('UserApp', JSON.stringify(_users));
            // return all users
            return this.fetch();
        },
        // clear localstorage
        clear: function() {
            localStorage.clear();
            return "LocalStorage cleared !!!";
        },
        // get all users
        findAll: function() {
            return this.fetch();
        },
        // get a user based on username
        find: function(uname) {
            // get all users
            var _users = this.fetch();
            // loop through user object and if any of the object matches requested username then return the user object
            for (var i = 0; i < _users.length; i++) {
                if (_users[i].username == uname) {
                    return _users[i];
                };
            };
            // if none of the user objects mactes with the requested username then retrun empty object
            return {};
        },
        // save a user
        create: function(user) {
            return this.save(user);
        }
    }
});