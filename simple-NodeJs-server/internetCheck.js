
var urlib = require('url')

// A simple way for internet check, for Q1 of the application test
// Achieved by sending a HEAD request through TCP connection, and count the 
// response time.
// Every response status will count, like even with a 404 response code,
// the function may still return a 'good' result
// The result will be returned by a callback function.
function internetCheck(url, callback) {

    const myURL = urlib.parse(url);
    var http = require('http');
    var options = {
        hostname: myURL.hostname,
        port: myURL.port,
        path: myURL.pathname,
        method: 'HEAD',
        maxRedirects: 20
    };


    var reqTime = new Date().getTime();

    var req = http.request(options, function (res) {

        resTime = new Date().getTime();
        latency = resTime - reqTime;

        if (callback != null) {
            if (latency < 500) {
                callback("good");
            } else if (latency < 5000) {
                callback("fine");
            } else {
                callback("terrible");
            }
        }
    });

    req.setTimeout(5000, () => {
        req.abort();
    })

    req.on('error', function (e) {
        // console.log('problem with request: ' + e.message);
        callback("terrible");
    });
    req.end();
}


//internetCheck('http://www.google.com', (result) => {
//    console.log(result);
//})