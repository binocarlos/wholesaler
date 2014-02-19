var simple_recaptcha = require('simple-recaptcha');
var Busboy = require('busboy');

module.exports = function(options, $digger){

	if(!options.RECAPTCHA_PUBLIC_KEY){
		console.error('RECAPTCHA_PUBLIC_KEY var required');
		process.exit(1);
	}

	if(!options.RECAPTCHA_PRIVATE_KEY){
		console.error('RECAPTCHA_PRIVATE_KEY var required');
		process.exit(1);
	}

	if(!options.ADMIN_EMAILS){
		console.error('ADMIN_EMAILS var required');
		process.exit(1);	
	}

	var shop_name = options.SHOP_NAME || '';
	var contact_url = options.CONTACT_URL || '/contact.html';
	var contact_thanks_url = options.CONTACT_THANKS_URL || '/contact_thanks.html'
	var admin_email = options.ADMIN_EMAIL || 'admin@wholesaler.digger.io'

	var mailgun = $digger.connect('/email');

	return function(req, res){

		var privateKey = options.RECAPTCHA_PRIVATE_KEY;
	  var ip = req.ip;

	  var challenge = req.body.recaptcha_challenge_field;
	  var response = req.body.recaptcha_response_field;

	  function run_error(st){
	  	req.body.error = st;
	  	res.renderhtml(contact_url, {
	  		form:req.body
	  	});
	  }

	  if(!challenge || !response){
	  	run_error('Please fillout the captcha');
	  	return;
	  }

	  var error_string = null;

	  ['email', 'subject', 'message'].forEach(function(f){
	  	var val = req.body[f];

	  	if(!val){
	  		error_string = 'please enter a ' + f + ' string';
	  	}
	  })

	  if(error_string){
	  	run_error(error_string);
	  	return;
	  }

	  simple_recaptcha(privateKey, ip, challenge, response, function(err) {

	  	(admin_emails || []).forEach(function(email){

	  		var data = {
	  			from:req.body.email || admin_email,
	  			to:email,
	  			subject:req.body.subject || shop_name + ' contact form',
	  			body:req.body.message
	  		}

	  		Object.keys(data || {}).forEach(function(prop){
	  			data[prop] = data[prop].replace(/\r/g, '');
	  		})

	  		var container = $digger.create('email', data)

	  		mailgun.append(container).ship();
	  	})

	    if (err){
	    	run_error('The Captcha was entered incorrectly.  Please try again');
	    }
	    else{
	    	res.redirect(contact_thanks_url)
	    }
	  })

	}
	

}