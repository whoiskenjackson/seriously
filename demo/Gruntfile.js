module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	require('time-grunt')(grunt);

	/*
	 * grunt watch -env=dev
	 * grunt watch -env=website
	 * grunt watch -theme=theme-name
	 *
	 */

	var target = '';
	var option = '';

	var env = {
		dev: 'dev',
		website: 'website',
		theme: 'website/wp-content/themes'
	}

    if(grunt.option('env') || grunt.option('theme')) {
    	
    	// If grunt option is env, then set option to env, else set option to theme
    	option = grunt.option('env') ? 'env' : 'theme';

    	// Set the target
    	if (option === 'theme') {
    		target = env.theme+'/'+grunt.option(option);
    	} else {
    		target = grunt.option(option);
    	}

    }

	grunt.initConfig({
		// Project settings
        config: {
            // Configurable paths
            target: target
        },

		watch: {
			js: {
				files: ['/js/**/{,*/}*.js'],
				tasks: ['newer:jshint:dist'],
				options: {
					reload: true,
					nospawn: true
				}
			},

			css: {
				files: ['/css/**/{,*/}*.scss'],
				tasks: ['sass','newer:autoprefixer:dist'],
				options: {
					reload: true,
					nospawn: true
				}
			}
		},

		sass: {
			options: {
				style: 'expanded',
				sourcemap: 'none',
				precision: 7,
				lineNumbers: true,
				loadPath: '/css/',
				trace: true,
				update: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: '/css/',
					src: ['**/{,*/}*.scss'],
					dest: '/css/',
					ext: '.css'
				}]
			}
		},

		jshint: {
			options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            dist: {
				files: [{
					expand: true,
					cwd: '/js/',
					src: ['**/{,*/}*.js']
				}]
			}
		},

		autoprefixer: {
            dist: {
            	files: [{
	            	expand: true,
					cwd: '/css/',
					src: '**/{,*/}*.css',
					dest: '/css/'
				}]
            }
        },

        cssmin: {
        	options: {
        		report: 'gzip'
        	},
			dist: {
				files: [{
				expand: true,
					cwd: '/css/',
					src: ['**/{,*/}.css'],
					dest: '/css'
				}]
			}
		},

        uglify: {
			options: {
				compress: {
					drop_console: true
				},
				report: 'gzip'
			},
			dist: {
				files: [{
					expand: true,
					cwd: '/js/',
					src: '**/{,*/}*.js',
					dest: '/js',
					ext: '.min.js'
				}]
			}
        },

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 4
				},
				files: [{
					expand: true,
					cwd: '/images/',
					src: ['*.{png,jpg,gif}'],
					dest: '/images'
				}]
			}
		}

	});

	grunt.registerTask('default');
	grunt.registerTask('build', ['autoprefixer', 'cssmin', 'uglify', 'imagemin']);

};