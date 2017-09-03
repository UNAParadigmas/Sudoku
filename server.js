var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var sudoku = require('./routes/sudoku');
var login = require('./routes/login');

var app = express();

//static folder
app.use(express.static(path.join(__dirname, 'client')));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//conexion db
var db;

//archivos estaticos, para JS, css, imagenes, etc
app.use(express.static('dist'));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:0150@ds141242.mlab.com:41242/sudoku_paradigmas', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db = database;
    console.log("Conectado a la db");

    app.use('/api', sudoku);
    app.use('/api', login);
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
    var server = app.listen(process.env.PORT || 8080, () => {
        var port = server.address().port;
        console.log("App corriendo en puerto: ", port);
    });
});

