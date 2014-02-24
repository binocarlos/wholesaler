var Digger = require('./digger');
var App = require('./website');
var AdminApp = require('./admin/app');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var optionmap = {
	'shop_name':true,
	'admin_username':true,
	'admin_password':true,
	'admin_email':true,
	'admin_emails':true,
	'mongo_address':true,
	'mongo_port':true,
	'mongo_database':true,
	'mailgun_key':true,
	'mailgun_domain':true,
	'paypal_email':true,
	'paypal_link':true,
	'paypal_ipn':true,
	'stripe_secret_key':true,
	'stripe_publish_key':true
}

function check_options(options){
	options = options || {};
	Object.keys(optionmap || {}).forEach(function(prop){
		if(!options.hasOwnProperty(prop)){
			throw new Error(prop + ' required');
		}
	})
}

function Wholesaler(options){
	EventEmitter.call(this);

	
	this.digger = Digger(options);
	this.app = App(options, digger, shop);
	this.adminapp = AdminApp(options, digger, shop);
}

util.inherits(Wholesaler, EventEmitter);

module.exports = function(options){
	options = options || {};

	check_options(options);

	return new Wholesaler(options);
}

module.exports.class = Wholesaler;