const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Diz ao servidor para expor tudo que está na pasta 'public' ao navegador
app.use(express.static('public'));

// Gerencia as conexões do WebSocket (quando alguém abre o site)
io.on('connection', (socket) => {
    console.log('Um usuário secreto se conectou:', socket.id);

    // Quando o servidor recebe uma mensagem, ele retransmite para TODOS
    socket.on('enviar_mensagem', (msg) => {
        io.emit('receber_mensagem', msg); 
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectou:', socket.id);
    });
});

// O servidor tenta pegar a porta da nuvem, se não achar, usa a 3000 (para testes locais)
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});