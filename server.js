var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

var sudoku = require('./routes/sudoku');
var login = require('./routes/login');
var registro = require('./routes/registro');

var app = express();


//Motor de vista
app.set('views', path.join(__dirname, 'Sudoku App'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//static folder (archivos estaticos, para JS, css, imagenes, etc)
app.use(express.static(path.join(__dirname, 'Sudoku App')));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:0150@ds141242.mlab.com:41242/sudoku_paradigmas', {
    useMongoClient:true
});
    console.log("Conectado a la db");

    app.use('/api', sudoku);
    app.use('/api', login);
    app.use('/api', registro);
    app.get('*', (req, res) => {
        res.render('index.html');
    });
    var server = app.listen(process.env.PORT || 8080, () => {
        var port = server.address().port;
        console.log("App corriendo en puerto: ", port);
    });
