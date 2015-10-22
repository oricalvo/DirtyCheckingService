(function () {

    function DirtyCheckingService($rootScope) {
        var scope = this.scope = $rootScope.$new();
        this.$rootScope = $rootScope;

        //
        //  Detach our custom scope from Angular scope tree
        //
        var parent = scope.$parent;
        if (parent && parent.$$childHead == scope) parent.$$childHead = scope.$$nextSibling;
        if (parent && parent.$$childTail == scope) parent.$$childTail = scope.$$prevSibling;
        if (scope.$$prevSibling) scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
        if (scope.$$nextSibling) scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;

        //
        //  Remove functions that we shold never use (keep only digest)
        //
        scope.$destroy = scope.$apply = scope.$evalAsync = scope.$applyAsync = null;
        scope.$on = null;
    }

    DirtyCheckingService.prototype.watch = function (expr, listener) {
        this.scope.$watch(expr, listener);
    }

    DirtyCheckingService.prototype.digest = function () {
        //
        //  Reset angular phase so we can execute our digest inside angular apply phase
        //
        var originalPhase = this.$rootScope.$$phase;
        this.$rootScope.$$phase = null;

        this.scope.$digest();

        //
        //  Restore angular phase
        //
        this.$rootScope.$$phase = originalPhase;
    }

    angular.module("MyApp").service("dirtyCheckingService", DirtyCheckingService);
})();
