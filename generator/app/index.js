var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

	initialize: function () {
		console.log(this.yeoman);
	},

	prompting: function () {

		var done = this.async();
		
		var initPrompts = [
			{
				type    : 'input',
				name    : 'projectName',
				message : 'Project Name',
			},
			{
				type    : 'input',
				name    : 'projectDescription',
				message : 'Project Description',
			},
			{
				type    : 'confirm',
				name    : 'projectType',
				message : 'Do you want to use WordPress'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'input',
				name    : 'wpDomain',
				message : 'Development Domain'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'input',
				name    : 'dbUser',
				message : 'Database Username'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'password',
				name    : 'dbPass',
				message : 'Database Password'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'input',
				name    : 'dbHost',
				message : 'MySQL Hostname'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'input',
				name    : 'wpUser',
				message : 'WordPress Username'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'password',
				name    : 'wpPass',
				message : 'WordPress Password'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'input',
				name    : 'authorName',
				message : 'Author Name'
			},
			{
				when    : function(responses) { return responses.projectType; },
				type    : 'input',
				name    : 'authorUrl',
				message : 'Author URL'
			},
			{
				type    : 'confirm',
				name    : 'cherryPick',
				message : 'Do you want to Cherry Pick your JS?'
			},
			{
				when    : function(responses) { return responses.cherryPick; },
				type    : 'checkbox',
				name    : 'jsArray',
				message : 'Choose your JS',
				choices : ['handlebars', 'lodash', 'require']
			}
		];
		
		this.prompt(initPrompts, function (props) {

            this.projectName = props.projectName;
            
            // Create Project Slug by replacing spaces with dashes.
            this.projectSlug = this.projectName.toLowerCase();
            this.projectSlug = this.projectSlug.replace(/(^\s+|[^a-zA-Z0-9 ]+|\s+$)/g,"");   //this one
    		this.projectSlug = this.projectSlug.replace(/\s+/g, "-");
            
            this.projectDescription = props.projectDescription;
            this.wordpress = props.projectType;
            this.cherryPick = props.cherryPick;
            this.jsArray = props.jsArray;
            this.projectType = props.projectType ? "wordpress" : "static";

            if(this.wordpress) {

            	this.dbUser = props.dbUser;
            	this.dbPass = props.dbPass;
            	this.dbHost = props.dbHost;
            	this.wpUser = props.wpUser;
            	this.wpPass = props.wpPass;
            	this.wpDomain = props.wpDomain;
            	this.authorName = props.authorName;
            	this.authorUrl = props.authorUrl;

            }

            done();

        }.bind(this));

	},

	writing: {

		setupEnv: function () {
			this.mkdir('docs');
			this.mkdir('design');
			this.mkdir('dev');
			this.mkdir('database');
		},

		copyDocs: function () {

			var context = {
				projectName: this.projectName,
				authorName: this.authorName,
				authorUrl: this.authorUrl,
				wpDomain: this.wpDomain,
				wpUser: this.wpUser,
				wpPass: this.wpPass,
				dbName: this.dbName,
				dbUser: this.dbUser,
				dbPass: this.dbPass,
				dbHost: this.dbHost
			}

			this.copy("readme/_README.md", "README.md");
			this.copy("package/_package.json", "package.json");
			this.copy("gruntfile/_Gruntfile.js", "Gruntfile.js");
			this.template("docs/_info.txt", "docs/info.txt", context);

		},

		copyProject: function () {

			var wordpress = {
				"base": "website/wp-content",
				"themes": "themes",
				"plugins": "plugins"
			}

			var static = {
				"base": "website"
			}

			var i = 0;
			var jsLength = this.jsArray.length;

			this.directory(''+this.projectType+'','website');

			if(this.wordpress) {
				this.directory('theme',''+wordpress.base+'/'+wordpress.themes+'/'+this.projectSlug+'');
				this.directory('plugins',''+wordpress.base+'/'+wordpress.plugins+'');
				this.directory('javascript/scripts',''+wordpress.base+'/'+wordpress.themes+'/'+this.projectSlug+'/js');
			
				if(this.cherryPick){
					for(i; i < jsLength; i++) {
						var choice = this.jsArray[i];
						this.directory('javascript/'+choice+'',''+wordpress.base+'/'+wordpress.themes+'/'+this.projectSlug+'/js');
					}
				}

			} else {

				this.directory('javascript/scripts',''+static.base+'/js');

				if(this.cherryPick){
					for(i; i < jsLength; i++) {
						var choice = this.jsArray[i];
						this.directory('javascript/'+choice+'',''+static.base+'/js');
					}
				}

			}
		
		},

	},

	install: function () {
		this.npmInstall();
	}

});