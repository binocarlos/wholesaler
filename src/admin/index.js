/*
  Module dependencies.
*/

var express = require('express');
var basicAuth = require('basic-auth-connect');
var fs = require('fs');
var Routes = require('./routes');
var DiggerClient = require('../digger/client');

module.exports = function(options, digger){

	options = options || {};

	var app = express();

	var document_root = __dirname + '/www';
	var view_root = __dirname + '/views';

	app.engine('.jade', require('jade').__express);
	app.set('views', view_root);
	app.set('view engine', 'jade');

	var favico = fs.existsSync(document_root + '/favicon.ico') ? document_root + '/favicon.ico' : null;
	app.use(express.favicon(favico));
	app.use(express.query());
	app.use(express.json());
	app.use(express.urlencoded());

	
	/*
	
		app
		
	*/
	var client = DiggerClient(digger);
	var $digger = client.digger;

	var username = options.admin_username;
	var password = options.admin_password;

	if(!username || !password){
		console.error('admin_username && admin_password required');
		process.exit(1);
	}

	app.use(basicAuth(username, password));
	
	/*
	
		digger
		
	*/
	app.use('/api/v1', client.handler);

	/*

		routes

	 */
	Routes(app, options);


	return app;
}