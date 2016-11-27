(() => {
    angular.module('Todos', ['ngMaterial']);

    document.addEventListener('DOMContentLoaded', () => {
        angular.bootstrap(document, ['Todos']);
    }, false);
})();
