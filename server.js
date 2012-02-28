/**
 * Created by JetBrains WebStorm.
 * User: tuba
 * Date: 12-2-17
 * Time: 上午11:32
 * To change this template use File | Settings | File Templates.
 */

var http = require("http");
var url = require("url");
function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        route(handle, pathname, response, request);
    }

    http.createServer(onRequest).listen(6666);
    console.log("Server has started.");
}


exports.start = start;
