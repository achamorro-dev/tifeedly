var TiFeedly = require('tifeedly');


function startFeedly(e) {
    var feedly = new TiFeedly('sandbox','ES3R6KCEG46BW9MYD332');
    feedly.login();
}


$.index.open();
