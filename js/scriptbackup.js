document.addEventListener('DOMContentLoaded', () => {
    const jogo = document.getElementById('jogo');
    const cronometro = document.getElementById('tempo');
    const tempoFinal = document.getElementById('tempo-final')
    const rankFacil = document.getElementById('ranking-facil');
    const rankDificil = document.getElementById('ranking-dificil');
    let cartasViradas = [];
    let tempoInicial;
    let intervaloTempo;
    var dificuldade;
    let nomeJogador;
    let acertos = 0;
    let quantReembaralha = 0;

    function formatarTempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
    }

    function iniciarCronometro() {
        tempoInicial = Date.now();
        intervaloTempo = setInterval(() => {
            const tempoGasto = Math.floor((Date.now() - tempoInicial) / 1000);
            cronometro.textContent = formatarTempo(tempoGasto);
        }, 1000);
    }

    function pararCronometro() {
        clearInterval(intervaloTempo);
        const tempoTotal = Math.floor((Date.now() - tempoInicial) / 1000);
        return tempoTotal;
    }

    function iniciarJogo() {
        const cartas = Array.from(document.querySelectorAll('.carta'));
        cartas.forEach(carta => {
            carta.classList.remove('virada');
        });

        const cartasEmbaralhadas = cartas.sort(() => Math.random() - 0.5);
        jogo.innerHTML = '';
        cartasEmbaralhadas.forEach(carta => jogo.appendChild(carta));

        acertos = 0;
        quantReembaralha = 0;
        cronometro.textContent = "00:00";
        clearInterval(intervaloTempo);
        iniciarCronometro(); 
    }


    function virarCarta() {
        if (cartasViradas.length < 2 && !this.classList.contains('virada')) {
            this.classList.add('virada');
            cartasViradas.push(this);

            if (cartasViradas.length === 2) {
                checarAcerto();
            }
        }
    }

    function checarAcerto() {
        const [primeira, segunda] = cartasViradas;

        if (primeira.dataset.value === segunda.dataset.value) {
            cartasViradas = [];
            acertos++;
            quantReembaralha++;

            checarVitoria();

            if (quantReembaralha === 2 && dificuldade === 'dificil') {
                reembaralhar();
                quantReembaralha = 0;
            }
        } else {
            setTimeout(() => {
                primeira.classList.remove('virada');
                segunda.classList.remove('virada');
                cartasViradas = [];
            }, 1000);
        }
    }

    function checarVitoria() {
        if (document.querySelectorAll('.carta.virada').length === document.querySelectorAll('.carta').length) {
            const tempoUsado = pararCronometro(); 
            tempoFinal.textContent = formatarTempo(tempoUsado);
            const vitoria = document.getElementById('mensagem');
            vitoria.innerHTML = `Parabéns, ${nomeJogador}! Você completou o jogo em ${formatarTempo(tempoUsado)}.<br>Voltando ao menu...`; // Altera o conteúdo da span
            salvarRank(nomeJogador, tempoUsado); 
            document.getElementById('ganhou').classList.remove('display-none');
            document.getElementById('ganhou').classList.add('display-flex');
            setTimeout(() => {
                document.getElementById('ganhou').classList.remove('display-flex');
                document.getElementById('ganhou').classList.add('display-none');
                document.getElementById('cronometro').classList.remove('display-flex');
                document.getElementById('cronometro').classList.add('display-none');
                document.getElementById('menu-final').classList.remove('display-none');
                document.getElementById('menu-final').classList.add('display-flex');
                document.getElementById('jogo').classList.remove('display-grid');
                document.getElementById('jogo').classList.add('display-none');
            }, 3000);
        }
    }

    function salvarRank(jogador, tempo) {
        if(dificuldade === 'dificil'){
            const ranks = JSON.parse(localStorage.getItem('ranking-dificil')) || [];
            ranks.push({ jogador, tempo });
            ranks.sort((a, b) => a.tempo - b.tempo);
            localStorage.setItem('ranking-dificil', JSON.stringify(ranks.slice(0, 5)));
        }
        else{
            const ranks = JSON.parse(localStorage.getItem('ranking-facil')) || [];
            ranks.push({ jogador, tempo });
            ranks.sort((a, b) => a.tempo - b.tempo);
            localStorage.setItem('ranking-facil', JSON.stringify(ranks.slice(0, 5)));
        }
    }

    function mostrarRanking() {
        rankFacil.innerHTML = '';
        rankDificil.innerHTML = ''; 
        
        const ranksDificil = JSON.parse(localStorage.getItem('ranking-dificil')) || [];
        const ranksFacil = JSON.parse(localStorage.getItem('ranking-facil')) || [];
    
        ranksDificil.forEach((rank, posicao) => {
            const listaItem = document.createElement('li');
            listaItem.textContent = `${posicao + 1}. ${rank.jogador} - Tempo: ${formatarTempo(rank.tempo)}`;
            rankDificil.appendChild(listaItem);
        });
    
        ranksFacil.forEach((rank, posicao) => {
            const listaItem = document.createElement('li');
            listaItem.textContent = `${posicao + 1}. ${rank.jogador} - Tempo: ${formatarTempo(rank.tempo)}`;
            rankFacil.appendChild(listaItem);
        });
    }
    

    function reembaralhar() {
        const cartasNaoViradas = Array.from(document.querySelectorAll('.carta:not(.virada)'));
        const todasCartas = Array.from(document.querySelectorAll('.carta'));

        if (cartasNaoViradas.length > 1) {
            cartasNaoViradas.forEach(carta => {
                const versoCarta = carta.querySelector('.verso');
                if (versoCarta) {
                    versoCarta.classList.add('destaque');
                }
            });

            const cartasReembaralhadas = cartasNaoViradas.sort(() => Math.random() - 0.5);

            const novoJogo = [];
            todasCartas.forEach(carta => {
                if (carta.classList.contains('virada')) {
                    novoJogo.push(carta);
                } else {
                    novoJogo.push(cartasReembaralhadas.shift());
                }
            });

            jogo.innerHTML = '';
            novoJogo.forEach(carta => jogo.appendChild(carta));

            setTimeout(() => {
                const destacada = document.querySelectorAll('.destaque');
                destacada.forEach(destaque => {
                    destaque.classList.remove('destaque');
                });
            }, 1000);
        }
    }

    const cartas = document.querySelectorAll('.carta');
    cartas.forEach(carta => carta.addEventListener('click', virarCarta));

    document.getElementById('resetar').addEventListener('click', () =>{
        dificuldade = document.querySelector('input[name="mudar-dificuldade"]:checked').value;
        document.getElementById('cronometro').classList.remove('display-none');
        document.getElementById('cronometro').classList.add('display-flex');
        document.getElementById('menu-final').classList.remove('display-flex');
        document.getElementById('menu-final').classList.add('display-none');
        document.getElementById('jogo').classList.remove('display-none');
        document.getElementById('jogo').classList.add('display-grid');
        document.getElementById('ranking').classList.remove('display-flex');
        document.getElementById('ranking').classList.add('display-none');
        iniciarJogo();
    });

    document.getElementById("rank").addEventListener('click', () => {
        document.getElementById('menu-final').classList.remove('display-flex');
        document.getElementById('menu-final').classList.add('display-none');
        document.getElementById("ranking").classList.remove('display-none');
        document.getElementById("ranking").classList.add('display-flex');
        mostrarRanking();
    });


    document.getElementById('voltar').addEventListener('click', () => {
        document.getElementById('ranking').classList.remove('display-flex');
        document.getElementById('ranking').classList.add('display-none');
        document.getElementById('menu-final').classList.remove('display-none');
        document.getElementById('menu-final').classList.add('display-flex');
    })  

    document.getElementById('iniciar').addEventListener('click', () => {
        dificuldade = document.querySelector('input[name="difficulty"]:checked').value;
        nomeJogador = document.getElementById('nome').value;
        if (nomeJogador.trim() === '') {
            alert('Por favor, digite seu nome!');
            return; 
        }
        
        document.getElementById('menu-inicial').classList.remove('display-flex');
        document.getElementById('menu-inicial').classList.add('display-none');
        document.getElementById('jogo').classList.remove('display-none');
        document.getElementById('jogo').classList.add('display-grid');
        document.getElementById('cronometro').classList.remove('display-none');
        document.getElementById('cronometro').classList.add('display-flex');
        
       
        iniciarJogo(); 
    });
    

    document.getElementById('limpar-storage').addEventListener('click', () => {
        localStorage.clear();
        alert('Ranking limpo!');
    });
    
});