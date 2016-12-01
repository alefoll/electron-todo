(() => {
    const { remote, shell } = require('electron');

    const { Menu, MenuItem } = remote;

    const Config = remote.require('./electron/Config');
    const moment = remote.require('moment');

    moment.locale('fr');

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
            $scope.add             = add;
            $scope.close           = close;
            $scope.done            = done;
            $scope.edit            = edit;
            $scope.isYoutrackIssue = isYoutrackIssue;
            $scope.openExternal    = shell.openExternal;
            $scope.showAdd         = showAdd;
            $scope.showEdit        = showEdit;

            $scope.date        = '';
            $scope.minDate     = new Date();
            $scope.task        = '';
            $scope.todos       = JSON.parse(localStorage.getItem('todos')) || [];
            $scope.youtrackURL = Config.get('youtrack.url');

            $scope.$watchCollection('todos', _updateAndSave)

            for(let todo of $scope.todos)
                todo.date = new Date(todo.date);

            const menu = new Menu();

            let index;

            menu.append(new MenuItem({
                label: 'Edit',
                click() {
                    showEdit(index)
                }
            }));

            window.addEventListener('contextmenu', (event) => {
                if (event.target.classList.contains('task')) {
                    event.preventDefault();

                    index = event.target.dataset.index;

                    menu.popup(remote.getCurrentWindow());
                }
            }, false)

            function _updateAndSave() {
                $scope.todos.sort((a, b) => {
                    return (a.date.getTime() === b.date.getTime()) ? a.task.toLowerCase() > b.task.toLowerCase() : a.date.getTime() > b.date.getTime();
                });

                localStorage.setItem('todos', JSON.stringify($scope.todos));
            }

            function add() {
                $scope.todos.push({
                    // client : $scope.client,
                    created : new Date(),
                    task    : $scope.task,
                    date    : $scope.date
                });

                close();
            }

            function close() {
                $mdDialog.hide();

                $scope.task = '';
                $scope.date = '';

                _updateAndSave();
            }

            function done(todo) {
                const index = $scope.todos.indexOf(todo);

                $scope.todos.splice(index, 1);
            }

            function edit() {
                $scope.todos[index].task = $scope.task;
                $scope.todos[index].date = $scope.date;

                close();
            }

            function isYoutrackIssue(task) {
                return (Config.get('youtrack.enabled')) ? (/([A-Z]+)-([0-9]+)/.test(task)) : false;
            }

            function showAdd() {
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
        }]);
})();