/* create server

*/
//dependences
var http=require('http');
var https=require('https');
var url=require('url');
var StringDecoder=require('string_decoder').StringDecoder;
var config=require('./config');
var fs = require('fs');

//the server hould response all requests
var httpServer=http.createServer(function(req,res){
    unifiedServer(req,res);
 });

 //instantiate the https server
var httpsServerOption = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

 //start the http server
var httpsServer=https.createServer(httpsServerOption,function(req,res){
    unifiedServer(req,res);
});
var unifiedServer = function(req,res){
//get url and parse it
    var parsedUrl=url.parse(req.url,true);

    //get the path
    var pathUrl=parsedUrl.pathname;
    var trimPath=pathUrl.replace(/^\/+|\/+S/g,'')

    //get request method
    var method=req.method.toLowerCase();
    //get quer object
    var querStringObject =parsedUrl.query;

    //get the headers Object  from req
    var headers = req.headers;

    //get the body payload
    var decoder = new StringDecoder('UTF-8');
    var buffer ='';
    //tell browser that thist json
    res.setHeader('Content-Type','application/json');

    req.on('data',function(data){
    buffer+=decoder.write(data);
    });
    req.on('end',function(){
    buffer +=decoder.end();
    //chose which handlrs , if handers.sample then handers.sample. if the handler has not found then  handlers.notFound
    var choseHandlers = typeof(router[trimPath])!=='undefined' ? router[trimPath] : handlers.notFound;
    //contruct data object to send the handlers
    var data={
    'trimPath':trimPath,
    'queryStringObject':querStringObject,
    'method':method,
    'headers':headers,
    'payload':buffer,
    'greeting':'hello the world--first assignment, done!' //first assignment
    };


    //router the request specified in the router
    choseHandlers(data,function(statusCode,payload){
        //use status code , payload which return from handlers , if status code and payload are undefined then 200 and empty object
         statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
         payload = typeof(payload) == 'object' ? payload : {};

        //conver a payload object to string
        var payloadString = JSON.stringify(payload);


        //return the response
        res.writeHead(statusCode);
        res.end(payloadString);

        //get the log
        console.log('response: ',statusCode,payloadString);

    });




    });
    //define handlers
    var handlers ={};
    handlers.ping =function(data,callback){
    //callback a http status code and payload object
    callback(200);
    };
    handlers.hello =function(data,callback){
    //callback a http status code and payload object
    callback(200,{'greeting':data});
    };

    //define not found handler
    handlers.notFound = function(data,callback){
        callback(404);

    };

    //define a router
    var router = {
    'ping':handlers.ping,
    'hello':handlers.hello

    };

};
//make server listen port 3000

 httpServer.listen(config.httpPort,function(){
 console.log("The Server is listening to "+config.httpPort+" and in "+config.envName+" mode");
 });

httpsServer.listen(config.httpsPort,function(){
 console.log("The Server is listening to "+config.httpsPort+" and in "+config.envName+" mode");
 });