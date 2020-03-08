const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');
const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (rs, cb) => {
        if (!rs.nombre || !rs.sala) return cb({ error: true, mensaje: 'El nombre y la sala es necesario' });
        client.join(rs.sala);
        usuarios.agregarPersona(client.id, rs.nombre, rs.sala);
        client.broadcast.to(rs.sala).emit('listaPersonas', usuarios.getPersonaPorSala(rs.sala));
        client.broadcast.to(rs.sala).emit('crearMensaje', crearMensaje('Administrador', `${rs.nombre} se uniò`))
        cb(usuarios.getPersonaPorSala(rs.sala));
    });
    client.on('crearMensaje', (dt, cb) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, dt.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        cb(mensaje);
    })
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonaPorSala(personaBorrada.sala));
    });
    client.on('mensajePrivado', dt => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(dt.para).emit('mensajePrivado', crearMensaje(persona.nombre, dt.mensaje));
    })
});
