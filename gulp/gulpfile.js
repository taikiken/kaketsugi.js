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
// ----------------------------------------------------------------
"use strict";

// node Module
var require = require;

// Gulp Module
var gulp = require( 'gulp' );

var runSequence = require('run-sequence');
var size = require('gulp-size');

var concat = require( 'gulp-concat' );
var rename = require( 'gulp-rename' );
var uglifyjs = require( 'gulp-uglifyjs' );
var uglify = require( 'gulp-uglify' );

var shell = require( 'gulp-shell' );

var plumber = require( 'gulp-plumber' );

var sass = require( 'gulp-ruby-sass' );
var minifycss = require('gulp-minify-css');
var changed = require('gulp-changed');

var cache = require('gulp-cache');

var rimraf = require('rimraf');
var del = require('del');

var path = require( 'path' );

var cached = require( 'gulp-cached' );

var yuidoc = require( 'gulp-yuidoc' );

var replace = require('gulp-replace-task');

// ----------------------------------------------------------------
// Directory
var dir = require( './setting.json' );

// ----------------------------------------------------------------
// package
var pac = require( './package.json' );

// ----------------------------------------------------------------
// patterns, replace task
var patterns = [
  {
    match: 'version',
    replacement: pac.version
  },
  {
    match: 'buildTime',
    replacement: new Date().toLocaleString()
  },
  {
    match: 'year',
    replacement: new Date().getFullYear()
  }
];

// ----------------------------------------------------------------
//  task
// ----------------------------------------------------------------
gulp.task( 'script-concat', function () {

  return gulp.src( dir.src + '/**/*.js' )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( rename( function ( path ) {

      path.basename = path.basename + '-' + pac.version;

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