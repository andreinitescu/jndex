module.exports = function(grunt) {
    var jndex = grunt.file.readJSON('jndex.json');
    var base64 = require('./src/base64.js');

    var replaceConstants = (function() {
        if (grunt.option('mode') == 'release') { 
            config = jndex.release;
        }
        else {
            config = jndex.build;
        }

        return [
            {
                from: 'BASE_URI',
                to: config.base_uri
            },{
                from: 'REQUIREJS_URI',
                to: config.requirejs_uri
            },{
                from: 'EXTERNAL_URI',
                to: config.external_uri
            },{
                from: 'RESOURCE_URI',
                to: config.resource_uri
            }, {
                from: /MODULE_PATH:([A-Za-z0-9_\-.]+)/g,
                to: function(matched) { 
                    var module = matched.substring(12);
                    return config.requirejs_modules[module];
                }
            }, {
                from: /SVG:([A-Za-z0-9_\-.]+)/g,
                to: function(matched) {
                    var file = matched.substring(4);
                    var contents = grunt.file.read('./resource/'+file);
                    return 'data:image/svg+xml;charset=utf-8;base64,' + base64.encode(contents);
                }
            }
        ];
    })();

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //handlebars: {
        //    compile: {
        //        options: {
        //            namespace: false,
        //            commonjs: true,
        //            processName: function(filename) {
        //                return filename.replace('app/templates/', '').replace('.hbs', '');
        //            }
        //        },
        //        src: "app/templates/**/*.hbs",
        //        dest: "app/templates/compiledTemplates.js",
        //        filter: function(filepath) {
        //            var filename = path.basename(filepath);
        //            // Exclude files that begin with '__' from being sent to the client,
        //            // i.e. __layout.hbs.
        //            return filename.slice(0, 2) !== '__';
        //        }
        //    }
        //},

        replace: {
            js: {
                src: ['src/*.js', '!src/base64.js'],
                dest: ['build/'],
                replacements: replaceConstants 
            }, 
            css: {
                src: ['build/*.css'],
                overwrite: true,
                replacements: replaceConstants 
            }

        },

        uglify: {
            my_targets: {
                files: {
                    "release/jndex.js": "build/jndex.js",
                    "release/loader.js": "build/loader.js",
                    "release/main.js": "build/main.js",
                    "release/bookmarklet.js": "build/bookmarklet.js"
                }
            }
        },

        cssmin: {
            //minify: {
            //    expand: true,
            //    flatten: true,
            //    cwd: 'build/',
            //    src: ['*.css'],
            //    dest: 'release/',
            //    ext: '.css'
            //},
            minify: {
                files: {
                    'release/jndex.css': ['build/jndex.css']
                }
            },
        },

        concat: {
            options: {
                separator: "\n",
            },
            dist: {
                src: ['src/*.css'],
                dest: 'build/jndex.css'
            }
        },

        //copy: {
        //    css: {
        //        files: [{
        //            expand: true,
        //            flatten: true,
        //            src: ['src/*.css'],
        //            dest: 'build/'
        //        }]
        //    }
        //},

        jshint: {
            all: ['Gruntfile.js', 'src/*.js', '!src/base64.js', '!src/bookmarklet.js'],
        },

        watch: {
            js: {
                files: ['src/*.js', 'Gruntfile.js', 'jndex.json'],
                tasks: ['jshint', 'replace:js'],
                options: {
                    interrupt: true
                }
            },
            css: {
                files: ['src/*.css', 'Gruntfile.js', 'jndex.json'],
                tasks: ['concat', 'replace:css'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('release', ['build', 'uglify', 'cssmin']);
    grunt.registerTask('build', ['jshint', 'concat', 'replace']);
    grunt.registerTask('default', ['build', 'watch']);
};
