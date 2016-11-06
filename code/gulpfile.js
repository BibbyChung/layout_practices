"use strict";

let gulp = require('gulp') // 載入 gulp
let gulpSass = require('gulp-sass'); // 載入 gulp-sass

let postcss = require('gulp-postcss');
let sourcemaps = require('gulp-sourcemaps');
let autoprefixer = require('autoprefixer');

let runSequence = require("run-sequence");
let rimraf = require("rimraf");
let merge = require("merge-stream");

let sassFun = (source, target) => {
    return gulp.src(source) // 指定要處理的 Scss 檔案目錄
        .pipe(sourcemaps.init())
        .pipe(gulpSass({ // 編譯 Scss
            //outputStyle: 'compressed'
        }))
        .pipe(postcss([autoprefixer({ browsers: ['> 1%', 'IE 7'], cascade: false })]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(target)); // 指定編譯後的 css 檔案目錄
};


gulp.task("copy_asset_to_dist", () => {

    let m = merge();

    let dist = gulp.src([
        "./src/**/*.html",
        "./src/**/*.jpg",
        "./src/**/*.png",
    ]).pipe(gulp.dest("./dist/"));
    m.add(dist);

    let font = gulp.src([
        "./node_modules/font-awesome/fonts/**/*.*"
    ]).pipe(gulp.dest("./dist/fonts/"));
    m.add(font);

    return m;

});


gulp.task('sass', () => {

    let m = merge();

    let normalCss = sassFun('./src/scss/normal/index.scss', './dist/css/normal');
    m.add(normalCss);

    let flexCss = sassFun('./src/scss/flex/index.scss', './dist/css/flex');
    m.add(flexCss);

    return m;

});

gulp.task("build", (cb) => {
    runSequence(
        "sass",
        "copy_asset_to_dist",
        cb
    );
});