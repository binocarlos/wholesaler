var Stripe = require('stripe');
var Emailer = require('./emailer');
var async = require('async');
var EventEmitter = require('events').EventEmitter;

module.exports = function(options, $digger){

	var stripe = Stripe(options.STRIPE_SECRET_KEY);
	var emailer = Emailer(options, $digger);
	var orders = $digger.connect('/orders');

	var api = new EventEmitter();

	api.payment = function(order, done){

		if(!order){
			return done('error no stripe data');
		}

		var objs = {};

		async.series([

			function(next){
				stripe.customers.create({
		  		email: order.stripe.email
				}).then(function(customer) {
					objs.customer = customer;
					next();
				}, next);

			},

			function(next){

				stripe.customers.createCard(
				  objs.customer.id,
				  {card: order.stripe.id},
				  function(err, card) {
				    if(err){
				    	return next(err);
				    }
				    objs.card = card;
				    next();
				  }
				);
			},

			function(next){

				var charge_details = {
				  amount: Math.ceil(order.amount*100),
				  currency: "gbp",
				  card: objs.card.id,
				  customer: objs.customer.id,
				  description: order.desc
				}
				stripe.charges.create(charge_details).then(function(charge){

					objs.charge = charge;
					next();

				}, next)

			},

			function(next){

				try{
					var container = $digger.create('order', {
						name:order.stripe.email + ' - ' + order.amount,
						customer:order.stripe.card.name,
						stripe_customer:objs.customer,
						email:order.stripe.email,
						order:order,
						payment:objs.charge
					}).addClass('stripe').addClass('new')

				} catch(e){
					next(e);
					return;
				}

				
				
				orders.append(container).ship(function(){

					self.emit('email', {
						notes:container.attr('order.notes'),
						amount:container.attr('order.amount'),
						paymentid:container.attr('payment.id'),
						address:container.attr('order.cart.settings.address'),
						email:container.attr('email')
					})

					objs.container = container;

					next();
				})
			}
		], done)
	}

	api.handler = function(req, res){

		api.payment(req.body, function(error, container){

			if(error){
				res.statusCode = 500;
				res.send(error.toString());
			}
			else{
				res.json({
					ok:true
				});
			}
		})
	}

	return api;
}