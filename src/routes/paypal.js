var Emailer = require('./emailer');

module.exports = function(options, $digger){

	var emailer = Emailer(options, $digger);
	var mailgun = $digger.connect('/email');
	var orders = $digger.connect('/orders');
	var stashes = $digger.connect('/stash');

	return {
		stash:function(req, res){

			var stashcontainer = $digger.create('stash', {
				order:req.body
			}).addClass('paypal');

			stashcontainer.attr('name', 'paypalstash: ' + stashcontainer.diggerid());

			stashes.append(stashcontainer).ship(function(){
				res.json({
					ok:true,
					id:stashcontainer.diggerid()
				});
			})
		},

		ping:function(req, res){

			var data = req.body || {};

			if(!data.custom){
				res.send('not ok');
				return;
			}

			stashes('=' + data.custom).ship(function(sorder){
				if(sorder.count()>0){
					var container = sorder.clone();

					container.tag('order');
					container.addClass('new');

					container.attr('name', data.payer_email + ' - ' + container.attr('order.amount'));
					container.attr('email', data.payer_email);
					container.attr('payment', data);
					container.attr('customer', (data.firstname + ' ' + data.lastname));

					var email = {
						notes:container.attr('order.notes'),
						amount:container.attr('order.amount'),
						paymentid:container.attr('payment.txn_id'),
						address:container.attr('order.cart.settings.address'),
						email:container.attr('email')
					}

					orders.append(container).ship(function(){
						emailer(email, function(error){
							res.end('ok');
						})
					})
				}
				else{
					res.end('not found');
				}
			})
		}
	
	}

}