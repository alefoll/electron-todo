(() => {
    const { remote } = require('electron');

    const Config = remote.require('./electron/Config');

    angular.module('Todos')
        .factory('$youtrack', ['$http', '$httpParamSerializer', ($http, $httpParamSerializer) => {
            const enabled = Config.get('youtrack.enabled');
            const url     = Config.get('youtrack.url');

            let token = '';

            function isIssue(task) {
                return (enabled) ? (/([A-Z]+)-([0-9]+)/.test(task)) : false;
            }

            function listIssues() {
                if (token === '')
                    login();
            }

            function login() {
                $http({
                    method  : 'POST',
                    url     : `${url}/rest/user/login`,
                    data : $httpParamSerializer({
                        login    : Config.get('youtrack.username'),
                        password : Config.get('youtrack.password')
                    }),
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(() => {

                }, () => {

                })
            }

            return {
                isIssue    : isIssue,
                listIssues : listIssues,
                login      : login,

                enabled : enabled,
                url     : url
            }
        }])
})();