/*
  Module dependencies.
*/

var ecstatic = require('ecstatic');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var url = require('url');

module.exports = function(options, $digger, vars){

	vars = vars || {};

	var document_root = options.DOCUMENT_ROOT;
	var recaptcha_public_key = options.RECAPTCHA_PUBLIC_KEY;

	var fileserver = ecstatic({
		root:path.normalize(__dirname + '/../www')
	})

	function render_html_page(filepath, req, res, params){
		if(!filepath.match(/\./)){
			filepath += '.html';
		}

		fs.stat(path.normalize(document_root + filepath), function(error, stat){
			if(!error && stat){
				res.render(path.normalize(document_root + filepath), vars);
			}
			else{
				res.redirect('/');
			}
		})	
	}

	function home_page(req, res){
		render_html_page('/index.html', req, res);
	}

	return {
		home:home_page,
		middleware:function(req, res, next){
			res.renderhtml = function(filepath, data){
				if(!filepath.match(/\.html/)){
					filepath += '.html';
				}
				data = data || {};
				data.recaptcha_public_key = recaptcha_public_key;
				res.render(path.normalize(document_root + filepath), data);
			}

			next();
		},
		serve:function(req, res, next){
			if(req.url.match(/\.html?$/)){
				render_html_page(url.parse(req.url).pathname, req, res);
			}
			else{
				fileserver(req, res, function(){
					render_html_page(url.parse(req.url).pathname, req, res);
				});
			}
		}
	}
}