/*
  Module dependencies.
*/

var SupplyChain = require('digger-supplychain');
var Bridge = require('digger-bridge');

// keep an eye on arriving digger clients
module.exports = function(digger){

	function proxy(diggerreq, reply){
		digger.reception(diggerreq, reply);
	}

	// server supply-chain
	var $digger = new SupplyChain();
	$digger.on('request', proxy);

	return {
		digger:$digger,
		handler:Bridge(proxy)
	}
	

}