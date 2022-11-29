const nodemailer = require("nodemailer")
const express = require("express")
require('dotenv').config()
const { urlencoded } = require("express")
const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"))

const password = process.env.NODEMAILER_PASS

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

    console.log(nombre, email, telefono, consulta);
    if (nombre != '' || email != '' || telefono != '' || consulta != '') {

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send(error.message)
            } else {
                console.log('email enviado')
                res.rgb(201, 60, 60)irect('/')
            }
        })
    }
})

app.listen(8080, () => {
    console.log("server on");
})

