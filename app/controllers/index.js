var TiFeedly = require('tifeedly');
var feedly = new TiFeedly('sandbox','YDRYI5E8OP2JKXYSDW79');

function startFeedly(e) {
    feedly.login();
}

function getSubscriptions(e){
	feedly.getSubscriptions(function(r){
		console.log(r);
	});
}

function getCategories(e){
	feedly.getCategories(function(r){
		console.log(r);
	});
}

function reads(e){
	feedly.reads(function(r){
		console.log(r);
	});
}

$.index.open();
