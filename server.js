const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Expõe os arquivos da pasta public
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Usuário conectou:', socket.id);

    // Recebe o pedido do usuário para entrar em uma sala
    socket.on('entrar_sala', (nomeDaSala) => {
        socket.join(nomeDaSala);
        console.log(`Usuário ${socket.id} entrou na sala: ${nomeDaSala}`);
    });

    // Recebe a mensagem e envia APENAS para quem está na mesma sala
    socket.on('enviar_mensagem', (dados) => {
        io.to(dados.sala).emit('receber_mensagem', dados.texto); 
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectou:', socket.id);
    });
});

// Porta dinâmica para funcionar na nuvem (Render) ou localmente na 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});