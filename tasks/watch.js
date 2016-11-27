const gulp = require('gulp');

module.exports = () => {
    gulp.watch('src/assets/**/*', gulp.series('assets'));
    gulp.watch('src/*.html',      gulp.series('layout'));
    gulp.watch('src/js/**/*.js',  gulp.series('app'));
    gulp.watch('src/**/*.css',    gulp.series('style'));
};