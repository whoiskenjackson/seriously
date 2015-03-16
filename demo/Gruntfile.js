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
				files: ['<%= config.target %>/js/**/{,*/}*.js'],
				tasks: ['newer:jshint:dist'],
				options: {
					reload: true,
					nospawn: true
				}
			},

			css: {
				files: ['<%= config.target %>/css/**/{,*/}*.scss'],
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
				loadPath: '<%= config.target %>/css/',
				trace: true,
				update: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.target %>/css/',
					src: ['**/{,*/}*.scss'],
					dest: '<%= config.target %>/css/',
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
					cwd: '<%= config.target %>/js/something',
					src: ['**/{,*/}*.js']
				}]
			}
		},

		autoprefixer: {
            dist: {
            	files: [{
	            	expand: true,
					cwd: '<%= config.target %>/css/',
					src: '**/{,*/}*.css',
					dest: '<%= config.target %>/css/'
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
					cwd: '<%= config.target %>/css/',
					src: ['**/{,*/}.css'],
					dest: '<%= config.target %>/css'
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
					cwd: '<%= config.target %>/js/',
					src: '**/{,*/}*.js',
					dest: '<%= config.target %>/js',
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
					cwd: '<%= config.target %>/images/',
					src: ['*.{png,jpg,gif}'],
					dest: '<%= config.target %>/images'
				}]
			}
		}

	});

	grunt.registerTask('default');
	grunt.registerTask('build', ['autoprefixer', 'cssmin', 'uglify', 'imagemin']);

};