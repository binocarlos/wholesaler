module.exports = function(options, $digger){

	var mailgun = $digger.connect('/email');

	options = options || {};

	var admin_emails = options.ADMIN_EMAILS;
	var shop_name = options.SHOP_NAME || '';
	var base_url = options.BASE_URL;
	var admin_email = options.ADMIN_EMAIL || 'admin@wholesaler.digger.io'

	return function(settings, done){


		var email_content = [
			
			'Your ' + shop_name + ' order has been recieved:',
			'',
			'ORDER DETAILS',
			settings.notes,
			'',
			'£' + Math.round(settings.amount*100)/100,
			'',
			'payment id: ' + settings.paymentid,
			'customer email: ' + settings.email,
			'',
			'-------------------------------------------',
			'Your reciept will be emailed to you shortly and your order will be shipped to you soon after.',
			''
			
		]

		var address = settings.address || null;

		if(address){

			var customer_name= address.name;
			email_content.unshift('Hi  ' + customer_name);

			['line1', 'line2', 'city', 'state', 'zip', 'country', 'notes'].forEach(function(field){
				email_content.push('address ' + field + ': ' + address[field])
			})	
		}

		email_content.push('',
							'Thank you',
							'Please feel free to contact the ' + shop_name + ' team for any enquiry',
							'',
							base_url

							)


		var email_body = email_content.join("\n");

		var arr = [].concat(admin_emails);

		if((settings.email || '').match(/\@/)){
			arr.push(settings.email);
		}

		arr.forEach(function(to){

			if(!to){
				return;
			}

			to = to.replace(/[\n\r]+/g, '');

			var container = $digger.create('email', {
				from:admin_email,
				to:to,
				subject:'Thank you for your ' + shop_name + ' order',
				body:email_body
			})

			mailgun
				.append(container)
				.error(function(error){
					console.log('-------------------------------------------');
					console.log(to);
					console.log('email error');
					console.dir(error);
				})
				.ship();

		})

		done();
	}
}