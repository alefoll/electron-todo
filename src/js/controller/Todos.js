(() => {
    const { remote, shell } = require('electron');

    const { Menu, MenuItem } = remote;

    const moment = remote.require('moment');

    moment.locale('fr');

    angular.module('Todos')
        .controller('TodosController', ['$scope', '$mdDialog', '$interval', '$youtrack', ($scope, $mdDialog, $interval, $youtrack) => {
            $scope.add              = add;
            $scope.close            = close;
            $scope.done             = done;
            $scope.edit             = edit;
            $scope.importYoutrack   = importYoutrack;
            $scope.isYoutrackIssue  = $youtrack.isIssue;
            $scope.onlyWorkingDay   = onlyWorkingDay;
            $scope.openExternal     = shell.openExternal;
            $scope.showAdd          = showAdd;
            $scope.showEdit         = showEdit;
            $scope.undo             = undo;
            $scope.youtrackEnabled  = $youtrack.enabled;

            $scope.date        = new Date();
            $scope.history     = [];
            $scope.hour        = 18;
            $scope.minDate     = new Date();
            $scope.minute      = 0;
            $scope.task        = '';
            $scope.todos       = JSON.parse(localStorage.getItem('todos')) || [];
            $scope.youtrackURL = $youtrack.url;

            $scope.$watchCollection('todos', _updateAndSave);

            for(let todo of $scope.todos) {
                todo.date = new Date(todo.date);

                _updateProgress(todo);
            }

            $interval(() => {
                for(let todo of $scope.todos)
                    _updateProgress(todo);
            }, 60000);

            // ***************************
            // Right click
            // ***************************

            const menu = new Menu();

            let index;

            menu.append(new MenuItem({
                label: 'Editer',
                click() {
                    showEdit(index)
                }
            }));

            window.addEventListener('contextmenu', (event) => {
                if (event.target.classList.contains('item-task')) {
                    event.preventDefault();

                    index = event.target.dataset.index;

                    menu.popup(remote.getCurrentWindow());
                }
            }, false)

            function _updateAndSave() {
                $scope.history.push(angular.copy($scope.todos));

                localStorage.setItem('todos', angular.toJson($scope.todos));
            }

            function _updateProgress(todo) {
                const now   = Date.now();
                const start = +new Date(todo.created); // + to transform in timestamp
                const end   = +new Date(todo.date);

                todo.progress = ((now - start) / (end - start)) * 100;
            }

            function add() {
                const m = moment($scope.date);

                m.hour($scope.hour);
                m.minute($scope.minute);
                m.second(0);

                $scope.date   = new Date();
                $scope.hour   = 18;
                $scope.minute = 0;

                $scope.todos.push({
                    // client : $scope.client,
                    created : new Date(),
                    task    : $scope.task,
                    date    : m.toDate()
                });

                close();
            }

            function close() {
                $mdDialog.hide();

                $scope.task = '';
                $scope.date = new Date();
            }

            function done(todo) {
                const index = $scope.todos.indexOf(todo);

                $scope.todos.splice(index, 1);
            }

            function edit() {
                const m = moment($scope.date);

                m.hour($scope.hour);
                m.minute($scope.minute);
                m.second(0);

                $scope.date   = new Date();
                $scope.hour   = 18;
                $scope.minute = 0;

                $scope.todos[index].task = $scope.task;
                $scope.todos[index].date = m.toDate();

                _updateAndSave();
                close();
            }

            function importYoutrack() {
                $youtrack.listIssues().then((issues) => {
                    $scope.youtrackIssues = issues;

                    $mdDialog.show({
                        templateUrl         : 'modalImportYoutrack.html',
                        preserveScope       : true,
                        scope               : $scope,
                        parent              : angular.element(document.body),
                        clickOutsideToClose : false,
                        fullscreen          : false
                    })
                })
            }

            function onlyWorkingDay(date) {
                const day = date.getDay();

                return day !== 0 && day !== 6;
            }

            function showAdd(title) {
                $scope.task = title || '';

                $mdDialog.show({
                    templateUrl         : 'modalAdd.html',
                    preserveScope       : true,
                    scope               : $scope,
                    parent              : angular.element(document.body),
                    clickOutsideToClose : false,
                    fullscreen          : false
                })
            }

            function showEdit(index) {
                $scope.task = $scope.todos[index].task;
                $scope.date = $scope.todos[index].date;

                $mdDialog.show({
                    templateUrl         : 'modalEdit.html',
                    preserveScope       : true,
                    scope               : $scope,
                    parent              : angular.element(document.body),
                    clickOutsideToClose : false,
                    fullscreen          : false
                })
            }

            function undo() {
                $scope.history.pop();

                $scope.todos = $scope.history.pop();
            }
        }]);
})();