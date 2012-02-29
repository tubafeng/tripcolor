/**
 * Created by JetBrains WebStorm.
 * User: tuba
 * Date: 12-2-17
 * Time: 上午11:25
 * To change this template use File | Settings | File Templates.
 */

var querystring = require("querystring");
var fs = require("fs");
var url = require("url");


function startTest(response, request) {
    console.log("Request handler 'startTest' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/app/login/" method="post">' +
        '用户名：<input type="text" name="uname">' +
        '密码：<input type="password" name="passwd">' +
        '<input type="submit" value="登录" />' +
        '</form> ' +
        '</body>' +
        '</html>';

    response.writeHead(200, {"Context-Type": "text/html"});
    response.write(body);
    response.end();
}

function start(response, request) {
    console.log("Request handler 'start' was called.");

    fs.readFile("./public/index.html", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "test/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(file, "binary");
            response.end();
        }
    })

}

function publicPage(response, request) {
    console.log("Request handler 'publicPage' was called.");

    var pathname = url.parse(request.url).pathname;
    pathname = '.' + pathname;
    var pathtype = pathname.substring(pathname.lastIndexOf(".") + 1);
    console.log("The path type of request : " + pathtype);
    var contype = 'text/html';
    switch (pathtype) {
        case 'jpg':
        {
            contype = 'image/jpeg';
        }
            break;
        case 'gif':
        {
            contype = 'image/gif';
        }
            break;
        case 'png':
        {
            contype = 'image/png';
        }
            break;
        case 'css':
        {
            contype = 'text/css';
        }
            break;
        case 'js':
        {
            contype = 'application/x-javascript';
        }
            break;

    }

    fs.readFile(pathname, "binary", function(error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "test/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": contype});
            response.write(file, "binary");
            response.end();
        }
    })
}

function login(response, request) {
    console.log("Request handler 'login' was called.");

    var info='';
    var resJson = '';
    request.addListener('data', function(chunk) {
        info += chunk;
    })
    .addListener('end', function(){
        info = querystring.parse(info);
        if (info.uname == 'tayak' && info.passwd == 'pass1234') {
            // login successfully
            resJson = '{"id": "911", "uname": "tayak", "email": "tayak@sina.com", "displayname": "antan", "sessionid": "efewnn394820jgnro_"}';
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(resJson);
            response.end();

        } else {
            // login failed
            resJson = '{}';
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(resJson);
            response.end();
        }
    })
}

function logout(response, request) {
    response.writeHead(200, {"Context-Type": "text/html"});
    response.write("");
    response.end();
}






exports.start = start;
exports.testpage = startTest;
exports.login = login;
exports.logout = logout;
exports.publicpage = publicPage;
