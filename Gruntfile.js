module.exports = function(grunt) {
  var mozjpeg = require('imagemin-mozjpeg');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
          dest: 'Prototype',
          ext: '.html'
        }]
      },
      prod: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'Jade/partial',
          src: ['*.jade'],
          dest: 'Prototype',
          ext: '.html'
        }]
      }
    },
    compass: {
      dev: {
        options: {
          sourcemap: true,
          noLineComments: true,
          outputStyle: 'expanded',
          sassDir: 'Sass',
          cssDir: 'Prototype/assets/stylesheets',
          imagesDir: "Prototype/assets/images",
          relativeAssets: true,
          environment: 'development',
          force: true,
          raw: 'Encoding.default_external = \'utf-8\'\n'
        }
      },
      prod: {
        options: {
          sourcemap: false,
          noLineComments: true,
          outputStyle: 'compressed',
          sassDir: 'Sass',
          cssDir: 'Prototype/assets/stylesheets',
          imagesDir: "Prototype/assets/images",
          relativeAssets: true,
          environment: 'production',
          force: true
        }
      }
    },
    concat: {
      dev: {
        src: [
          'Javascript/main.js'
        ],
        dest: 'Prototype/assets/javascripts/script.js'
      },
      prod: {
        files: {
          'Prototype/assets/stylesheets/style.min.css': [
            'Prototype/assets/stylesheets/style.css'
          ],
          'Prototype/assets/javascripts/script.min.js': [
            'Prototype/assets/javascripts/script.uglify.js'
          ]
        }
      }
    },
    uglify: {
      prod: {
        files: {
          'Prototype/assets/javascripts/script.uglify.js': [
            'Prototype/assets/javascripts/script.js'
          ]
        }
      }
    },
    connect: {
      dev: {
        options: {
          hostname: '0.0.0.0',
          port: 8000,
          base: './Prototype',
          livereload: true
        }
      },
      prod: {
        options: {
          hostname: '0.0.0.0',
          port: 8000,
          base: './Prototype',
          livereload: false,
          keepalive: true
        }
      }
    },
    imagemin: {
      mix: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{
            removeViewBox: false
          }],
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: '../../svn/trunk/designer/export/about/',
          dest: 'Prototype/assets/images/about/',
          src: ['**/*.{png,jpg,gif}']
        }, {
          'Prototype/favicon.ico': '../../svn/trunk/designer/export/favicon/jumpy_website_favicon_02.ico',
          'Prototype/favicon.png': '../../svn/trunk/designer/export/favicon/jumpy_website_favicon_02_32.png'
        }]
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
        files: ['Prototype/**/*']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['jade:dev', 'compass:dev', 'concat:dev', 'connect:dev', 'watch']);
  grunt.registerTask('prod', ['jade:prod', 'compass:prod', 'uglify:prod', 'concat:prod', 'connect:prod']);
  grunt.registerTask('img', ['imagemin']);
};
