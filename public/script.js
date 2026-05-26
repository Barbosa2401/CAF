const socket = io();

// Elementos da Tela de Acesso
const telaAcesso = document.getElementById('telaAcesso');
const telaChat = document.getElementById('telaChat');
const inputSala = document.getElementById('inputSala');
const btnEntrar = document.getElementById('btnEntrar');
const infoSala = document.getElementById('infoSala');

// Elementos do Chat
const inputText = document.getElementById('inputText');
const btnEnviar = document.getElementById('btnEnviar');
const chatBox = document.getElementById('chatBox');
const btnTraduzir = document.getElementById('btnTraduzir');

let modoTraduzido = false;
let salaAtual = ''; 

// Dicionário de Coordenadas (Coluna, Linha)
const coordsCifra = {
    'a': [0, 0], 'b': [1, 0], 'c': [2, 0], 'd': [3, 0], 'e': [4, 0],
    'f': [0, 1], 'g': [1, 1], 'h': [2, 1], 'i': [3, 1], 'j': [4, 1],
    'k': [0, 2], 'l': [1, 2], 'm': [2, 2], 'n': [3, 2], 'o': [4, 2],
    'p': [0, 3], 'q': [1, 3], 'r': [2, 3], 's': [3, 3], 't': [4, 3],
    'u': [0, 4], 'v': [1, 4], 'w': [2, 4], 'x': [3, 4], 'y': [4, 4]
};

// --- LÓGICA DE ACESSO ---
btnEntrar.addEventListener('click', () => {
    const nomeSala = inputSala.value.trim().toLowerCase();
    
    if (nomeSala !== '') {
        salaAtual = nomeSala;
        socket.emit('entrar_sala', salaAtual);
        
        telaAcesso.style.display = 'none';
        telaChat.style.display = 'block';
        infoSala.textContent = `Você está na sala secreta: ${salaAtual}`;
    }
});

inputSala.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnEntrar.click();
});

// --- LÓGICA DE ENVIO DE MENSAGEM ---
btnEnviar.addEventListener('click', () => {
    const texto = inputText.value;
    if (texto.trim() !== '') {
        socket.emit('enviar_mensagem', {
            sala: salaAtual,
            texto: texto
        }); 
        inputText.value = '';
    }
});

inputText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnEnviar.click();
});

// --- LÓGICA DE RECEBIMENTO ---
socket.on('receber_mensagem', (msg) => {
    const balaoMensagem = criarBalaoDeMensagem(msg);
    chatBox.appendChild(balaoMensagem);
    chatBox.scrollTop = chatBox.scrollHeight; // Rola para a última mensagem
});

// --- CONSTRUTOR VISUAL DA MENSAGEM ---
function criarBalaoDeMensagem(texto) {
    const divMensagem = document.createElement('div');
    divMensagem.classList.add('mensagem');

    const divSimbolos = document.createElement('div');
    divSimbolos.classList.add('conteudo-simbolos');
    
    const divTexto = document.createElement('div');
    divTexto.classList.add('conteudo-texto');
    divTexto.textContent = texto; 
    divTexto.style.display = modoTraduzido ? 'block' : 'none';
    divSimbolos.style.display = modoTraduzido ? 'none' : 'flex';

    for (let char of texto.toLowerCase()) {
        if (coordsCifra[char]) {
            const [coluna, linha] = coordsCifra[char];
            const posX = coluna * 25;
            const posY = linha * 25;

            // A Máscara que esconde a letra de baixo
            const mascara = document.createElement('div');
            mascara.classList.add('mascara-simbolo');

            // O Símbolo em si
            const simbolo = document.createElement('div');
            simbolo.classList.add('simbolo');
            simbolo.style.backgroundPosition = `${posX}% ${posY}%`;
            
            mascara.appendChild(simbolo);
            divSimbolos.appendChild(mascara);
            
        } else if (char === ' ') {
            const espaco = document.createElement('div');
            espaco.classList.add('espaco');
            divSimbolos.appendChild(espaco);
            
        } else if (char === '\n') {
            const quebra = document.createElement('div');
            quebra.classList.add('quebra-linha');
            divSimbolos.appendChild(quebra);
        }
    }

    divMensagem.appendChild(divSimbolos);
    divMensagem.appendChild(divTexto);
    return divMensagem;
}

// --- LÓGICA DO BOTÃO DE TRADUÇÃO ---
btnTraduzir.addEventListener('click', () => {
    modoTraduzido = !modoTraduzido; 
    
    const todasMensagens = document.querySelectorAll('.mensagem');
    todasMensagens.forEach(msg => {
        const simbolos = msg.querySelector('.conteudo-simbolos');
        const texto = msg.querySelector('.conteudo-texto');
        
        if (modoTraduzido) {
            simbolos.style.display = 'none';
            texto.style.display = 'block';
        } else {
            simbolos.style.display = 'flex';
            texto.style.display = 'none';
        }
    });

    btnTraduzir.textContent = modoTraduzido ? "Ocultar Tradução" : "Traduzir Tudo";
    btnTraduzir.classList.toggle('ativo');
});