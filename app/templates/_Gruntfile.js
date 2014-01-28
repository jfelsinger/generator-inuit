'use strict';
var LIVERELOAD_PORT = 4500;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Configuration
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%%= yeoman.dist %>/*',
                        '!<%% yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        sass: {
            options: {
                style: 'compressed'
                // sourcemap: true
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/styles',
                    src: ['*.scss', '*.sass'],
                    dest: '<%%= yeoman.app %>/styles',
                    ext: '.css'
                }]
            },

            server: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/styles',
                    src: ['*.scss', '*.sass'],
                    dest: '<%%= yeoman.app %>/styles',
                    ext: '.css'
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                // reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%%= connect.options.port %>/index.html']
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%%= yeoman.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%%= yeoman.dist %>/images'
                }]
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/main.css',
                        '<%%= yeoman.app %>/styles/main.css'
                    ]
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%%= yeoman.app %>',
                        dest: '<%%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'images/{,*/}*.{webp,gif}',
                            'styles/fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%%= yeoman.dist %>/images',
                        src: [
                            'generatred/*'
                        ]
                    }
                ]
            },

            inuit: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/inuit/',
                    src: './**',
                    dest: 'bower_components/inuit-template/css/inuit.css/',
                }, {
                    expand: true,
                    cwd: 'bower_components/inuit-template/css/',
                    src: './**',
                    dest: '<%%= yeoman.app %>/styles/inuit',
                }]
            },
        },

        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    cleanBowerDir: false,
                }
            }
        },

        connect: {
            options: {
                ports: 8020,
                hostname: 'localhost',
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            }
        },

        watch: {
            styles: {
                files: ['<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server']
            },

            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%%= yeoman.app %>/*.html',
                    '{.tmp <%%= yeoman.app %>/styles/{,*/}*.css',
                    '{.tmp <%%= yeoman.app %>/scripts/{,*/}*.js',
                    '{.tmp <%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        concurrent: {
            server: [
                'sass:server',
            ],

            dist: [
                'sass:dist',
                'imagemin',
                'svgmin',
                'htmlmin'
            ],
        },
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:inuit',
        'concurrent:dist',
        'cssmin',
        'copy:dist',
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);

    grunt.registerTask('serve', [
        'clean:server',
        'concurrent:server',
        'connect:livereload',
        'watch'
    ]);
};
