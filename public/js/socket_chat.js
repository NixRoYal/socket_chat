var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) { window.location = 'index.html' };
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};
socket.on('connect', () => {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, (rs) => {
        // console.log('Usuarios conectados', rs);
        rendedirzarUsuarios(rs);
    });
});

socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', (rs) => {
    // console.log('Servidor:', rs);
    renderizarMensajes(rs, false);
    scrollBottom();
});

// Cuando un usuario entra o sale del chat
socket.on('listaPersonas', (rs) => {
    rendedirzarUsuarios(rs);
});

socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje Privado:', mensaje);
})
