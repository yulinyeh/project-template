module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    timestamp: '<%= new Date().getTime() / 1000000 >> 0 %>',
    jade: {
      dev: {
        options: {
          data: {
            debug: true
          },
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'Jade/partial',
          src: ['*.jade'],
          dest: 'Development',
          ext: '.html'
        }]
      },
      prod: {
        options: {
          data: {
            debug: false,
            timestamp: '<%= timestamp %>'
          },
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'Jade/partial',
          src: ['*.jade'],
          dest: 'Production',
          ext: '.html'
        }]
      }
    },
    compass: {
      dev: {
        options: {
          sourcemap: true,
          specify: 'Sass/main.sass', // banner 加註的檔案
          banner: '/*! Update: <%= new Date() %> */\n',
          noLineComments: true,
          outputStyle: 'expanded',
          sassDir: 'Sass',
          cssDir: 'Development/assets/stylesheets',
          environment: 'development'
        }
      },
      prod: {
        options: {
          noLineComments: true,
          outputStyle: 'compressed',
          sassDir: 'Sass',
          cssDir: 'Temp',
          environment: 'production'
        }
      }
    },
    concat: {
      dev: {
        src: [
          'Javascript/main.js'
        ],
        dest: 'Development/assets/javascripts/script.js'
      },
      prod: {
        files: {
          'Temp/script<%= timestamp %>.min.js': [
            'Temp/script.min.js'
          ],
          'Temp/style<%= timestamp %>.min.css': [
            'Temp/main.css'
          ],
          'Temp/hack-ie8<%= timestamp %>.min.css': ['Temp/hack-ie8.css']
        }
      }
    },
    uglify: {
      prod: {
        files: {
          'Temp/script.min.js': ['Development/assets/javascripts/script.js']
        }
      }
    },
    connect: {
      dev: {
        options: {
          hostname: '0.0.0.0',
          port: 8000,
          base: './',
          livereload: true
        }
      },
      prod: {
        options: {
          hostname: '0.0.0.0',
          port: 8000,
          base: './',
          livereload: false,
          keepalive: true
        }
      }
    },
    watch: {
      jade: {
        files: ['Jade/**/*.jade'],
        tasks: ['jade:dev']
      },
      sass: {
        files: ['Sass/**/*.sass'],
        tasks: ['compass:dev']
      },
      javascript: {
        files: ['Javascript/*.js'],
        tasks: ['concat:dev']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['Development/**/*']
      },
    },
    clean: {
      prod: ['Temp', 'Production']
    },
    copy: {
      prod: {
        files: [{
          expand: true,
          cwd: 'Development/assets/fonts/',
          dest: 'Production/assets/fonts/',
          src: ['**']
        }, {
          expand: true,
          cwd: 'Development/assets/images/',
          dest: 'Production/assets/images/',
          src: ['**']
        }, {
          expand: true,
          cwd: 'Development/assets/javascripts/',
          dest: 'Production/assets/javascripts/',
          src: ['html5shiv-printshiv.min.js']
        }, {
          expand: true,
          cwd: 'Temp/',
          dest: 'Production/assets/javascripts/',
          src: ['script<%= timestamp %>.min.js']
        }, {
          expand: true,
          cwd: 'Temp/',
          dest: 'Production/assets/stylesheets',
          src: ['style<%= timestamp %>.min.css']
        }, {
          expand: true,
          cwd: 'Development/',
          dest: 'Production/',
          src: ['*.txt', 'favicon.ico']
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jade:dev', 'compass:dev', 'concat:dev', 'connect:dev', 'watch']);
  grunt.registerTask('prod', ['clean:prod', 'jade:prod', 'compass:prod', 'uglify:prod', 'concat:prod', 'copy:prod', 'connect:prod']);
};
