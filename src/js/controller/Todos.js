(() => {
    const { remote } = require('electron');

    const moment = remote.require('moment');

    angular.module('Todos')
        .config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
            $mdDateLocaleProvider.months      = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
            $mdDateLocaleProvider.shortMonths = ["janv.",   "févr.",   "mars", "avr.",  "mai", "juin", "juil.",   "août",  "sept.",    "oct.",    "nov.",     "déc."];

            $mdDateLocaleProvider.days      = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
            $mdDateLocaleProvider.shortDays = ["Di",       "Lu",    "Ma",    "Me",       "Je",    "Ve",        "Sa"];

            $mdDateLocaleProvider.firstDayOfWeek = 1;

            $mdDateLocaleProvider.weekNumberFormatter = (weekNumber) => {
                return 'Semaine ' + weekNumber;
            }

            $mdDateLocaleProvider.formatDate = function(date) {
                const m = moment(date);
                return m.isValid() ? m.format('L') : '';
            };

            $mdDateLocaleProvider.msgCalendar     = "Calendrier";
            $mdDateLocaleProvider.msgOpenCalendar = "Ouvrir le calendrier";
        }])
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
                $scope.todos.sort((a, b) => {
                    return (a.date.getTime() === b.date.getTime()) ? a.task.toLowerCase() > b.task.toLowerCase() : a.date.getTime() > b.date.getTime();
                });

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