module.exports = function(grunt) {
    var jndex = grunt.file.readJSON('jndex.json');

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
            constants: {
                src: ['src/*.js'],
                dest: ['build/'],
                replacements: (function() {
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
                            from: 'VENDOR_URI',
                            to: config.vendor_uri
                        }, {
                            from: /MODULE_PATH:([A-Za-z0-9_\-.]+)/g,
                            to: function(matched) { 
                                var module = matched.substring(12);
                                return config.requirejs_modules[module];
                            }
                        }
                    ];
                })()
            }

                /*{
                src: ['src/*.js'],
                dest: ['build/'],
                replacements: function() { 
                    //  "requirejs_modules": [
                    //      "jquery": "jquery/2.0.3/jquery.min.js",
                    //      "underscorejs": "underscore.js/1.5.1/underscore-min.js",
                    //      "backbonejs": "backbone.js/1.0.0/backbone-min.js",
                    //      "jquery.dateFormat": "jquery-dateFormat/1.0/jquery.dateFormat.min.js",
                    //      "requirejs": "require.js/2.1.8/require.min.js"
                    //  ]
                    return replacements;
                }
            }*/
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
            minify: {
                expand: true,
                flatten: true,
                cwd: 'build/',
                src: ['*.css'],
                dest: 'release/',
                ext: '.css'
            },
        },

        copy: {
            css: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['src/*.css'],
                    dest: 'build/'
                }]
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'src/*.js'],
            options: {
                ignores: ['src/bookmarklet.js']
            }
        },

        watch: {
            js: {
                files: 'src/*.js',
                tasks: ['jshint', 'replace'],
                options: {
                    interrupt: true
                }
            },
            css: {
                files: '*.css',
                tasks: ['copy'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');

    // Default task(s).
    grunt.registerTask('release', ['build', 'uglify', 'cssmin']);
    grunt.registerTask('build', ['jshint', 'replace', 'copy']);
    grunt.registerTask('default', ['build', 'watch']);
};
