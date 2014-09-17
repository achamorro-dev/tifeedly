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

function unreadCount(e){
	feedly.getUnreadCounts(function(r){
		console.log(r);
	});
}

function markEntryAsRead(e){
	var entries = ['entry1'];
	feedly.markEntryAsRead(entries,function(r){
		console.log(r);
	});
}

function keepEntryUnread(e){
	var entries = ['entry1'];
	feedly.keepEntryUnread(entries,function(r){
		console.log(r);
	});
}

function markAsSaved(e){
	var entries = ['entry1'];
	feedly.markAsSaved(entries,function(r){
		console.log(r);
	});
}

function markAsUnsaved(e){
	var entries = ['entry1'];
	feedly.markAsUnsaved(entries,function(r){
		console.log(r);
	});
}


$.index.open();
