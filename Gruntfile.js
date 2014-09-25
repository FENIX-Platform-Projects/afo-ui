'use strict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-jsonlint');
grunt.loadNpmTasks('grunt-jsdoc');
grunt.loadNpmTasks('grunt-exec');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner:
            '/* \n'+
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n'+
            ' * \n'+
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %> \n'+
            ' * \n'+
            ' * Licensed under the <%= pkg.license %> license. \n'+
            ' * \n'+
            ' * Homepage: \n'+
            ' * <%= pkg.homepage %> \n'+
            ' * \n'+
            ' * Source: \n'+
            ' * <%= pkg.repository.url %> \n'+
            ' * \n'+
            ' */\n'
        },
        clean: {
            dist: {
                src: ['dist/*']
            },
            docs: {
                src: ['docs/*']
            }     
        },
        jshint: {
            options: {
                globals: {
                    console: true,
                    module: true
                },
                "-W099": true, //ignora tabs e space warning
                "-W033": true
            },
            files: ['src/*']//, '!src/file-excluded.js']
        },
        jsonlint: {
            sample: {
                src: ['i18n/*.json']
            }
        },
        copy: {
            i18n: {
                nonull: true,
                expand: true,
                cwd: 'i18n/',
                src: '*.json',
                dest: 'dist/i18n/',
                flatten: true,
                filter: 'isFile',
            },
            jquery: {
                nonull: true,
                src: 'node_modules/jquery/dist/jquery.min.js',
                dest: 'src/lib/jquery.js'
            },
            backbone: {
                nonull: true,
                src: 'node_modules/backbone/backbone-min.js',
                dest: 'src/lib/backbone.js'
            },
            "backbone.layoutmanager": {
                nonull: true,
                src: "node_modules/backbone.layoutmanager/backbone.layoutmanager.js",
                dest: "src/lib/backbone.layoutmanager.js"
            },
            bootstrap_js: {
                nonull: true,
                src: "node_modules/bootstrap/dist/js/bootstrap.min.js",
                dest: 'src/lib/bootstrap.js'
            },
            bootstrap_css: {
                nonull: true,
                src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
                dest: "src/css/lib/bootstrap.css"
            },
            nprogress_js: {
                nonull: true,
                src: "node_modules/nprogress/nprogress.js",
                dest: "src/lib/nprogress.js"
            },
            nprogress_css: {
                nonull: true,
                src: "node_modules/nprogress/nprogress.css",
                dest: "src/css/lib/nprogress.css"
            },
            requirejs: {
                nonull: true,
                src: "node_modules/requirejs/require.js",
                dest: "src/lib/require.js"
            },
            underscore: {
                nonull: true,
                src: "node_modules/underscore/underscore-min.js",
                dest: "src/lib/underscore.js"
            }            
        },
        concat: {
            options: {
                separator: ';\n',
                stripBanners: {
                    block: true
                }
            },
            lib: {

            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            mix: {
                files: {
                    'dist/mix.min.js': ['<%= concat.mix.dest %>']
                }
            }
        },
        cssmin: {
            combine: {
                src: [
                    'src/css/lib/bootstrap.css',
                    /* ... */
                    ],
                dest: 'dist/css/main.css'
            },
            minify: {
                expand: true,
                cwd: 'dist/css/',
                src: '<%= cssmin.combine.dest %>'
                //,dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.css'
            }
        },
        jsdoc: {
            dist: {
                src: ["src/*.js"],
                options: {
                    destination: 'docs'
                }
            }
        }
    });

    grunt.registerTask('docs', [
        'clean:docs',
        'jsdoc'
    ]);

    grunt.registerTask('default', [
        'clean',
        'jsonlint',
        'copy',
        //'jshint',
        'concat',
        //'cssmin',        
        //'uglify'
    ]);
};