const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const endpointHelper = {

    /**
     * Send GET request to the server with specified URL and return response from the server.
     *
     * @param httpMethod
     * @param request
     * @param body type of String
     * @param Optional httpHeaders
     * @param httpMethod default value is GET. You may provide any other method to get response
     * @returns {promise.Promise<any> responseText}
     */
    getResponseText: function (httpMethod = 'GET', request, body = JSON.stringify({}), httpHeaders = new Map()) {
        return Promise.resolve(endpointHelper.sendRequest(httpMethod, request, body, httpHeaders).then((response) => {
            return response.responseText;
        }));
    },

    /**
     * Send GET request to the server with specified URL and return response from the server.
     *
     * @param httpMethod
     * @param request
     * @param body type of String
     * @param Optional httpHeaders
     * @param httpMethod default value is GET. You may provide any other method to get response
     * @returns {promise.Promise<any> status}
     */
    getResponseStatus: function (httpMethod = 'GET', request, body = JSON.stringify({}), httpHeaders = new Map()) {
        return Promise.resolve(endpointHelper.sendRequest(httpMethod, request, body, httpHeaders).then((response) => {
            return response.status;
        }));
    },

    /**
     * Send specified POST request with data to the server and return status of the request from the server.
     *
     * @param httpMethod
     * @param request
     * @param Optional body type of String
     * @param Optional httpHeaders
     * @param httpMethod default value is POST. You may provide any other method to get response
     * @returns {promise.Promise<any> XMLHttpRequest object}
     */
    sendRequest: function (httpMethod = 'POST', request, body = JSON.stringify({}), httpHeaders = new Map()) {
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest();
            console.log('Sending ' + request);
            xhttp.open(httpMethod, request);
            httpHeaders.forEach((value, key) => {
                xhttp.setRequestHeader(key, value);
            });
            xhttp.send(body);
            xhttp.onload = function () {
                console.log(httpMethod + ' status: ' + xhttp.status);
                resolve(xhttp);
            };
            xhttp.onerror = function () {
                console.log(httpMethod + ' status: ' + xhttp.status + ' failed to load ' + request);
                reject(request);
            }
        });
    }
};

module.exports = endpointHelper;