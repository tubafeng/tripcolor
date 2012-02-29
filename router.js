/**
 * Created by JetBrains WebStorm.
 * User: tuba
 * Date: 12-2-17
 * Time: 上午11:38
 * To change this template use File | Settings | File Templates.
 */

function route(handle, pathname, response, request) {
    pathname = pathname.substring(0, pathname.lastIndexOf("/") + 1);

    console.log("About to route a request for " + pathname);

    var pathroot = pathname.substring(0, pathname.indexOf("/", 1) + 1);
    if (pathroot === '/public/') {
        handle["public"](response, request);
    } else {
        if (typeof handle[pathname] === 'function') {
            handle[pathname](response, request);
        } else {
            console.log("No request handler found for " + pathname);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        }
    }

}

exports.route = route;
