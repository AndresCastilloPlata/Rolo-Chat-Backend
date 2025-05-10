const { comprobarJWT } = require('../helpers/jwt');
const {io} = require('../index');
const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado.');

    // cliente con JWT
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])
    
    // Verificar autenticacion
    if (!valido){ return client.disconnect();}

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    // Sala global, client.id, uid usuairo
    client.join(uid);

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', (payload)=> {
        // todo: grabar mensaje
        grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });
    // client.to(uid).emit()

    

    client.on('disconnect', () => { console.log('Cliente desconectado.') });
    
    // client.on('mensaje', (payload)=> {
    //     console.log('mensaje', payload);   

    //     io.emit('mensaje', {admin: 'Nuevo mensaje'});
    // });
    usuarioDesconectado(uid);
});