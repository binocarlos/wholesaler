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

the options for a new wholesaler:

 * shop_name - the name of the shop
 * shop_url - the base url of the shop
 * admin_username - the admin panel username
 * admin_password - the admin panel password
 * admin_emails - the admin emails to copy purchase updates to - array or split by space, newline
 * admin_email - the email address the purchase updates are sent from
 * mongo_host - the mongo host, read from env if option is blank (quarry mode)
 * mongo_port - the mongo port, read from env if option is blank (quarry mode)
 * mongo_database - the mongo database to write to
 * mailgun_key - the api key for mailgun
 * mailgun_domain - the domain for mailgun
 * paypal_email - the paypal shop to buy from
 * paypal_link - the paypal store url to buy from (sandbox or live)
 * paypal_ipn - the URL for the paypal servers to post to
 * stripe_secret_key - the secret api key for stripe
 * stripe_publish_key - the publish api key for stripe

## license

MIT