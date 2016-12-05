let gulp = require('gulp')
    scss = require('gulp-sass'),
    babel = require('gulp-babel'),
    fileinclude = require('gulp-file-include');

// fileinclude
gulp.task('fileinclude', () => {
  return gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

// scss
gulp.task('scss', () => {
  return gulp.src('./scss/*.scss')
    .pipe(scss())
    .pipe(gulp.dest('./build/css/'));
});

// babel
gulp.task('babel', () => {
  return gulp.src('./js/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./build/js/'));
});

// serve
gulp.task('serve', () => {
  gulp.watch('./scss/*.scss', ['scss']);
  gulp.watch('./*.html', ['fileinclude'])
  gulp.watch('./js/*.js', ['babel']);
});
