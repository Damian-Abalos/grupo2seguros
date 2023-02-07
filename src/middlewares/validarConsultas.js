const { check, validationResult } = require('express-validator')

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (error) {
        res.send({ errors: error.array() })
    }
}

const validarConsultas = [
    check('nombre')
        .exists()
        .not()
        .isEmpty(),
    check('email')
        .exists()
        .not()
        .isEmpty(),
    check('telefono')
        .exists()
        .not()
        .isEmpty(),
    check('consulta')
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = validarConsultas