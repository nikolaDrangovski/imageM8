'use strict';
var gulp = require('gulp')
var electron = require('electron-connect').server.create();
gulp.task('default', function () {
  // Start browser process
 electron.start();
  // reload = electron.reload / restart = electron.restart
 gulp.watch(['app/app.js', 'index.html','app/app.css','app/services/compressor.js'], electron.restart);
});