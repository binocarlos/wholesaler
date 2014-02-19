wholesaler
==========

Digger based app for running online shops

## installation

```
$ npm install wholesaler
```

## usage

```js
var wholesaler = require('wholesaler');

var shop = wholesaler({
	// options
})

var app = shop.express();

app.listen(80, function(){
	console.log('app listening on port 80');
})
```

## options

the options you MUST pass to a new wholesaler:

 
 * BASE_DOMAIN - the base domain - requests are redirected to this for ssl and seo
 * DOCUMENT_ROOT - the folder where the website .html files live
 * ADMIN_USERNAME - the admin panel username
 * ADMIN_PASSWORD - the admin panel password
 * ADMIN_EMAILS - the emails to send status updates to - array or split by space, newline
 * MONGO_ADDR | process.env.MONGO_PORT_27017_TCP_ADDR - the mongo host, read from env if option is blank
 * MONGO_PORT | process.env.MONGO_PORT_27017_TCP_PORT - the mongo port, read from env if option is blank
 * MONGO_DATABASE - the mongo database to write to
 * MAILGUN_KEY | MAILGUN_KEY - the api key for mailgun
 * MAILGUN_DOMAIN | MAILGUN_DOMAIN - the domain for mailgun
 * RECAPTCHA_PUBLIC_KEY - the public key for the recaptcha api
 * RECAPTCHA_PRIVATE_KEY - the private key for the recaptcha api
 * PAYPAL_EMAIL - the paypal shop to buy from
 * PAYPAL_IPN - the URL for the paypal servers to post to
 * STRIPE_SECRET_KEY - the secret api key for stripe
 * STRIPE_PUBLISH_KEY - the publish api key for stripe

the options you CAN pass to a new wholesaler:

 * SHOP_NAME - the name of the shop
 * FORCE_SSL - whether to force requests onto https://$base_domain
 * FORCE_DOMAIN - whether to force requests onto the BASE_DOMAIN
 * PAYPAL_LIVE - whether to pay the sandbox or live system
 * CONTACT_URL - the contact page url for re-rendering
 * CONTACT_THANKS_URL - the contact page url for re-rendering
 * ADMIN_EMAIL - the email that emails are sent from

## routes

These routes are how to use wholesaler from your web-app:


## events

these events are emitted by the wholesaler object you create:

## website

gives you a chance to setup routes on the website app

```js
var shop = wholesaler({
	// options
})

shop.on('website', function(app){
	app.get('/info', function(req, res){
		// handle route
	})
})
```

## admin

gives you a chance to setup routes on the admin app

```js
var shop = wholesaler({
	// options
})

shop.on('admin', function(app){
	app.get('/info', function(req, res){
		// handle route
	})
})
```

## license

MIT