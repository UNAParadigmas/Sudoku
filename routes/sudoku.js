var express = require('express');
var router = express.Router();
var fs = require('fs');

const Sudoku = require("../model/sudoku");
const Historial = require("../model/historial");

/**
 * guardar juego del usuario actual (enviar todo el usuario para buscar y actualizar)
 * PD: load no se ocupa porque los datos van a estar en el front end cuando inicion sesion
 */
router.put('/save', (req, res, next) => {
    let data = req.body;
    console.log("Guardar juego de: ", data.user)

    Usuario.findOne({
        usuario: data.user,
        pass: data.pass,
    }, (err, usuario) => {
        if (err) {
            console.log("Error encontrar el usuario ", err.message)
            res.status(500).send(err);
        }
        console.log("Usuario encontrado: ", usuario + ". Actualizando partida a: " + data.user.partida);
        usuario.partida = data.user.partida;
        res.status(200).json(usuario);
    });
});


/**
 * traer un sudoku al azar de la BD
 */
router.get('/newSudoku', (req, res) => {

    console.log("Obteniendo un sudoku al azar de la BD")

    Sudoku.aggregate([{ $sample: { size: 1 } }], (err, sudoku) => {
        if (err) {
            console.log("Error al obtener sudoku al azar ", err.message)
            res.status(500).send(err);
        }
        console.log("Sudoku encontrado: ", sudoku[0].hilera);
        res.status(200).json(sudoku[0]);
    });
});


/**
 * importar sudokus prueba a la BD
 */
router.post('/import', (req, res, next) => {
    console.log("Importando sudokus a la base de datos");
    Sudoku.count((err, count) => {
        if (err) {
            console.log("error inesperado", err.message);
            res.send(err);
        }
        else if (count == 0) {
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
        }
        else {
            console.log("sudokus cargados anteriormente");
            res.status(200).json("sudokus cargados anteriormente");
        }
    });

});


/**
 * registros de juegos terminados para mostrar graficos de estadisticas
 */
router.route('/historial')
    .post((req, res, next) => {
        let data = req.body;
        console.log("Guardando nuevo historial");

        let newHistorial = new Historial({
            usuario: data.id,
            tiempo: data.tiempo,
            dificultad: data.dificultad
        })

        newHistorial.save((err, historial) => {
            if (err) {
                console.log(err.message);
                res.status(500).send(err);
            }
            else {
                console.log("historial guardado: ", historial);
                res.status(200).json(historial);
            }
        });

    })

    .get((req, res) => {
        console.log("Cargando registros del jugador");
        Historial.find({ usuario_id: req.body.id }, null, { limit: 10, sort: -date }, (err, historial) => {
            if (err) {
                console.log("error: ", err.message);
                res.status(500).send(err);
            }
            else {
                console.log("historial encontrados: ", historial);
                res.status(200).json(historial);
            }
        });
    })

module.exports = router;