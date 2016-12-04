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

                return m.isValid() ? m.format('ddd DD/MM') : '';
            };

            $mdDateLocaleProvider.msgCalendar     = "Calendrier";
            $mdDateLocaleProvider.msgOpenCalendar = "Ouvrir le calendrier";
        }])
        .filter('moment', () => {
            return (date) => {
                if (date !== undefined) {
                    const m = moment(date);

                    return m.isValid() ? m.format('ddd DD/MM, H:mm') : '';
                }
            }
        })
        .filter('sort', () => {
            return (items) => {
                const filtered = [];

                for (let item of items)
                    filtered.push(item);

                filtered.sort((a, b) => {
                    return (a.date.getTime() === b.date.getTime()) ? a.task.toLowerCase() > b.task.toLowerCase() : a.date.getTime() > b.date.getTime();
                })

                return filtered;
            }
        })
        .filter('zpad', () => {
            return (input, n) => {
                if (input === undefined)
                    input = "";

                if (input.length >= n)
                    return input;

                const zeros = "0".repeat(n);

                return (zeros + input).slice(-1 * n);
            }
        })
        .controller('TodosController', ['$scope', '$mdDialog', '$interval', ($scope, $mdDialog, $interval) => {
            $scope.add              = add;
            $scope.close            = close;
            $scope.done             = done;
            $scope.edit             = edit;
            $scope.isYoutrackIssue  = isYoutrackIssue;
            $scope.openExternal     = shell.openExternal;
            $scope.showAdd          = showAdd;
            $scope.showEdit         = showEdit;
            $scope.undo             = undo;

            $scope.date        = new Date();
            $scope.history     = [];
            $scope.hour        = 18;
            $scope.minDate     = new Date();
            $scope.minute      = 0;
            $scope.task        = '';
            $scope.todos       = JSON.parse(localStorage.getItem('todos')) || [];
            $scope.youtrackURL = Config.get('youtrack.url');

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

                localStorage.setItem('todos', JSON.stringify($scope.todos));
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

            function undo() {
                $scope.history.pop();

                $scope.todos = $scope.history.pop();
            }
        }]);
})();