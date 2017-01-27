(() => {
    const { remote } = require('electron');

    const Config = remote.require('./electron/Config');

    angular.module('Todos')
        .factory('$youtrack', ['$http', '$httpParamSerializer', ($http, $httpParamSerializer) => {
            const enabled = Config.get('youtrack.enabled');
            const url     = Config.get('youtrack.url');

            function isIssue(task) {
                return (enabled) ? (/^([A-Z]+)-([0-9]+)/.test(task)) : false;
            }

            function listIssues() {
                return login().then(() => {
                }, () => {
                    console.log("To do, make angular.$http return xml");

                    return $http({
                        method : 'GET',
                        url    : `${url}/rest/issue`,
                        params : {
                            filter : Config.get('youtrack.query'),
                            max    : 20,
                            with   : ["summary", "Priority"]
                        }
                    }).then((response) => {
                        const issues = [];

                        for (let issue of response.data.issue) {
                            issues.push({
                                id    : issue.id,
                                title : issue.field[0].value
                            })
                        }

                        issues.sort((a, b) => {
                            if (a.id < b.id)
                                return -1;

                            if (a.id > b.id)
                                return 1;

                            return 0;
                        })

                        return issues;
                    }, () => {

                    })
                });
            }

            function login() {
                return $http({
                    method : 'POST',
                    url    : `${url}/rest/user/login`,
                    data   : $httpParamSerializer({
                        login    : Config.get('youtrack.username'),
                        password : Config.get('youtrack.password')
                    }),
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
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