var userController = angular.module('userController', ['userService', 'errorController']);

userController.controller('userController', ['$scope', '$routeParams', 'userService', '$timeout', '$location', '$controller',
    function($scope, $routeParams, userService, $timeout, $location, $controller) {
        $controller('errorController', { $scope: $scope });

        $scope.initializeUser = function() {
            userService.getUser($routeParams.id, function(user) {
                $scope.user = user;
                $scope.password;

                if (localStorage.getItem('role') === "admin") {
                    $scope.isAdmin = true;
                    $scope.showDelete = true;
                    $scope.showPromote = true;
                    $scope.showEdit = false;
                    $scope.addServers = true;
                } else {
                    $scope.isAdmin = false;
                    $scope.showDelete = false;
                    $scope.showPromote = false;
                    $scope.showChangePassword = false;
                    $scope.showEdit = false;
                    $scope.addServers = false;
                }

            }, function(error) {
                $scope.handleErrors(error);
            })
        }

        $scope.delete = function() {
            var userId;
            if ($location.path() != "/myaccount") {
                var userId = $routeParams.id;
            } else {
                var userId = localStorage.getItem("userid");
            }
            userService.deleteUser(userId, function() {
                $timeout(function() {
                    $location.path("userlist");
                }, 300);
            }, function(error) {

            });
        }

        $scope.update = function() {
            if ($location.path() != "/myaccount") {

                userService.updateUser($routeParams.id, function() {
                        $scope.user;
                    },
                    function(error) {
                        $scope.handleErrors(error);
                    },
                    $scope.user
                )
            } else {
                userService.updateUser(userService.getCurrentUser().id, function() {
                        $scope.user;
                    },
                    function(error) {
                        $scope.handleErrors(error);
                    },
                    $scope.user
                )
            }
        }


        $scope.promote = function() {
            userService.promoteUser($routeParams.id, function() {
                console.log($scope.user);
                $scope.user.roleId = 'admin';
            }, function(error) {
                $scope.handleErrors(error);
            })
        }

        $scope.serversOfUser = function() {
            userService.serversOfUser($routeParams.id, function(server) {
                $scope.servers = server;
                $scope.display = false;
                if ($scope.servers.length > 0) {
                    $scope.display = true;
                    $scope.show = [];
                    for (var i = 0; i < $scope.servers.length; i++)
                        $scope.show[i] = true;
                }
                console.log($scope.display);
            }, function(error) {
                if ($scope.isAdmin) {
                    $scope.handleErrors(error);
                }
            })
        }
        $scope.removeFromUser = function(serverID, index) {
            userService.removeFromUser($routeParams.id, serverID, function(server) {
                $scope.show[index] = false;
            }, function(error) {
                $scope.handleErrors(error);
            })
        }

        $scope.initializeCurrentUser = function() {
            userService.getUser(localStorage.getItem("userid"), function(user) {
                $scope.user = user;
                $scope.showEdit = true;                                
                $scope.showChangePassword = true;
                if (localStorage.getItem('role') === 'admin') {
                    $scope.addServers = true;
                    $scope.showDelete = true;
                }
            }, function(error) {
                $scope.handleErrors(error);
            })
        }

        $scope.serversOfCurrentUser = function() {
            userService.serversOfUser("", function(server) {
                $scope.servers = server;
                $scope.display = false;
                if ($scope.servers.length > 0) {
                    $scope.display = true;
                    $scope.show = [];
                    for (var i = 0; i < $scope.servers.length; i++)
                        $scope.show[i] = true;
                }
                console.log($scope.display);
            }, function(error) {
                $scope.handleErrors(error);
            })
        }


        $scope.changePassword = function() {
            if ($scope.password == $scope.user.password) {
                userService.changePasswordUser(userService.getCurrentUser().id, function() {
                        localStorage.setItem("password", $scope.password);
                    },
                    function(error) {
                        $scope.handleErrors(error);
                    },
                    $scope.user
                );
                $('#changePasswordModal').modal('hide');
            } else alert("Not Matching");
        }

        $scope.removeFromCurrentUser = function(serverID, index) {
            userService.removeFromUser(localStorage.getItem("userid"), serverID, function(server) {
                $scope.show[index] = false;
            }, function(error) {
                $scope.handleErrors(error);
            })
        }
    }

]);

userController.controller('usersListController', ['$scope', '$http', 'userService', '$controller',
    function($scope, $http, userService, $controller) {
        $controller('errorController', { $scope: $scope });

        $scope.initialize = function() {
            if (localStorage.getItem('role') === "admin") {
                $scope.deleteUser = true;
            } else {
                $scope.deleteUser = false;
            }
            userService.listUsers(function(users) {
                $scope.users = users;
                $scope.show = [];
                for (var i = 0; i < $scope.users.length; i++)
                    $scope.show[i] = true;
                console.log(users);
            }, function(error) {
                $scope.handleErrors(error);
            })
        }

        $scope.injectVarsToScope = function(currentUser, $index) {
            $scope.currentUser = currentUser;
            $scope.index = $index;
        }

        $scope.delete = function(userID, index) {
            userService.deleteUser(userID, function(user) {
                $scope.show[index] = false;
            }, function(error) {
                $scope.handleErrors(error);
            })
        }
    }
]);

userController.controller('usersAddToSeverListController', ['$scope', '$http', '$routeParams', 'userService', '$controller',
    function($scope, $http, $routeParams, userService, $controller) {
        $controller('errorController', { $scope: $scope });

        $scope.initialize = function() {
            console.log(userService);
            userService.listUsersToVM($routeParams.id, function(users) {
                if (users != 0) {
                    $scope.message = "Add users to server";
                    $scope.users = users;
                    $scope.show = [];
                    for (var i = 0; i < $scope.users.length; i++)
                        $scope.show[i] = true;
                } else $scope.message = "There are no users available!"
                console.log(users);
            }, function(error) {
                $scope.handleErrors(error);
            })
        }
        $scope.addUserToVm = function(userID, index) {
            console.log(userID);
            userService.addUsersToVM($routeParams.id, function(users) {
                $scope.show[index] = false;
            }, function(error) {
                $scope.handleErrors(error);
            }, userID)
        }
    }
]);

userController.controller('usersCreateController', ['$scope', '$http', '$routeParams', '$location', 'userService', '$controller',
    function($scope, $http, $routeParams, $location, userService, $controller) {
        $controller('errorController', { $scope: $scope });

        $scope.initialize = function() {
            $scope.user = new User();
        }

        $scope.create = function() {
            userService.createUser($routeParams.id, function() {
                    console.log($scope.user);
                    $location.path("/");
                }, function(error) {
                    $scope.handleErrors(error);
                },
                $scope.user
            )
        }
    }
]);

userController.controller('userLoginController', ['$scope', '$location', 'userService', 'apiService', '$window', '$controller',
    function($scope, $location, userService, apiService, $window, $controller) {
        $controller('errorController', { $scope: $scope });

        $scope.initialize = function() {
            $scope.rememberMe = false;
            $scope.isLoggedIn = false;
            $scope.password = "";
            $scope.username = userService.getCurrentUser().username;
            $scope.id = localStorage.getItem("userid");


            $scope.$watch(function() {
                return $location.path();
            }, function(newValue, oldValue) {
                if ($scope.isLoggedIn == false && $scope.username != null && !apiService.isLoginFreePage(newValue) && newValue != '/') {
                    $location.path('/');
                } else if (localStorage.getItem("userid") === null && newValue === '/') {
                    $scope.isLoggedIn = false;
                }
            });

            if ($scope.username != null) {
                $scope.isLoggedIn = true;
                if ($location.path() == "/") {
                    $location.path("vmlist");
                }
            }
        };

        $scope.login = function() {
            userService.login($scope.username, $scope.password, $scope.rememberMe, function() {
                    $location.path("vmlist");
                    $scope.$emit('loginEvent', {});
                },
                function(error) {
                    $location.path("login_error");
                }
            );
        };
        $scope.error_login = function() {
            userService.login($scope.username, $scope.password, $scope.rememberMe, function() {
                    $location.path("vmlist");
                    $scope.$emit('loginEvent', {});
                },
                function() {
                    $window.location.reload();
                }
            );
        };

        $scope.logout = function() {
            userService.logout();
            $scope.isLoggedIn = false;
            $location.path('/');
        };

        $scope.$on('loginEvent', $scope.initialize);
    }
]);

userController.controller('userRestorePassController', ['$scope', '$location', 'userService', '$window', '$controller',
    function($scope, $location, userService, $window, $controller) {
        $controller('errorController', { $scope: $scope });

        $scope.submitEmail = function() {
            userService.submitEmail(function() {
                    $location.path("email_submitted");
                },
                function(error) {
                    $scope.handleErrors(error);
                    $location.path("email_error");
                },
                $scope.email
            )
        }
        $scope.submitEmailError = function() {
            userService.submitEmail(function() {
                    $location.path("email_submitted");
                },
                function(error) {
                    $scope.handleErrors(error);
                    $window.location.reload();
                },
                $scope.email
            )
        }
    }
]);
