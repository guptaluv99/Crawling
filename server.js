var http = require('http');
var express = require('express');
var database = require('./database.js');

var app = express();
var port = 8080;

var bodyParser   = require('body-parser');
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

var weburls = require('./app/weburls.js', weburls);
app.use(express.static('public'));

app.use('/api/weburls', weburls);

app.get('/*', function(req, res){
   res.sendFile(__dirname + '/views/index.html');
});

var server = http.createServer(app);
console.log('Exambazaar loaded on port ' + port);
server.listen(port);