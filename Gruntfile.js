module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: 'private/sass/*.scss',
                tasks: ['sass'],
                options: {
                    atBegin: true
                }
                // options: {
                //     livereload: true
                // }
            },
            other: {
                files: ['views/*.html',  'Gruntfile.js', 'package.json'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            css: {
                files: 'public/styles/*.css',
                options: {
                    livereload: true,
                    atBegin: true
                }
            }
            // concat: {
            //     files: 'private/js/*.js',
            //     tasks: ['concat']
            // },
            // uglify: {
            //     // files: 'bin/<%= pkg.name %>.js',
            //     files: 'main/js/main.js',
            //     tasks: ['uglify']
            // }
        },
        // concat: {
        //     options: {
        //         separator: "\n\n"
        //     },
        //     dist: {
        //         src: ['bower_components/bower-angularjs/angular.min.js', 'private/js/main.js'],
        //         // dest: 'bin/<%= pkg.name %>.js'
        //         dest: 'main/js/main.js'
        //     }
        // },
        // uglify: {
        //     my_target: {
        //         files: {
        //             'main/js/main.min.js': ['main/js/main.js']
        //         },
        //         options: {
        //             sourceMap: true
        //             // sourceMapName: 'path/'
        //         }
        //     }
        // },
        sass: {
            dist: {
                files: {
                    'public/styles/lobby.css': 'private/sass/lobby.scss',
                    'public/styles/table.css': 'private/sass/table.scss'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //tasks
    // grunt.registerTask('default', ['concat','uglify', 'watch']);
    grunt.registerTask('default', ['watch']);
};