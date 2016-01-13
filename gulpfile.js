var gulp = require('gulp');
var runSeq = require('run-sequence');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');

gulp.task('jshint', function () {
  'use strict';
  return gulp.src([
    '**/*.js',
    '!node_modules/**/*.js',
    '!public/components/**/*.js',
    '!coverage/**/*.js'
  ]).pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('bower', function () {
  'use strict';
  return bower();
});