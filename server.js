var express = require('express'),
    socketIO = require('socket.io'),
    app = express(),
    port = Number(process.env.PORT || 3000)
    ;

/**
 * Meng-konfigurasi express untuk mendapatkan file html
 * dari directory bernama "public"
 */
app.use(express.static(__dirname + '/public'));

/**
 * Pada saat browser me-request path "/"
 * response dengan file "index.html"
 */
app.get('/', function(req, res){
    res.sendfile('index.html');
});

/*
 * Meng-konfigurasi express untuk listen pada
 * port yang telah di tentukan
 */
var server = app.listen(port, function(){
    console.log('listening on *:' + port);
});

/**
 * Setup socket.io server untuk meng-handle request
 * dari library socket.io yang berjalan pada browser
 */
var io = socketIO.listen(server);

var users = [];
var sockets = [];

io.on('connection', function (socket) {    
    
    socket.on('message', function(message){
        
        if (message.type === 'user') {
            console.log('User connected: ' + message.user.name);        
            users.push(message.user);
            sockets.push(socket);
            for (var i = 0; i < users.length; ++i) {
                io.emit('connected', users[i]);       
            }                  
        }
        else if (message.type === 'text') {
            console.log('Text Message: ' + message.text);
            io.emit('message', message);    
        }
    
    });
    
    socket.on('disconnect', function(){
        var i = sockets.indexOf(socket);
        var user = users[i];
        console.log('User disconnected: ' + user.name);
        io.emit('disconnected', user);
        users.splice(i, 1);
        sockets.splice(i, 1);
    });
    
});