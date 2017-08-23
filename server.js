var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var index = require('./routes/index');
var login = require('./routes/login');
//var sudoku = require('./routes/sudoku');

//var port = 3000;

var app = express();

//Motor de vista
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//static folder
app.use(express.static(path.join(__dirname, 'client')));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//conexion db
var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://admin:0150@ds141242.mlab.com:41242/sudoku_paradigmas', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db = database;
    console.log("Conectado a la db");

    app.use('/', index);
    //app.use('/api', sudoku);
    app.use('/api', login);
    var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App corriendo en puerto: ", port);
  });
});


/*app.use('/', index);
//app.use('/api', sudoku);
app.use('/api', login);

app.listen(port, function(){
    console.log('Servidor iniciado en puerto '+port);
});*/