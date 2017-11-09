var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('default', function(cb) {
  exec('npm run --prefix client build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);

    gulp.src(['client/dist/**/*'], {
      base: 'client'
    }).pipe(gulp.dest('server/assets'))
  });
});

gulp.task('copy', function(){
  return gulp.src(['./client/dist/**/*'], {
    base: 'client/dist'
  }).pipe(gulp.dest('server/assets/'))
})