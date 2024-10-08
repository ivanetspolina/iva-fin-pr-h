const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob')
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
// const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin')


gulp.task('clean', function(done){
    if(fs.existsSync('./dist')){
        return gulp.src('./dist/', {read: false})
        .pipe(clean({force: true}));
    }    
    done();
});

const plumberNotify = (title) =>{
    return{
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

gulp.task('html', function(){
    return gulp.src('./src/html/**/*.html')
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('sass',function(){
    return gulp.src('./src/css/*.scss')    
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    // .pipe(groupMedia())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./dist/css/'))
    
});

gulp.task('images', function() {
    return gulp.src('./src/img/**/*')
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest('./dist/img/'))
});

gulp.task('fonts', function(){
    return gulp.src('./src/fonts/**/*').pipe(gulp.dest('./dist/fonts/'))
});

gulp.task('server', function(){
    return gulp.src('./dist/').pipe(server(
        {
            livereload: true,
            open: true
        }))
});

gulp.task('watch', function(){
    gulp.watch('./src/css/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
});

gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('html', 'sass', 'images', 'fonts'), 
    gulp.parallel('server', 'watch')
));




