'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const prettier = require('gulp-prettier');
const beautify = require('gulp-jsbeautifier');
const sourcemaps = require('gulp-sourcemaps');
const hash_src = require('gulp-hash-src');
const posthtml = require('gulp-posthtml');
const htmlmin = require('gulp-htmlmin');
const include = require('posthtml-include');
const richtypo = require('posthtml-richtypo');
const expressions = require('posthtml-expressions');
const removeAttributes = require('posthtml-remove-attributes');
const { quotes, sectionSigns, shortWords } = require('richtypo-rules-ru');
var filejsInclude = require('gulp-include');
var inlinesource = require('gulp-inline-source');

/**
 * Основные переменные
 Если нужно добавить/переменовать еще одну страницу, то нужно добавлять путь к ней по аналогии
 */
const paths = {
  dist: './public/',
  src: './src/',
};
const src = {
  html: paths.src + 'pages//',
  partials: paths.src + 'partials/',
  img: paths.src + 'img/',
  scss: paths.src + 'sass/',
  js: paths.src + 'js/',
  fonts: paths.src + '/fonts',
};
const dist = {
  html: paths.dist + '/',
  img: paths.dist + '/img/',
  css: paths.dist + '/',
  js: paths.dist + '/',
  fonts: paths.dist + '/fonts/',
};

/**
 * Получение аргументов командной строки
 * @type {{}}
 */
const arg = ((argList) => {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
})(process.argv);

/**
 * Очистка папки dist перед сборкой
 * @returns {Promise<string[]> | *}
 */
function clean() {
  return del([paths.dist]);
}
function cleanJsAndCss() {
  if (arg.production === 'true') {
    return del([
      './public/app.js',
      './public/app-min.js',
      './public/index.css',
    ]);
  }
}

/**
 * Инициализация веб-сервера browserSync
 * @param done
 */
function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: paths.dist,
    },
    host: 'localhost',
    port: 9000,
    logPrefix: 'log',
  });
  done();
}

/**
 * Функция перезагрузки страницы при разработке
 * @param done
 */
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

/**
 * Копирование шрифтов
 * @returns {*}
 */
function copyFonts() {
  return gulp.src([src.fonts + '/**/*']).pipe(gulp.dest(dist.fonts));
}

/**
 * Шаблонизация и склейка HTML
 * @returns {*}
 */
function htmlProcess() {
  return gulp
    .src(src.html + 'index.html')
    .pipe(
      posthtml([
        include({ encoding: 'utf8' }),
        expressions(),
        richtypo({
          attribute: 'data-typo',
          rules: [quotes, sectionSigns, shortWords],
        }),
        removeAttributes([
          // The only non-array argument is also possible
          'data-typo',
        ]),
      ]),
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist.html));
}



/**
 * Копирование картинок в dist или оптимизация при финишной сборке
 * @returns {*}
 */
function imgProcess() {
  return gulp
    .src(src.img + '**/*')
    .pipe(changed(dist.img))
    .pipe(gulp.dest(dist.img));
}

/**
 * Склейка и обработка scss файлов
 * @returns {*}
 */
function scssProcess() {
  const plugins = [autoprefixer({ grid: true }), cssnano()];

  return gulp
    .src([src.scss + 'index.scss'])
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(prettier())
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist.css));
}


/**
 * Работа с пользовательским js (Либы)
 * @returns {*}
 */
function jsProcess_libs() {
  return gulp
    .src('./src/js/libs/*')
    .pipe(changed('./public/js/libs/'))
    .pipe(gulp.dest('./public/js/libs/'));
}
/**
 * Работа с пользовательским js (Главная страница)
 * @returns {*}
 */
function jsProcess() {
  return gulp
    .src(src.js + 'app.js')
    .pipe(
      filejsInclude({
        extensions: 'js',
        hardFail: true,
        separateInputs: true,
        includePaths: [__dirname + '/bower_components', __dirname + '/src/js'],
      }),
    )
    .pipe(prettier({ singleQuote: true }))
    .pipe(minify())
    .pipe(gulp.dest(dist.js));
}


// Inline sources (Главная страница)
function inlineSource() {
  if (arg.production === 'true') {
    return gulp
      .src(dist.html.main + '**/index.html')
      .pipe(
        inlinesource({
          compress: false,
        }),
      )
      .pipe(gulp.dest(paths.dist))
      .pipe(browserSync.stream());
  }
}

/**
 * Наблюдение за изменениями в файлах
 */
function watchFiles() {
  gulp.watch(
    ['./src/pages/**/*.*'],
    gulp.series(
      htmlProcess,
      browserSyncReload,
    ),
  );

  gulp.watch(
    src.partials + '**/*.*',
    gulp.series(
      htmlProcess,
      browserSyncReload,
    ),
  );

  gulp.watch(
    './src/sass' + '/**/*.*',
    gulp.series(
      scssProcess,
      browserSyncReload,
    ),
  );

  gulp.watch(
    './src/js' + '/**/*.*',
    gulp.series(
      jsProcess,
      jsProcess_libs,
      browserSyncReload,
    ),
  );

  gulp.watch(
    './src/img' + '/**/*.*',
    gulp.series(
      imgProcess,
      browserSyncReload,
    ),
  );

  gulp.watch(src.fonts, gulp.series(copyFonts, browserSyncReload));
}

const build = gulp.series(
  clean,
  gulp.parallel(
    htmlProcess,

    jsProcess,
    jsProcess_libs,

    scssProcess,

    imgProcess,

    copyFonts,
  ),

  inlineSource,

  cleanJsAndCss,
);

const watch = gulp.parallel(build, watchFiles, browserSyncInit);

exports.build = build;
exports.default = watch;
