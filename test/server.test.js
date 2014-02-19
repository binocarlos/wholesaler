var Wholesaler = require('../src');

describe('server', function(){

	it('should be a function', function(){

		Wholesaler.should.be.type('function');

	})

	it('should throw without options', function(){
		(function(){
		  var shop = Wholesaler();
		}).should.throw();
	})

	it('should not throw with options', function(){
		(function(){
		  var shop = Wholesaler({
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
		  });
		}).should.not.throw();
	})

})