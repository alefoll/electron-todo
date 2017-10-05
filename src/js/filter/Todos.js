(() => {
    const { remote } = require('electron');

    const moment = remote.require('moment');

    moment.locale('fr');

    angular.module('Todos')
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

                for (let item of items) {
                    item.index = filtered.length;

                    filtered.push(item);
                }

                filtered.sort((a, b) => {
                    return (a.date.getTime() === b.date.getTime()) ? a.task.toLowerCase() - b.task.toLowerCase() : a.date.getTime() - b.date.getTime();
                });

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
        });
})();