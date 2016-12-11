(() => {
    const { remote } = require('electron');

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
        }]);
})();