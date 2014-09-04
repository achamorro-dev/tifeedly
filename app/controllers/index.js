var TiFeedly = require('tifeedly');


function startFeedly(e) {
    var feedly = new TiFeedly('sandbox','YDRYI5E8OP2JKXYSDW79');
    feedly.login();
}


$.index.open();
