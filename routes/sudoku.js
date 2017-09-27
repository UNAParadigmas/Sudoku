var express = require('express');
var router = express.Router();
var fs = require('fs');

const Sudoku = require("../model/sudoku");


router.put('/save', function (req, res, next) { //guardar juego del usuario actual (enviar todo el usuario para buscar y actualizar)
                                                //PD: load no se ocupa porque los datos van a estar en el front end cuando inicion sesion
    let data = req.body;
    console.log("Guardar juego de: ", data.user)
    
    Usuario.findOne({
        usuario: data.user,
        pass: data.pass,
    }, (err, usuario) => {
        if (err) {
            console.log("Error encontrar el usuario ",err.message)
            res.status(500).send(err);
        }
        console.log("Usuario encontrado: ", usuario+". Actualizando partida a: "+data.user.partida);
        usuario.partida=data.user.partida;
        res.status(200).json(usuario);
    });
});


router.get('/newSudoku', function (req, res) { //traer un sudoku al azar de la BD

    console.log("Obteniendo un sudoku al azar de la BD")

    Sudoku.aggregate([ { $sample: { size: 1 } } ], (err, sudoku) => {
        if (err) {
            console.log("Error al obtener sudoku al azar ",err.message)
            res.status(500).send(err);
        }
        console.log("Sudoku encontrado: ", sudoku[0].hilera);
        res.status(200).json(sudoku[0]);
    });
});



router.post('/import', (req, res, next) => { //importar sudokus prueba a la BD
    console.log("Importando sudokus a la base de datos");
    fs.readFile('./Sudoku App/files/9x9(1465).txt', 'utf8', (err, data) => {
        if (err) console.log("error al leer el archivo " + err.message);
        let datos = data.split(/\r?\n/);

        datos.map(sudoku => {
            let newSudoku = new Sudoku({
                hilera: sudoku
            });

            newSudoku.save((err) => {
                if (err) {
                    console.log(err.message);
                    res.send(err);
                }
            });
        });
        console.log("Importacion exitosa");
        res.status(200).json("importacion correcta");
    });
});





//exportarlo para accederlo desde otros archivos
module.exports = router;