'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
//	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-jsdoc');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner:
            '/* \n'+
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'+
            ' * \n'+
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n'+
            ' * License: <%= pkg.license %>\n'+
            ' * Homepage: <%= pkg.homepage %>\n'+
            ' * Source: <%= pkg.repository.url %>\n'+
            ' * \n'+
            ' */\n'
        },
        clean: {
            dist: {
                src: ['dist/*']
            },
            lib: {
                src: ['src/lib/*']
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
            files: ['src/*.js']//, '!src/file-excluded.js']
        },
        jsonlint: {
            i18n: {
                src: ['i18n/*.json']
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
        //'jshint'
    ]);
};
