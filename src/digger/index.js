/*
  Module dependencies.
*/

var Stack = require('digger-stack');
var Mongo = require('digger-mongo');
var Static = require('digger-static');
var Mailgun = require('digger-mailgun');

module.exports = function(config){

	config = config || {};

	var mongo_hostname = config.MONGO_ADDR || process.env.MONGO_PORT_27017_TCP_ADDR;
	var mongo_port = config.MONGO_PORT || process.env.MONGO_PORT_27017_TCP_PORT;

	// reception stack
	return new Stack({
		router:require('./router')(config),
		suppliers:{
			'/config':Static({
				folder:__dirname + '/config'
			}),
			'/email':Mailgun({
				apikey:config.MAILGUN_KEY || process.env.MAILGUN_KEY,
				domain:config.MAILGUN_DOMAIN || process.env.MAILGUN_DOMAIN
			}),
			'/orders':Mongo({
				database:config.MONGO_DATABASE,
				collection:'orders',
				hostname:mongo_hostname,
				port:mongo_port
			}),
			'/stash':Mongo({
				database:config.MONGO_DATABASE,
				collection:'stash',
				hostname:mongo_hostname,
				port:mongo_port
			})
		}
	});

}