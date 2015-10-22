(function () {

    function HomeCtrl($scope, dirtyCheckingService) {
        dirtyCheckingService.watch(function () {
            return $scope.name;
        }, function (newValue, oldValue) {
            console.log("CHANGED: " + oldValue + " --> " + newValue);
        });

        $scope.runDirtyChecking = function () {
            dirtyCheckingService.digest();
        }
    }

    angular.module("MyApp").controller("HomeCtrl", HomeCtrl);

})();
