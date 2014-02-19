module.exports = {
	home:function(options){
		return function home(req, res, next){
			res.render('pages/home', {
				page:'home',
				pretty:true
			})
		}
	},
	orders:function(options){
		return function orders(req, res, next){
			res.render('pages/orders', {
				page:'orders',
				pretty:true
			})
		}
	}
}