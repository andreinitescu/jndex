//var build_dir = 'node_modules/rendr';
//var javascript_files = ['jndex.js', 'loader.js', 'main.js'];

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //handlebars: {
    //  compile: {
    //    options: {
    //      namespace: false,
    //      commonjs: true,
    //      processName: function(filename) {
    //        return filename.replace('app/templates/', '').replace('.hbs', '');
    //      }
    //    },
    //    src: "app/templates/**/*.hbs",
    //    dest: "app/templates/compiledTemplates.js",
    //    filter: function(filepath) {
    //      var filename = path.basename(filepath);
    //      // Exclude files that begin with '__' from being sent to the client,
    //      // i.e. __layout.hbs.
    //      return filename.slice(0, 2) !== '__';
    //    }
    //  }
    //},
    
    uglify: {
        my_targets: {
            files: {
                "build/jndex.js": "jndex.js",
                "build/loader.js": "loader.js",
                "build/main.js": "main.js",
                "build/bookmarklet.js": "bookmarklet.js"
            }
        }
    },

    cssmin: {
        minify: {
            expand: true,
            cwd: './',
            src: ['*.css'],
            dest: 'build/',
            ext: '.css'
        },
    },

    watch: {
      uglify: {
        files: '*.js',
        tasks: ['uglify'],
        options: {
          interrupt: true
        }
      },
      cssmin: {
          files: '*.css',
          tasks: ['cssmin'],
          options: {
              interrupt: true
          }
      }
    }
  });

  //grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin', 'watch']);
};
