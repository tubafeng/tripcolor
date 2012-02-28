/**
 * Created by JetBrains WebStorm.
 * User: tuba
 * Date: 12-2-17
 * Time: 下午1:34
 * To change this template use File | Settings | File Templates.
 */


var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/app/login/"] = requestHandlers.login;
handle["/app/logout/"] = requestHandlers.logout;

server.start(router.route, handle);