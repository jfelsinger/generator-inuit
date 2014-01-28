'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var InuitGenerator = module.exports = function InuitGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(InuitGenerator, yeoman.generators.Base);

InuitGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [
        {
            type: 'list',
            name: 'framework',
            message: 'Include MV* Framework?',
            choices: [
                {
                    name: 'None',
                    value: 'noFramework'
                },
                {
                    name: 'Knockout',
                    value: 'framworkKnockout'
                },
                {
                    name: 'Angular',
                    value: 'frameworkAngular'
                }
            ],
            default: 0,
        },

        {
            type: 'confirm',
            name: 'require',
            message: 'Include Requirejs?',
            default: false,
        }
    ];

    this.prompt(prompts, function (props) {
        this.framework = props.framework;
        this.require = props.require;

        cb();
    }.bind(this));
};

InuitGenerator.prototype.appBase = function appBase() {
    this.directory('app', 'app');
}

InuitGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.mkdir('app/images');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_Gruntfile.js', 'Gruntfile.js');
};

InuitGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
