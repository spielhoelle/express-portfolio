const gulp          = require('gulp'),
  browserSync   = require('browser-sync').create(),
  sass          = require('gulp-sass'),
  autoprefixer  = require('gulp-autoprefixer');


const asset_path = './public'

gulp.task('serve', ['sass'], function() {

  browserSync.init({
    proxy: {
      target: "localhost:3000",
      proxyReq: [
        function(proxyReq) {
          proxyReq.setHeader('X-Forwarded-Host', 'localhost:8000');
        }
      ],
    },
    port: 8000,
    open: false,
    ui: {
      port: 8001
    },
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    },
  });

  gulp.watch(`**/*.hbs`).on('change', browserSync.reload);
  gulp.watch(`**/*.js`).on('change', browserSync.reload);
  gulp.watch(`**/*.sass`, ['sass']);
});

gulp.task('sass', function() {
  return gulp.src(`${asset_path}/stylesheets/style.sass`)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(`${asset_path}/stylesheets`))
    .pipe(browserSync.stream());
});


gulp.task('default', ['serve']);

