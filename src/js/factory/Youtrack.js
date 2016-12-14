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

                    const query = "for: me #Unresolved and State: -{to test}";

                    return $http({
                        method : 'GET',
                        url    : `${url}/rest/issue`,
                        params : {
                            filter : query,
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