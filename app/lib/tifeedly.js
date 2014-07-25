/**
 * tifeedly provides a Javascript-friendly interface to your feedly account
 * without other dependencies. Ports of node-feedly library
 *
 * @class TiFeedly
 */
(function() {
	 /*
	 * Constants
	 */
	var BASE_URL = 'http://sandbox.feedly.com',
	    AUTH_URL = BASE_URL + '/v3/auth/auth',
	    TOKEN_URL = BASE_URL + '/v3/auth/token',
	    TiFeedly = null;
	
	module.exports = TiFeedly = (function(){
	    /**
	     * Creates an instance of the TiFeedly class
	     * @constructor
	     * @param {String} client_id String with client_id in Feedly Cloud
	     * @param {String} client_secret String with client_secret in Feedly Cloud
	     */
	    function TiFeedly(client_id, client_secret){
	        if(client_id == null || client_secret == null){
	            return null;
	        }
	        this.client_id = client_id;
	        this.client_secret = client_secret;
	        this.code = null;
	        this.access_token = null;
	        this.refresh_token = null;
	        this.expires = null;
	        this.expiration_min = 3600000; // milliseconds
	    }
	
	    // ====== PRIVATE METHODS ======
	
	    /**
	     * Request token to access to Feedly Cloud
	     * @method _access
	     * @return {Bool} true or false
	     */
	    TiFeedly.prototype._access = function(){
	        if(this.code == null){
	            return this._auth();
	        }else{
	            if(this.access_token == null || this.refresh_token == null){
	                this._request(
	                    TOKEN_URL,
	                    'POST',
	                    {
	                        code: this.code,
	                        client_id: this.client_id,
	                        client_secret: this.client_secret,
	                        grant_type: 'authorization_code',
	                        redirect_uri: 'http://localhost'
	                    },
	                    false,
	                    function(response){
	                        console.log("Respuesta!" + response);
	                        // this.access_token = EXTRAER
	                        // this.refresh_token = EXTRAER
	                        // this.expires = new Date(new Date().getTime() + (body.expires_in * 1000));
	                    }
	                );
	            }
	        }
	    };
	
	    /**
	     * Execute authentication in Feedly Cloud.
	     * If code element is not null execute _access method
	     * @method _auth
	     * @return {Bool} true or false
	     */
	    TiFeedly.prototype._auth = function(){
	        if(this.code == null){
	        	var window = Ti.UI.createWindow({modal: true}),
	        		webview = Ti.UI.createWebView(),
	        		url = AUTH_URL + '?',
	        		data = {
	                    response_type: 'code',
	                    client_id: this.client_id,
	                    redirect_uri: 'http://localhost',
	                    scope: 'https://cloud.feedly.com/subscriptions'
	               	};
	                Object.keys(data).forEach(function(key){
	                    url = url + encodeURIComponent(key) + '='
	                        + encodeURIComponent(data[key]) + '&';
	                });
	                webview.setUrl(url);
	                webview.addEventListener('load',function(event){
	                	if(event.url.indexOf('http://localhost') == 0 ){
	                		window.close();
	                		delete(window);
							var params = event.url.split('?')[1].split('&');
							for (var i=0; i<params.length; i++) {
								var paramSplited = params[i].split('=');
								if(paramSplited[0] == 'code'){
							  		TiFeedly.code=paramSplited[1];
							  		return TiFeedly.prototype._access();
							  	}
							};
	                	}else{
	                		window.close();
	                		delete(window);
	                		return false;
	                	}
	                });
	                window.add(webview);
	                window.open({modal: true});
			}else{
	            return this._access();
	        }
	    };
	
	    /**
	     * Request refresh tokens to access to Feedly Cloud
	     * @method _refresh
	     * @return {Bool} true or false
	     */
	    TiFeedly.prototype._refresh = function(){
	        if(this.code == null){
	            return this._auth();
	        }else{
	            if(this.refresh_token != null){
	                this._request(
	                    TOKEN_URL,
	                    'POST',
	                    {
	                        refresh_token: this.refresh_token,
	                        client_id: this.client_id,
	                        client_secret: this.client_secret,
	                        grant_type: 'refresh_token'
	                    },
	                    false,
	                    function(response){
	                        console.log(response);
	                        // this.access_token = EXTRAER
	                        // this.expires = new Date(new Date().getTime() + (body.expires_in * 1000));
	                    }
	                );
	            }else{
	                return this._access();
	            }
	        }
	    };
	
	    /**
	     * Generic method to execute http request to Feedly Cloud
	     * @method _request
	     * @param {String} url Path to feedly cloud
	     * @param {String} method Method to call feedly (GET, POST, DELETE)
	     * @param {Object} data Object with parameters to url
	     * @param {Bool} oauth true or false if you need header oauth
	     * @param {Function} callback Function to execute when call has finished
	     * @return {Bool} true or false
	     */
	    TiFeedly.prototype._request = function(url, method, data, oauth, callback){
	        if(method == null){
	            method = 'GET';
	        }
	        if(oauth == null){
	            oauth = false;
	        }
	        if(url != null){
	        	console.log("========== Metodo request");
	            var client = Ti.Network.createHTTPClient({
	                onload: function(response){
	                    if (callback != null) {
	                        return callback(response);
	                    } else {
	                        return response;
	                    }
	                },
	                onerror: function(response){
	                    if (callback != null) {
	                        return callback(response);
	                    } else {
	                        return response;
	                    }
	                },
	                timeout: 10000
	            });
	            if(method != 'POST' && data != null){
	                url = url + '?';
	                Object.keys(data).forEach(function(key){
	                    url = url + encodeURIComponent(key) + '='
	                        + encodeURIComponent(data[key]) + '&';
	                });
	            }
	            client.open(method,url);
	            if(oauth){
	                client.setRequestHeader('Authorization','OAuth ' + this.access_token);
	            }
	            if(method == 'POST'){
	                client.send(data);
	            }else{
	            	client.send();
	            }
	        }
	    };
	
	    /**
	     * Return true or false if exist a valid expiration date
	     * @method _validExpiration
	     * @return {Bool} true or false if exist a valid expiration date
	     */
	    TiFeedly.prototype._validExpiration = function(){
	        return (this.expires != null) && (this.expires > new Date()) && ((this.expires - new Date()) < this.expiration_min);
	    };
	
	    /**
	     * Return true or false if exist a valid access and refresh token
	     * @method _validToken
	     * @return {Bool} true or false if exist a valid access and refresh token
	     */
	    TiFeedly.prototype._validToken = function(){
	        return (this.access_token != null) && (this.refresh_token != null);
	    };
	
	
	
	    // ====== PUBLIC METHODS ======
	
	    /**
	     * Public method to start login process
	     * @method login
	     * @return {Bool} true or false
	     */
	    TiFeedly.prototype.login = function(){
	    	if(! this._validToken()){
	            return this._auth();
	        }else if(! this._validExpiration()){
	            return this._refresh();
	        }else{
	            return true;
	        }
	    };
	    
	    /**
	     * Public method to logout
	     * @method logout
	     * @return {Bool} true or false
	     */
	    TiFeedly.prototype.logout = function(){
	        /* Igual que access pero distinto grant_type */
	        this.code = null;
	        this.access_token = null;
	        this.refresh_token = null;
	        this.expires = null;
	    };
	
	    /**
	     * Public method to refresh access token
	     * @method refresh
	     * @return {Bool} true or false
	     */
	    TiFeedly.prototype.refresh = function(){
	        if (! this._validExpiration()){
	            return this._refresh();
	        }else{
	            return true;
	        }
	    };
	    
	    return TiFeedly;
	    
	})();	
}).call(this);
