const { validationResult} = require('express-validator');

const validarCampos = (req, res, next) =>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json(
            {
                ok: false,
                errores: errores.mapped(),
            }
        );
    }
    next();
}

module.exports = {
    validarCampos
}