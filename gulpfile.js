var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith');

gulp.task('sass', function(){
    gulp.src('app/sass/*.sass')
    .pipe(sass({outputStyle: "expanded"}))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function(){
    browserSync(
        {server:
         {baseDir:'app'},
         notify: false
        });
});

gulp.task('watch', ['browser-sync', 'sass'], function(){
    gulp.watch('app/sass/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('clear', function () {
	return cache.clearAll();
});

gulp.task('build', ['clean','img','sass'], function() {

	var buildCss = gulp.src([ // Переносим CSS стили в продакшен
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'));

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

    var buildFonts = gulp.src('app/fonts/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'));

});

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/sprite/*.png').pipe(spritesmith({
    imgName: 'icons.png',
    cssName: 'sprite.sass'
  }));
  return spriteData.pipe(gulp.dest('app/img'));
});

gulp.task('default', ['watch']);
