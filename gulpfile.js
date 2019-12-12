var gulp = require("gulp");
var concat = require("gulp-concat");

gulp.task("concat", function() {
    return gulp.src([
        "./dist/controllers/SettingsController.js",
        "./dist/controllers/AccountController.js",
        "./dist/controllers/TaskListController.js",
        "./dist/controllers/TimeTrackerController.js"
    ]).pipe(
        concat("Controllers.js")
    ).pipe(
        gulp.dest("./dist/controllers")
    );
});