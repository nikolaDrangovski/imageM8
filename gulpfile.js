'use strict';
var gulp = require('gulp')
var electron = require('electron-connect').server.create();
gulp.task('default', function () {
// Start browser process
 electron.start();
  // reload = electron.reload / restart = electron.restart
 gulp.watch('app/app.js', electron.reload);

 gulp.watch(['index.html'], electron.reload);
});