var Digger = require('./digger');
var App = require('./app');
var AdminApp = require('./admin/app');
var EventEmitter = require('events').EventEmitter;

var envs = {
	'BASE_DOMAIN':true,
	'ADMIN_USERNAME':true,
	'ADMIN_PASSWORD':true,
	'ADMIN_EMAILS':true,
	'DOCUMENT_ROOT':true,
	'RECAPTCHA_PUBLIC_KEY':true,
	'RECAPTCHA_PRIVATE_KEY':true,
	'PAYPAL_EMAIL':true,
	'PAYPAL_IPN':true,
	'PAYPAL_LIVE':false,
	'STRIPE_SECRET_KEY':true,
	'STRIPE_PUBLISH_KEY':true,
	'MAILGUN_KEY':true,
	'MAILGUN_DOMAIN':true,
	'MONGO_ADDR':true,
	'MONGO_PORT':true,
	'MONGO_DATABASE':true,
	'FORCE_SSL':false,
	'DEV_SSL':false
}

function slurp_env(opts){
	opts = opts || {};

	Object.keys(envs || {}).forEach(function(prop){
		if(process.env.hasOwnProperty(prop)){
			opts[prop] = process.env[prop];	
		}
	})

	return opts;
}

function check_options(options){
	options = options || {};
	Object.keys(envs || {}).forEach(function(prop){
		if(!options.hasOwnProperty(prop)){
			throw new Error(prop + ' required');
		}
	})
}

module.exports = function(options, slurp){

	if(typeof(options)=='boolean'){
		slurp = options;
		options = {};
	}

	options = options || {};

	if(slurp){
		options = slurp_env(options);
	}

	check_options(options);

	var shop = new EventEmitter();

	shop.build = function(done){

		var digger = Digger(options);
		var app = App(options, digger);
		var adminapp = AdminApp(options, digger);

		function router(req, res){
			if((req.headers['host'] || '').match(/admin\./)){
				adminapp(req, res);
			}
			else{
				app(req, res);
			}
		}

		shop.emit('app', app);
		shop.emit('admin', adminapp);

		shop.router = router;

		done && done(shop.router);
	}

	return shop;
}