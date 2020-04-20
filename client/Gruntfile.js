module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // grunt uglify
    uglify: {
      build: {
        src: 'js/script.js',
        dest: 'js/script.min.js'
      }
    },
    // grunt-contrib-cssmin
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: 'css/',
          ext: '.min.css'
        }]
      }
    },
    // grunt-contrib-watch v1.1.0
    watch: {
      all: {
        files: ['scss/*.scss','css/*.css', 'js/script.js'],
        tasks: ['sass','csslint','jshint'],
        options: {
          livereload: true
        }
      },
    },
    // grunt-contrib-csslint v2.0.0
    csslint: {
      lax: {
        options: {
          import: 2,
          ids: false,
          "universal-selector": false,
          "box-sizing": false,
          "known-properties": false,
          "box-model": false,
          "order-alphabetical": false
        },
        src: ['css/*.css','!*.min.css']//do not include min files
      }
    },
    // grunt-contrib-sass
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'css/style.css': 'scss/style.scss'    // 'destination': 'source'
        },
      },
    },
    // grunt-contrib-jshint
    jshint: {
      all: ['Gruntfile.js', 'js/script.js'],
      options: {
      'esversion': 6,
  },
    }
  });

  // Load the plugin that provides tasks.
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('ugly', ['cssmin'], ['uglify']);

};
