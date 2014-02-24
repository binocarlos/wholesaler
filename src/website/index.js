/*
  Module dependencies.
*/

var express = require('express');
var Paypal = require('./paypal');
var Stripe = require('./stripe');
var Emailer = require('./emailer');

module.exports = function(options, digger){

	options = options || {};

	var app = express();

	var emailer = Emailer(options);

	function send_emails(data, done){
		emailer(data, function(error){
			done && done(error);
		})
	}
	
	var stripe = Stripe($digger, {
		key:options.stripe_secret_key
	})

	var paypal = PayPal($digger);

	stripe.on('email', send_emails);
	paypal.on('email', send_emails);

	app.use('/stripe/checkout', stripe.handler);
	app.use('/paypal/stash', paypal.stash);
	app.use('/paypal/ping', paypal.ping);

	return app;
}