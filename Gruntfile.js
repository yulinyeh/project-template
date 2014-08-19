module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      dev: {
        options: {
          data: {
            debug: false
          },
          pretty: true
        },
        // files: {
        //   "Public/index.html": "Jade/partial/index.jade"
        // }
        files: [{
          expand: true,
          cwd: 'Jade/partial',
          src: ['*.jade'],
          dest: 'Public',
          ext: '.html'
        }]
      }
    },
    compass: {
      dev: {
        options: {
          noLineComments: true,
          outputStyle: 'expanded',
          sassDir: 'Sass',
          cssDir: 'Public/assets/stylesheets',
          environment: 'development'
        }
      }
    },
    concat: {
      dist: {
        src: [
          'Javascript/main.js'
        ],
        dest: 'Public/assets/javascripts/script.js',
      }
    },
    uglify: {
      my_target: {
        files: {
          'Public/assets/javascripts/script.min.js': ['Javascript/main.js']
        }
      }
    },
    connect: {
      server: {
        options: {
          hostname: '0.0.0.0',
          port: 8000,
          base: 'Public',
          livereload: true
        }
      }
    },
    watch: {
      jade: {
        files: ['Jade/**/*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['Sass/**/*.sass'],
        tasks: ['compass']
      },
      javascript: {
        files: ['Javascript/**/*.js'],
        tasks: ['concat']
      },
      // javascript: {
      //   files: ['Javascript/**/*.js'],
      //   tasks: ['uglify']
      // },
      livereload: {
        options: {
          livereload: true
        },
        files: ['Public/**/*']
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jade', 'compass', 'concat', 'connect', 'watch']);
  // grunt.registerTask('default', ['jade', 'compass', 'uglify', 'connect', 'watch']);
};
