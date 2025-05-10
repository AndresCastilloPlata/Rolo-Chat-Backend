const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');


const usuarioConectado = async ( uid = '') => {
    usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();

    return usuario;
}
const usuarioDesconectado = async ( uid = '') => {
    usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();

    return usuario;
}

const grabarMensaje = async (payload) => {

    /* 
        {
            de: '123456',
            para: '654321',
            mensaje: 'Hola Mundo'
        }
    */
    try {
        const mensaje = new Mensaje(payload);
        await mensaje.save();
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    grabarMensaje
}