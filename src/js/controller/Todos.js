(() => {
    angular.module('Todos')
        .controller('TodosController', ['$scope', '$mdDialog', ($scope, $mdDialog) => {
            $scope.add     = add;
            $scope.cancel  = cancel;
            $scope.done    = done;
            $scope.showAdd = showAdd;

            $scope.date     = '';
            $scope.minDate  = new Date();
            $scope.task     = '';
            $scope.todos    = JSON.parse(localStorage.getItem('todos')) || [];

            $scope.$watchCollection('todos', () => {
                localStorage.setItem('todos', JSON.stringify($scope.todos));
            })

            for(let todo of $scope.todos)
                todo.date = new Date(todo.date);

            function add() {
                $scope.todos.push({
                    // client : $scope.client,
                    created : new Date(),
                    task    : $scope.task,
                    date    : $scope.date
                })

                cancel();
            }

            function cancel() {
                $mdDialog.hide();

                $scope.task = '';
                $scope.date = '';
            }

            function done(todo) {
                const index = $scope.todos.indexOf(todo);

                $scope.todos.splice(index, 1);
            }

            function showAdd() {
                $mdDialog.show({
                    templateUrl         : 'newTodo.html',
                    preserveScope       : true,
                    scope               : $scope,
                    parent              : angular.element(document.body),
                    clickOutsideToClose : false,
                    fullscreen          : false
                })
            }
        }]);
})();