/*
  Module dependencies.
*/

var ecstatic = require('ecstatic');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var url = require('url');
var DiggerClient = require('../digger/client');
var ContactHandler = require('./contacthandler');
var Stripe = require('./stripe');
var PayPal = require('./paypal');
var Fileserver = require('./fileserver');

module.exports = function(app, options, digger){

	var client = DiggerClient(digger);
	var $digger = client.digger;

	//var shop_data = require('../../shopdata.json');

	var stripe = Stripe(options, $digger);
	var paypal = PayPal(options, $digger);
	var files = Fileserver(options, $digger, {
		recaptcha_public_key:options.RECAPTCHA_PUBLIC_KEY,
    form:{},
    settings:{
    	ssl_dir:options.FUNKYBOD_SSL_DIR,
    	force_ssl:options.FORCE_SSL=='yes' ? true : false,
    	paypal_link:options.PAYPAL_LINK,
    	paypal_business:options.PAYPAL_EMAIL,
    	paypal_ipn:options.PAYPAL_IPN,
    	stripe_publish_key:options.STRIPE_PUBLISH_KEY,
    	shop_data:shop_data
    }
	});

	function home_redirect(req, res, next){
		res.redirect('/');
	}

	function domain_redirect(req, res, next){
		if(!options.FORCE_DOMAIN){
			return next();
		}
		if(req.headers['host'] != options.FORCE_DOMAIN){
			var loc = (options.FORCE_SSL ? 'https://' : 'http://') + options.BASE_DOMAIN + url.parse(req.url).pathname + url.parse(req.url).search;
			res.redirect(loc);
		}
		else{
			next();
		}
	}

	app.use(domain_redirect);

	// setup custom render
	app.use(files.middleware)
	
	app.post('/contactsubmit', ContactHandler(options, $digger));

	app.post('/stripe_checkout', stripe.handler);

	app.use('/paypal_stash', paypal.stash);
	app.use('/paypal_ping', paypal.ping);

	app.get('/', files.home);

	app.get('/index', home_redirect);
	app.get('/index.html', home_redirect);

	app.use(app.router);
	app.use(files.serve);
}