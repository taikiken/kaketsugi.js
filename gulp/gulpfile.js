/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2015/03/16 - 14:54
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
/*jslint node: true */
// ----------------------------------------------------------------
'use strict';

// node Module

// Gulp Module
var gulp = require( 'gulp' );

var size = require('gulp-size');
var concat = require( 'gulp-concat' );
var rename = require( 'gulp-rename' );
var uglify = require( 'gulp-uglify' );
var plumber = require( 'gulp-plumber' );
var jshint = require( 'gulp-jshint' );
var replace = require('gulp-replace-task');

var del = require('del');
var path = require( 'path' );
var runSequence = require('run-sequence');

// ----------------------------------------------------------------
// Directory
var dir = require( './setting.json' );

// ----------------------------------------------------------------
// package
var pkg = require( './package.json' );

// ----------------------------------------------------------------
// patterns, replace task
var patterns = [
  {
    match: 'version',
    replacement: pkg.version
  },
  {
    match: 'buildTime',
    replacement: new Date().toLocaleString()
  },
  {
    match: 'year',
    replacement: new Date().getFullYear()
  },
  {
    match: 'url',
    replacement: pkg.repository.url
  }
];

// ----------------------------------------------------------------
//  task
// ----------------------------------------------------------------
gulp.task( 'script-hint', function () {

  return gulp.src( dir.src + '/**/*.js' )
    .pipe( jshint() )
    .pipe( jshint.reporter('jshint-stylish'));

} );

gulp.task( 'script-concat', function () {

  return gulp.src( dir.src + '/**/*.js' )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( rename( function ( path ) {

      path.basename = path.basename + '-' + pkg.version;

    } ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( size( { title: '*** script-concat ***' } ) );
} );


gulp.task( 'script-min', function (){

  return gulp.src( [
    dir.libs + '/**/*.js',
    '!' + dir.libs + '/**/*.min.js'
  ] )
    .pipe( uglify( { preserveComments: 'some' } ) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( replace( { patterns: patterns } ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( size( { title: '*** script-min ***' } ) );
} );

gulp.task( 'script-build', function () {

  runSequence(
    'script-concat',
    'script-min'
  );

} );