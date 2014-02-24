var Textmail = require('textmail');

module.exports = function(options, $digger){

	options = options || {};

	var admin_email = options.admin_email;
	var admin_emails = options.admin_emails;
	var shop_name = options.shop_name;
	var base_url = options.shop_url;
	
	var mailer = Textmail({
		domain:options.mailgun_domain,
		key:options.mailgun_key,
		template_root:__dirname + '/email_templates'
	})

	var purchasemail = mailer.create('/purchase.ejs', 'Thank you for your ' + shop_name + ' order', admin_emails);

	return function(data, done){

		purchasemail(admin_email, data.email, data, done);
	}
}