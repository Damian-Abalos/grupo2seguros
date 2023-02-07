const express = require("express")
const { urlencoded } = require("express")
const nodemailer = require("nodemailer")
// const multer = require("multer")
const path = require('path');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const File = require('./src/models/file');
require('dotenv').config()


const PORT = process.env.PORT || 8080;
const password = process.env.NODEMAILER_PASS


//instancia de express
const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

const url = "mongodb+srv://damianAbalos:vegantechno@cluster0.sv63y.mongodb.net/gruppo2seguro?retryWrites=true&w=majority"
mongoose.Promise = global.Promise;
// mongoose.set('strictQuery', true);
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json())
app.use(urlencoded({ extended: true }));

//Cargamos el bodyParser: middleware para analizar cuerpos de a través de la URL
app.use(bodyParser.urlencoded({ extended: false }));
//Cualquier tipo de petición lo convertimos a json:
app.use(bodyParser.json());

//Activar el CORS para permitir peticiones AJAX y HTTP desde el frontend.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    //res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

mongoose.connect(url, { useNewUrlParser: true }).then(() => {

    console.log('Conexión con la BDD realizada con éxito!!!');

    app.listen(PORT, () => {
        console.log('servidor ejecutándose en el puerto ' + PORT);
    });

});
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './src/public/uploads')
//         // cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))

//     }
// })

// const upload = multer({
//     storage: storage
// })


// let uploadMultiple = upload.fields([{ name: 'foto_cedula_frente' }, { name: 'foto_cedula_dorso'}])


// SEND FILES
app.post('/api/upload', (req, res) => {
    console.log('body');
    const data = req.body
    console.log(data)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: 'damian.vegtech@gmail.com',
            pass: password
        }
    });

    const path = __dirname + '/src/public/images/' + data.image;
    console.log(path);

    let html = `
    <h2>cedula frente:</h2> 
    <img src="${ 'http://localhost:8080/src/public/images/' + data.image}" alt="">
    `
    console.log(html);

    const mailOptions = {
        from: 'nombre',
        to: 'damian.vegtech@gmail.com',
        subject: 'Nuevo reporte',
        html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send(error.message)
        } else {
            console.log('email enviado')
            // res.send('consulta enviada')
            res.redirect('/')
        }
    })
})
// app.post('/api/upload', uploadMultiple, (req, res) => {
//     console.log(req.files)
//     let cedula_verde_frente = req.files.foto_cedula_frente[0].filename
//     let cedula_verde_frente_path = req.files.foto_cedula_frente[0].path

//     let path = __dirname + '/' + cedula_verde_frente_path

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         port: 587,
//         auth: {
//             user: 'damian.vegtech@gmail.com',
//             pass: password
//         }
//     });

//     const mailOptions = {
//         from: 'nombre',
//         to: 'damian.vegtech@gmail.com',
//         subject: 'Nuevo reporte',
//         html: `
//             <h2>cedula frente:</h2> 
//             <img src="${path}" alt="">
//             ${req.files.foto_cedula_frente[0]}
//             `
//     }

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//             res.status(500).send(error.message)
//         } else {
//             console.log('email enviado')
//             // res.send('consulta enviada')
//             res.redirect('/')
//         }
//     })
// })

app.post('/api/save', (req, res) => {

    console.log('respuesta recibida');
    const data = req.body;
    console.log('data');
    console.log(data);

    var file = new File();

    //Asignamos los valores:
    file.description = data.description;
    file.image = data.image;

    file.save((err, fileStored) => {

        if (err || !fileStored) {
            return res.status(404).send({
                status: 'error',
                message: 'El post no se ha guardado !!!'
            });
        }

        // Devolver una respuesta 
        return res.status(200).send({
            status: 'success',
            fileStored
        });

    });

});

//Subida de imágenes -------------------------------------------------------------
app.post('/api/saveImage', (req, res) => {
    const file = req.files.myFile;
    const fileName = req.files.myFile.name;
    const path = __dirname + '/src/public/images/' + fileName;
    console.log(path);

    file.mv(path, (error) => {
        if (error) {
            console.error(error);
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ status: 'error', message: error }));
            return;
        }
        return res.status(200).send({ status: 'success', path: 'public/images/' + fileName });
    });
});

//// -----CONSULTA A LA BDD------------------------------------------------
//GET method route
//recibimos la consulta desde el cliente y devolvemos los datos:
app.get('/api/files', (req, res)  => {

    var query = File.find({});

    query.sort('-date').exec((err, files) => {

        if (err) {
            return res.status(500).send({
                status: "error",
                message: "Error al extraer los datos"
            });
        }

        //Si no existen artículos:
        if (!files) {
            return res.status(404).send({
                status: "error",
                message: "No hay posts para mostrar"
            });
        }

        return res.status(200).send({
            status: "success",
            files
        });
    });
});



// SEND EMAIL
app.post("/send-email", (req, res) => {
    const { nombre, email, telefono, consulta } = req.body

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: 'damian.vegtech@gmail.com',
            pass: password
        }
    });

    const mailOptions = {
        from: nombre,
        to: 'damian.vegtech@gmail.com',
        subject: 'Nuevo reporte',
        html: `<h1>Nuevo reporte de ${nombre}, email: ${email}, tel: ${telefono}</h1><p>${consulta}</p>`
    }

    if (nombre != '' || email != '' || telefono != '' || consulta != '') {

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send(error.message)
            } else {
                console.log('email enviado')
                console.log(req.body);
                res.redirect('/')
            }
        })
    }
})
