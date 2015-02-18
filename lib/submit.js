var submit = require('submit'),
	qs = require('querystring'),
	cfg = require('../config');
	
function Submit(endpoint, params, config) {
    config = config || cfg;
    this.endpoint = endpoint;
    this.params = params;
    this.config = config;
};

Submit.prototype.makeSubmission = function(callback) {
	this.options = {
		host: this.config.base_url, 
		path: '/' + this.endpoint,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(params)
		}
	};
    var currentSubmissionObject = this;
    var postRequest = request(this.options, function(error, response) {
        if (!error && response.statusCode == 200) {
            response.setEncoding('utf8');
            response.on('data', function(data) {
            	currentSubmissionObject.data = data.data;
                currentSubmissionObject.message = data.message;
                callback(null, currentSubmissionObject.data, currentSubmissionObject);
            });
        } else {
            if (error) {
                callback(error, null, null);
            } else {
                callback(new Error("Server returned status: " + 
                                   response.statusCode), null, null);
            }
        }
    });
    
    postRequest.write(this.params);
    postRequest.end();
};