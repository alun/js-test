var app = angular.module('githubUsers', ['ngResource']);

app.factory('User', ['$resource', function (resource) {
    return resource("https://api.github.com/users");
}]);

app.directive('usersList', ['User', '$http', function (User, http) {
    return function (scope, elem, attrs) {

        scope.toggleFollowers = function (user, event) {
            if (user.followers) {
                delete user.followers;
            } else {
                http.get(user.followers_url).success(function (data) {
                    user.followers = data;
                }).error(function () {
                    //console.log("Followers couldn't be loaded for ", user);
                });
            }
        };

        scope.loadNext = function () {
            if (scope.users) {
                scope.prevId = scope.users[0].id;
                scope.since = scope.users[scope.users.length - 1].id;
                reload();
            }
        };

        scope.loadPrev = function () {
            if (scope.prevId) {
                scope.since = scope.prevId;
                reload();
            }
        };

        function reload() {
            User.query({since: scope.since || 0}, function (results) {
                scope.users = results;
            });
        }

        reload();
    }
}]);
