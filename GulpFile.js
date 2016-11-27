'use strict';

const gulp  = require('gulp');
const gutil = require('gulp-util');

gutil.env.prod = false;

gulp.task('envProd', (done) => {
    gutil.env.prod = true;

    done();
});

gulp.task('app',          require('./tasks/app.js'));
gulp.task('assets',       require('./tasks/assets.js'));
gulp.task('browser-sync', require('./tasks/browser-sync.js'));
gulp.task('clean',        require('./tasks/clean.js'));
gulp.task('config',       require('./tasks/config.js'));
gulp.task('electron',     require('./tasks/electron.js'));
gulp.task('layout',       require('./tasks/layout.js'));
gulp.task('packager',     require('./tasks/packager.js'));
gulp.task('style',        require('./tasks/style.js'));
gulp.task('vendorsCSS',   require('./tasks/vendorsCSS.js'));
gulp.task('vendorsJS',    require('./tasks/vendorsJS.js'));
gulp.task('watch',        require('./tasks/watch.js'));

gulp.task('launch', gulp.parallel(gulp.series('browser-sync', 'electron'), 'watch'));

gulp.task('build',   gulp.series('clean', 'vendorsCSS', 'vendorsJS', 'assets', 'app', 'style', 'layout'));
gulp.task('default', gulp.series('build', 'launch'));
gulp.task('prod',    gulp.series('envProd', 'build', 'electron'));

gulp.task('exe', gulp.series('envProd', 'build', 'packager', 'config'));