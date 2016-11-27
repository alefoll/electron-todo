(() => {
    angular.module('Todos')
        .controller('TodosController', ['$scope', ($scope) => {
            $scope.add     = add;
            $scope.cancel  = cancel;
            $scope.done    = done;
            $scope.showAdd = showAdd;

            $scope.date     = '';
            $scope.minDate  = new Date();
            $scope.name     = '';
            $scope.showLine = false;
            $scope.todos    = JSON.parse(localStorage.getItem('todos')) || [];

            $scope.$watchCollection('todos', () => {
                localStorage.setItem('todos', JSON.stringify($scope.todos));
            })

            for(let todo of $scope.todos)
                todo.date = new Date(todo.date);

            function add() {
                $scope.showLine = false;

                $scope.todos.push({
                    // client : $scope.client,
                    name   : $scope.name,
                    date   : $scope.date
                })

                $scope.name = '';
                $scope.date = '';
            }

            function cancel() {
                $scope.showLine = false;

                $scope.name = '';
                $scope.date = '';
            }

            function done(todo) {
                const index = $scope.todos.indexOf(todo);

                $scope.todos.splice(index, 1);
            }

            function showAdd() {
                $scope.showLine = true;
            }
        }]);
})();