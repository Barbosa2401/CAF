// Conecta com o servidor Socket.IO
const socket = io();

const inputText = document.getElementById('inputText');
const btnEnviar = document.getElementById('btnEnviar');
const chatBox = document.getElementById('chatBox');
const btnTraduzir = document.getElementById('btnTraduzir');

let modoTraduzido = false;

const coordsCifra = {
    'a': [0, 0], 'b': [1, 0], 'c': [2, 0], 'd': [3, 0], 'e': [4, 0],
    'f': [0, 1], 'g': [1, 1], 'h': [2, 1], 'i': [3, 1], 'j': [4, 1],
    'k': [0, 2], 'l': [1, 2], 'm': [2, 2], 'n': [3, 2], 'o': [4, 2],
    'p': [0, 3], 'q': [1, 3], 'r': [2, 3], 's': [3, 3], 't': [4, 3],
    'u': [0, 4], 'v': [1, 4], 'w': [2, 4], 'x': [3, 4], 'y': [4, 4]
};

// 1. O EVENTO DE ENVIAR A MENSAGEM
btnEnviar.addEventListener('click', () => {
    const texto = inputText.value;
    if (texto.trim() !== '') {
        // Manda o texto puro para o servidor
        socket.emit('enviar_mensagem', texto); 
        inputText.value = ''; // Limpa o input
    }
});

// Permite enviar com a tecla Enter
inputText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnEnviar.click();
});

// 2. O EVENTO DE RECEBER A MENSAGEM
socket.on('receber_mensagem', (msg) => {
    const balaoMensagem = criarBalaoDeMensagem(msg);
    chatBox.appendChild(balaoMensagem);
    
    // Rola o chat automaticamente para baixo
    chatBox.scrollTop = chatBox.scrollHeight; 
});

// 3. A LÓGICA DE CRIAR A MENSAGEM (O Truque da Tradução)
function criarBalaoDeMensagem(texto) {
    const divMensagem = document.createElement('div');
    divMensagem.classList.add('mensagem');

    // Container para os símbolos
    const divSimbolos = document.createElement('div');
    divSimbolos.classList.add('conteudo-simbolos');
    
    // Container para o texto normal (começa escondido)
    const divTexto = document.createElement('div');
    divTexto.classList.add('conteudo-texto');
    divTexto.textContent = texto; 
    divTexto.style.display = modoTraduzido ? 'block' : 'none';
    divSimbolos.style.display = modoTraduzido ? 'none' : 'flex';

    // Gerador de Sprites que já tínhamos
    for (let char of texto.toLowerCase()) {
        if (coordsCifra[char]) {
            const [coluna, linha] = coordsCifra[char];
            const posX = coluna * 25;
            const posY = linha * 25;

            const mascara = document.createElement('div');
            mascara.classList.add('mascara-simbolo');

            const simbolo = document.createElement('div');
            simbolo.classList.add('simbolo');
            simbolo.style.backgroundPosition = `${posX}% ${posY}%`;
            
            mascara.appendChild(simbolo);
            divSimbolos.appendChild(mascara);
            
        } else if (char === ' ') {
            const espaco = document.createElement('div');
            espaco.classList.add('espaco');
            divSimbolos.appendChild(espaco);
        }
    }

    divMensagem.appendChild(divSimbolos);
    divMensagem.appendChild(divTexto);
    return divMensagem;
}

// 4. O BOTÃO DE TRADUZIR
btnTraduzir.addEventListener('click', () => {
    modoTraduzido = !modoTraduzido; // Inverte o estado (verdadeiro/falso)
    
    // Procura todas as mensagens na tela e altera a visibilidade
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