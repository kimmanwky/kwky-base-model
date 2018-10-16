const gulp = require('gulp');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify-es').default;
const clean = require('gulp-clean');

const JSON_FILES = ['src/*.json', 'src/**/*.json'];
// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean:dist', () => {
  return gulp.src('dist').pipe(clean());
});

gulp.task('clean:build', () => {
  return gulp.src('build').pipe(clean());
});

gulp.task('compile', ['assets'], () => {
  return gulp.src(['src/**/*.ts'])
    .pipe(tsProject())
    .pipe(gulp.dest('./dist'));
});

gulp.task("uglify", ['compile'], () => {
  const options = {
    toplevel: true
  };

  return gulp
    .src("dist/**/*.js")
    .pipe(uglify(options))
    .pipe(gulp.dest("build/"));
});

gulp.task('watch', ['compile'], () => {
  gulp.watch('src/**/*.ts', ['compile']);
});

gulp.task('assets', () => {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);
gulp.task('build', ['uglify']);
gulp.task('clean', ['clean:build', 'clean:dist']);
