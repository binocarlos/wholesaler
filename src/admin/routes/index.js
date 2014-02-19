/*
  Module dependencies.
*/

var Pages = require('./pages');
var ecstatic = require('ecstatic');
var path = require('path');

module.exports = function(app, options){

	var home = Pages.home(options);
	app.get('/', home);
	app.get('/index.html', home);

	app.get('/orders', Pages.orders(options));
	

	app.use(app.router);

	app.use('/app', ecstatic({
		root:path.normalize(__dirname + '/../app')
	}))

	app.use(ecstatic({
		root:path.normalize(__dirname + '/../www')
	}))
}